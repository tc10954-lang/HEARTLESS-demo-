// --- EDIT YOUR UPDATES & NEWS HERE ---
const NEWS_ITEMS = [
  "FULL GAME COMING SOON!",
  "v1: Added THE KING and ending cutscene"
];

// Automatically hooks into drawOverworld() to show the banner on the Title Screen
const _origDrawOverworld = drawOverworld;
drawOverworld = function() {
  _origDrawOverworld();

  if (state === 'TITLE') {
    // Black box with crisp white Undertale border at the bottom of the Title Screen
    ctx.fillStyle = '#000';
    ctx.fillRect(60, 385, 520, 78);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 385, 520, 78);

    // Header
    ctx.fillStyle = '#ff0';
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('* UPDATES & NEWS', 76, 406);

    // News lines
    ctx.fillStyle = '#fff';
    ctx.font = '13px Courier New';
    NEWS_ITEMS.slice(0, 2).forEach((line, i) => {
      ctx.fillText('> ' + line, 76, 428 + i * 20);
    });
  }
};
