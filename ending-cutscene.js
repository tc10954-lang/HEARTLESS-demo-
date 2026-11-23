var endStep = 0, gateOpenProgress = 0, endTick = 0;

var endLines = [
  { scene: 'KING', shaky: true,  text: '* "I-I... I can\'t believe it."' },
  { scene: 'KING', shaky: true,  text: '* "You... YOU. A mortal. A human being."' },
  { scene: 'KING', shaky: true,  text: '* "Bested the king of the Underworld."' },
  { scene: 'GATE', shaky: false, text: '* "Go, human. This is what you wanted, wasn\'t it?"' },
  { scene: 'GATE', shaky: false, text: '* "To see your sun again."' },
  { scene: 'GATE', shaky: false, text: '* "As bitter as I am, you deserve it."' },
  { scene: 'GATE', shaky: false, text: '* "Find freedom, mortal. Many realise when they come back to the surface, that the Underworld is better."' }
];

function drawWrappedShakyText(text, x, y, maxW, lineH, shaky) {
  var words = text.split(' ');
  var line = '', curY = y;
  ctx.font = '17px Courier New';
  for (var n = 0; n < words.length; n++) {
    var test = line + words[n] + ' ';
    if (ctx.measureText(test).width > maxW && n > 0) {
      drawLineChars(line, x, curY, shaky);
      line = words[n] + ' ';
      curY += lineH;
    } else {
      line = test;
    }
  }
  drawLineChars(line, x, curY, shaky);
}

function drawLineChars(str, startX, startY, shaky) {
  var cx = startX;
  for (var i = 0; i < str.length; i++) {
    var ch = str[i];
    var jx = shaky ? (Math.random() - 0.5) * 4.5 : 0;
    var jy = shaky ? (Math.random() - 0.5) * 4.5 : 0;
    ctx.fillText(ch, cx + jx, startY + jy);
    cx += ctx.measureText(ch).width;
  }
}

function updateEndingScene() {
  endTick += 0.08;
  if (state === 'ENDING_OPEN' && gateOpenProgress < 1) {
    gateOpenProgress = Math.min(1, gateOpenProgress + 0.015);
  }
}

function drawEndingScene() {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 640, 480);

  var current = endLines[Math.min(endStep, endLines.length - 1)];

  if (state === 'ENDING_CUTSCENE' && current.scene === 'KING') {
    // Dramatic zoom-in on the King's head (top half of boss2fight.png)
    var pulse = Math.sin(endTick * 2) * 8;
    var g = ctx.createRadialGradient(320, 165, 20, 320, 165, 130 + pulse);
    g.addColorStop(0, 'rgba(180, 120, 255, 0.7)');
    g.addColorStop(0.6, 'rgba(50, 0, 70, 0.3)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(160, 20, 320, 280);

    var sx = (Math.random() - 0.5) * 3, sy = (Math.random() - 0.5) * 3;
    if (typeof boss2Img !== 'undefined' && boss2Img.complete && boss2Img.naturalWidth) {
      var sw = boss2Img.naturalWidth, sh = boss2Img.naturalHeight * 0.58;
      ctx.drawImage(boss2Img, 0, 0, sw, sh, 200 + sx, 45 + sy, 240, 220);
    } else {
      ctx.fillStyle = '#111'; ctx.fillRect(230 + sx, 65 + sy, 180, 180);
      ctx.fillStyle = '#ff0'; ctx.fillRect(250 + sx, 40 + sy, 140, 30);
    }
  } else {
    // Gate Behind the Throne with Daylight Peeking Out
    ctx.fillStyle = '#1a0810'; ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#2e101d'; ctx.fillRect(120, 20, 400, 320);

    // Bright Surface Daylight Sky behind the gate
    var skyGrad = ctx.createLinearGradient(0, 55, 0, 290);
    skyGrad.addColorStop(0, '#87ceeb');
    skyGrad.addColorStop(0.55, '#fff3b0');
    skyGrad.addColorStop(1, '#ffd166');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(210, 60, 220, 230);

    // Sunbeams peeking through the bars
    ctx.fillStyle = 'rgba(255, 250, 200, 0.28)';
    ctx.beginPath();
    ctx.moveTo(220, 290); ctx.lineTo(420, 290);
    ctx.lineTo(490, 470); ctx.lineTo(150, 470);
    ctx.closePath(); ctx.fill();

    // Stone Archway Frame
    ctx.fillStyle = '#3b2052';
    ctx.fillRect(185, 35, 270, 30);
    ctx.fillRect(185, 35, 30, 260);
    ctx.fillRect(425, 35, 30, 260);

    // Sliding Iron Gate Doors (slide open during ENDING_OPEN)
    var slide = gateOpenProgress * 92;
    ctx.fillStyle = '#555';
    // Left Gate Half
    for (var lx = 222 - slide; lx <= 308 - slide; lx += 21) {
      if (lx >= 212) ctx.fillRect(lx, 65, 6, 225);
    }
    ctx.fillRect(215, 130, Math.max(0, 105 - slide), 6);
    ctx.fillRect(215, 215, Math.max(0, 105 - slide), 6);

    // Right Gate Half
    for (var rx = 326 + slide; rx <= 412 + slide; rx += 21) {
      if (rx <= 422) ctx.fillRect(rx, 65, 6, 225);
    }
    ctx.fillRect(320 + slide, 130, Math.max(0, 105 - slide), 6);
    ctx.fillRect(320 + slide, 215, Math.max(0, 105 - slide), 6);
  }

  // Dialogue Box or Final Open-Gate Banner
  if (state === 'ENDING_CUTSCENE') {
    ctx.fillStyle = '#000'; ctx.fillRect(45, 315, 550, 135);
    ctx.strokeStyle = current.shaky ? '#b388ff' : '#ffd700'; ctx.lineWidth = 4;
    ctx.strokeRect(45, 315, 550, 135);

    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 15px Courier New';
    ctx.fillText('THE KING:', 65, 344);

    ctx.fillStyle = '#fff';
    drawWrappedShakyText(current.text, 65, 372, 510, 24, current.shaky);

    ctx.fillStyle = '#aaa'; ctx.font = '13px Courier New';
    ctx.fillText('[Press Z or ENTER to continue...]', 65, 434);
  } else if (state === 'ENDING_OPEN') {
    if (gateOpenProgress >= 1) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.78)'; ctx.fillRect(110, 325, 420, 115);
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3; ctx.strokeRect(110, 325, 420, 115);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd700'; ctx.font = 'bold 22px Courier New';
      ctx.fillText('HEARTLESS (DEMO) — FINISH', 320, 368);
      ctx.fillStyle = '#fff'; ctx.font = '14px Courier New';
      ctx.fillText('The surface awaits... [Press R to Retry King]', 320, 408);
      ctx.textAlign = 'left';
    }
  }
}

// Hook cleanly into main loop
var _prevLoop = loop;
loop = function() {
  if (state === 'ENDING_CUTSCENE' || state === 'ENDING_OPEN') {
    updateEndingScene(); drawEndingScene();
    requestAnimationFrame(loop);
  } else {
    _prevLoop();
  }
};

function advanceEnding() {
  if (state === 'BOSS2_WIN') {
    endStep = 0;
    gateOpenProgress = 0;
    state = 'ENDING_CUTSCENE';
    if (typeof beep === 'function') beep(180, 0.15, 'triangle', 0.08);
  } else if (state === 'ENDING_CUTSCENE') {
    if (endStep < endLines.length - 1) {
      endStep++;
      if (typeof beep === 'function') beep(endLines[endStep].shaky ? 155 : 220, 0.1, 'triangle', 0.07);
    } else {
      state = 'ENDING_OPEN';
      if (typeof beep === 'function') beep(330, 0.35, 'sine', 0.08, 165);
    }
  }
}

window.addEventListener('keyup', function(e) {
  if (e.code === 'KeyZ' || e.code === 'Enter' || e.code === 'Space') advanceEnding();
  if (state === 'ENDING_OPEN' && e.code === 'KeyR' && typeof startBoss2 === 'function') {
    startBoss2();
  }
});

canvas.addEventListener('click', advanceEnding);
