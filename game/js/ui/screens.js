/**
 * screens.js — DOM overlay screens (menu, class select, pause, results).
 *
 * Menus are plain DOM because text layout, buttons and accessibility are
 * free there; everything inside a match is canvas. The Screens class owns
 * the #ui container and swaps innerHTML per screen.
 */

import { CLASSES, CLASS_LIST, ROUNDS_TO_WIN } from '../game/config.js';
import { gyro } from '../core/gyro.js';
import { sfx, initAudio } from '../core/audio.js';

export class Screens {
  /**
   * @param {HTMLElement} root  the #ui overlay container
   * @param {object} cb  { onStart(mode, classIds), onRematch(), onMenu(), onResume() }
   */
  constructor(root, cb) {
    this.root = root;
    this.cb = cb;
    this.selection = [null, null];
    this.mode = '2p';
  }

  hide() {
    this.root.innerHTML = '';
    this.root.classList.remove('visible');
  }

  _show(html) {
    this.root.innerHTML = html;
    this.root.classList.add('visible');
  }

  // --- main menu -------------------------------------------------------------

  showMenu() {
    this._show(`
      <div class="screen">
        <h1 class="title">ARENA&nbsp;DUEL</h1>
        <p class="tagline">Zręcznościowe pojedynki 1v1 • do ${ROUNDS_TO_WIN} wygranych rund</p>
        <div class="stack">
          <button class="btn big" data-mode="2p">👥&nbsp; 2 GRACZY — jeden telefon</button>
          <button class="btn big" data-mode="ai">🤖&nbsp; GRACZ vs BOT</button>
          <button class="btn ghost" id="gyroBtn"></button>
        </div>
        <p class="hint">🏹 Łucznik celuje pochylając telefon (żyroskop).<br>
        Przytrzymaj atak, aby naciągnąć łuk — puść, aby strzelić.</p>
      </div>`);

    this._refreshGyroBtn();
    this.root.querySelector('#gyroBtn').addEventListener('click', async () => {
      initAudio();
      sfx.click();
      if (gyro.active) gyro.disable();
      else await gyro.enable(); // must run inside the tap gesture (iOS)
      this._refreshGyroBtn();
    });
    for (const b of this.root.querySelectorAll('[data-mode]')) {
      b.addEventListener('click', () => {
        initAudio();
        sfx.click();
        this.showSelect(b.dataset.mode);
      });
    }
  }

  _refreshGyroBtn() {
    const btn = this.root.querySelector('#gyroBtn');
    if (!btn) return;
    if (!gyro.supported) {
      btn.textContent = '🎯 Żyroskop: niedostępny na tym urządzeniu';
      btn.disabled = true;
    } else {
      btn.textContent = gyro.active ? '🎯 Żyroskop: WŁĄCZONY ✓' : '🎯 Włącz celowanie żyroskopem';
    }
  }

  // --- class select ------------------------------------------------------------

  showSelect(mode) {
    this.mode = mode;
    // Preselect a random class for the bot so a single tap can start.
    this.selection = [null, mode === 'ai'
      ? CLASS_LIST[Math.floor(Math.random() * CLASS_LIST.length)]
      : null];

    const col = (pi) => `
      <div class="col">
        <h3 class="p${pi}">${pi === 0 ? 'GRACZ 1' : (mode === 'ai' ? 'BOT' : 'GRACZ 2')}</h3>
        <div class="cards" data-p="${pi}">
          ${CLASS_LIST.map((id) => `
            <button class="card" data-p="${pi}" data-cls="${id}">
              <span class="icon">${CLASSES[id].icon}</span>
              <b>${CLASSES[id].name}</b>
              <small>${CLASSES[id].desc}</small>
            </button>`).join('')}
        </div>
      </div>`;

    this._show(`
      <div class="screen select">
        <h2>Wybierz klasę</h2>
        <div class="cols">${col(0)}${col(1)}</div>
        <div class="row">
          <button class="btn ghost" id="backBtn">← Menu</button>
          <button class="btn big" id="fightBtn" disabled>WALCZ! ⚔️</button>
        </div>
      </div>`);

    for (const card of this.root.querySelectorAll('.card')) {
      card.addEventListener('click', () => {
        sfx.click();
        const pi = Number(card.dataset.p);
        this.selection[pi] = card.dataset.cls;
        this._refreshSelect();
      });
    }
    this.root.querySelector('#backBtn').addEventListener('click', () => {
      sfx.click();
      this.showMenu();
    });
    this.root.querySelector('#fightBtn').addEventListener('click', async () => {
      sfx.click();
      // If anyone picked the archer, offer gyro right away — the click is
      // a user gesture, which iOS requires for the permission prompt.
      if (this.selection.includes('archer') && gyro.supported && !gyro.active) {
        await gyro.enable();
      }
      this.cb.onStart(this.mode, [...this.selection]);
    });
    this._refreshSelect();
  }

  _refreshSelect() {
    for (const card of this.root.querySelectorAll('.card')) {
      const pi = Number(card.dataset.p);
      card.classList.toggle('sel', this.selection[pi] === card.dataset.cls);
      card.classList.toggle('sel-p1', pi === 1 && this.selection[pi] === card.dataset.cls);
    }
    this.root.querySelector('#fightBtn').disabled =
      !(this.selection[0] && this.selection[1]);
  }

  // --- pause ---------------------------------------------------------------------

  showPause() {
    this._show(`
      <div class="screen">
        <h2>PAUZA</h2>
        <div class="stack">
          <button class="btn big" id="resumeBtn">▶ WZNÓW</button>
          <button class="btn ghost" id="quitBtn">🏠 Menu główne</button>
        </div>
      </div>`);
    this.root.querySelector('#resumeBtn').addEventListener('click', () => {
      sfx.click();
      this.hide();
      this.cb.onResume();
    });
    this.root.querySelector('#quitBtn').addEventListener('click', () => {
      sfx.click();
      this.cb.onMenu();
    });
  }

  // --- match result ------------------------------------------------------------

  showMatchEnd(winnerName, winnerIndex, score) {
    this._show(`
      <div class="screen">
        <h1 class="title small">🏆</h1>
        <h2 class="p${winnerIndex}">${winnerName} WYGRYWA MECZ!</h2>
        <div class="score">${score[0]} : ${score[1]}</div>
        <div class="stack">
          <button class="btn big" id="rematchBtn">🔁 REWANŻ</button>
          <button class="btn ghost" id="menuBtn">🏠 Menu główne</button>
        </div>
      </div>`);
    this.root.querySelector('#rematchBtn').addEventListener('click', () => {
      sfx.click();
      this.cb.onRematch();
    });
    this.root.querySelector('#menuBtn').addEventListener('click', () => {
      sfx.click();
      this.cb.onMenu();
    });
  }
}
