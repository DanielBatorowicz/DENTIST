# SuitCam 🕴️🕶️

Aplikacja na Androida, która w czasie rzeczywistym nakłada na obraz z kamery filtr
**czarnego garnituru z białą koszulą i krawatem** oraz **ciemnych okularów**.
Filtr podąża za twarzą (wykrywanie twarzy i pozycji oczu przez ML Kit, w pełni offline)
i jest nakładany zarówno na podgląd na żywo, jak i na zapisywane zdjęcia.

## Funkcje

- 📷 Podgląd na żywo z kamery przedniej lub tylnej (CameraX)
- 🙂 Wykrywanie wielu twarzy jednocześnie wraz z pozycją oczu (ML Kit Face Detection)
- 🕶️ Okulary przeciwsłoneczne dopasowane do rozstawu i nachylenia oczu
- 🕴️ Czarny garnitur (marynarka, klapy, biała koszula, krawat) rysowany pod brodą
- 📸 Zapis zdjęcia z nałożonym filtrem do galerii (album `Pictures/SuitCam`)
- 🔄 Przełączanie kamery przód/tył

## Ważne: dlaczego to nie jest „wirtualna kamera” systemowa

Android **nie pozwala aplikacjom bez roota rejestrować się jako urządzenie kamery**
widoczne w innych aplikacjach (Teams, Zoom, Messenger itd.). Nie istnieje publiczne
API odpowiadające np. OBS Virtual Camera z komputera. Dlatego:

- ta aplikacja jest pełnoprawnym aparatem z filtrem — podgląd i zdjęcia mają nałożony garnitur i okulary,
- jeśli potrzebujesz filtra w wideorozmowach, realne opcje to:
  - **telefon jako kamera komputera**: OBS + [DroidCam](https://droidcam.app)/Camo na komputerze i wirtualna kamera OBS,
  - **root + moduły typu Xposed** (nie zalecane, ryzyko bezpieczeństwa),
  - na niektórych urządzeniach efekty producenta (np. tryby portretowe) — bez możliwości własnych filtrów.

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
| `FaceAnalyzer.kt` | analiza klatek: ML Kit wykrywa twarze i punkty oczu |
| `SuitOverlayView.kt` | mapowanie współrzędnych obrazu na ekran (z lustrem dla kamery przedniej) i rysowanie |
| `SuitRenderer.kt` | wektorowe rysowanie garnituru i okularów na dowolnym `Canvas` |
| `PhotoProcessor.kt` | nakładanie filtra na zrobione zdjęcie i zapis do `MediaStore` |

Filtr jest rysowany wektorowo (Canvas/Path), więc skaluje się do dowolnej
rozdzielczości i liczby twarzy — bez żadnych bitmap w zasobach.

## Wymagania

- Android 7.0+ (API 24)
- Kamera przednia lub tylna
- Brak wymagań sieciowych — wykrywanie twarzy działa offline
