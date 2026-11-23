function updateBoss2() {
  let rage = b2Enemy.hp <= 80 && b2Enemy.mercy < 4;
  if (state === 'BOSS2_ATTACK') {
    b2BarX += rage ? 12.5 : 10;
    if (b2BarX > 545) { b2Text = "* PARRIED! Too slow!"; startB2Turn(); }
  }
  if (state === 'BOSS2_DODGE') {
    b2Timer--;
    if (player.invuln > 0) player.invuln--;
    if (keys['ArrowLeft'] && player.x > 224) player.x -= 4.0;
    if (keys['ArrowRight'] && player.x < 402) player.x += 4.0;
    if (keys['ArrowUp'] && player.y > 224) player.y -= 4.0;
    if (keys['ArrowDown'] && player.y < 382) player.y += 4.0;

    let mult = b2Enemy.mercy >= 4 ? 0.65 : (rage ? 1.35 : 1.0);

    // Pattern 0: Double Aimed Snipers
    if (b2Pattern === 0 && b2Timer % (rage ? 18 : 24) === 0) {
      for (let k = 0; k < 2; k++) {
        let bx = k === 0 ? 220 : 420, by = 225 + Math.random() * 165;
        b2Lasers.push({ x: bx, y: by, tx: player.x + 7, ty: player.y + 7, t: 15 });
      }
    }
    // Pattern 1: Royal Crossfire Walls
    if (b2Pattern === 1 && b2Timer % (rage ? 34 : 44) === 0) {
      let gap = 240 + Math.random() * 125;
      for (let y = 224; y < 390; y += 16) {
        if (Math.abs(y - gap) > 22) b2Bullets.push({ x: 215, y: y, vx: 2.8 * mult, vy: 0 });
      }
    }
    // Pattern 2: Crown Spiral Storm
    if (b2Pattern === 2 && b2Timer % (rage ? 5 : 7) === 0) {
      b2Angle += 0.42;
      for (let k = 0; k < 2; k++) {
        let a = b2Angle + k * Math.PI;
        b2Bullets.push({ x: 316, y: 306, vx: Math.cos(a) * 2.5 * mult, vy: Math.sin(a) * 2.5 * mult });
      }
    }

    for (let i = b2Lasers.length - 1; i >= 0; i--) {
      let l = b2Lasers[i];
      if (--l.t <= 0) {
        let a = Math.atan2(l.ty - l.y, l.tx - l.x);
        b2Bullets.push({ x: l.x, y: l.y, vx: Math.cos(a) * 3.8 * mult, vy: Math.sin(a) * 3.8 * mult });
        b2Lasers.splice(i, 1);
      }
    }
    for (let i = b2Bullets.length - 1; i >= 0; i--) {
      let b = b2Bullets[i]; b.x += b.vx; b.y += b.vy;
      if (player.invuln === 0 && player.x + 2 < b.x + 7 && player.x + 12 > b.x && player.y + 2 < b.y + 7 && player.y + 12 > b.y) {
        player.hp = Math.max(0, player.hp - 6); player.invuln = 25;
        if (player.hp <= 0) { state = 'BOSS2_LOSE'; b2Text = "* FALLEN. Press R to retry THE KING."; }
      }
      if (b.x < 200 || b.x > 440 || b.y < 200 || b.y > 420) b2Bullets.splice(i, 1);
    }
    if (b2Timer <= 0 && state === 'BOSS2_DODGE') {
      state = 'BOSS2_MENU';
      b2Text = b2Enemy.mercy >= 4 ? "* THE KING lowers his crown!" : (rage ? "* THE KING'S AURA BLAZES!" : "* Shadows swirl around the throne...");
    }
  }
}

function drawBoss2() {
  let rage = b2Enemy.hp <= 80 && b2Enemy.mercy < 4, spare = b2Enemy.mercy >= 4;
  if (b2Enemy.hp > 0) {
    let sx = rage ? (Math.random() - 0.5) * 7 : 0, sy = rage ? (Math.random() - 0.5) * 7 : 0;
    if (boss2Img.complete && boss2Img.naturalWidth) ctx.drawImage(boss2Img, 255 + sx, 48 + sy, 130, 130);
    else { ctx.fillStyle = spare ? '#ff0' : '#f80'; ctx.fillRect(275 + sx, 68 + sy, 90, 90); }
    ctx.fillStyle = '#300'; ctx.fillRect(230, 30, 180, 10);
    ctx.fillStyle = spare ? '#ff0' : (rage ? '#f00' : '#f80');
    ctx.fillRect(230, 30, (b2Enemy.hp / b2Enemy.maxHp) * 180, 10);
  }
  ctx.strokeStyle = spare ? '#ff0' : (rage ? '#f44' : '#f80'); ctx.lineWidth = 4;
  ctx.strokeRect(state === 'BOSS2_DODGE' ? 220 : 80, 220, state === 'BOSS2_DODGE' ? 200 : 480, 170);

  if (state === 'BOSS2_MENU' || state === 'BOSS2_WIN' || state === 'BOSS2_LOSE') {
    ctx.fillStyle = spare && state === 'BOSS2_MENU' ? '#ff0' : '#fff';
    ctx.font = '18px Courier New'; ctx.fillText(b2Text, 95, 275);
    if (state === 'BOSS2_WIN' || state === 'BOSS2_LOSE') {
      ctx.fillStyle = '#aaa'; ctx.font = '15px Courier New'; ctx.fillText('[Press R to fight THE KING again]', 95, 320);
    }
  } else if (state === 'BOSS2_ACT') {
    ['* Check', '* Plead (' + b2Enemy.pleaded + '/3)', '* Kneel'].forEach((act, i) => {
      ctx.fillStyle = b2Act === i ? '#ff0' : '#fff'; ctx.font = '19px Courier New';
      ctx.fillText((b2Act === i ? '> ' : '  ') + act, 110, 270 + i * 35);
    });
  } else if (state === 'BOSS2_ATTACK') {
    ctx.fillStyle = '#444'; ctx.fillRect(312, 230, 16, 150);
    ctx.fillStyle = '#ff0'; ctx.fillRect(b2BarX, 225, 6, 160);
  } else if (state === 'BOSS2_DODGE') {
    ctx.strokeStyle = 'rgba(255, 80, 0, 0.6)'; ctx.lineWidth = 1;
    b2Lasers.forEach(l => { ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(l.tx, l.ty); ctx.stroke(); });
    if (Math.floor(player.invuln / 4) % 2 === 0) {
      if (heartImg.complete && heartImg.naturalWidth) ctx.drawImage(heartImg, player.x, player.y, 14, 14);
      else { ctx.fillStyle = '#f00'; ctx.fillRect(player.x, player.y, 14, 14); }
    }
    ctx.fillStyle = spare ? '#ff0' : (rage ? '#ff4444' : '#ffaa00');
    b2Bullets.forEach(b => ctx.fillRect(b.x, b.y, 7, 7));
  }

  ctx.fillStyle = '#fff'; ctx.font = '18px Courier New';
  ctx.fillText(`YOU   LV 2   HP ${player.hp}/20`, 80, 418);
  ['FIGHT', 'ACT', 'HEAL', 'MERCY'].forEach((opt, i) => {
    let bx = 80 + i * 125, ready = (i === 3 && spare);
    ctx.strokeStyle = (state === 'BOSS2_MENU' && b2Opt === i) ? '#ff0' : (ready ? '#ff0' : '#f80');
    ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 2;
    ctx.strokeRect(bx, 432, 105, 36); ctx.font = '17px Courier New'; ctx.fillText(opt, bx + 22, 456);
  });
}
