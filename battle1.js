let turnTimer = 0, selectedOption = 0, attackBarX = 120;
let player = { x: 313, y: 303, size: 14, speed: 3.8, hp: 20, invuln: 0 };
let enemy = { hp: 100 };
let bullets = [], telegraphs = [];
let battleText = "* THE HEARTLESS blocks the gate!";

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (state === 'TITLE' && (e.code === 'KeyZ' || e.code === 'Enter')) state = 'OVERWORLD';
  else if (state === 'DIALOGUE' && (e.code === 'KeyZ' || e.code === 'Enter')) state = 'MENU';
  else if (state === 'MENU') {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') selectedOption = (selectedOption + 1) % 2;
    if (e.code === 'KeyZ' || e.code === 'Enter') {
      if (selectedOption === 0) { state = 'ATTACK_BAR'; attackBarX = 100; }
      else { player.hp = Math.min(20, player.hp + 9); battleText = "* Soul Shard used. +9 HP!"; startEnemyTurn(); }
    }
  } else if (state === 'ATTACK_BAR' && (e.code === 'KeyZ' || e.code === 'Enter')) {
    let dmg = Math.max(5, Math.floor(28 - Math.abs(320 - attackBarX) / 5));
    enemy.hp = Math.max(0, enemy.hp - dmg);
    if (enemy.hp <= 0) { state = 'WIN'; battleText = "* THE GATE OPENS! Press R to replay."; }
    else { battleText = `* STRIKE! Dealt ${dmg} damage!`; startEnemyTurn(); }
  } else if ((state === 'WIN' || state === 'LOSE') && e.code === 'KeyR') {
    walker = { x: 308, y: 405, speed: 2.6 }; player.hp = 20; player.invuln = 0;
    enemy.hp = 100; bullets = []; telegraphs = []; selectedOption = 0;
    battleText = "* THE HEARTLESS blocks the gate!"; state = 'OVERWORLD';
  }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function startEnemyTurn() {
  state = 'DODGE'; turnTimer = 330; player.x = 313; player.y = 303; bullets = []; telegraphs = [];
}
