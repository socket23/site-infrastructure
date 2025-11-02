(function(){
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
  if(btn && menu){
    btn.addEventListener('click', () => {
      const open = menu.getAttribute('data-state') === 'open';
      menu.setAttribute('data-state', open ? 'closed' : 'open');
      btn.setAttribute('aria-expanded', (!open).toString());
    });
  }

  // Show success message if redirected from form submission
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('success') === 'true'){
    const successMsg = document.getElementById('successMessage');
    const form = document.getElementById('contactForm');
    if(successMsg){
      successMsg.style.display = 'block';
      if(form) form.style.display = 'none';
      // Scroll to success message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
})();
