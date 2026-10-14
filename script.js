document.documentElement.classList.add('js-enabled');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
menuButton.hidden = false;
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('is-open', expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const links = [...navigation.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}

// Native dialog keeps keyboard focus inside the enlarged image; links work without JS.
const imageDialog = document.querySelector('.image-dialog');
if (imageDialog && typeof imageDialog.showModal === 'function') {
  const dialogImage = imageDialog.querySelector('.dialog-image');
  const dialogCaption = imageDialog.querySelector('#image-caption');
  let galleryTrigger = null;
  document.querySelectorAll('.gallery-link').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      galleryTrigger = link;
      dialogImage.src = link.href;
      dialogImage.alt = link.querySelector('img').alt;
      dialogCaption.textContent = link.dataset.caption || dialogImage.alt;
      imageDialog.showModal();
      document.body.classList.add('gallery-open');
    });
  });
  imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', event => {
    const bounds = imageDialog.getBoundingClientRect();
    if (event.target === imageDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) imageDialog.close();
  });
  imageDialog.addEventListener('close', () => {
    document.body.classList.remove('gallery-open');
    if (galleryTrigger) galleryTrigger.focus();
  });
}
