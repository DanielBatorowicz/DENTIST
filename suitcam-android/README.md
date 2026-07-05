# SuitCam 🕴️🕶️

Aplikacja na Androida, która w czasie rzeczywistym nakłada na obraz z kamery filtr
**czarnego garnituru z białą koszulą i krawatem** oraz **ciemnych okularów**.
Filtr podąża za twarzą (wykrywanie twarzy i pozycji oczu przez ML Kit, w pełni offline)
i jest nakładany zarówno na podgląd na żywo, jak i na zapisywane zdjęcia.

## Funkcje

- 📷 Podgląd na żywo z kamery przedniej lub tylnej (CameraX)
- 🙂 Wykrywanie wielu twarzy jednocześnie wraz z pozycją oczu (ML Kit Face Detection)
- 🕶️ Okulary w stylu wayfarer: gradientowe szkła, belka, mostek, zauszniki, odblaski
- 🕴️ Czarny garnitur: marynarka z cieniowaniem, klapy z wcięciem, biała koszula
  z kołnierzykiem, krawat z połyskiem, guziki i poszetka
- 🌐 **Wirtualna kamera po sieci**: wbudowany serwer MJPEG strumieniuje obraz
  z nałożonym filtrem pod `http://IP-telefonu:8080`
- 📸 Zapis zdjęcia z nałożonym filtrem do galerii (album `Pictures/SuitCam`)
- 🔄 Przełączanie kamery przód/tył

## Wirtualna kamera — jak używać

Android **nie pozwala aplikacjom bez roota rejestrować się jako systemowe urządzenie
kamery** widoczne w innych aplikacjach na telefonie (Teams, Zoom, Messenger itd.) —
nie istnieje publiczne API odpowiadające OBS Virtual Camera z komputera.
SuitCam rozwiązuje to strumieniem sieciowym:

1. W aplikacji naciśnij **„🌐 Wirtualna kamera”** — na ekranie pojawi się adres,
   np. `http://192.168.1.50:8080` (telefon i komputer muszą być w tej samej sieci Wi-Fi).
2. **W przeglądarce / VLC**: otwórz ten adres — zobaczysz obraz z filtrem na żywo.
3. **Jako kamera w Teams/Zoom (przez komputer)**:
   - zainstaluj [OBS Studio](https://obsproject.com),
   - dodaj źródło **Przeglądarka** (URL = adres z telefonu) albo **Źródło multimedialne**
     (odznacz „plik lokalny”, wklej adres),
   - kliknij **Start Virtual Camera** — w Teams/Zoom wybierz kamerę „OBS Virtual Camera”.

Filtr jest nakładany na strumień po stronie telefonu, więc każdy odbiorca widzi
garnitur i okulary. Alternatywa bez OBS: aplikacje typu „IP Camera Adapter”
czytające MJPEG jako webcam.

## Budowanie

Najprościej w **Android Studio** (Hedgehog lub nowszy):

1. `File → Open` i wskaż katalog projektu.
2. Poczekaj na synchronizację Gradle (pobierze zależności CameraX i ML Kit).
3. `Run ▶` na podłączonym telefonie (min. Android 7.0, API 24).

Z linii poleceń (wymagany Android SDK i JDK 17):

```bash
./gradlew assembleDebug
# APK: app/build/outputs/apk/debug/app-debug.apk
```

> Jeśli w repo brakuje `gradle/wrapper/gradle-wrapper.jar`, wygeneruj wrapper
> lokalnie zainstalowanym Gradle: `gradle wrapper --gradle-version 8.7`,
> albo po prostu otwórz projekt w Android Studio.

## Jak to działa

| Plik | Rola |
| --- | --- |
| `MainActivity.kt` | uprawnienia, konfiguracja CameraX (podgląd + analiza + zdjęcia), UI |
| `FaceAnalyzer.kt` | analiza klatek: ML Kit wykrywa twarze i punkty oczu; przy aktywnym streamie konwertuje klatki na bitmapy |
| `SuitOverlayView.kt` | mapowanie współrzędnych obrazu na ekran (z lustrem dla kamery przedniej) i rysowanie |
| `SuitRenderer.kt` | wektorowe rysowanie garnituru i okularów na dowolnym `Canvas` |
| `PhotoProcessor.kt` | nakładanie filtra na zrobione zdjęcie i zapis do `MediaStore` |
| `StreamEngine.kt` | nakładanie filtra na klatki streamu i kompresja JPEG |
| `MjpegServer.kt` | serwer HTTP multipart/x-mixed-replace (MJPEG) dla OBS/VLC/przeglądarki |

Filtr jest rysowany wektorowo (Canvas/Path), więc skaluje się do dowolnej
rozdzielczości i liczby twarzy — bez żadnych bitmap w zasobach.

## Wymagania

- Android 7.0+ (API 24)
- Kamera przednia lub tylna
- Brak wymagań sieciowych — wykrywanie twarzy działa offline
