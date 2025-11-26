// === WHEYPUCCINO THEME JS ===
// Menu mobile, carrosséis, acordeon e animações

(function(){
  // === MENU MOBILE ===
  var toggle = document.querySelector('.site-nav__toggle');
  var body = document.body;
  var mobile = document.getElementById('mobile-menu');
  if(toggle && mobile){
    toggle.addEventListener('click', function(){
      var open = body.classList.toggle('is-menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.addEventListener('click', function(e){
      if(e.target === mobile){
        body.classList.remove('is-menu-open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }
})();

// === CARROSSEL SEÇÃO 09 - AVALIAÇÕES (INFINITO) ===
(function(){
  var gallery = document.getElementById('gallery09');
  var items = gallery ? gallery.querySelectorAll('.section-09__carousel-item') : [];
  var dots = document.querySelectorAll('.s09-dot');
  var prev = document.getElementById('s09Prev');
  var next = document.getElementById('s09Next');
  if(!gallery || !items.length) return;

  var current = 0;
  var isScrolling = false;

  function setActive(index){
    items.forEach(function(i){ i.classList.remove('active'); });
    if(items[index]) items[index].classList.add('active');
    if(dots.length){
      dots.forEach(function(d){ d.classList.remove('active'); });
      if(dots[index]) dots[index].classList.add('active');
    }
  }

  function goto(index){
    // Loop infinito: volta ao início ou vai ao final
    var wrappedIndex = index;
    if(index < 0) wrappedIndex = items.length - 1;
    if(index >= items.length) wrappedIndex = 0;
    
    var el = items[wrappedIndex];
    if(el){
      isScrolling = true;
      el.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
      setTimeout(function(){ isScrolling = false; }, 800);
    }
    setActive(wrappedIndex);
    current = wrappedIndex;
  }

  setActive(current);

  if(prev) prev.addEventListener('click', function(e){
    e.preventDefault();
    goto(current - 1);
  });
  
  if(next) next.addEventListener('click', function(e){
    e.preventDefault();
    goto(current + 1);
  });
  
  if(dots.length){
    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(e){
        e.preventDefault();
        goto(i);
      });
    });
  }

  // Atualiza dot conforme scroll manual
  var ticking = false;
  gallery.addEventListener('scroll', function(){
    if(isScrolling || ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var closest = 0;
      var min = Infinity;
      items.forEach(function(it, idx){
        var rect = it.getBoundingClientRect();
        var center = rect.left + rect.width/2;
        var dist = Math.abs(center - (window.innerWidth/2));
        if(dist < min){
          min = dist;
          closest = idx;
        }
      });
      if(closest !== current){
        setActive(closest);
        current = closest;
      }
      ticking = false;
    });
  });
})();

// === ACORDEON FAQ SEÇÃO 11 ===
(function(){
  var faqItems = document.querySelectorAll('.faq-item');
  if(faqItems.length > 0){
    faqItems.forEach(function(item){
      var question = item.querySelector('.faq-item__question');
      question.addEventListener('click', function(){
        var isActive = item.classList.contains('active');
        faqItems.forEach(function(i){ i.classList.remove('active'); i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false'); });
        if(!isActive){
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
})();

// === ANIMAÇÕES FADE-IN AO SCROLL ===
(function(){
  var sections = document.querySelectorAll('section, .whey-features-container-final, .p-card, .t-card, .faq-item');
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('animate-on-scroll', 'animated');
      }
    });
  }, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});
  
  sections.forEach(function(section){
    observer.observe(section);
  });
})();

// === MODAL DE INGREDIENTES (ACESSÍVEL) ===
(function(){
  function getFocusable(container){
    return container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  }

  function trapFocus(modal, e){
    var focusables = getFocusable(modal);
    if(!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if(e.key !== 'Tab') return;
    if(e.shiftKey){
      if(document.activeElement === first){ e.preventDefault(); last.focus(); }
    } else {
      if(document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  function openModal(modal){
    if(!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    var focusables = getFocusable(modal);
    if(focusables.length) focusables[0].focus();
    modal._keydownHandler = function(e){
      if(e.key === 'Escape'){ closeModal(modal); }
      trapFocus(modal, e);
    };
    document.addEventListener('keydown', modal._keydownHandler);
  }

  function closeModal(modal){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    if(modal._keydownHandler){
      document.removeEventListener('keydown', modal._keydownHandler);
      modal._keydownHandler = null;
    }
  }

  document.addEventListener('click', function(e){
    var trigger = e.target.closest('[data-ingredients-trigger]');
    if(trigger){
      var id = trigger.getAttribute('data-ingredients-trigger');
      var modal = document.getElementById(id);
      openModal(modal);
      return;
    }

    var closer = e.target.closest('[data-ingredients-close]');
    if(closer){
      var closeId = closer.getAttribute('data-ingredients-close');
      var modalToClose = document.getElementById(closeId);
      closeModal(modalToClose);
    }
  });
})();
