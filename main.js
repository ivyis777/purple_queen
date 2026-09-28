/**
 * Purple Queen Interiors - Interactive Client Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = '#ffffff';
        navLinks.style.padding = '24px';
        navLinks.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      }
    });
  }

  // 3. Category Filter Tabs
  const filterBtns = document.querySelectorAll('.cat-filter-btn');
  const catCards = document.querySelectorAll('.category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      catCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Interactive Estimate Calculator
  const bhkInputs = document.querySelectorAll('input[name="calc-bhk"]');
  const packageInputs = document.querySelectorAll('input[name="calc-package"]');
  const scopeInputs = document.querySelectorAll('input[name="calc-scope"]');
  const priceDisplay = document.getElementById('calcPriceDisplay');
  const emiDisplay = document.getElementById('calcEmiDisplay');

  // Base pricing matrix (in INR)
  const basePrices = {
    '1bhk': 285000,
    '2bhk': 485000,
    '3bhk': 750000,
    'villa': 1250000
  };

  const packageMultipliers = {
    'essential': 1.0,
    'elegance': 1.35,
    'royal': 1.75
  };

  const scopeWeights = {
    'kitchen': 0.32,
    'living': 0.22,
    'master-bed': 0.24,
    'wardrobes': 0.18,
    'ceiling': 0.12,
    'pooja': 0.08
  };

  function updateEstimate() {
    if (!priceDisplay) return;

    let selectedBhk = '2bhk';
    bhkInputs.forEach(input => {
      if (input.checked) selectedBhk = input.value;
    });

    let selectedPackage = 'elegance';
    packageInputs.forEach(input => {
      if (input.checked) selectedPackage = input.value;
    });

    let activeScopeFactor = 0;
    let checkedCount = 0;
    scopeInputs.forEach(input => {
      if (input.checked) {
        activeScopeFactor += (scopeWeights[input.value] || 0.15);
        checkedCount++;
      }
    });

    // Default normalization
    if (checkedCount === 0) activeScopeFactor = 0.5;

    const base = basePrices[selectedBhk] || 485000;
    const multiplier = packageMultipliers[selectedPackage] || 1.35;
    const rawTotal = Math.round((base * multiplier * activeScopeFactor) / 1000) * 1000;

    // Format Indian Rupee currency
    const formattedPrice = '₹' + rawTotal.toLocaleString('en-IN');
    priceDisplay.textContent = formattedPrice;

    // Approximate 36-month EMI with standard interest
    const emiValue = Math.round((rawTotal * 1.12) / 36);
    if (emiDisplay) {
      emiDisplay.textContent = `EMI starts from ₹${emiValue.toLocaleString('en-IN')}/month*`;
    }
  }

  bhkInputs.forEach(i => i.addEventListener('change', updateEstimate));
  packageInputs.forEach(i => i.addEventListener('change', updateEstimate));
  scopeInputs.forEach(i => i.addEventListener('change', updateEstimate));

  // Run initial estimate calculation
  updateEstimate();

  // 5. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 6. Lead Modal Popup
  const modal = document.getElementById('consultationModal');
  const openModalBtns = document.querySelectorAll('.open-consultation-modal');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('open');
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }

  // 7. Property Type Selector in Hero Form
  const propTabs = document.querySelectorAll('.prop-tab-btn');
  const propInput = document.getElementById('heroPropertyType');
  propTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      propTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (propInput) {
        propInput.value = tab.getAttribute('data-value');
      }
    });
  });

  // 8. Form Submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.innerHTML = 'Submitting...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        alert('Thank you! Your design consultation request has been received. Our senior interior designer will contact you shortly.');
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
        if (modal) modal.classList.remove('open');
      }, 700);
    });
  });
});
