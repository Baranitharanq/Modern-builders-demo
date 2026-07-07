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
