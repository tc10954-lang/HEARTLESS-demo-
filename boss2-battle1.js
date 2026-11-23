var boss2Img = new Image(); boss2Img.src = './boss2fight.png';

var b2Timer = 0, b2Opt = 0, b2Act = 0, b2BarX = 120, b2Pattern = 0, b2Angle = 0;
var b2Enemy = { hp: 160, maxHp: 160, mercy: 0, pleaded: 0, bowed: false };
var b2Bullets = [], b2Lasers = [];
var b2Text = "* THE KING draws his royal blade!";

function startBoss2() {
  player.hp = 20; player.invuln = 0;
  b2Enemy = { hp: 160, maxHp: 160, mercy: 0, pleaded: 0, bowed: false };
  b2Bullets = []; b2Lasers = []; b2Opt = 0;
  b2Text = "* THE KING draws his royal blade!";
  state = 'BOSS2_MENU';
}

window.addEventListener('keydown', function(e) {
  if (!state.startsWith('BOSS2_')) return;

  if (state === 'BOSS2_MENU') {
    if (e.code === 'ArrowLeft') b2Opt = (b2Opt + 3) % 4;
    if (e.code === 'ArrowRight') b2Opt = (b2Opt + 1) % 4;
    if (e.code === 'KeyZ' || e.code === 'Enter') {
      if (b2Opt === 0) { state = 'BOSS2_ATTACK'; b2BarX = 95; }
      else if (b2Opt === 1) { state = 'BOSS2_ACT'; b2Act = 0; }
      else if (b2Opt === 2) { player.hp = Math.min(20, player.hp + 10); b2Text = "* Royal Ambrosiabite! +10 HP!"; startB2Turn(); }
      else if (b2Opt === 3) {
        if (b2Enemy.mercy >= 4) { state = 'BOSS2_WIN'; b2Text = "* THE KING SPARES YOU! Demo Complete!"; }
        else { b2Text = "* THE KING refuses to yield!"; startB2Turn(); }
      }
    }
  } else if (state === 'BOSS2_ACT') {
    if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') b2Act = (b2Act + 2) % 3;
    if (e.code === 'ArrowDown' || e.code === 'ArrowRight') b2Act = (b2Act + 1) % 3;
    if (e.code === 'KeyX' || e.code === 'Escape') state = 'BOSS2_MENU';
    if (e.code === 'KeyZ' || e.code === 'Enter') {
      if (b2Act === 0) b2Text = "* THE KING - ATK 25 DEF 20. Ruler of the Heartless.";
      else if (b2Act === 1) {
        if (b2Enemy.pleaded < 3) { b2Enemy.pleaded++; b2Enemy.mercy++; b2Text = "* You speak of peace. His grip trembles..."; }
        else b2Text = "* His heart is already swayed.";
      } else if (b2Act === 2) {
        if (!b2Enemy.bowed) { b2Enemy.bowed = true; b2Enemy.mercy++; b2Text = "* You kneel with honor. The King hesitates!"; }
        else b2Text = "* You have already shown respect.";
      }
      startB2Turn();
    }
  } else if (state === 'BOSS2_ATTACK' && (e.code === 'KeyZ' || e.code === 'Enter')) {
    var dmg = Math.max(6, Math.floor(32 - Math.abs(320 - b2BarX) / 4));
    b2Enemy.hp = Math.max(0, b2Enemy.hp - dmg);
    if (b2Enemy.hp <= 0) { state = 'BOSS2_WIN'; b2Text = "* THE KING FALLS! Demo Complete!"; }
    else { b2Text = '* HEAVY SLASH! Dealt ' + dmg + ' damage!'; startB2Turn(); }
  } else if ((state === 'BOSS2_WIN' || state === 'BOSS2_LOSE') && e.code === 'KeyR') {
    startBoss2();
  }
});

function startB2Turn() {
  state = 'BOSS2_DODGE'; b2Timer = 390;
  player.x = 313; player.y = 303; b2Bullets = []; b2Lasers = [];
  b2Pattern = (b2Pattern + 1) % 3;
}
