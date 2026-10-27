# 🌸 Pink & Purple Adventure 💜

Kompletní hratelná 2D plošinovka běžící přímo ve webovém prohlížeči (PC i mobil) bez nutnosti instalace nebo externích závislostí.

🎮 **Hrajte online zde:** [https://adamferencz.github.io/pink-purple-adventure/](https://adamferencz.github.io/pink-purple-adventure/)

---

## 🚀 Jak spustit hru

1. Otevřete soubor [`index.html`](file:///c:/dev/playground/stavebka/pink-antigravity/index.html) v jakémkoliv moderním prohlížeči (Chrome, Firefox, Safari, Edge).
2. Klikněte na tlačítko **▶ HRÁT HRU**.
3. Přejeme skvělou zábavu!

---

## 🎮 Ovládání

### 💻 Počítač (Klávesnice)
| Klávesa | Akce |
|---|---|
| **A / Šipka vlevo** | Pohyb doleva |
| **D / Šipka vpravo** | Pohyb doprava |
| **Mezerník / W / Šipka nahoru** | Skok |
| **E** | Interakce s AI přítelkyní Lili / zavření dialogu |
| **Escape** | Pozastavení hry (Pauza) / zavření dialogu |

### 📱 Mobilní telefon & Tablet (Dotyk)
- **◀ / ▶** Dotyková tlačítka pro pohyb vlevo a vpravo
- **▲ SKOK** Skok (podporuje současný stisk se směrem)
- **💬 E** Tlačítko pro zahájení rozhovoru s Lili

---

## 🌟 Herní prvky & Mechaniky

### 🥒 Okurkové Power-upy
Po světě jsou rozmístěny kouzelné okurky:
- 🟢 **Zelená okurka (Super skok - 10s):** Umožní skákat do enormních výšek.
- 🟡 **Zlatá okurka (Nezranitelnost - 8s):** Hráč září zlatou aurou a nepřátelé jsou eliminováni pouhým dotykem.
- 🔴 **Růžová okurka (Super rychlost - 10s):** Turbo zrychlení s neonovou stopou za zády pro překonání dlouhých propastí.

### 💗 AI Přítelkyně Lili
- Nachází se na bezpečných místech v každé úrovni.
- Přistupte k ní a stiskněte **[E]** pro otevření dialogového okna.
- Můžete si s ní povídat nebo jí darovat nasbírané mince (10, 25 nebo 50 mincí).
- Zvyšováním náklonnosti (0 až 100 ❤️) odemykáte hlubší vztah a nové odpovědi.
- Při dosažení **80+ náklonnosti** vám Lili udělí **Magický růžový štít 🛡️**, který absorbuje zásah nepřítele!

### 👾 Nepřátelé & Bodování
- Hlídkující fialové příšerky na platformách.
- Skokem na hlavu nepřítele zneškodníte (+50 bodů) a odrazíte se do vzduchu.
- Kontakt ze strany způsobí ztrátu 1 života a spustí krátkou nezranitelnost.
- Mince dávají **+10 bodů a 1 minci** do peněženky.
- Okurky dávají **+25 bodů**.
- Průchod portálem na konci úrovně dává **+200 bodů**.

---

## 📁 Struktura projektu

- [`index.html`](file:///c:/dev/playground/stavebka/pink-antigravity/index.html) – HTML5 struktura, responzivní HUD, dialogy a modální okna.
- [`style.css`](file:///c:/dev/playground/stavebka/pink-antigravity/style.css) – Růžovo-fialový neonový design, animace a responzivní dotykové ovládání.
- [`game.js`](file:///c:/dev/playground/stavebka/pink-antigravity/game.js) – Herní engine, fyzika, procedurální grafika na Canvasu, 3 úrovně, dialogový systém a Web Audio syntezátor.
- [`pink-purple-adventure-specifikace.md`](file:///c:/dev/playground/stavebka/pink-antigravity/pink-purple-adventure-specifikace.md) – Původní podrobná specifikace.
