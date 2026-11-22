const style = document.createElement('style');
style.textContent = `
  body { flex-direction: column; touch-action: none; user-select: none; -webkit-user-select: none; }
  canvas { max-width: 96vw; max-height: 58vh; height: auto; }
  #pad { display: flex; justify-content: space-between; align-items: center; width: 92vw; max-width: 600px; margin-top: 14px; }
  .dpad { display: grid; grid-template-columns: repeat(3, 54px); grid-template-rows: repeat(3, 54px); gap: 4px; }
  .tbtn { background: #181818; color: #fff; border: 2px solid #666; border-radius: 8px; font: bold 18px Courier New; display: flex; justify-content: center; align-items: center; cursor: pointer; }
  .tbtn:active { background: #ff0; color: #000; border-color: #ff0; }
  .acts { display: flex; gap: 12px; align-items: center; }
  .zbtn { width: 66px; height: 66px; border-radius: 50%; border-color: #f80; color: #ff0; }
  .xbtn { width: 56px; height: 56px; border-radius: 50%; border-color: #888; color: #ccc; }
  .rbtn { width: 46px; height: 46px; border-radius: 8px; font-size: 13px; color: #aaa; }
`;
document.head.appendChild(style);

const pad = document.createElement('div');
pad.id = 'pad';
pad.innerHTML = `
  <div class="dpad">
    <div></div><div class="tbtn" data-k="ArrowUp">▲</div><div></div>
    <div class="tbtn" data-k="ArrowLeft">◄</div><div></div><div class="tbtn" data-k="ArrowRight">►</div>
    <div></div><div class="tbtn" data-k="ArrowDown">▼</div><div></div>
  </div>
  <div class="acts">
    <div class="tbtn rbtn" data-k="KeyR">RST</div>
    <div class="tbtn xbtn" data-k="KeyX">X</div>
    <div class="tbtn zbtn" data-k="KeyZ">Z</div>
  </div>
`;
document.body.appendChild(pad);

pad.querySelectorAll('.tbtn').forEach(btn => {
  const code = btn.dataset.k;
  const press = (e) => {
    e.preventDefault();
    if (typeof keys !== 'undefined') keys[code] = true;
    window.dispatchEvent(new KeyboardEvent('keydown', { code }));
  };
  const release = (e) => {
    e.preventDefault();
    if (typeof keys !== 'undefined') keys[code] = false;
    window.dispatchEvent(new KeyboardEvent('keyup', { code }));
  };
  btn.addEventListener('touchstart', press, { passive: false });
  btn.addEventListener('touchend', release, { passive: false });
  btn.addEventListener('touchcancel', release, { passive: false });
  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
});
