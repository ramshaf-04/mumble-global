// script.js - Mumble Global Shared Functionality

document.addEventListener('DOMContentLoaded', function () {

  // ================= NAV ACTIVE LINK =================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else if (currentPage === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  // ================= FAQ TOGGLE (FIXED) =================
  function initFaqToggles() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon i');

      if (!question || !answer) return;

      // ❗ Prevent duplicate event listeners
      if (question.dataset.listenerAttached === "true") return;
      question.dataset.listenerAttached = "true";

      // Ensure all are closed initially
      answer.classList.remove('active');
      if (icon) icon.className = 'fas fa-chevron-down';

      question.addEventListener('click', function () {
        const isOpen = answer.classList.contains('active');

        // Close all FAQs
        document.querySelectorAll('.faq-answer').forEach(ans => {
          ans.classList.remove('active');
        });

        document.querySelectorAll('.faq-icon i').forEach(ic => {
          ic.className = 'fas fa-chevron-down';
        });

        // Open current if it was closed
        if (!isOpen) {
          answer.classList.add('active');
          if (icon) icon.className = 'fas fa-chevron-up';
        }
      });
    });
  }

  // Initialize FAQ
  initFaqToggles();

  // ================= CONTACT FORM =================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim() || '';

      let successMessage = name
        ? `✨ Thank you ${name}! A Mumble Global advisor will contact you within 24 hours.`
        : '✨ Thanks for reaching out! A friendly advisor will contact you soon.';

      const formContainer = contactForm.parentElement;

      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert-success';
      alertDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${successMessage}`;

      formContainer.appendChild(alertDiv);
      contactForm.reset();

      setTimeout(() => {
        alertDiv.remove();
      }, 5000);
    });
  }

  // ================= SHOP =================
  const shopBtns = document.querySelectorAll('.shop-btn');
  const shopMsgDiv = document.getElementById('shopMessage');

  if (shopBtns.length > 0) {
    shopBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const product = this.getAttribute('data-product') || 'item';

        if (shopMsgDiv) {
          shopMsgDiv.innerHTML = `
            <div class="alert-success">
              <i class="fas fa-check-circle"></i> 🎉 ${product} added to cart.
              Call <strong>1-800-MUMBLE-GO</strong> to complete your purchase!
            </div>
          `;

          setTimeout(() => {
            shopMsgDiv.innerHTML = '';
          }, 5000);
        } else {
          alert(`${product} selected. Please call 1-800-MUMBLE-GO.`);
        }
      });
    });
  }

  // ================= BLOG =================
  const blogSubBtn = document.getElementById('blogSubscribeBtn');

  if (blogSubBtn) {
    blogSubBtn.addEventListener('click', function () {
      const emailInput = document.getElementById('blogEmail');
      const email = emailInput?.value.trim();
      const feedback = document.getElementById('subscribeFeedback');

      if (email && email.includes('@') && email.includes('.')) {
        if (feedback) {
          feedback.innerHTML = `
            <div class="alert-success">
              <i class="fas fa-check-circle"></i> ✅ Subscribed!
            </div>
          `;
          if (emailInput) emailInput.value = '';
        }
      } else {
        if (feedback) {
          feedback.innerHTML = `
            <div class="alert-error">
              <i class="fas fa-exclamation-triangle"></i> Please enter a valid email.
            </div>
          `;
        }
      }

      setTimeout(() => {
        if (feedback) feedback.innerHTML = '';
      }, 4000);
    });
  }

  // ================= SMOOTH SCROLL =================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      if (href !== '#' && href !== '#contact-section') return;

      const targetElement = document.querySelector('#contact-section');

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ================= PHONE TRACKING =================
  const phoneLink = document.querySelector('.call-cta a[href^="tel:"]');

  if (phoneLink) {
    phoneLink.addEventListener('click', function () {
      console.log('Phone call initiated');
    });
  }

  console.log('Mumble Global Initialized ✔️');
});

function goToPage(page) {
  window.location.href = page;
}

const products = {
  starter: { name: "Starter Kit", price: 29 },
  membership: { name: "Membership", price: 199 },
  coaching: { name: "Coaching", price: 79 },
  accessibility: { name: "Accessibility Kit", price: 49 }
};

let cart = JSON.parse(localStorage.getItem("mumbleCart")) || [];

function saveCart() {
  localStorage.setItem("mumbleCart", JSON.stringify(cart));
}

function addToCart(id) {
  let item = cart.find(p => p.id === id);

  if (item) item.quantity++;
  else cart.push({ id, quantity: 1 });

  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  renderCart();
}

function updateQuantity(id, qty) {
  let item = cart.find(p => p.id === id);
  if (item) {
    item.quantity = qty;
    if (qty <= 0) removeItem(id);
  }
  saveCart();
  renderCart();
}

function calculateTotal() {
  return cart.reduce((total, item) => {
    return total + products[item.id].price * item.quantity;
  }, 0);
}

function renderCart() {
  const container = document.getElementById("cartContainer");

  if (cart.length === 0) {
    container.innerHTML = "<h2>Cart is empty</h2>";
    return;
  }

  let html = "<div class='cart-grid'><div class='cart-items'>";

  cart.forEach(item => {
    const product = products[item.id];

    html += `
      <div class="cart-item">
        <div>
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
        </div>

        <div>
          <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          ${item.quantity}
          <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>

        <div>$${product.price * item.quantity}</div>

        <button onclick="removeItem('${item.id}')">Remove</button>
      </div>
    `;
  });

  html += "</div>";

  html += `
    <div class="cart-summary">
      <h3>Total: $${calculateTotal()}</h3>
      <button class="btn-primary">Checkout</button>
    </div>
  </div>
  `;

  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", renderCart);