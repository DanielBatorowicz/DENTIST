# ⚔️ Arena Duel — mobilna zręcznościowa gra 1v1 PvP w otwartym świecie 3D

Szybkie, lokalne pojedynki dwóch graczy na jednym telefonie (lub gracz vs bot)
na **otwartym placu miejskim 3D**: swobodne poruszanie się we wszystkich
kierunkach, osłony (fontanna, skrzynie, beczki) zatrzymujące strzały, miasto
z oświetlonymi oknami dookoła i kamera podążająca za akcją. Cztery klasy
postaci, celowanie łukiem **żyroskopem**, mecze do **3 wygranych rund**.

Technologia: **HTML5 + czysty JavaScript (moduły ES)**, bez build stepu i bez
assetów do pobrania. Świat renderowany jest w **WebGL (Three.js)** — słońce
rzucające cienie, latarnie ze światłami punktowymi, mgła, panorama gór i
proceduralne budynki. Three.js jest zvendorowany w `lib/` (gra pozostaje w
pełni samowystarczalna i działa offline). Gra działa w przeglądarce na
Androidzie i iOS, jako PWA lub jako natywna aplikacja przez Capacitor.

---

## 🎮 Sterowanie

### Na ekranie dotykowym (landscape)
Każdy gracz ma swój zestaw kontrolek w swoim rogu ekranu (gracz 1 po lewej,
gracz 2 po prawej; w trybie vs bot tylko lewy zestaw):

| Kontrolka | Działanie |
|---|---|
| 🕹️ Wirtualny joystick | swobodny ruch po placu we wszystkich kierunkach |
| ⚔️ / 🏹 ATAK | cios wręcz/mieczem; **łucznik: przytrzymaj = naciąganie, puść = strzał** |
| ⚡ SPECJAL | zdolność specjalna klasy (z czasem odnowienia) |
| 🛡️ BLOK | tylko klasa *Miecz i tarcza* — dedykowany przycisk zasłony |

Postać automatycznie obraca się w stronę przeciwnika (lock-on), więc joystick
służy do doskoku, uników i chowania się za osłonami.

### Celowanie żyroskopem (łucznik)
Gra sama wylicza balistyczny kąt podniesienia potrzebny do trafienia
przeciwnika przy aktualnej sile naciągu, a **żyroskop nakłada na to poprawkę**:
w momencie rozpoczęcia naciągania zapamiętywane jest położenie telefonu i
pochylenie w pionie podnosi/opuszcza strzał, a pochylenie w poziomie odchyla
go w lewo/prawo (prowadzenie ruchomego celu!). Podczas naciągania widoczny
jest podgląd trajektorii, który uwzględnia grawitację **i osłony** — dokładnie
tak poleci prawdziwa strzała. Kontrą jest unik i krycie się za fontanną.
Na iOS system zapyta o zgodę na czujniki (przycisk 🎯 w menu lub automatycznie
przy starcie meczu z łucznikiem). **Żyroskop wymaga HTTPS.**

### Klawiatura (do testów na komputerze)
- Gracz 1: `W/A/S/D` ruch, `F` atak, `G` blok, `H` specjal
- Gracz 2: `←↑↓→` ruch, `K` atak, `L` blok, `P` specjal

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
    │   ├── config.js     #   CAŁY balans, wymiary areny i lista przeszkód
    │   ├── player.js     #   maszyna stanów wojownika, ruch x/z, auto-celowanie
    │   ├── combat.js     #   trafienia w stożku przednim, obrażenia, blok
    │   ├── projectile.js #   balistyka 3D strzał + kolizje (gracze, osłony)
    │   ├── ai.js         #   bot: sterowanie wektorowe, kiting, timing łuku
    │   └── match.js      #   rundy, odliczanie, wynik meczu
    ├── render/           # rysowanie (WebGL)
    │   ├── renderer3d.js #   miasto, światła, cienie, kamera podążająca
    │   ├── fighter3d.js  #   proceduralny rig 3D postaci (bez modeli!)
    │   └── effects.js    #   pulowane cząsteczki (bez alokacji w pętli)
    └── ui/
        ├── hud.js        #   paski HP, punkty rund, banery
        ├── controls.js   #   układ i rysowanie kontrolek dotykowych
        └── screens.js    #   menu / wybór klasy / pauza / wynik (DOM)
```

Zasady projektowe: logika gry nie zna renderera (komunikacja przez fasadę `fx`),
symulacja działa w świecie logicznym 1100×700 (x/wschód, z/południe, y/góra),
a wejście gracza, bota i klawiatury ma identyczny format komend.

### Optymalizacje mobilne
- stały krok symulacji 60 Hz niezależny od odświeżania ekranu (90/120 Hz OK),
- `devicePixelRatio` ograniczone do 2 (oszczędność fill-rate),
- budżet renderera 3D: jedna mapa cieni 1024 px, dwa światła punktowe,
  współdzielone tekstury fasad/bruku (canvas), cząsteczki i podgląd
  trajektorii jako `InstancedMesh` (po 1 draw callu), pule meshy strzał —
  zero alokacji w pętli renderowania,
- pula cząsteczek o stałym rozmiarze — brak GC w pętli gry,
- brak assetów graficznych/dźwiękowych — geometria miasta, tekstury i SFX
  generowane proceduralnie (szybki start, mały cache),
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
