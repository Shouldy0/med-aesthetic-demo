/* ==========================================================================
   MED Aesthetic Clinic UK — script.js (Client Sales Edition)
   Interactive logic:
   1. Treatment rendering & Category Filtering
   2. Interactive Before/After Drag Slider
   3. 30-Second Skin Assessment Recommender Mini-Tool
   4. Appointment Day & Time Slot Picker
   5. Treatwell Reviews rendering
   6. WhatsApp 1-Tap Booking Integration
   7. Sticky Mobile Bar & Mobile Navigation
   ========================================================================== */

// ---- 1. Services Data with Categories ----
const services = [
  {
    id: "signature-facial",
    category: "facials",
    icon: "✨",
    name: "Signature Facial",
    desc: "A tailored restorative facial balancing deep pore cleansing, gentle exfoliation, active hydration, and facial lymphatic drainage.",
    price: "£65",
    priceNote: "from",
    duration: "60 Min"
  },
  {
    id: "hydration-facial",
    category: "hydration",
    icon: "💧",
    name: "Hydration Facial",
    desc: "Intensive multi-depth moisture restoration designed specifically for depleted, dry, or environmentally stressed urban skin barriers.",
    price: "£50",
    priceNote: "from",
    duration: "50 Min"
  },
  {
    id: "skin-brightening",
    category: "peels",
    icon: "🌟",
    name: "Skin Brightening",
    desc: "Targeted enzymatic treatment focused on reducing dullness, balancing pigmentation, and reviving tired cellular luminosity.",
    price: "£70",
    priceNote: "from",
    duration: "55 Min"
  },
  {
    id: "advanced-facial",
    category: "facials",
    icon: "🌿",
    name: "Advanced Facial",
    desc: "Clinical-grade treatment including precise gentle extractions, high-potency serums, and a revitalizing therapeutic finish.",
    price: "£85",
    priceNote: "from",
    duration: "75 Min"
  }
];

// ---- 2. Real Treatwell Reviews ----
const reviews = [
  {
    stars: "★★★★★",
    text: "Overall, the experience was excellent. The staff were very friendly and attentive, and the service was highly professional. I was very satisfied with the care I received and would definitely recommend them.",
    name: "Margarita",
    source: "Treatwell Verified"
  },
  {
    stars: "★★★★★",
    text: "Great experience today. Very relaxing and knowledgeable about how to help my skin issues.",
    name: "Evie",
    source: "Treatwell Verified"
  },
  {
    stars: "★★★★★",
    text: "An outstanding clinic with topquality equipment. I felt confident, safe, and exceptionally well cared for by a highly professional team 💚",
    name: "Angela",
    source: "Treatwell Verified"
  }
];

// Helper: Create element from template HTML
function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

// ---- 3. Render Treatment Cards & Category Filtering ----
function renderServices(activeCategory = 'all') {
  const container = document.getElementById('serviceCards');
  if (!container) return;
  container.innerHTML = '';

  const filtered = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  filtered.forEach(service => {
    const card = createElement(`
      <article class="service-card" data-service-id="${service.id}" data-category="${service.category}">
        <div class="service-top">
          <div class="service-icon" aria-hidden="true">${service.icon}</div>
          <span class="placeholder-badge">placeholder</span>
        </div>
        <h3>${service.name}</h3>
        <p>${service.desc}</p>
        <div class="service-footer">
          <div class="price-box">
            <span class="price-prefix">${service.priceNote}</span>
            <span class="price-amount">${service.price}</span>
          </div>
          <a href="#contact" class="btn btn-enquire" data-service-name="${service.name}">
            Enquire
          </a>
        </div>
      </article>
    `);
    container.appendChild(card);
  });

  // Attach quick enquiry handler
  container.querySelectorAll('.btn-enquire').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service-name');
      selectServiceInForm(serviceName);
    });
  });
}

function selectServiceInForm(serviceName) {
  const treatmentSelect = document.getElementById('fTreatment');
  const messageInput = document.getElementById('fMsg');
  
  if (treatmentSelect) {
    for (let i = 0; i < treatmentSelect.options.length; i++) {
      if (treatmentSelect.options[i].text.includes(serviceName)) {
        treatmentSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (messageInput && !messageInput.value) {
    messageInput.value = `Hello, I would like to enquire about booking the ${serviceName}.`;
  }
}

function initCategoryFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const category = tab.getAttribute('data-category');
      renderServices(category);
    });
  });
}

// ---- 4. Interactive Before/After Drag Slider ----
function initBeforeAfterSlider() {
  const stage = document.getElementById('comparisonStage');
  const layerBefore = document.getElementById('layerBefore');
  const handle = document.getElementById('comparisonHandle');

  if (!stage || !layerBefore || !handle) return;

  let isDragging = false;

  function setPosition(xPos) {
    const rect = stage.getBoundingClientRect();
    let offsetX = xPos - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    layerBefore.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
    handle.setAttribute('aria-valuenow', Math.round(percentage));
  }

  // Mouse events
  stage.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch events for mobile screens (390px)
  stage.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches.length > 0) {
      setPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      setPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keyboard accessibility
  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
    if (e.key === 'ArrowLeft') {
      const next = Math.max(0, current - 5);
      layerBefore.style.width = `${next}%`;
      handle.style.left = `${next}%`;
      handle.setAttribute('aria-valuenow', next);
    } else if (e.key === 'ArrowRight') {
      const next = Math.min(100, current + 5);
      layerBefore.style.width = `${next}%`;
      handle.style.left = `${next}%`;
      handle.setAttribute('aria-valuenow', next);
    }
  });
}

// ---- 5. 30-Second Skin Assessment Mini-Tool (Lead Magnet) ----
function initSkinAssessmentQuiz() {
  const goalBtns = document.querySelectorAll('#quizGoalOptions .quiz-opt-btn');
  const feelBtns = document.querySelectorAll('#quizFeelOptions .quiz-opt-btn');
  const resultTitle = document.getElementById('quizResultTitle');
  const resultReason = document.getElementById('quizResultReason');
  const resultDuration = document.getElementById('quizResultDuration');
  const resultPrice = document.getElementById('quizResultPrice');
  const applyBtn = document.getElementById('quizApplyBtn');

  if (!goalBtns.length || !feelBtns.length) return;

  let currentGoal = 'hydration';
  let currentFeel = 'dry';

  const recommendations = {
    'hydration': {
      title: 'Hydration Facial',
      reason: 'Deep moisture replenishment specifically targeted for depleted, dry, or tight skin. Restores intercellular lipid health and natural barrier bounce.',
      duration: '50 Minutes',
      price: '£50'
    },
    'glow': {
      title: 'Skin Brightening Protocol',
      reason: 'Enzymatic resurfacing coupled with antioxidant infusion to target sun fatigue, post-blemish shadows, and restore luminous skin tone.',
      duration: '55 Minutes',
      price: '£70'
    },
    'pores': {
      title: 'Advanced Clinical Facial',
      reason: 'Focused on precise gentle extractions, anti-inflammatory calming masks, and pore clearing for smooth, clarified skin texture.',
      duration: '75 Minutes',
      price: '£85'
    },
    'allround': {
      title: 'Signature Facial',
      reason: 'Our most popular comprehensive facial. Balances deep sonic cleansing, gentle exfoliation, active hydration, and lymphatic massage.',
      duration: '60 Minutes',
      price: '£65'
    }
  };

  function updateRecommendation() {
    let key = currentGoal;
    // Contextual refinement based on skin feel
    if (currentFeel === 'oily' && currentGoal !== 'pores') {
      key = 'pores';
    } else if (currentFeel === 'uneven' && currentGoal !== 'glow') {
      key = 'glow';
    }

    const rec = recommendations[key] || recommendations['allround'];
    if (resultTitle) resultTitle.textContent = rec.title;
    if (resultReason) resultReason.textContent = rec.reason;
    if (resultDuration) resultDuration.textContent = rec.duration;
    if (resultPrice) {
      resultPrice.innerHTML = `${rec.price} <small class="placeholder-badge">placeholder</small>`;
    }
    if (applyBtn) {
      applyBtn.setAttribute('data-treatment', rec.title);
    }
  }

  goalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGoal = btn.getAttribute('data-goal');
      updateRecommendation();
    });
  });

  feelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      feelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFeel = btn.getAttribute('data-feel');
      updateRecommendation();
    });
  });

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const treatmentName = applyBtn.getAttribute('data-treatment') || 'Hydration Facial';
      selectServiceInForm(treatmentName);
      const msg = document.getElementById('fMsg');
      if (msg) {
        msg.value = `Hello! Based on the 30-Second Skin Assessment tool, I was matched with the ${treatmentName}. My skin is feeling ${currentFeel}.`;
      }
    });
  }

  updateRecommendation();
}

// ---- 6. Appointment Day & Time Slot Picker Pills ----
function initSlotPills() {
  const dayPills = document.querySelectorAll('#dayPills .slot-pill');
  const timePills = document.querySelectorAll('#timePills .slot-pill');

  dayPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dayPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      timePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

// ---- 7. Render Reviews ----
function renderReviews() {
  const container = document.getElementById('reviewCards');
  if (!container) return;
  container.innerHTML = '';

  reviews.forEach(review => {
    const card = createElement(`
      <article class="review-card">
        <div class="review-top">
          <div class="review-stars" aria-label="${review.stars} 5 out of 5 stars">${review.stars}</div>
          <span class="review-verified">Verified Client</span>
        </div>
        <blockquote>“${review.text}”</blockquote>
        <div class="review-author">
          <span class="author-name">${review.name}</span>
          <span class="author-source">${review.source}</span>
        </div>
      </article>
    `);
    container.appendChild(card);
  });
}

// ---- 8. Mobile Navigation Toggle & Drawer ----
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const siteHeader = document.getElementById('header');
  const navLinks = document.querySelectorAll('.main-nav a');

  if (!toggleBtn || !siteHeader) return;

  function toggleMenu() {
    const isOpen = siteHeader.classList.toggle('nav-open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (siteHeader.classList.contains('nav-open')) {
        siteHeader.classList.remove('nav-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (siteHeader.classList.contains('nav-open') && !siteHeader.contains(e.target)) {
      siteHeader.classList.remove('nav-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---- 9. Sticky Mobile Bottom Bar (Visible past hero) ----
function initStickyMobileBar() {
  const heroSection = document.getElementById('hero');
  const stickyBar = document.getElementById('stickyMobileBar');
  if (!heroSection || !stickyBar) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyBar.classList.add('is-visible');
        } else {
          stickyBar.classList.remove('is-visible');
        }
      });
    }, {
      root: null,
      threshold: 0.1
    });

    observer.observe(heroSection);
  } else {
    window.addEventListener('scroll', () => {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom < 0) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }
    }, { passive: true });
  }
}

// ---- 10. Booking Form Handler (Preserving demo behavior with feedback) ----
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('fName');
    const phoneInput = document.getElementById('fPhone');
    const treatmentSelect = document.getElementById('fTreatment');
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const treatment = treatmentSelect ? treatmentSelect.value : 'Consultation';

    // Get selected day & time slot
    const activeDayPill = document.querySelector('#dayPills .slot-pill.active');
    const activeTimePill = document.querySelector('#timePills .slot-pill.active');
    const selectedDay = activeDayPill ? activeDayPill.getAttribute('data-day') : 'Flexible';
    const selectedTime = activeTimePill ? activeTimePill.getAttribute('data-time') : 'Flexible';

    if (!name || !phone) {
      alert('Please provide your name and phone number so the clinic team can contact you.');
      if (!name && nameInput) nameInput.focus();
      else if (!phone && phoneInput) phoneInput.focus();
      return;
    }

    const feedbackCard = createElement(`
      <div class="form-feedback-card" role="status">
        <h4>✓ Consultation Request Received</h4>
        <p>Thank you, <strong>${name}</strong>! We have captured your request for <strong>${treatment}</strong> (${selectedDay} · ${selectedTime}).</p>
        <p style="margin-top: 8px; font-size: 0.88rem; opacity: 0.9;">In this demo proposal, submissions demonstrate instant appointment routing. In live deployment, this immediately syncs with the clinic's calendar or CRM.</p>
        <div style="margin-top: 14px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <a href="https://wa.me/447308438403?text=Hi%20MED%20Aesthetic,%20I%20just%20submitted%20a%20booking%20request%20for%20${encodeURIComponent(treatment)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
            <span>Confirm Faster on WhatsApp</span>
          </a>
          <a href="tel:07308438403" class="btn btn-ghost-light btn-sm">
            <span>Call 07308 438403</span>
          </a>
        </div>
      </div>
    `);

    form.replaceWith(feedbackCard);
  });
}

// Initialise everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  renderServices('all');
  initCategoryFilters();
  initBeforeAfterSlider();
  initSkinAssessmentQuiz();
  initSlotPills();
  renderReviews();
  initMobileNav();
  initStickyMobileBar();
  initBookingForm();
});