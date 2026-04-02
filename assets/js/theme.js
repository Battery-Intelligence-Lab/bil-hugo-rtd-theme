/**
 * bil-hugo-rtd-theme — vanilla JS (no jQuery)
 * Ported from the Jekyll RTD theme's jQuery-based theme.js
 */

document.addEventListener('DOMContentLoaded', function() {
  initToctreeToggles();
  initScrollSpy();
  initSidebarToggle();
  initScrollRestore();
  initHeadingAnchors();
  if (window.themeConfig && window.themeConfig.codeCopy !== false) {
    initCodeCopyButtons();
  }
  initTabs();
  initLightbox();
  highlightCurrentNav(location.pathname);
  highlightCurrentNav(location.hash);
});

/* --- Toctree expand/collapse --- */

function initToctreeToggles() {
  document.querySelectorAll('.toctree .toc > ul').forEach(function(ul) {
    var link = ul.previousElementSibling;
    if (!link || link.tagName !== 'A') return;

    var expand = document.createElement('span');
    expand.className = 'tree-toggle';
    expand.setAttribute('role', 'button');
    expand.setAttribute('aria-label', 'Toggle section');
    expand.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleCurrent(link);
    });
    link.prepend(expand);
  });
}

function toggleCurrent(link) {
  var li = link.closest('li');
  if (!li) return;

  // Close siblings
  li.parentElement.querySelectorAll(':scope > li.current').forEach(function(sibling) {
    if (sibling !== li) {
      sibling.classList.remove('current');
      sibling.querySelectorAll('li.current').forEach(function(child) {
        child.classList.remove('current');
      });
    }
  });

  // Toggle this node
  li.classList.toggle('current');
}

/* --- Highlight current nav item --- */

function highlightCurrentNav(name) {
  if (!name) return;
  var link = document.querySelector('.toctree a[href="' + CSS.escape(decodeURI(name)) + '"]');
  if (!link) return;

  // Remove existing highlights
  document.querySelectorAll('.toctree .current').forEach(function(el) {
    el.classList.remove('current');
  });

  // Add current to the link and all parent levels
  link.classList.add('current');
  var parent = link.closest('.toc');
  while (parent) {
    parent.classList.add('current');
    parent = parent.parentElement ? parent.parentElement.closest('.toc') : null;
  }
}

/* --- Scroll spy: highlight heading in sidebar as you scroll --- */

function initScrollSpy() {
  var ticking = false;
  document.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateScrollSpy();
        ticking = false;
      });
      ticking = true;
    }
  });
}

function updateScrollSpy() {
  var scrollTop = window.scrollY + 10;
  var headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6');
  var current = null;

  headings.forEach(function(heading) {
    if (heading.getBoundingClientRect().top + window.scrollY <= scrollTop) {
      current = heading;
    }
  });

  if (current && current.id) {
    // Highlight in content-toc
    document.querySelectorAll('.content-toc a').forEach(function(a) {
      a.classList.remove('active');
    });
    var tocLink = document.querySelector('.content-toc a[href="#' + CSS.escape(current.id) + '"]');
    if (tocLink) {
      tocLink.classList.add('active');
    }
  }
}

/* --- Mobile sidebar toggle --- */

function initSidebarToggle() {
  var toggle = document.getElementById('toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function() {
    document.querySelectorAll('.sidebar-wrap, .content-wrap').forEach(function(el) {
      el.classList.toggle('shift');
    });
  });

  // Close sidebar when clicking on content area (mobile)
  var contentWrap = document.querySelector('.content-wrap');
  if (contentWrap) {
    contentWrap.addEventListener('click', function(e) {
      if (contentWrap.classList.contains('shift') && !e.target.closest('#toggle')) {
        document.querySelectorAll('.sidebar-wrap, .content-wrap').forEach(function(el) {
          el.classList.remove('shift');
        });
      }
    });
  }
}

/* --- Sidebar scroll position persistence --- */

function initScrollRestore() {
  var sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  var saved = sessionStorage.getItem('sidebar-scroll');
  var savedTime = sessionStorage.getItem('sidebar-scroll-time');
  var savedHost = sessionStorage.getItem('sidebar-scroll-host');

  // Restore if same host and within 10 minutes
  if (saved && savedTime && savedHost) {
    if (savedHost === location.host && (Date.now() - parseInt(savedTime)) < 600000) {
      sidebar.scrollTop = parseInt(saved);
    }
  }

  var scrollTimer = null;
  sidebar.addEventListener('scroll', function() {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      sessionStorage.setItem('sidebar-scroll', sidebar.scrollTop);
      sessionStorage.setItem('sidebar-scroll-time', Date.now());
      sessionStorage.setItem('sidebar-scroll-host', location.host);
    }, 100);
  });
}

/* --- Heading anchor links --- */

function initHeadingAnchors() {
  document.querySelectorAll('.markdown-body h1[id], .markdown-body h2[id], .markdown-body h3[id], .markdown-body h4[id], .markdown-body h5[id], .markdown-body h6[id]').forEach(function(heading) {
    var anchor = document.createElement('a');
    anchor.href = '#' + heading.id;
    anchor.className = 'anchor';
    anchor.setAttribute('aria-label', 'Link to ' + heading.textContent);
    anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    heading.appendChild(anchor);
  });
}

/* --- Code copy buttons --- */

function initCodeCopyButtons() {
  document.querySelectorAll('pre > code').forEach(function(block) {
    var pre = block.parentElement;
    pre.style.position = 'relative';

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

    btn.addEventListener('click', function() {
      var copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
      var checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(block.textContent).then(function() {
          btn.innerHTML = checkIcon;
          setTimeout(function() { btn.innerHTML = copyIcon; }, 2000);
        }).catch(function() {
          fallbackCopy(block.textContent, btn, copyIcon, checkIcon);
        });
      } else {
        fallbackCopy(block.textContent, btn, copyIcon, checkIcon);
      }
    });

    pre.appendChild(btn);
  });
}

/* --- Clipboard fallback for HTTP --- */

function fallbackCopy(text, btn, copyIcon, checkIcon) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    btn.innerHTML = checkIcon;
    setTimeout(function() { btn.innerHTML = copyIcon; }, 2000);
  } catch (e) { /* silent fail */ }
  document.body.removeChild(ta);
}

/* --- Tabbed content --- */

function initTabs() {
  document.querySelectorAll('.tabs-container').forEach(function(container) {
    var nav = container.querySelector('.tabs-nav');
    var panels = container.querySelectorAll('.tab-panel');
    if (!nav || panels.length === 0) return;

    panels.forEach(function(panel, i) {
      var label = panel.getAttribute('data-tab-label');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) {
        btn.classList.add('active');
        panel.classList.add('active');
      }
      btn.addEventListener('click', function() {
        nav.querySelectorAll('button').forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        panel.classList.add('active');
      });
      nav.appendChild(btn);
    });
  });
}

/* --- Image lightbox --- */

function initLightbox() {
  document.querySelectorAll('.lightbox-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      var src = trigger.getAttribute('href') || trigger.querySelector('img').src;
      var overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Enlarged image';
      overlay.appendChild(img);

      function closeOverlay() {
        overlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
      function escHandler(e) {
        if (e.key === 'Escape') closeOverlay();
      }
      overlay.addEventListener('click', closeOverlay);
      document.addEventListener('keydown', escHandler);
      document.body.appendChild(overlay);
    });
  });
}

/* --- Hash change listener --- */

window.addEventListener('hashchange', function() {
  highlightCurrentNav(location.hash || location.pathname);
});
