const AudioCtx = window.AudioContext || window.webkitAudioContext;
let actx = null, bgmTimer = null, step = 0;

function beep(freq, dur, type = 'square', vol = 0.08, slide = null) {
  if (!actx) actx = new AudioCtx();
  if (actx.state === 'suspended') actx.resume();
  const osc = actx.createOscillator(), gain = actx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, actx.currentTime);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, actx.currentTime + dur);
  gain.gain.setValueAtTime(vol, actx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
  osc.connect(gain); gain.connect(actx.destination);
  osc.start(); osc.stop(actx.currentTime + dur);
}

// Auto-hook into keyboard controls for menu & confirm sounds
window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    if (typeof state !== 'undefined' && state === 'MENU') beep(440, 0.06, 'square', 0.06);
  }
  if (e.code === 'KeyZ' || e.code === 'Enter') {
    if (typeof state !== 'undefined') {
      if (state === 'TITLE' || state === 'DIALOGUE') beep(660, 0.12, 'square', 0.08);
      else if (state === 'MENU') beep(selectedOption === 0 ? 520 : 600, 0.1, 'triangle', 0.09, selectedOption === 0 ? 260 : 880);
      else if (state === 'ATTACK_BAR') beep(800, 0.14, 'sawtooth', 0.1, 180);
    }
  }
});

// Watch game state, HP, and bullets to trigger SFX & chiptune boss music
let lastState = '', lastPlayerHp = 20, lastEnemyHp = 100, lastBullets = 0;
setInterval(() => {
  if (typeof state === 'undefined') return;

  if (state !== lastState) {
    if (state === 'ENCOUNTER') { beep(320, 0.08, 'square', 0.1); setTimeout(() => beep(640, 0.22, 'square', 0.1), 90); }
    if (state === 'WIN') { [523, 659, 784, 1046].forEach((n, i) => setTimeout(() => beep(n, 0.18, 'triangle', 0.1), i * 110)); }
    if (state === 'LOSE') { [330, 294, 262, 196].forEach((n, i) => setTimeout(() => beep(n, 0.22, 'sawtooth', 0.1), i * 140)); }
    lastState = state;
  }

  if (typeof player !== 'undefined' && player.hp < lastPlayerHp) beep(150, 0.2, 'sawtooth', 0.12, 55);
  if (typeof player !== 'undefined') lastPlayerHp = player.hp;

  if (typeof enemy !== 'undefined' && enemy.hp < lastEnemyHp) beep(220, 0.16, 'square', 0.11, 70);
  if (typeof enemy !== 'undefined') lastEnemyHp = enemy.hp;

  if (typeof bullets !== 'undefined' && bullets.length > lastBullets) beep(920, 0.07, 'sine', 0.06, 320);
  if (typeof bullets !== 'undefined') lastBullets = bullets.length;
}, 40);

// Boss Chiptune Loop
const bassNotes = [110, 110, 130.8, 110, 146.8, 130.8, 98, 130.8];
const leadNotes = [440, 0, 523.2, 493.8, 440, 392, 329.6, 392];
setInterval(() => {
  if (typeof state === 'undefined') return;
  if (['MENU', 'ATTACK_BAR', 'DODGE'].includes(state)) {
    let rage = typeof enemy !== 'undefined' && enemy.hp <= 50;
    beep(bassNotes[step % 8] * (rage ? 1.12 : 1), 0.14, 'triangle', 0.05);
    if (leadNotes[step % 8] > 0) beep(leadNotes[step % 8] * (rage ? 1.12 : 1), 0.1, 'square', 0.03);
    step++;
  }
}, 190);
