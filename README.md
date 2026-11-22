# ❤️ Heartless (demo)

A minimalist, *Undertale*-inspired pixel RPG boss demo built entirely with vanilla HTML5 Canvas, JavaScript, and Web Audio API.

### 🎮 [Play the Live Demo Here](https://github.io)

---

## ✨ Features
* **Overworld Gate Encounter:** Walk down a tiled Ruins corridor toward an iron gate to trigger a dramatic boss ambush.
* **Bullet-Hell Sniper Combat:** Dodge telegraphed laser-guided shots inside the battle box.
* **Dual Routes (Fight or Spare):**
  * **Fight Route:** Time your strike bar near the center for critical damage—watch out when the Gatekeeper enters Rage Mode below 50% HP!
  * **Pacifist Route:** Use **ACT** (*Reason* twice and *Lower Weapon* once) until the Gatekeeper's name turns yellow, then select **MERCY** to spare them peacefully.
* **Procedural 8-Bit Audio:** Dynamic chiptune boss music and retro sound effects synthesized in real time using the Web Audio API (zero `.mp3` files required).

---

## 🕹️ Controls

| Key | Action |
| :--- | :--- |
| **Arrow Keys** | Walk in overworld / Navigate menus / Dodge bullets |
| **Z** or **Enter** | Confirm selection / Stop attack timing bar |
| **X** or **Escape** | Go back in menus |
| **R** | Restart after winning, sparing, or losing |

---

## 📁 Project Structure
```text
Heartless-demo/
├── index.html      # Main game canvas & script loader
├── overworld.js    # Title screen, Ruins corridor & gate ambush cutscene
├── battle1.js      # Battle controls, ACT submenu & Mercy logic
├── battle2.js      # Sniper telegraphing, bullet-hell physics & UI rendering
├── audio.js        # Web Audio API 8-bit soundtrack & SFX generator
├── enemy.png       # Custom boss pixel sprite
└── heart.png       # Custom player soul sprite
```

---

## 🚀 Running Locally
No build tools or dependencies are required. Simply clone the repository and open `index.html` in any modern web browser:

```bash
git clone https://github.com
cd Heartless-demo
```
