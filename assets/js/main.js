/* ============================================================
   NEXORA TECHNOLOGIES — site behaviour
   Vanilla JS, no dependencies. Loaded with `defer`.
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     CONFIG — edit these three lines and the whole site follows.
     ---------------------------------------------------------- */
  var CFG = {
    phone:     '03425844921',
    phoneIntl: '923425844921',           // for wa.me / tel: links
    email:     'salmanmalhig@gmail.com',

    // Leave empty to send enquiries through WhatsApp instead.
    // Paste a Web3Forms access key or a Formspree endpoint here to
    // receive submissions by email. See README.md.
    formEndpoint: '',
    formProvider: 'web3forms'            // 'web3forms' | 'formspree'
  };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ----------------------------------------------------------
     1. Header — condense once the page has scrolled
     ---------------------------------------------------------- */
  var hdr = $('.hdr');
  if (hdr) {
    var onScroll = function () {
      hdr.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------
     2. Mobile drawer
     ---------------------------------------------------------- */
  var burger = $('.burger');
  var drawer = $('.drawer');
  if (burger && drawer) {
    var setNav = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };
    burger.addEventListener('click', function () {
      setNav(burger.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setNav(false);
    });
  }

  /* ----------------------------------------------------------
     3. Reveal on scroll
     ---------------------------------------------------------- */
  var revealables = $$('[data-reveal]');
  if (revealables.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var delay = parseInt(en.target.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(function () { en.target.classList.add('is-in'); }, delay);
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });

      // Failsafe: if the observer never fires (background tab on first paint,
      // prerender, odd embeds) nothing should stay permanently invisible.
      window.addEventListener('load', function () {
        setTimeout(function () {
          revealables.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight * 1.2) el.classList.add('is-in');
          });
        }, 1200);
      });
    }
  }

  /* ----------------------------------------------------------
     4. Cursor sheen on cards
     ---------------------------------------------------------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', function (e) {
      var card = e.target.closest ? e.target.closest('.card') : null;
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     5. Counting stats
     ---------------------------------------------------------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (reduced) { el.textContent = prefix + target + suffix; return; }

      var start = performance.now();
      var dur = 1500;
      var tick = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          runCount(en.target);
          cio.unobserve(en.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });

      // Same failsafe as the reveals: a stat stuck showing 0 looks broken.
      window.addEventListener('load', function () {
        setTimeout(function () {
          counters.forEach(function (el) {
            if (el.textContent.trim() === '0') runCount(el);
          });
        }, 1400);
      });
    }
  }

  /* ----------------------------------------------------------
     6. Accordion
     ---------------------------------------------------------- */
  $$('.acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc__item');
      var open = btn.getAttribute('aria-expanded') === 'true';
      var group = btn.closest('.acc');

      if (group) {
        $$('.acc__btn', group).forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          other.closest('.acc__item').classList.remove('is-open');
        });
      }
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        item.classList.add('is-open');
      }
    });
  });

  /* ----------------------------------------------------------
     7. Portfolio filters
     ---------------------------------------------------------- */
  var filterBar = $('[data-filters]');
  if (filterBar) {
    var items = $$('[data-cat]');
    $$('button', filterBar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var want = btn.getAttribute('data-filter');
        $$('button', filterBar).forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        items.forEach(function (item) {
          var match = want === 'all' || item.getAttribute('data-cat').split(' ').indexOf(want) > -1;
          item.classList.toggle('hide', !match);
          if (match) {
            item.classList.remove('is-in');
            requestAnimationFrame(function () { item.classList.add('is-in'); });
          }
        });

        var empty = $('[data-empty]');
        if (empty) {
          var visible = items.filter(function (i) { return !i.classList.contains('hide'); });
          empty.classList.toggle('hide', visible.length > 0);
        }
      });
    });
  }

  /* ----------------------------------------------------------
     8. Contact / quote forms
     ---------------------------------------------------------- */
  var fieldOf = function (input) { return input.closest('.field'); };

  var showError = function (input, msg) {
    var f = fieldOf(input);
    if (!f) return;
    f.classList.add('has-error');
    var slot = $('.field__err', f);
    if (slot) slot.textContent = msg;
  };

  var clearError = function (input) {
    var f = fieldOf(input);
    if (f) f.classList.remove('has-error');
  };

  var validate = function (form) {
    var ok = true;

    // Required fields must be filled; format is checked on ANY field that has
    // a value, so an optional-but-mistyped email is still caught.
    $$('input, select, textarea', form).forEach(function (input) {
      var val = (input.value || '').trim();
      clearError(input);

      if (input.hasAttribute('required') && !val) {
        showError(input, 'This field is required.');
        ok = false;
        return;
      }
      if (!val) return;

      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(val)) {
        showError(input, 'Please enter a valid email address.');
        ok = false;
        return;
      }
      if (input.type === 'tel' && val.replace(/\D/g, '').length < 10) {
        showError(input, 'Please enter a complete phone number.');
        ok = false;
      }
    });
    return ok;
  };

  var collect = function (form) {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (value, key) {
      if (data[key]) { data[key] += ', ' + value; }
      else { data[key] = value; }
    });
    return data;
  };

  var toWhatsAppText = function (form, data) {
    var lines = ['*' + (form.getAttribute('data-subject') || 'Website Enquiry') + '*', ''];
    $$('[name]', form).forEach(function (input) {
      var key = input.getAttribute('name');
      if (!(key in data) || !data[key]) return;
      if (lines.indexOf(key) > -1) return;
      var label = input.getAttribute('data-label') || key;
      lines.push(label + ': ' + data[key]);
      delete data[key];
    });
    lines.push('', '— Sent from the Nexora website');
    return lines.join('\n');
  };

  var setStatus = function (form, kind, msg) {
    var box = $('.form__status', form);
    if (!box) return;
    box.className = 'form__status ' + (kind === 'ok' ? 'is-ok' : 'is-bad');
    box.textContent = msg;
    box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  };

  var sendViaWhatsApp = function (form) {
    var data = collect(form);
    var text = toWhatsAppText(form, data);
    window.open('https://wa.me/' + CFG.phoneIntl + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    setStatus(form, 'ok',
      'WhatsApp is opening — just press Send and your details reach us. ' +
      'If WhatsApp does not open, message us directly on ' + CFG.phone + '.');
  };

  var sendViaEndpoint = function (form, btn, original) {
    var url = CFG.formProvider === 'web3forms'
      ? 'https://api.web3forms.com/submit'
      : CFG.formEndpoint;

    var payload = collect(form);
    if (CFG.formProvider === 'web3forms') {
      payload.access_key = CFG.formEndpoint;
      payload.subject = form.getAttribute('data-subject') || 'Nexora website enquiry';
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }); })
      .then(function (res) {
        if (res.success || res.ok) {
          form.reset();
          setStatus(form, 'ok', 'Thank you. We have your message and will reply within 24 hours.');
        } else {
          throw new Error('rejected');
        }
      })
      .catch(function () {
        setStatus(form, 'bad', 'That could not be sent. Trying WhatsApp instead…');
        setTimeout(function () { sendViaWhatsApp(form); }, 900);
      })
      .finally(function () {
        btn.disabled = false;
        btn.innerHTML = original;
      });
  };

  $$('form[data-form]').forEach(function (form) {
    // live-clear errors as the user types
    $$('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('input', function () { clearError(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) {
        var first = $('.has-error input, .has-error select, .has-error textarea', form);
        if (first) first.focus();
        return;
      }

      var btn = $('[type="submit"]', form);
      var original = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }

      if (CFG.formEndpoint) {
        sendViaEndpoint(form, btn, original);
      } else {
        sendViaWhatsApp(form);
        form.reset();
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      }
    });

    // explicit "send on WhatsApp" button
    var waBtn = $('[data-wa-send]', form);
    if (waBtn) {
      waBtn.addEventListener('click', function () {
        if (!validate(form)) return;
        sendViaWhatsApp(form);
      });
    }
  });

  /* ----------------------------------------------------------
     9. Small conveniences
     ---------------------------------------------------------- */
  // current year in the footer
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // wire contact details from CFG so they only live in one place
  $$('[data-cfg]').forEach(function (el) {
    var key = el.getAttribute('data-cfg');
    if (key === 'phone') { el.textContent = CFG.phone; el.href = 'tel:+' + CFG.phoneIntl; }
    if (key === 'email') { el.textContent = CFG.email; el.href = 'mailto:' + CFG.email; }
    if (key === 'wa')    { el.href = 'https://wa.me/' + CFG.phoneIntl; }
  });
})();
