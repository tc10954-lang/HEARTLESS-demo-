let throneWalker = { x: 308, y: 420, speed: 2.5 }, throneFrame = 0, killedBoss = false;

function drawGoldBucket(bx, by) {
  ctx.fillStyle = '#5c3a21'; ctx.fillRect(bx, by + 10, 26, 22);
  ctx.fillStyle = '#333'; ctx.fillRect(bx - 1, by + 13, 28, 3); ctx.fillRect(bx - 1, by + 24, 28, 3);
  ctx.fillStyle = '#ffd700'; ctx.fillRect(bx + 2, by + 3, 22, 8);
  ctx.fillStyle = '#fff59d'; ctx.fillRect(bx + 6, by + 5, 6, 4); ctx.fillRect(bx + 15, by + 4, 5, 4);
}

function updateThroneScene() {
  if (state === 'THRONE_WALK') {
    let moving = false;
    if (keys['ArrowLeft'] && throneWalker.x > 250) { throneWalker.x -= throneWalker.speed; moving = true; }
    if (keys['ArrowRight'] && throneWalker.x < 366) { throneWalker.x += throneWalker.speed; moving = true; }
    if (keys['ArrowUp'] && throneWalker.y > 185) { throneWalker.y -= throneWalker.speed; moving = true; }
    if (keys['ArrowDown'] && throneWalker.y < 435) { throneWalker.y += throneWalker.speed; moving = true; }
    if (moving) throneFrame++;
    if (throneWalker.y <= 192) state = 'KING_DIALOGUE';
  }
}

function drawThroneScene() {
  ctx.fillStyle = '#14050a'; ctx.fillRect(0, 0, 640, 480);
  ctx.fillStyle = '#2b0b16'; ctx.fillRect(110, 40, 420, 440);

  for (let py = 120; py <= 380; py += 130) {
    ctx.fillStyle = '#b8860b'; ctx.fillRect(115, py, 24, 55); ctx.fillRect(501, py, 24, 55);
    ctx.fillStyle = '#ffd700'; ctx.fillRect(112, py, 30, 8); ctx.fillRect(498, py, 30, 8);
  }

  ctx.fillStyle = '#ffd700'; ctx.fillRect(242, 130, 156, 350);
  ctx.fillStyle = '#9e0b28'; ctx.fillRect(248, 130, 144, 350);

  const buckets = [
    { x: 155, y: 150 }, { x: 190, y: 175 }, { x: 160, y: 230 },
    { x: 195, y: 270 }, { x: 155, y: 330 }, { x: 185, y: 390 },
    { x: 455, y: 150 }, { x: 420, y: 180 }, { x: 460, y: 235 },
    { x: 425, y: 280 }, { x: 455, y: 340 }, { x: 420, y: 395 }
  ];
  buckets.forEach(b => drawGoldBucket(b.x, b.y));

  ctx.fillStyle = '#8b6508'; ctx.fillRect(275, 45, 90, 95);
  ctx.fillStyle = '#ffd700'; ctx.fillRect(282, 52, 76, 80);
  ctx.fillStyle = '#70081c'; ctx.fillRect(292, 85, 56, 48);
  ctx.fillStyle = '#ddd'; ctx.fillRect(302, 72, 36, 24);
  ctx.fillStyle = '#ff0'; ctx.fillRect(302, 58, 36, 14);
  ctx.fillStyle = '#f00'; ctx.fillRect(317, 62, 6, 6);

  let bob = Math.sin(throneFrame * 0.3) * 2;
  ctx.fillStyle = '#4a2e1b'; ctx.fillRect(throneWalker.x + 4, throneWalker.y + bob, 16, 12);
  ctx.fillStyle = '#f5c242'; ctx.fillRect(throneWalker.x + 6, throneWalker.y + 4 + bob, 12, 8);
  ctx.fillStyle = '#3b5dc9'; ctx.fillRect(throneWalker.x + 4, throneWalker.y + 12 + bob, 16, 12);
  ctx.fillStyle = '#a83279'; ctx.fillRect(throneWalker.x + 4, throneWalker.y + 16 + bob, 16, 4);
  ctx.fillStyle = '#2b1b17'; ctx.fillRect(throneWalker.x + 6, throneWalker.y + 24, 5, 8); ctx.fillRect(throneWalker.x + 13, throneWalker.y + 24, 5, 8);

  if (state === 'KING_DIALOGUE') {
    ctx.fillStyle = '#000'; ctx.fillRect(80, 320, 480, 125);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 4; ctx.strokeRect(80, 320, 480, 125);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 16px Courier New'; ctx.fillText('THE KING:', 105, 352);
    ctx.fillStyle = '#fff'; ctx.font = '19px Courier New';
    let line = killedBoss ? '* "So... You\'ve arrived."' : '* "My guard spared you... Intriguing."';
    ctx.fillText(line, 105, 385);
    ctx.fillStyle = '#aaa'; ctx.font = '13px Courier New'; ctx.fillText('[BOSS 2 COMING SOON - Press R to Replay]', 105, 425);
  } else {
    ctx.fillStyle = '#ffd700'; ctx.font = '15px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('Walk down the red carpet to the King...', 320, 465); ctx.textAlign = 'left';
  }
}

const _origLoop = loop;
loop = function() {
  if (state === 'THRONE_WALK' || state === 'KING_DIALOGUE') {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 640, 480);
    updateThroneScene(); drawThroneScene();
    requestAnimationFrame(loop);
  } else {
    _origLoop();
  }
};

window.addEventListener('keydown', (e) => {
  if (state === 'KING_DIALOGUE' && e.code === 'KeyR') {
    walker = { x: 308, y: 405, speed: 2.6 }; player.hp = 20; player.invuln = 0;
    enemy = { hp: 100, mercy: 0, reasoned: 0, lowered: false }; bullets = []; telegraphs = [];
    selectedOption = 0; battleText = "* THE DOGBOY blocks the gate!"; state = 'OVERWORLD';
  }
});

loop();
