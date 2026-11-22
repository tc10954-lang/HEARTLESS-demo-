# ❤️ Heartless (demo)

A minimalist, *Undertale*-inspired pixel RPG built entirely with vanilla HTML5 Canvas, JavaScript, and Web Audio API.

### 🎮 [Play the Live Demo Here](https://tc10954-lang.github.io/HEARTLESS-demo-/)

---

## ✨ Features
* **Title Screen & News Banner:** Features an in-game **Updates & News** board right on the start screen.
* **Overworld Gate Ambush:** Walk down a tiled Ruins corridor toward an iron gate to trigger a dramatic ambush by **THE DOGBOY**.
* **Bullet-Hell Sniper Combat:** Dodge telegraphed laser-guided shots inside the battle box—watch out when THE DOGBOY enters Rage Mode below 50% HP!
* **Dual Routes (Fight or Mercy):**
  * **Fight Route:** Time your strike bar near the center for critical damage.
  * **Pacifist Route:** Use **ACT** (*Reason* twice and *Lower Weapon* once) until THE DOGBOY's name turns yellow, then select **MERCY** to spare him peacefully.
* **Throne Room Cutscene:** Pass through the gate onto a gold-trimmed red carpet flanked by buckets of gold to confront **THE KING**—featuring route-specific dialogue and a royal hallway theme.
* **Toggleable Mobile Controls:** Tap **`🎮 PAD: OFF / ON`** in the top-right corner at any time to toggle an on-screen D-pad and `Z` / `X` / `RST` buttons for phones and tablets.
* **Procedural 8-Bit Audio:** Dynamic chiptune boss music, royal hallway theme, and retro SFX synthesized in real time via the Web Audio API.

---

## 🕹️ Controls

| Key / Button | Action |
| :--- | :--- |
| **Arrow Keys** / **D-Pad** | Walk in overworld / Navigate menus / Dodge bullets |
| **Z** or **Enter** | Confirm selection / Advance dialogue / Stop attack timing bar |
| **X** or **Escape** | Go back in menus |
| **R** or **RST** | Restart demo |
| **`🎮 PAD` Toggle** | Show or hide on-screen mobile touch controls |

---

## 📁 Project Structure
```text
Heartless-demo/
├── index.html          # Main game canvas & script loader
├── intro-gate.js       # Title screen, Ruins corridor & gate ambush
├── news.js             # Title screen Updates & News banner
├── boss1-battle1.js    # Battle controls, ACT submenu & Mercy logic
├── boss1-battle2.js    # Sniper telegraphing, bullet-hell physics & battle UI
├── throne-cutscene.js  # Throne Room walk-up, gold buckets & King dialogue
├── sound.js            # Web Audio API 8-bit soundtrack & SFX generator
├── touch.js            # Toggleable mobile D-pad & action buttons
├── boss1.png           # THE DOGBOY sprite
├── boss2scene.png      # THE KING cutscene sprite
└── heart.png           # Player soul sprite
```
