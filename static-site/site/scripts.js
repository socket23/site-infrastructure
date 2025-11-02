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
  // Validate URL parameter to prevent XSS
  const urlParams = new URLSearchParams(window.location.search);
  const successParam = urlParams.get('success');
  if(successParam === 'true'){
    const successMsg = document.getElementById('successMessage');
    const form = document.getElementById('contactForm');
    if(successMsg){
      successMsg.style.display = 'block';
      if(form) form.style.display = 'none';
      // Scroll to success message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Clean URL without reloading page
      if(window.history && window.history.replaceState){
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }
})();
