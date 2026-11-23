# ❤️ Heartless (DEMO)

> **⚠️ DEMO NOTICE:** This playable build is a **DEMO** of *Heartless*. **The full game is currently in development and will be out soon!**

A minimalist, *Undertale*-inspired pixel RPG boss rush and story demo built entirely with vanilla HTML5 Canvas, JavaScript, and the Web Audio API.

### 🎮 [Play the Live Demo Here](https://tc10954-lang.github.io/HEARTLESS-demo-/)

---

## ✨ What's in the Demo
* **Title Screen & Live News Banner:** Check the latest demo patch notes right from the main menu.
* **Boss 1 — THE DOGBOY:** Walk down the Ruins corridor to trigger a gate ambush, then choose to defeat him with timed strikes or spare him peacefully through **ACT** and **MERCY**.
* **The Throne Room Cutscene:** Cross the red carpet past overflowing buckets of gold to face the ruler of the Underworld, featuring branching dialogue based on how you handled THE DOGBOY.
* **Boss 2 — THE KING:** Survive high-speed laser snipers, sudden Guard Body slams, and crisscrossing royal whiplashes as the King reacts dynamically to his remaining HP.
* **Ending Cutscene:** Witness the King's final words and watch the gates to the surface slide open—setting the stage for the full release!
* **Procedural 8-Bit Chiptune Audio:** Original retro sound effects and intense boss themes synthesized in real time via the Web Audio API (no `.mp3` files required).
* **Desktop & Mobile Ready:** Play with a keyboard or toggle the on-screen **`🎮 PAD`** D-pad and action buttons on phones and tablets.

---

## 🕹️ Controls

| Key / Button | Action |
| :--- | :--- |
| **Arrow Keys** / **D-Pad** | Walk in overworld / Navigate menus / Dodge bullets |
| **Z** or **Enter** | Confirm selection / Advance dialogue / Stop attack bar |
| **X** or **Escape** | Go back in menus |
| **R** / **RST** | Restart from the current checkpoint |
| **🎮 PAD** (Top-Right) | Toggle on-screen mobile touch controls ON/OFF |

---

## 📁 Project Structure
```text
HEARTLESS-demo-/
├── index.html           # Main game canvas & script loader
├── intro-gate.js        # Title screen, Ruins corridor & gate ambush
├── news.js              # Title screen updates & news banner
├── boss1-battle1.js     # Boss 1 (THE DOGBOY) controls, ACT & Mercy logic
├── boss1-battle2.js     # Boss 1 sniper combat & UI rendering
├── throne-cutscene.js   # Throne room walk-up, gold buckets & King intro
├── boss2-battle1.js     # Boss 2 (THE KING) controls, HP dialogue & checkpoint reset
├── boss2-battle2.js     # Boss 2 snipers, Guard slams, whiplashes & rendering
├── ending-cutscene.js   # Shaky-text head zoom-in & sunlit surface gate ending
├── audio.js             # Web Audio API 8-bit soundtrack & SFX generator
├── touch.js             # Toggleable mobile D-pad & action buttons
├── dev-warp.js          # Developer scene-warp utility
├── boss1.png            # THE DOGBOY sprite
├── boss2scene.png       # THE KING throne cutscene sprite
├── boss2fight.png       # THE KING battle sprite
└── heart.png            # Player soul sprite
```

---

## 🔮 Coming Soon in the Full Game
* **Before The Gates:** Explore the Underground and fight valiant monsters.
* **New Chapters, Bosses & Story Routes:** More encounters, deeper Pacifist/Genocide consequences, and new chiptune tracks.

---

## 🚀 Running Locally
No build tools or dependencies are required. Clone the repository and open `index.html` in any modern web browser:

```bash
git clone https://github.com
cd HEARTLESS-demo-
```
