const style = document.createElement('style');
style.textContent = `
  body { flex-direction: column; touch-action: none; user-select: none; -webkit-user-select: none; }
  canvas { max-width: 96vw; max-height: 88vh; height: auto; transition: max-height 0.15s; }
  body.pad-open canvas { max-height: 56vh; }
  #pad-toggle { position: fixed; top: 10px; right: 10px; z-index: 99; background: #111; color: #ff0; border: 2px solid #f80; border-radius: 6px; padding: 6px 10px; font: bold 13px Courier New; cursor: pointer; }
  #pad { display: none; justify-content: space-between; align-items: center; width: 92vw; max-width: 600px; margin-top: 12px; }
  body.pad-open #pad { display: flex; }
  .dpad { display: grid; grid-template-columns: repeat(3, 52px); grid-template-rows: repeat(3, 52px); gap: 4px; }
  .tbtn { background: #181818; color: #fff; border: 2px solid #666; border-radius: 8px; font: bold 18px Courier New; display: flex; justify-content: center; align-items: center; cursor: pointer; }
  .tbtn:active { background: #ff0; color: #000; border-color: #ff0; }
  .acts { display: flex; gap: 10px; align-items: center; }
  .zbtn { width: 64px; height: 64px; border-radius: 50%; border-color: #f80; color: #ff0; }
  .xbtn { width: 54px; height: 54px; border-radius: 50%; border-color: #888; color: #ccc; }
  .rbtn { width: 44px; height: 44px; border-radius: 8px; font-size: 13px; color: #aaa; }
`;
document.head.appendChild(style);

const toggleBtn = document.createElement('button');
toggleBtn.id = 'pad-toggle';
toggleBtn.textContent = '🎮 PAD: OFF';
document.body.appendChild(toggleBtn);

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

toggleBtn.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('pad-open');
  toggleBtn.textContent = isOpen ? '🎮 PAD: ON' : '🎮 PAD: OFF';
  toggleBtn.blur(); // Keeps keyboard Enter/Space from re-toggling the button
});

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
