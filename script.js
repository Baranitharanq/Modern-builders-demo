(function(){
  const svg = document.getElementById('wordSvg');
  const field = document.getElementById('brickField');
  const stage = document.getElementById('loaderStage');
  const loaderScreen = document.getElementById('loaderScreen');

  const VB_W = 640, VB_H = 190;
  const BRICK_W = 15, BRICK_H = 9, GAP = 2;

  function buildBricks(){
    field.innerHTML = '';
    // clear old dust puffs
    stage.querySelectorAll('.dust-puff').forEach(el => el.remove());

    const cols = Math.ceil(VB_W / (BRICK_W + GAP));
    const rows = Math.ceil(VB_H / (BRICK_H + GAP));
    const centerX = VB_W / 2, centerY = VB_H / 2;

    for(let r = 0; r < rows; r++){
      for(let c = 0; c < cols; c++){
        const x = c * (BRICK_W + GAP);
        const y = r * (BRICK_H + GAP);

        const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', BRICK_W);
        rect.setAttribute('height', BRICK_H);
        rect.setAttribute('rx', 2);
        rect.classList.add('flybrick');

        // random inbound direction: pick an edge to fly in from (top/bottom/left/right),
        // biased outward from center, like debris being summoned inward — Thor-hammer style
        const angle = Math.random() * Math.PI * 2;
        const dist = 400 + Math.random() * 500;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const rot = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540);

        // delay: wave outward from center so it reads as a converging swarm
        const dCenter = Math.hypot(x - centerX, y - centerY);
        const maxDist = Math.hypot(centerX, centerY);
        const wave = (dCenter / maxDist) * 0.35;
        const jitter = Math.random() * 0.25;
        const delay = (wave + jitter).toFixed(3);
        const dur = (0.55 + Math.random() * 0.35).toFixed(3);

        rect.style.setProperty('--dx', dx.toFixed(1) + 'px');
        rect.style.setProperty('--dy', dy.toFixed(1) + 'px');
        rect.style.setProperty('--rot', rot.toFixed(1) + 'deg');
        rect.style.setProperty('--delay', delay + 's');
        rect.style.setProperty('--dur', dur + 's');

        field.appendChild(rect);
      }
    }
  }

  function scatterDust(){
    // a handful of dust puffs along the lower edge of the word, timed to the impact
    const rectBox = svg.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    const scaleX = rectBox.width / VB_W;
    const spots = 14;
    for(let i = 0; i < spots; i++){
      const puff = document.createElement('div');
      puff.className = 'dust-puff';
      const left = (rectBox.left - stageBox.left) + (40 + Math.random() * (VB_W - 80)) * scaleX;
      const top = (rectBox.top - stageBox.top) + rectBox.height * (0.55 + Math.random() * 0.35);
      puff.style.left = left + 'px';
      puff.style.top = top + 'px';
      puff.style.animationDelay = (0.55 + Math.random() * 0.2) + 's';
      stage.appendChild(puff);
    }
  }

  function playSequence(){
    stage.classList.remove('assembling','impact','shine','reveal-tag');
    buildBricks();
    scatterDust();

    // force reflow so the browser registers the "scattered" start state
    // before we flip to the assembled end state
    void field.getBoundingClientRect();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        stage.classList.add('assembling');
      });
    });

    // impact flash once the swarm has landed (~ max delay + max duration)
    setTimeout(() => stage.classList.add('impact'), 950);
    // shine sweep right after impact
    setTimeout(() => stage.classList.add('shine'), 1150);
    // subtitle fades in
    setTimeout(() => stage.classList.add('reveal-tag'), 1550);
    // hide loader, reveal the site
    setTimeout(() => loaderScreen.classList.add('hide'), 3000);
  }

  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      loaderScreen.classList.remove('hide');
      playSequence();
    });
  }

  window.addEventListener('load', playSequence);
})();

// Mobile nav toggle
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const shown = getComputedStyle(links).display !== 'none';
    links.style.display = shown ? 'none' : 'flex';
  });
})();
