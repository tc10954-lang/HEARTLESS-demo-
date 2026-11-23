var devUnlocked = false;

var devStyle = document.createElement('style');
devStyle.textContent = `
  #dev-btn { position: fixed; top: 10px; left: 10px; z-index: 99; background: #111; color: #0ff; border: 2px solid #088; border-radius: 6px; padding: 6px 10px; font: bold 13px Courier New; cursor: pointer; }
  #dev-panel { display: none; position: fixed; top: 46px; left: 10px; z-index: 99; background: #000; border: 2px solid #0ff; border-radius: 6px; padding: 8px; flex-direction: column; gap: 6px; }
  #dev-panel.open { display: flex; }
  .warp-opt { background: #181818; color: #fff; border: 1px solid #0ff; border-radius: 4px; padding: 6px 10px; font: bold 13px Courier New; cursor: pointer; text-align: left; }
  .warp-opt:hover { background: #0ff; color: #000; }
`;
document.head.appendChild(devStyle);

var devBtn = document.createElement('button');
devBtn.id = 'dev-btn';
devBtn.textContent = '🔒 WARP';
document.body.appendChild(devBtn);

var devPanel = document.createElement('div');
devPanel.id = 'dev-panel';
devPanel.innerHTML = `
  <button class="warp-opt" data-dest="BOSS1">▶ Boss 1 (THE DOGBOY)</button>
  <button class="warp-opt" data-dest="THRONE">▶ Throne Cutscene</button>
  <button class="warp-opt" data-dest="BOSS2">▶ Boss 2 (THE KING)</button>
`;
document.body.appendChild(devPanel);

devBtn.addEventListener('click', function() {
  devBtn.blur();
  if (!devUnlocked) {
    var pw = prompt('Enter Developer Password:');
    if (pw === 'Tristan') {
      devUnlocked = true;
      devBtn.textContent = '⚡ WARP';
      devPanel.classList.add('open');
    } else if (pw !== null) {
      alert('Wrong password!');
    }
  } else {
    devPanel.classList.toggle('open');
  }
});

devPanel.querySelectorAll('.warp-opt').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var dest = btn.dataset.dest;
    devPanel.classList.remove('open');
    btn.blur();

    if (dest === 'BOSS1') {
      player.hp = 20; player.invuln = 0;
      enemy = { hp: 100, mercy: 0, reasoned: 0, lowered: false };
      bullets = []; telegraphs = []; selectedOption = 0;
      battleText = "* THE DOGBOY blocks the gate!";
      state = 'MENU';
    } else if (dest === 'THRONE') {
      killedBoss = false;
      throneWalker = { x: 308, y: 420, speed: 2.5 };
      dialogStep = 0;
      state = 'THRONE_WALK';
    } else if (dest === 'BOSS2' && typeof startBoss2 === 'function') {
      startBoss2();
    }
  });
});
