let turnTimer = 0, selectedOption = 0, actOption = 0, attackBarX = 120;
let player = { x: 313, y: 303, size: 14, speed: 3.8, hp: 20, invuln: 0 };
let enemy = { hp: 100, mercy: 0, reasoned: 0, lowered: false };
let bullets = [], telegraphs = [];
let battleText = "* THE DOGBOY blocks the gate!";

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (state === 'TITLE' && (e.code === 'KeyZ' || e.code === 'Enter')) state = 'OVERWORLD';
  else if (state === 'DIALOGUE' && (e.code === 'KeyZ' || e.code === 'Enter')) state = 'MENU';
  else if (state === 'MENU') {
    if (e.code === 'ArrowLeft') selectedOption = (selectedOption + 3) % 4;
    if (e.code === 'ArrowRight') selectedOption = (selectedOption + 1) % 4;
    if (e.code === 'KeyZ' || e.code === 'Enter') {
      if (selectedOption === 0) { state = 'ATTACK_BAR'; attackBarX = 100; }
      else if (selectedOption === 1) { state = 'ACT_MENU'; actOption = 0; }
      else if (selectedOption === 2) { player.hp = Math.min(20, player.hp + 9); battleText = "* Soul Shard used. +9 HP!"; startEnemyTurn(); }
      else if (selectedOption === 3) {
        if (enemy.mercy >= 3) { state = 'SPARE_WIN'; battleText = "* YOU SPARED THE DOGBOY! Press Z to pass."; }
        else { battleText = "* THE DOGBOY isn't ready to spare yet!"; startEnemyTurn(); }
      }
    }
  } else if (state === 'ACT_MENU') {
    if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') actOption = (actOption + 2) % 3;
    if (e.code === 'ArrowDown' || e.code === 'ArrowRight') actOption = (actOption + 1) % 3;
    if (e.code === 'KeyX' || e.code === 'Escape') state = 'MENU';
    if (e.code === 'KeyZ' || e.code === 'Enter') {
      if (actOption === 0) battleText = "* THE DOGBOY - ATK 10 DEF 10. Sworn to guard the gate.";
      else if (actOption === 1) {
        if (enemy.reasoned < 2) { enemy.reasoned++; enemy.mercy++; battleText = "* You calmly explain you mean no harm. Its aim wavers."; }
        else battleText = "* It already hears your words.";
      } else if (actOption === 2) {
        if (!enemy.lowered) { enemy.lowered = true; enemy.mercy++; battleText = "* You lower your stance. THE DOGBOY hesitates!"; }
        else battleText = "* Your stance is already peaceful.";
      }
      startEnemyTurn();
    }
  } else if (state === 'ATTACK_BAR' && (e.code === 'KeyZ' || e.code === 'Enter')) {
    let dmg = Math.max(5, Math.floor(28 - Math.abs(320 - attackBarX) / 5));
    enemy.hp = Math.max(0, enemy.hp - dmg);
    if (enemy.hp <= 0) { state = 'KILL_WIN'; battleText = "* THE DOGBOY falls... Press Z to pass the gate."; }
    else { battleText = `* STRIKE! Dealt ${dmg} damage!`; startEnemyTurn(); }
  } else if ((state === 'KILL_WIN' || state === 'SPARE_WIN') && (e.code === 'KeyZ' || e.code === 'Enter')) {
    if (typeof killedBoss !== 'undefined') killedBoss = (state === 'KILL_WIN');
    if (typeof throneWalker !== 'undefined') throneWalker = { x: 308, y: 420, speed: 2.5 };
    state = 'THRONE_WALK';
  } else if (state === 'LOSE' && e.code === 'KeyR') {
    walker = { x: 308, y: 405, speed: 2.6 }; player.hp = 20; player.invuln = 0;
    enemy = { hp: 100, mercy: 0, reasoned: 0, lowered: false }; bullets = []; telegraphs = [];
    selectedOption = 0; battleText = "* THE DOGBOY blocks the gate!"; state = 'OVERWORLD';
  }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function startEnemyTurn() {
  state = 'DODGE'; turnTimer = 330; player.x = 313; player.y = 303; bullets = []; telegraphs = [];
}
