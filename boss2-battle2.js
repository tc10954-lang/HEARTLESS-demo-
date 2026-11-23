var b2Aura = 0;

function hitB2Player(dmg) {
  if (player.invuln > 0) return;
  player.hp = Math.max(0, player.hp - dmg);
  player.invuln = 26;
  if (player.hp <= 0) { state = 'BOSS2_LOSE'; b2RedText = false; b2Text = "* FALLEN. Press R to retry THE KING."; }
}

function updateBoss2() {
  b2Aura += 0.12; b2Pulse += 0.16;
  var rage = b2Enemy.hp <= 64 && b2Enemy.mercy < 4;

  if (state === 'BOSS2_ATTACK') {
    b2BarX += rage ? 12 : 10;
    if (b2BarX > 545) { b2Text = "* PARRIED! Too slow!"; startB2Turn(); }
  }

  if (state === 'BOSS2_DODGE') {
    b2Timer--;
    if (player.invuln > 0) player.invuln--;
    if (keys['ArrowLeft'] && player.x > 224) player.x -= 4.2;
    if (keys['ArrowRight'] && player.x < 402) player.x += 4.2;
    if (keys['ArrowUp'] && player.y > 224) player.y -= 4.2;
    if (keys['ArrowDown'] && player.y < 382) player.y += 4.2;

    var mult = b2Enemy.mercy >= 4 ? 0.7 : (rage ? 1.25 : 1.0);

    // PATTERN 0: Aimed Snipers
    if (b2Pattern === 0 && b2Timer % (rage ? 17 : 22) === 0) {
      var side = Math.floor(Math.random() * 4);
      var bx = side === 0 ? 220 : side === 1 ? 420 : 225 + Math.random() * 190;
      var by = side === 2 ? 220 : side === 3 ? 390 : 225 + Math.random() * 165;
      b2Lasers.push({ x: bx, y: by, tx: player.x + 7, ty: player.y + 7, t: 14 });
    }

    // PATTERN 1: Insanely Fast Half-Side Guard Body Slams (3 slams per turn!)
    if (b2Pattern === 1 && (b2Timer === 265 || b2Timer === 170 || b2Timer === 75)) {
      var throwLeft = Math.random() < 0.5;
      var gx = throwLeft ? 224 : 322;
      b2Guards.push({ x: gx, y: 110, w: 94, h: 98, vy: 16.5 * mult, warn: rage ? 10 : 12 });
    }

    // PATTERN 2: Multi-Whiplash Barrage (3 to 4 crisscrossing slashes at once!)
    if (b2Pattern === 2 && b2Timer % (rage ? 34 : 42) === 0) {
      var count = rage ? 4 : 3;
      var safeX = 240 + Math.random() * 150;
      var safeY = 240 + Math.random() * 125;
      for (var w = 0; w < count; w++) {
        var horiz = w % 2 === 0;
        var pos = horiz ? (230 + Math.random() * 148) : (230 + Math.random() * 178);
        // Keep a guaranteed safe pocket so it's always dodgeable
        if (horiz && Math.abs(pos - safeY) < 22) pos = safeY > 305 ? 236 : 372;
        if (!horiz && Math.abs(pos - safeX) < 22) pos = safeX > 320 ? 236 : 402;
        b2Whips.push({ horiz: horiz, pos: pos, warn: rage ? 14 : 17, snap: 8 });
      }
    }

    // Update Snipers
    for (var i = b2Lasers.length - 1; i >= 0; i--) {
      var l = b2Lasers[i];
      if (--l.t <= 0) {
        var ang = Math.atan2(l.ty - l.y, l.tx - l.x);
        b2Bullets.push({ x: l.x, y: l.y, vx: Math.cos(ang) * 3.8 * mult, vy: Math.sin(ang) * 3.8 * mult });
        b2Lasers.splice(i, 1);
      }
    }
    for (var i = b2Bullets.length - 1; i >= 0; i--) {
      var b = b2Bullets[i]; b.x += b.vx; b.y += b.vy;
      if (player.x + 2 < b.x + 7 && player.x + 12 > b.x && player.y + 2 < b.y + 7 && player.y + 12 > b.y) hitB2Player(5);
      if (b.x < 200 || b.x > 440 || b.y < 200 || b.y > 420) b2Bullets.splice(i, 1);
    }

    // Update Guard Bodies
    for (var i = b2Guards.length - 1; i >= 0; i--) {
      var g = b2Guards[i];
      if (g.warn > 0) {
        g.warn--;
        if (g.warn === 0 && typeof beep === 'function') beep(110, 0.16, 'sawtooth', 0.12, 45);
      } else {
        g.y += g.vy;
        if (player.x + 3 < g.x + g.w && player.x + 11 > g.x && player.y + 3 < g.y + g.h && player.y + 11 > g.y) hitB2Player(6);
        if (g.y > 420) b2Guards.splice(i, 1);
      }
    }

    // Update Whiplashes
    for (var i = b2Whips.length - 1; i >= 0; i--) {
      var w = b2Whips[i];
      if (w.warn > 0) {
        w.warn--;
        if (w.warn === 0 && typeof beep === 'function') beep(1200, 0.08, 'sawtooth', 0.09, 180);
      } else {
        w.snap--;
        if (w.horiz && Math.abs((player.y + 7) - w.pos) < 10) hitB2Player(5);
        if (!w.horiz && Math.abs((player.x + 7) - w.pos) < 10) hitB2Player(5);
        if (w.snap <= 0) b2Whips.splice(i, 1);
      }
    }

    if (b2Timer <= 0 && state === 'BOSS2_DODGE') {
      state = 'BOSS2_MENU';
      b2Text = getKingMenuDialogue();
    }
  }
}

function drawBoss2() {
  var rage = b2Enemy.hp <= 64 && b2Enemy.mercy < 4, spare = b2Enemy.mercy >= 4;
  if (b2Enemy.hp > 0) {
    var sx = rage ? (Math.random() - 0.5) * 7 : 0, sy = rage ? (Math.random() - 0.5) * 7 : 0;
    var pulse = Math.sin(b2Aura * (rage ? 2.5 : 1)) * 8;
    var g = ctx.createRadialGradient(320 + sx, 112 + sy, 15, 320 + sx, 112 + sy, 85 + pulse);
    g.addColorStop(0, spare ? 'rgba(255, 255, 100, 0.7)' : (rage ? 'rgba(255, 50, 50, 0.75)' : 'rgba(180, 130, 255, 0.65)'));
    g.addColorStop(0.6, 'rgba(60, 0, 90, 0.3)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(220, 25, 200, 175);

    if (boss2Img.complete && boss2Img.naturalWidth) ctx.drawImage(boss2Img, 255 + sx, 48 + sy, 130, 130);
    else { ctx.fillStyle = spare ? '#ff0' : '#f80'; ctx.fillRect(275 + sx, 68 + sy, 90, 90); }

    ctx.fillStyle = '#300'; ctx.fillRect(230, 30, 180, 10);
    ctx.fillStyle = spare ? '#ff0' : (rage ? '#f00' : '#f80');
    ctx.fillRect(230, 30, (b2Enemy.hp / b2Enemy.maxHp) * 180, 10);
  }
  ctx.strokeStyle = spare ? '#ff0' : (rage ? '#f44' : '#f80'); ctx.lineWidth = 4;
  ctx.strokeRect(state === 'BOSS2_DODGE' ? 220 : 80, 220, state === 'BOSS2_DODGE' ? 200 : 480, 170);

  if (state === 'BOSS2_MENU' || state === 'BOSS2_WIN' || state === 'BOSS2_LOSE') {
    if (b2RedText && state === 'BOSS2_MENU') {
      var scale = 18 + Math.sin(b2Pulse * 1.5) * 2.2;
      ctx.fillStyle = Math.floor(b2Pulse * 2) % 2 === 0 ? '#ff2222' : '#ff7777';
      ctx.font = 'bold ' + Math.round(scale) + 'px Courier New';
    } else {
      ctx.fillStyle = spare && state === 'BOSS2_MENU' ? '#ff0' : '#fff';
      ctx.font = '17px Courier New';
    }
    ctx.fillText(b2Text, 95, 275);
    if (state === 'BOSS2_WIN' || state === 'BOSS2_LOSE') {
      ctx.fillStyle = '#aaa'; ctx.font = '15px Courier New'; ctx.fillText('[Press R to fight THE KING again]', 95, 320);
    }
  } else if (state === 'BOSS2_ACT') {
    ['* Check', '* Plead (' + b2Enemy.pleaded + '/3)', '* Kneel'].forEach(function(act, i) {
      ctx.fillStyle = b2Act === i ? '#ff0' : '#fff'; ctx.font = '19px Courier New';
      ctx.fillText((b2Act === i ? '> ' : '  ') + act, 110, 270 + i * 35);
    });
  } else if (state === 'BOSS2_ATTACK') {
    ctx.fillStyle = '#444'; ctx.fillRect(312, 230, 16, 150);
    ctx.fillStyle = '#ff0'; ctx.fillRect(b2BarX, 225, 6, 160);
  } else if (state === 'BOSS2_DODGE') {
    ctx.strokeStyle = 'rgba(255, 80, 0, 0.6)'; ctx.lineWidth = 1;
    b2Lasers.forEach(function(l) { ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(l.tx, l.ty); ctx.stroke(); });
    ctx.fillStyle = spare ? '#ff0' : '#ffaa00';
    b2Bullets.forEach(function(b) { ctx.fillRect(b.x, b.y, 7, 7); });

    b2Guards.forEach(function(g) {
      if (g.warn > 0) {
        ctx.fillStyle = 'rgba(255, 40, 40, 0.35)'; ctx.fillRect(g.x, 222, g.w, 166);
        ctx.fillStyle = '#ff0'; ctx.font = 'bold 26px Courier New'; ctx.fillText('!', g.x + 38, 312);
      } else {
        if (enemyImg.complete && enemyImg.naturalWidth) ctx.drawImage(enemyImg, g.x, g.y, g.w, g.h);
        else { ctx.fillStyle = '#ccc'; ctx.fillRect(g.x, g.y, g.w, g.h); }
      }
    });

    b2Whips.forEach(function(w) {
      if (w.warn > 0) {
        ctx.strokeStyle = 'rgba(255, 40, 40, 0.65)'; ctx.lineWidth = 2;
        ctx.beginPath();
        if (w.horiz) { ctx.moveTo(222, w.pos); ctx.lineTo(418, w.pos); }
        else { ctx.moveTo(w.pos, 222); ctx.lineTo(w.pos, 388); }
        ctx.stroke();
      } else {
        var crack = Math.sin(w.snap * 1.4) * 6;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 6;
        ctx.beginPath();
        if (w.horiz) { ctx.moveTo(222, w.pos); ctx.quadraticCurveTo(320, w.pos + crack, 418, w.pos); }
        else { ctx.moveTo(w.pos, 222); ctx.quadraticCurveTo(w.pos + crack, 305, w.pos, 388); }
        ctx.stroke();
      }
    });

    if (Math.floor(player.invuln / 4) % 2 === 0) {
      if (heartImg.complete && heartImg.naturalWidth) ctx.drawImage(heartImg, player.x, player.y, 14, 14);
      else { ctx.fillStyle = '#f00'; ctx.fillRect(player.x, player.y, 14, 14); }
    }
  }

  ctx.fillStyle = '#fff'; ctx.font = '18px Courier New';
  ctx.fillText('YOU   LV 2   HP ' + player.hp + '/20', 80, 418);
  ['FIGHT', 'ACT', 'HEAL', 'MERCY'].forEach(function(opt, i) {
    var bx = 80 + i * 125, ready = (i === 3 && spare);
    ctx.strokeStyle = (state === 'BOSS2_MENU' && b2Opt === i) ? '#ff0' : (ready ? '#ff0' : '#f80');
    ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 2;
    ctx.strokeRect(bx, 432, 105, 36); ctx.font = '17px Courier New'; ctx.fillText(opt, bx + 22, 456);
  });
}
