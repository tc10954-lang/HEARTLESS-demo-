function updateBattle() {
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

    if (turnTimer % (rage ? 16 : 22) === 0) {
      let side = Math.floor(Math.random() * 4);
      let bx = side === 0 ? 230 : side === 1 ? 410 : 230 + Math.random() * 180;
      let by = side === 2 ? 230 : side === 3 ? 390 : 230 + Math.random() * 160;
      telegraphs.push({ x: bx, y: by, tx: player.x + 7, ty: player.y + 7, timer: 16 });
    }
    for (let i = telegraphs.length - 1; i >= 0; i--) {
      let t = telegraphs[i];
      if (--t.timer <= 0) {
        let a = Math.atan2(t.ty - t.y, t.tx - t.x), spd = rage ? 4.4 : 3.3;
        bullets.push({ x: t.x, y: t.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd });
        telegraphs.splice(i, 1);
      }
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

function drawBattle() {
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
    ctx.strokeStyle = 'rgba(255, 50, 50, 0.55)'; ctx.lineWidth = 1;
    telegraphs.forEach(t => { ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(t.tx, t.ty); ctx.stroke(); });
    if (Math.floor(player.invuln / 4) % 2 === 0) {
      if (heartImg.complete && heartImg.naturalWidth) ctx.drawImage(heartImg, player.x, player.y, 14, 14);
      else { ctx.fillStyle = '#f00'; ctx.fillRect(player.x, player.y, 14, 14); }
    }
    ctx.fillStyle = rage ? '#ff5555' : '#fff';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 7, 7));
  }

  ctx.fillStyle = '#fff'; ctx.font = '18px Courier New';
  ctx.fillText(`YOU   LV 1   HP ${player.hp}/20`, 80, 418);
  ['FIGHT', 'HEAL'].forEach((opt, i) => {
    let bx = 140 + i * 220;
    ctx.strokeStyle = (state === 'MENU' && selectedOption === i) ? '#ff0' : '#f80';
    ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 2;
    ctx.strokeRect(bx, 432, 140, 36); ctx.fillText(opt, bx + 42, 456);
  });
}

function loop() {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 640, 480);
  if (state === 'TITLE' || state === 'OVERWORLD' || state === 'ENCOUNTER' || state === 'DIALOGUE') {
    updateOverworld(); drawOverworld();
  } else {
    updateBattle(); drawBattle();
  }
  requestAnimationFrame(loop);
}
loop();
