# ⚔️ Arena Duel — mobilna zręcznościowa gra 1v1 PvP

Szybkie, lokalne pojedynki dwóch graczy na jednym telefonie (lub gracz vs bot).
Widok z boku (side-scroller 2D), cztery klasy postaci, celowanie łukiem za pomocą
**żyroskopu**, mecze do **3 wygranych rund**.

Technologia: **HTML5 + czysty JavaScript (moduły ES)**, bez build stepu i bez
assetów do pobrania. Grafika renderowana jest w **prawdziwym 3D (WebGL /
Three.js)** — oświetlona scena z cieniami, mgłą, low-poly górami i pochodniami —
z automatycznym fallbackiem do renderera Canvas 2D na urządzeniach bez WebGL.
Three.js jest zvendorowany w `lib/` (gra pozostaje w pełni samowystarczalna
i działa offline). Gra działa w przeglądarce na Androidzie i iOS, jako PWA
lub jako natywna aplikacja przez Capacitor.

---

## 🎮 Sterowanie

### Na ekranie dotykowym (landscape)
Każdy gracz ma swój zestaw kontrolek w swoim rogu ekranu (gracz 1 po lewej,
gracz 2 po prawej; w trybie vs bot tylko lewy zestaw):

| Kontrolka | Działanie |
|---|---|
| 🕹️ Wirtualny joystick | ruch w lewo / w prawo (oś pionowa: korekta celowania łukiem) |
| ⚔️ / 🏹 ATAK | cios wręcz/mieczem; **łucznik: przytrzymaj = naciąganie, puść = strzał** |
| ⚡ SPECJAL | zdolność specjalna klasy (z czasem odnowienia) |
| 🛡️ BLOK | tylko klasa *Miecz i tarcza* — dedykowany przycisk zasłony |

### Celowanie żyroskopem (łucznik)
W momencie rozpoczęcia naciągania łuku gra zapamiętuje aktualne położenie telefonu
i celuje **względem niego** — pochylenie w pionie steruje kątem strzału, pochylenie
w poziomie daje precyzyjną korektę. Podczas naciągania widoczny jest podgląd
trajektorii lotu strzały (pełna balistyka z grawitacją).
Na iOS system zapyta o zgodę na czujniki (przycisk 🎯 w menu lub automatycznie
przy starcie meczu z łucznikiem). **Żyroskop wymaga HTTPS.**

### Klawiatura (do testów na komputerze)
- Gracz 1: `A/D` ruch, `W/S` celowanie, `F` atak, `G` blok, `H` specjal
- Gracz 2: `←/→` ruch, `↑/↓` celowanie, `K` atak, `L` blok, `P` specjal

## 🧙 Klasy postaci

| Klasa | HP | Szybkość | Charakterystyka | Specjal |
|---|---|---|---|---|
| 👊 Walka wręcz | 100 | bardzo wysoka | szybkie ciosy o małym zasięgu | Szarża (dash z ciosem) |
| 🗡️ Miecz | 115 | średnia | średni zasięg, balans ataku i obrony | Wypad (skok z cięciem) |
| 🛡️ Miecz i tarcza | 135 | niska | blokuje ataki i strzały z przodu | Taran (przełamuje gardę, ogłusza) |
| 🏹 Łucznik | 90 | średnia | dystans, 5 strzał w kołczanie (odnawiają się co 2,2 s) | Potrójny strzał |

Cały balans (HP, obrażenia, zasięgi, czasy odnowienia) znajduje się w jednym pliku:
[`js/game/config.js`](js/game/config.js).

## 🏗️ Architektura

```
game/
├── index.html            # powłoka: canvas WebGL + przezroczysty canvas UI
├── css/style.css         # style menu DOM, ostrzeżenie o orientacji
├── manifest.json, sw.js  # PWA: instalacja + tryb offline
├── lib/                  # zvendorowany Three.js (moduł ES, minified)
└── js/
    ├── main.js           # punkt wejścia — spina wszystkie moduły
    ├── core/             # warstwa niezależna od gry
    │   ├── engine.js     #   pętla gry ze stałym krokiem 60 Hz
    │   ├── input.js      #   dotyk (multi-touch) + mysz + klawiatura
    │   ├── gyro.js       #   DeviceOrientation → celowanie względne
    │   └── audio.js      #   proceduralne SFX (WebAudio, bez plików)
    ├── game/             # logika rozgrywki (bez renderowania!)
    │   ├── config.js     #   CAŁY balans i stałe świata
    │   ├── player.js     #   maszyna stanów wojownika
    │   ├── combat.js     #   trafienia wręcz, obrażenia, blok
    │   ├── projectile.js #   balistyka strzał + kolizje
    │   ├── ai.js         #   bot (rozwiązuje kąt strzału analitycznie)
    │   └── match.js      #   rundy, odliczanie, wynik meczu
    ├── render/           # rysowanie
    │   ├── renderer3d.js #   scena WebGL: światła, cienie, arena, kamera
    │   ├── fighter3d.js  #   proceduralny rig 3D postaci (bez modeli!)
    │   ├── renderer.js   #   fallback Canvas 2D (brak WebGL)
    │   ├── sprites.js    #   wektorowe postacie 2D + wspólne krzywe animacji
    │   └── effects.js    #   pulowane cząsteczki (bez alokacji w pętli)
    └── ui/
        ├── hud.js        #   paski HP, punkty rund, banery
        ├── controls.js   #   układ i rysowanie kontrolek dotykowych
        └── screens.js    #   menu / wybór klasy / pauza / wynik (DOM)
```

Zasady projektowe: logika gry nie zna renderera (komunikacja przez fasadę `fx`),
symulacja działa w stałym świecie logicznym 1000×560 skalowanym do ekranu,
a wejście gracza, bota i klawiatury ma identyczny format komend.

### Optymalizacje mobilne
- stały krok symulacji 60 Hz niezależny od odświeżania ekranu (90/120 Hz OK),
- `devicePixelRatio` ograniczone do 2 (oszczędność fill-rate),
- budżet renderera 3D: jedna mapa cieni 1024 px, dwa światła punktowe,
  cząsteczki i podgląd trajektorii jako `InstancedMesh` (po 1 draw callu),
  pule meshy strzał — zero alokacji w pętli renderowania,
- pula cząsteczek o stałym rozmiarze — brak GC w pętli gry,
- brak assetów graficznych/dźwiękowych — geometria, tekstura nieba i SFX
  generowane proceduralnie (szybki start, mały cache),
- automatyczny fallback do Canvas 2D, gdy WebGL jest niedostępny,
- wyłączone gesty przeglądarki (`touch-action: none`, blokada zoomu i scrolla),
- automatyczna pauza zegara po zwinięciu karty (brak "teleportacji" po powrocie).

---

## 🚀 Uruchomienie lokalne

Moduły ES wymagają serwera HTTP (nie otwieraj `index.html` z dysku):

```bash
cd game
python3 -m http.server 8000     # lub: npx serve .
# → http://localhost:8000
```

Aby przetestować na telefonie w sieci lokalnej z żyroskopem, potrzebny jest HTTPS —
najprościej: `npx serve .` + tunel (np. `npx localtunnel --port 3000`) albo od razu
deploy na Vercel/GitHub Pages (niżej).

## 🌐 Wdrożenie webowe (PWA)

Gra to statyczne pliki — działa na dowolnym hostingu:

- **Vercel**: repo ma już wpis w `vercel.json`, gra jest dostępna pod `/game/`.
- **GitHub Pages**: Settings → Pages → wskaż gałąź; gra będzie pod `.../game/`.
- **Netlify / dowolny serwer**: skopiuj katalog `game/`.

Po wejściu na stronę na telefonie wybierz „Dodaj do ekranu głównego" — gra
zainstaluje się jako PWA: pełny ekran, orientacja pozioma, działa offline (`sw.js`).

> Po każdej zmianie plików gry podbij stałą `VERSION` w `sw.js`, aby unieważnić cache.

## 📱 Wdrożenie natywne na Android / iOS (Capacitor)

Gdy potrzebna jest aplikacja w sklepach (lub pewny dostęp do czujników bez pytań
przeglądarki), opakuj grę w [Capacitor](https://capacitorjs.com):

```bash
# 1. Nowy projekt wrappera obok katalogu game/
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init "Arena Duel" com.example.arenaduel --web-dir=game

# 2. Android (wymaga Android Studio)
npm install @capacitor/android
npx cap add android
npx cap sync
npx cap open android      # → Run na urządzeniu / Build APK-AAB

# 3. iOS (wymaga macOS + Xcode)
npm install @capacitor/ios
npx cap add ios
npx cap sync
npx cap open ios          # → podpisz zespołem deweloperskim i uruchom
```

Zalecane ustawienia wrappera:
- w `capacitor.config.ts`: `backgroundColor: '#1e1b4b'`,
- Android: w `AndroidManifest.xml` dla aktywności ustaw `android:screenOrientation="landscape"`,
- iOS: w Xcode zaznacz tylko orientacje Landscape; `NSMotionUsageDescription`
  nie jest wymagane dla DeviceOrientation w WKWebView, ale zgoda na czujniki
  (przycisk 🎯 w menu) nadal obowiązuje na iOS ≥ 13.

Po każdej zmianie w kodzie gry wystarczy `npx cap sync` i przebudowa.

## 🧪 Testy

Automatyczny test dymny (Playwright) przechodzi przez menu, wybór klas, walkę
z botem, blok tarczą i pauzę — patrz historia PR. Ręcznie: `F`/`K` = atak,
łucznik: przytrzymaj i puść.
