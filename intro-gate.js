var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var enemyImg = new Image(); enemyImg.src = './boss1.png';
var heartImg = new Image(); heartImg.src = './heart.png';

var state = 'TITLE', encounterTimer = 0, walkFrame = 0;
var walker = { x: 308, y: 405, speed: 2.6 };
var keys = {};

function updateOverworld() {
  if (state === 'OVERWORLD') {
    var moving = false;
    if (keys['ArrowLeft'] && walker.x > 216) { walker.x -= walker.speed; moving = true; }
    if (keys['ArrowRight'] && walker.x < 400) { walker.x += walker.speed; moving = true; }
    if (keys['ArrowUp'] && walker.y > 152) { walker.y -= walker.speed; moving = true; }
    if (keys['ArrowDown'] && walker.y < 435) { walker.y += walker.speed; moving = true; }
    if (moving) walkFrame++;
    if (walker.y <= 165) { state = 'ENCOUNTER'; encounterTimer = 90; }
  } else if (state === 'ENCOUNTER') {
    if (--encounterTimer <= 0) state = 'DIALOGUE';
  }
}

function drawOverworld() {
  if (state === 'TITLE') {
    ctx.fillStyle = '#fff'; ctx.font = 'bold 36px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('HEARTLESS', 320, 150);
    ctx.fillStyle = '#888'; ctx.font = '18px Courier New'; ctx.fillText('(demo)', 320, 180);
    ctx.fillStyle = '#ff0'; ctx.fillText('Press Z or ENTER to Start', 320, 265);
    ctx.fillStyle = '#aaa'; ctx.font = '14px Courier New';
    ctx.fillText('Arrow Keys: Walk / Dodge | Z / Enter: Confirm', 320, 315);
    ctx.textAlign = 'left'; return;
  }

  ctx.fillStyle = '#0d0614'; ctx.fillRect(0, 0, 640, 480);
  ctx.fillStyle = '#2a163b'; ctx.fillRect(185, 70, 25, 410); ctx.fillRect(430, 70, 25, 410);
  ctx.fillStyle = '#43245c';
  for (var py = 170; py <= 390; py += 110) { ctx.fillRect(182, py, 30, 45); ctx.fillRect(428, py, 30, 45); }

  for (var y = 145; y < 480; y += 32) {
    for (var x = 210; x < 430; x += 32) {
      ctx.fillStyle = ((x + y) / 32) % 2 === 0 ? '#1b0e26' : '#221230';
      ctx.fillRect(x, y, 32, 32);
    }
  }

  ctx.fillStyle = '#3b2052'; ctx.fillRect(185, 35, 270, 115);
  ctx.fillStyle = '#050208'; ctx.fillRect(240, 60, 160, 90);
  ctx.fillStyle = '#888';
  for (var bx = 252; bx <= 388; bx += 22) ctx.fillRect(bx, 60, 6, 90);
  ctx.fillRect(240, 90, 160, 6); ctx.fillRect(240, 120, 160, 6);

  if (state === 'ENCOUNTER' || state === 'DIALOGUE') {
    var p = state === 'DIALOGUE' ? 1 : 1 - (encounterTimer / 90);
    var riseY = 125 - p * 65;
    if (enemyImg.complete && enemyImg.naturalWidth) ctx.drawImage(enemyImg, 268, riseY, 104, 104);
    else { ctx.fillStyle = '#fff'; ctx.fillRect(280, riseY + 10, 80, 80); }
  }

  var bob = Math.sin(walkFrame * 0.3) * 2;
  ctx.fillStyle = '#4a2e1b'; ctx.fillRect(walker.x + 4, walker.y + bob, 16, 12);
  ctx.fillStyle = '#f5c242'; ctx.fillRect(walker.x + 6, walker.y + 4 + bob, 12, 8);
  ctx.fillStyle = '#3b5dc9'; ctx.fillRect(walker.x + 4, walker.y + 12 + bob, 16, 12);
  ctx.fillStyle = '#a83279'; ctx.fillRect(walker.x + 4, walker.y + 16 + bob, 16, 4);
  ctx.fillStyle = '#2b1b17'; ctx.fillRect(walker.x + 6, walker.y + 24, 5, 8); ctx.fillRect(walker.x + 13, walker.y + 24, 5, 8);

  if (state === 'ENCOUNTER') {
    ctx.fillStyle = '#fff'; ctx.fillRect(walker.x + 2, walker.y - 28, 20, 20);
    ctx.fillStyle = '#f00'; ctx.font = 'bold 16px Courier New'; ctx.fillText('!', walker.x + 7, walker.y - 13);
  } else if (state === 'DIALOGUE') {
    ctx.fillStyle = '#000'; ctx.fillRect(80, 320, 480, 120);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.strokeRect(80, 320, 480, 120);
    ctx.fillStyle = '#fff'; ctx.font = '18px Courier New'; ctx.fillText('* None shall pass this gate!', 105, 365);
    ctx.fillStyle = '#ff0'; ctx.font = '14px Courier New'; ctx.fillText('[Press Z or ENTER to Fight]', 105, 415);
  } else {
    ctx.fillStyle = '#aaa'; ctx.font = '15px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('Use Arrow Keys to walk up to the gate...', 320, 465); ctx.textAlign = 'left';
  }
}
