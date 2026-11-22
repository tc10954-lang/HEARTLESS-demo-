const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const enemyImg = new Image(); enemyImg.src = './enemy.png';
const heartImg = new Image(); heartImg.src = './heart.png';

let state = 'TITLE', turnTimer = 0, encounterTimer = 0, walkFrame = 0;
let walker = { x: 308, y: 410, w: 24, h: 32, speed: 2.5 };
let player = { x: 313, y: 303, size: 14, speed: 3.8, hp: 20, maxHp: 20, invuln: 0 };
let enemy = { hp: 100, maxHp: 100 };

const menuOptions = ['FIGHT', 'HEAL'];
let selectedOption = 0, attackBarX = 120, bullets = [], keys = {};
let battleText = "* THE HEARTLESS guards the gate!";

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (state === 'TITLE' && (e.code === 'KeyZ' || e.code === 'Enter')) state = 'OVERWORLD';
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
    walker = { x: 308, y: 410, w: 24, h: 32, speed: 2.5 };
    player.hp = 20; player.invuln = 0; enemy.hp = 100; bullets = []; selectedOption = 0;
    battleText = "* THE HEARTLESS guards the gate!"; state = 'OVERWORLD';
  }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function startEnemyTurn() {
  state = 'DODGE'; turnTimer = 330; player.x = 313; player.y = 303; bullets = [];
}

function update() {
  if (state === 'OVERWORLD') {
    let moving = false;
    if (keys['ArrowLeft'] && walker.x > 214) { walker.x -= walker.speed; moving = true; }
    if (keys['ArrowRight'] && walker.x < 402) { walker.x += walker.speed; moving = true; }
    if (keys['ArrowUp'] && walker.y > 150) { walker.y -= walker.speed; moving = true; }
    if (keys['ArrowDown'] && walker.y < 440) { walker.y += walker.speed; moving = true; }
    if (moving) walkFrame++;
    if (walker.y <= 162) { state = 'ENCOUNTER'; encounterTimer = 95; }
    return;
  }
  if (state === 'ENCOUNTER') {
    if (--encounterTimer <= 0) state = 'MENU';
    return;
  }

  let rage = enemy.hp <= 50;
  if (state === 'ATTACK_BAR') {
    attackBarX += rage ? 10.5 : 8.5;
    if (attackBarX > 540) { battleText = "* MISSED! Too slow!"; startEnemyTurn(); }
  }
  if (state === 'DODGE') {
    turnTimer--;
    if (player.invuln > 0) player.invuln--;
    if (keys['ArrowLeft'] && player.x > 234) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < 392) player.x += player.speed;
    if (keys['ArrowUp'] && player.y > 234) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < 372) player.y += player.speed;

    if (turnTimer % (rage ? 14 : 20) === 0) {
      let side = Math.floor(Math.random() * 4);
      let bx = side === 0 ? 230 : side === 1 ? 410 : 230 + Math.random() * 180;
      let by = side === 2 ? 230 : side === 3 ? 390 : 230 + Math.random() * 160;
      let a = Math.atan2((player.y + 7) - by, (player.x + 7) - bx);
      let spd = rage ? 4.2 : 3.1;
      bullets.push({ x: bx, y: by, size: 7, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd });
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i]; b.x += b.vx; b.y += b.vy;
      if (player.invuln === 0 && player.x + 2 < b.x + 7 && player.x + 12 > b.x && player.y + 2 < b.y + 7 && player.y + 12 > b.y) {
        player.hp = Math.max(0, player.hp - 5); player.invuln = 28;
        if (player.hp <= 0) { state = 'LOSE'; battleText = "* SHATTERED. Press R to try again."; }
      }
      if (b.x < 210 || b.x > 430 || b.y < 210 || b.y > 410) bullets.splice(i, 1);
    }
    if (turnTimer <= 0 && state === 'DODGE') {
      state = 'MENU';
      battleText = rage ? "* THE HEARTLESS LOCKS ONTO YOU!" : "* Sniper sights track your soul...";
    }
  }
}

function draw() {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 640, 480);

  if (state === 'TITLE') {
    ctx.fillStyle = '#fff'; ctx.font = 'bold 36px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('HEARTLESS', 320, 180);
    ctx.fillStyle = '#888'; ctx.font = '18px Courier New'; ctx.fillText('(demo)', 320, 210);
    ctx.fillStyle = '#ff0'; ctx.fillText('Press Z or ENTER to Start', 320, 310);
    ctx.fillStyle = '#aaa'; ctx.font = '14px Courier New';
    ctx.fillText('Arrow Keys: Walk / Dodge | Z / Enter: Confirm', 320, 360);
    ctx.textAlign = 'left'; return;
  }

  if (state === 'OVERWORLD' || state === 'ENCOUNTER') {
    ctx.fillStyle = '#0d0614'; ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#2a163b'; ctx.fillRect(190, 80, 20, 400); ctx.fillRect(430, 80, 20, 400);
    for (let y = 140; y < 480; y += 32) {
      for (let x = 210; x < 430; x += 32) {
        ctx.fillStyle = ((x + y) / 32) % 2 === 0 ? '#1b0e26' : '#221230';
        ctx.fillRect(x, y, 32, 32);
      }
    }
    ctx.fillStyle = '#3b2052'; ctx.fillRect(190, 40, 260, 110);
    ctx.fillStyle = '#050208'; ctx.fillRect(240, 65, 160, 85);
    ctx.fillStyle = '#777';
    for (let bx = 252; bx <= 388; bx += 22) ctx.fillRect(bx, 65, 6, 85);
    ctx.fillRect(240, 95, 160, 6); ctx.fillRect(240, 125, 160, 6);

    if (state === 'ENCOUNTER') {
      let p = 1 - (encounterTimer / 95), riseY = 120 - p * 55;
      ctx.save(); ctx.globalAlpha = Math.min(1, p * 1.5);
      if (enemyImg.complete && enemyImg.naturalWidth) ctx.drawImage(enemyImg, 272, riseY, 96, 96);
      else { ctx.fillStyle = '#fff'; ctx.fillRect(285, riseY + 10, 70, 70); }
      ctx.restore();
    }

    let bob = Math.sin(walkFrame * 0.3) * 2;
    ctx.fillStyle = '#4a2e1b'; ctx.fillRect(walker.x + 4, walker.y + bob, 16, 12);
    ctx.fillStyle = '#f5c242'; ctx.fillRect(walker.x + 6, walker.y + 4 + bob, 12, 8);
    ctx.fillStyle = '#3b5dc9'; ctx.fillRect(walker.x + 4, walker.y + 12 + bob, 16, 12);
    ctx.fillStyle = '#a83279'; ctx.fillRect(walker.x + 4, walker.y + 16 + bob, 16, 4);
    ctx.fillStyle = '#2b1b17'; ctx.fillRect(walker.x + 6, walker.y + 24, 5, 8); ctx.fillRect(walker.x + 13, walker.y + 24, 5, 8);

    if (state === 'ENCOUNTER') {
      ctx.fillStyle = '#fff'; ctx.fillRect(walker.x + 2, walker.y - 28, 20, 20);
      ctx.fillStyle = '#f00'; ctx.font = 'bold 16px Courier New'; ctx.fillText('!', walker.x + 7, walker.y - 13);
      if (encounterTimer < 25 && Math.floor(encounterTimer / 4) % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(0, 0, 640, 480);
      }
    } else {
      ctx.fillStyle = '#aaa'; ctx.font = '15px Courier New'; ctx.textAlign = 'center';
      ctx.fillText('Walk up to the gate...', 320, 465); ctx.textAlign = 'left';
    }
    return;
  }

  let rage = enemy.hp <= 50;
  if (enemy.hp > 0) {
    let sx = rage ? (Math.random() - 0.5) * 6 : 0, sy = rage ? (Math.random() - 0.5) * 6 : 0;
    if (enemyImg.complete && enemyImg.naturalWidth) ctx.drawImage(enemyImg, 260 + sx, 55 + sy, 120, 120);
    else { ctx.fillStyle = rage ? '#f33' : '#fff'; ctx.fillRect(280 + sx, 75 + sy, 80, 80); }
    ctx.fillStyle = '#300'; ctx.fillRect(245, 35, 150, 10);
    ctx.fillStyle = rage ? '#f00' : '#0f0'; ctx.fillRect(245, 35, (enemy.hp / 100) * 150, 10);
  }

  ctx.strokeStyle = rage ? '#f44' : '#fff'; ctx.lineWidth = 4;
  ctx.strokeRect(state === 'DODGE' ? 230 : 80, 230, state === 'DODGE' ? 180 : 480, 160);

  if (state === 'MENU' || state === 'WIN' || state === 'LOSE') {
    ctx.fillStyle = '#fff'; ctx.font = '19px Courier New'; ctx.fillText(battleText, 100, 280);
  } else if (state === 'ATTACK_BAR') {
    ctx.fillStyle = '#444'; ctx.fillRect(310, 240, 20, 140);
    ctx.fillStyle = '#ff0'; ctx.fillRect(attackBarX, 235, 6, 150);
  } else if (state === 'DODGE') {
    if (Math.floor(player.invuln / 4) % 2 === 0) {
      if (heartImg.complete && heartImg.naturalWidth) ctx.drawImage(heartImg, player.x, player.y, 14, 14);
      else { ctx.fillStyle = '#f00'; ctx.fillRect(player.x, player.y, 14, 14); }
    }
    ctx.fillStyle = rage ? '#ff5555' : '#fff';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 7, 7));
  }

  ctx.fillStyle = '#fff'; ctx.font = '18px Courier New';
  ctx.fillText(`YOU   LV 1   HP ${player.hp}/20`, 80, 418);
  menuOptions.forEach((opt, i) => {
    let bx = 140 + i * 220;
    ctx.strokeStyle = (state === 'MENU' && selectedOption === i) ? '#ff0' : '#f80';
    ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 2;
    ctx.strokeRect(bx, 432, 140, 36); ctx.fillText(opt, bx + 42, 456);
  });
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
