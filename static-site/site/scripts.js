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

// Convert service .card articles into collapsible summaries (title + first bullets visible)
(function(){
  // target cards inside panels (services page)
  const cards = document.querySelectorAll('section.panel .container .card');
  if(!cards || !cards.length) return;
  cards.forEach(card => {
    // skip cards that are already using <details>
    if(card.tagName && card.tagName.toLowerCase() === 'details') return;
    const h3 = card.querySelector('h3');
    if(!h3) return;

    // Find the first ul inside the card (first set of bullets)
    const firstUl = card.querySelector('ul');

    // Create summary container and move title + firstUl into it
    const summary = document.createElement('div');
    summary.className = 'summary';

    // Move or clone the h3 into the summary (use clone to preserve semantics)
    const titleClone = h3.cloneNode(true);
    summary.appendChild(titleClone);

    if(firstUl){
      // Move the first ul into summary
      summary.appendChild(firstUl.cloneNode(true));
    }

    // Create collapsible body and move all original children except the moved title/firstUl into it
    const body = document.createElement('div');
    body.className = 'collapsible-body';

    // We will move nodes from the original card into the body for anything after the firstUl (or after h3 if no ul)
    let moved = false;
    const children = Array.from(card.childNodes);
    for(const node of children){
      // Skip nodes that are the original h3 or the original firstUl (we'll remove originals later)
      if(node.nodeType === Node.ELEMENT_NODE && node.matches('h3')){ moved = true; continue; }
      if(node.nodeType === Node.ELEMENT_NODE && firstUl && node.isSameNode(firstUl)){ moved = true; continue; }
      // If we've passed the summary split point, move nodes into body
      if(moved){
        body.appendChild(node.cloneNode(true));
        card.removeChild(node);
      }
    }

    // Remove original h3 and original firstUl from card (they were cloned/moved into summary)
    const origH3 = card.querySelector('h3'); if(origH3) card.removeChild(origH3);
    const origFirstUl = card.querySelector('ul'); if(origFirstUl) card.removeChild(origFirstUl);

    // Insert summary at the top of the card, then the body
    card.insertBefore(summary, card.firstChild);
    card.appendChild(body);

    // Make summary toggle open/close
    summary.addEventListener('click', () => {
      card.classList.toggle('open');
      // Smoothly scroll expanded card into view
      if(card.classList.contains('open')){
        card.scrollIntoView({behavior:'smooth', block:'nearest'});
      }
    });
  });
})();
