const AudioCtx = window.AudioContext || window.webkitAudioContext;
let actx = null, step = 0;

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

// Menu & confirm sound effects
window.addEventListener('keydown', (e) => {
  if (typeof state === 'undefined') return;
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    if (state === 'MENU' || state === 'BOSS2_MENU') beep(440, 0.06, 'square', 0.06);
  }
  if (e.code === 'KeyZ' || e.code === 'Enter') {
    if (state === 'TITLE' || state === 'DIALOGUE') beep(660, 0.12, 'square', 0.08);
    else if (state === 'MENU' || state === 'BOSS2_MENU') beep(520, 0.1, 'triangle', 0.09, 260);
    else if (state === 'ATTACK_BAR' || state === 'BOSS2_ATTACK') beep(800, 0.14, 'sawtooth', 0.1, 180);
  }
});

// Watch HP & bullets for hit/damage SFX
let lastState = '', lastPlayerHp = 20, lastEnemyHp = 100, lastB2Hp = 160, lastBullets = 0;
setInterval(() => {
  if (typeof state === 'undefined') return;

  if (state !== lastState) {
    if (state === 'ENCOUNTER') { beep(320, 0.08, 'square', 0.1); setTimeout(() => beep(640, 0.22, 'square', 0.1), 90); }
    lastState = state;
  }

  if (typeof player !== 'undefined' && player.hp < lastPlayerHp) beep(150, 0.2, 'sawtooth', 0.12, 55);
  if (typeof player !== 'undefined') lastPlayerHp = player.hp;

  if (typeof enemy !== 'undefined' && enemy.hp < lastEnemyHp) beep(220, 0.16, 'square', 0.11, 70);
  if (typeof enemy !== 'undefined') lastEnemyHp = enemy.hp;

  if (typeof b2Enemy !== 'undefined' && b2Enemy.hp < lastB2Hp) beep(200, 0.18, 'square', 0.12, 60);
  if (typeof b2Enemy !== 'undefined') lastB2Hp = b2Enemy.hp;

  if (typeof bullets !== 'undefined' && bullets.length > lastBullets) beep(920, 0.07, 'sine', 0.06, 320);
  if (typeof bullets !== 'undefined') lastBullets = bullets.length;
}, 40);

// Boss 1 (THE DOGBOY) Chiptune Loop
const bassNotes = [110, 110, 130.8, 110, 146.8, 130.8, 98, 130.8];
const leadNotes = [440, 0, 523.2, 493.8, 440, 392, 329.6, 392];
setInterval(() => {
  if (typeof state !== 'undefined' && ['MENU', 'ACT_MENU', 'ATTACK_BAR', 'DODGE'].includes(state)) {
    let rage = typeof enemy !== 'undefined' && enemy.hp <= 50;
    beep(bassNotes[step % 8] * (rage ? 1.12 : 1), 0.14, 'triangle', 0.05);
    if (leadNotes[step % 8] > 0) beep(leadNotes[step % 8] * (rage ? 1.12 : 1), 0.1, 'square', 0.03);
    step++;
  }
}, 190);

// --- CRAZY BOSS 2 (THE KING) THEME ---
var kStep = 0;
var kLead = [293.7, 293.7, 587.3, 440, 0, 415.3, 392, 349.2, 293.7, 349.2, 392, 261.6, 261.6, 587.3, 440, 415.3];
var kBass = [73.4, 146.8, 73.4, 146.8, 65.4, 130.8, 65.4, 130.8, 58.3, 116.5, 58.3, 116.5, 65.4, 130.8, 82.4, 164.8];
setInterval(function() {
  if (typeof state !== 'undefined' && ['BOSS2_MENU', 'BOSS2_ACT', 'BOSS2_ATTACK', 'BOSS2_DODGE'].indexOf(state) !== -1) {
    var rage = typeof b2Enemy !== 'undefined' && b2Enemy.hp <= 64;
    var mult = rage ? 1.15 : 1.0;
    beep(kBass[kStep % 16] * mult, 0.11, 'sawtooth', 0.055);
    if (kLead[kStep % 16] > 0) beep(kLead[kStep % 16] * mult, 0.1, 'square', 0.045);
    kStep++;
  }
}, 125);
