var throneWalker = { x: 308, y: 420, speed: 2.5 }, throneFrame = 0, killedBoss = false, dialogStep = 0;
var kingSceneImg = new Image(); kingSceneImg.src = './boss2scene.png';

function drawGoldBucket(bx, by) {
  ctx.fillStyle = '#5c3a21'; ctx.fillRect(bx, by + 10, 26, 22);
  ctx.fillStyle = '#333'; ctx.fillRect(bx - 1, by + 13, 28, 3); ctx.fillRect(bx - 1, by + 24, 28, 3);
  ctx.fillStyle = '#ffd700'; ctx.fillRect(bx + 2, by + 3, 22, 8);
  ctx.fillStyle = '#fff59d'; ctx.fillRect(bx + 6, by + 5, 6, 4); ctx.fillRect(bx + 15, by + 4, 5, 4);
}

function updateThroneScene() {
  if (state === 'THRONE_WALK') {
    var moving = false;
    if (keys['ArrowLeft'] && throneWalker.x > 250) { throneWalker.x -= throneWalker.speed; moving = true; }
    if (keys['ArrowRight'] && throneWalker.x < 366) { throneWalker.x += throneWalker.speed; moving = true; }
    if (keys['ArrowUp'] && throneWalker.y > 185) { throneWalker.y -= throneWalker.speed; moving = true; }
    if (keys['ArrowDown'] && throneWalker.y < 435) { throneWalker.y += throneWalker.speed; moving = true; }
    if (moving) throneFrame++;
    if (throneWalker.y <= 192) { state = 'KING_DIALOGUE'; dialogStep = 0; }
  }
}

function drawThroneScene() {
  ctx.fillStyle = '#14050a'; ctx.fillRect(0, 0, 640, 480);
  ctx.fillStyle = '#2b0b16'; ctx.fillRect(110, 40, 420, 440);

  for (var py = 120; py <= 380; py += 130) {
    ctx.fillStyle = '#b8860b'; ctx.fillRect(115, py, 24, 55); ctx.fillRect(501, py, 24, 55);
    ctx.fillStyle = '#ffd700'; ctx.fillRect(112, py, 30, 8); ctx.fillRect(498, py, 30, 8);
  }

  ctx.fillStyle = '#ffd700'; ctx.fillRect(242, 130, 156, 350);
  ctx.fillStyle = '#9e0b28'; ctx.fillRect(248, 130, 144, 350);

  var buckets = [
    { x: 155, y: 150 }, { x: 190, y: 175 }, { x: 160, y: 230 },
    { x: 195, y: 270 }, { x: 155, y: 330 }, { x: 185, y: 390 },
    { x: 455, y: 150 }, { x: 420, y: 180 }, { x: 460, y: 235 },
    { x: 425, y: 280 }, { x: 455, y: 340 }, { x: 420, y: 395 }
  ];
  buckets.forEach(function(b) { drawGoldBucket(b.x, b.y); });

  // Royal Throne Backdrop
  ctx.fillStyle = '#8b6508'; ctx.fillRect(275, 35, 90, 100);
  ctx.fillStyle = '#ffd700'; ctx.fillRect(282, 42, 76, 85);

  // Custom King Cutscene Sprite (boss2scene.png)
  if (kingSceneImg.complete && kingSceneImg.naturalWidth) {
    ctx.drawImage(kingSceneImg, 276, 48, 88, 96);
  } else {
    ctx.fillStyle = '#70081c'; ctx.fillRect(292, 85, 56, 48);
    ctx.fillStyle = '#ddd'; ctx.fillRect(302, 72, 36, 24);
    ctx.fillStyle = '#ff0'; ctx.fillRect(302, 58, 36, 14);
  }

  // Walking Protagonist
  var bob = Math.sin(throneFrame * 0.3) * 2;
  ctx.fillStyle = '#4a2e1b'; ctx.fillRect(throneWalker.x + 4, throneWalker.y + bob, 16, 12);
  ctx.fillStyle = '#f5c242'; ctx.fillRect(throneWalker.x + 6, throneWalker.y + 4 + bob, 12, 8);
  ctx.fillStyle = '#3b5dc9'; ctx.fillRect(throneWalker.x + 4, throneWalker.y + 12 + bob, 16, 12);
  ctx.fillStyle = '#a83279'; ctx.fillRect(throneWalker.x + 4, throneWalker.y + 16 + bob, 16, 4);
  ctx.fillStyle = '#2b1b17'; ctx.fillRect(throneWalker.x + 6, throneWalker.y + 24, 5, 8); ctx.fillRect(throneWalker.x + 13, throneWalker.y + 24, 5, 8);

  if (state === 'KING_DIALOGUE') {
    var lines = [
      killedBoss ? '* "So... You\'ve arrived."' : '* "My guard spared you... Intriguing."',
      '* "It doesn\'t matter, he was weak."',
      '* "Do you know who you\'re talking to?"',
      '* "I rule this kingdom, whether you like it or not."',
      '* "Anyway, you must DIE."'
    ];
    var isFinalLine = dialogStep >= lines.length - 1;

    ctx.fillStyle = '#000'; ctx.fillRect(45, 320, 550, 125);
    ctx.strokeStyle = isFinalLine ? '#f33' : '#ffd700'; ctx.lineWidth = 4;
    ctx.strokeRect(45, 320, 550, 125);

    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 16px Courier New'; ctx.fillText('THE KING:', 65, 352);
    ctx.fillStyle = isFinalLine ? '#ff5555' : '#fff'; ctx.font = '16px Courier New';
    ctx.fillText(lines[dialogStep], 65, 385);

    ctx.fillStyle = '#aaa'; ctx.font = '13px Courier New';
    ctx.fillText(isFinalLine ? '[BOSS 2 COMING SOON - Press R to Replay]' : '[Press Z or ENTER to continue...]', 65, 425);
  } else {
    ctx.fillStyle = '#ffd700'; ctx.font = '15px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('Walk down the red carpet to the King...', 320, 465); ctx.textAlign = 'left';
  }
}

// Royal Hallway Chiptune Theme
var royalStep = 0;
var royalBass = [146.8, 146.8, 220, 146.8, 130.8, 130.8, 196, 220];
var royalLead = [587.3, 659.3, 698.5, 880, 784, 698.5, 659.3, 587.3];
setInterval(function() {
  if ((state === 'THRONE_WALK' || state === 'KING_DIALOGUE') && typeof beep === 'function') {
    beep(royalBass[royalStep % 8], 0.28, 'triangle', 0.05);
    beep(royalLead[royalStep % 8], 0.24, 'sine', 0.04);
    royalStep++;
  }
}, 320);

var _origLoop = loop;
loop = function() {
  if (state === 'THRONE_WALK' || state === 'KING_DIALOGUE') {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 640, 480);
    updateThroneScene(); drawThroneScene();
    requestAnimationFrame(loop);
  } else {
    _origLoop();
  }
};

function handleThroneAdvance() {
  if (state === 'KILL_WIN' || state === 'SPARE_WIN') {
    killedBoss = (state === 'KILL_WIN');
    throneWalker = { x: 308, y: 420, speed: 2.5 };
    dialogStep = 0;
    state = 'THRONE_WALK';
  } else if (state === 'KING_DIALOGUE' && dialogStep < 4) {
    dialogStep++;
    if (typeof beep === 'function') beep(dialogStep === 4 ? 140 : 210, 0.12, 'sawtooth', 0.08);
  }
}

window.addEventListener('keyup', function(e) {
  if (e.code === 'KeyZ' || e.code === 'Enter' || e.code === 'Space') handleThroneAdvance();
  if (state === 'KING_DIALOGUE' && e.code === 'KeyR') {
    walker = { x: 308, y: 405, speed: 2.6 }; player.hp = 20; player.invuln = 0;
    enemy = { hp: 100, mercy: 0, reasoned: 0, lowered: false }; bullets = []; telegraphs = [];
    selectedOption = 0; dialogStep = 0; battleText = "* THE DOGBOY blocks the gate!"; state = 'OVERWORLD';
  }
});

canvas.addEventListener('click', handleThroneAdvance);

loop();
