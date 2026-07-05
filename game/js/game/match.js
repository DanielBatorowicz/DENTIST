/**
 * match.js — round & match flow.
 *
 * Phases:
 *   intro    — "ROUND N" banner + 3-2-1 countdown, inputs disabled
 *   fight    — live gameplay
 *   roundEnd — a player dropped to 0 HP; short pause, then next round
 *   matchEnd — someone reached ROUNDS_TO_WIN; the UI shows the result
 *
 * A match is: rounds until one player collects ROUNDS_TO_WIN (3) wins.
 * If both fighters die on the same frame the round is a draw and is
 * replayed without awarding a win.
 */

import {
  SPAWN_X, ROUNDS_TO_WIN, ROUND_INTRO_TIME, ROUND_END_TIME,
} from './config.js';
import { Player, NEUTRAL_CMD } from './player.js';
import { AiController } from './ai.js';
import { updateArrows } from './projectile.js';

export class Match {
  /**
   * @param {object} opts
   * @param {'2p'|'ai'} opts.mode
   * @param {[string,string]} opts.classIds  class per player
   * @param {import('../core/input.js').Input} opts.input
   * @param {object} opts.fx                 feedback facade
   * @param {(winner:number)=>void} opts.onMatchEnd
   */
  constructor({ mode, classIds, input, fx, onMatchEnd }) {
    this.mode = mode;
    this.input = input;
    this.fx = fx;
    this.onMatchEnd = onMatchEnd;

    this.players = [new Player(0, classIds[0]), new Player(1, classIds[1])];
    this.names = ['GRACZ 1', mode === 'ai' ? 'BOT' : 'GRACZ 2'];
    this.ai = mode === 'ai' ? new AiController() : null;
    if (this.ai) this.players[1].isHuman = false;

    this.arrows = [];
    this.roundNum = 0;
    this.phase = 'intro';
    this.phaseT = 0;
    this.lastCount = 0;    // last countdown digit (for tick sfx)
    this.fightFlashT = 0;  // "WALCZ!" banner timer
    this.roundBanner = ''; // text shown during roundEnd

    this.startRound();
  }

  startRound() {
    this.roundNum++;
    this.arrows.length = 0;
    this.players[0].reset(SPAWN_X[0], 1);
    this.players[1].reset(SPAWN_X[1], -1);
    this.phase = 'intro';
    this.phaseT = ROUND_INTRO_TIME;
    this.lastCount = 4;
  }

  update(dt) {
    switch (this.phase) {
      case 'intro': {
        this.phaseT -= dt;
        const count = Math.max(1, Math.ceil(this.phaseT / (ROUND_INTRO_TIME / 3)));
        if (count !== this.lastCount) {
          this.lastCount = count;
          this.fx.sfx.countdown();
        }
        if (this.phaseT <= 0) {
          this.phase = 'fight';
          this.fightFlashT = 0.8;
          this.fx.sfx.fight();
        }
        break;
      }

      case 'fight':
        this.fightFlashT = Math.max(0, this.fightFlashT - dt);
        this._simulate(dt, true);
        this._checkRoundEnd();
        break;

      case 'roundEnd':
        // Let bodies fall and arrows finish flying, but freeze inputs.
        this._simulate(dt, false);
        this.phaseT -= dt;
        if (this.phaseT <= 0) {
          const winner = this.players.find((p) => p.wins >= ROUNDS_TO_WIN);
          if (winner) {
            this.phase = 'matchEnd';
            this.fx.sfx.matchWin();
            this.onMatchEnd(winner.index);
          } else {
            this.startRound();
          }
        }
        break;

      case 'matchEnd':
        break;
    }

    // Smoothed HP for the HUD damage-trail bars.
    for (const p of this.players) {
      p.dispHp += (p.hp - p.dispHp) * Math.min(1, dt * 5);
    }
  }

  _simulate(dt, live) {
    const [p0, p1] = this.players;
    const cmd0 = live ? this.input.state(0) : NEUTRAL_CMD;
    const cmd1 = live
      ? (this.ai ? this.ai.getCommands(p1, p0, dt) : this.input.state(1))
      : NEUTRAL_CMD;

    p0.update(dt, cmd0, p1, this.fx, this.arrows);
    p1.update(dt, cmd1, p0, this.fx, this.arrows);
    updateArrows(this.arrows, this.players, this.fx, dt);
  }

  _checkRoundEnd() {
    const [p0, p1] = this.players;
    if (p0.alive && p1.alive) return;

    if (!p0.alive && !p1.alive) {
      this.roundBanner = 'REMIS!';
      this.roundNum--; // draws are replayed and do not count
    } else {
      const winner = p0.alive ? p0 : p1;
      winner.wins++;
      this.roundBanner = winner.wins >= ROUNDS_TO_WIN
        ? `${this.names[winner.index]} WYGRYWA MECZ!`
        : `${this.names[winner.index]} WYGRYWA RUNDĘ!`;
      this.fx.sfx.roundWin();
    }
    this.phase = 'roundEnd';
    this.phaseT = ROUND_END_TIME;
  }

  /** Countdown digit for the intro banner (3..1). */
  get countdown() {
    return Math.max(1, Math.ceil(this.phaseT / (ROUND_INTRO_TIME / 3)));
  }
}
