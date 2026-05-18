/* ═══════════════════════════════════════════════════════════
   Ajogunba Herbal Remedy Clinic — main.js
   ═══════════════════════════════════════════════════════════

   PRODUCT_CATALOGUE
   ⚠️  To update prices: change the "price" values below (numbers only, Naira ₦)
   ⚠️  To add a product: copy one block and give it a new id like 'prod-5'
   ═══════════════════════════════════════════════════════════ */

var PRODUCTS = {
  'prod-1': {
    id:   'prod-1',
    name: 'Herbal Calcium Medicine',
    tag:  'Bone & Joints',
    price: 5000,              /* ← update price here */
    icon: '🦴',
    img:  'images/product-calcium.jpg'
  },
  'prod-2': {
    id:   'prod-2',
    name: 'Sciatica Herbal Remedy',
    tag:  'Pain Relief',
    price: 6500,              /* ← update price here */
    icon: '⚡',
    img:  'images/product-sciatica.jpg'
  },
  'prod-3': {
    id:   'prod-3',
    name: 'Original E.D. Formula',
    tag:  "Men's Health",
    price: 7000,              /* ← update price here */
    icon: '💪',
    img:  'images/product-ed.jpg'
  },
  'prod-4': {
    id:   'prod-4',
    name: 'Herbal Deworming Formula',
    tag:  'Digestive Health',
    price: 4500,              /* ← update price here */
    icon: '🌿',
    img:  'images/product-deworming.jpg'
  }
};

/* ── CLINIC CONTACT ── */
var CLINIC_WHATSAPP = '2347047362000';
var CLINIC_EMAIL    = 'Ajogunbaremedyherbalclinic@gmail.com';
var CLINIC_PHONE_1  = '+2347047362000';
var CLINIC_PHONE_2  = '+2347047352000';

/* ════════════════════════════════════════════
   CART STATE
════════════════════════════════════════════ */
var cart = {};  /* { 'prod-id': quantity } */

function fmtPrice(n) {
  return '₦' + n.toLocaleString('en-NG');
}
function cartTotal() {
  var total = 0;
  Object.keys(cart).forEach(function(id) {
    total += PRODUCTS[id].price * cart[id];
  });
  return total;
}
function cartCount() {
  var count = 0;
  Object.keys(cart).forEach(function(id) { count += cart[id]; });
  return count;
}

/* ── ADD TO CART ── */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
  /* flash badge */
  var b = document.getElementById('cart-badge');
  b.style.transition = 'transform .15s';
  b.style.transform  = 'scale(1.7)';
  setTimeout(function() { b.style.transform = 'scale(1)'; }, 200);
  openCart();
}

/* ── UPDATE ALL CART UI ── */
function updateCartUI() {
  var count  = cartCount();
  var badge  = document.getElementById('cart-badge');
  var hcount = document.getElementById('cart-header-count');

  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
  hcount.textContent = count + (count === 1 ? ' item' : ' items');

  var empty  = document.getElementById('cart-empty');
  var list   = document.getElementById('cart-items-list');
  var footer = document.getElementById('cart-footer');

  if (count === 0) {
    empty.style.display  = 'block';
    list.innerHTML       = '';
    footer.style.display = 'none';
    return;
  }

  empty.style.display  = 'none';
  footer.style.display = 'block';

  var html = '';
  Object.keys(cart).forEach(function(id) {
    var p = PRODUCTS[id];
    var q = cart[id];
    html +=
      '<div class="cart-item">' +
        '<div class="cart-item-img">' +
          '<img src="' + p.img + '" alt="' + p.name + '"' +
            ' onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"/>' +
          '<div class="ci-icon" style="display:none;">' + p.icon + '</div>' +
        '</div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">'  + p.name + '</div>' +
          '<div class="cart-item-tag">'   + p.tag  + '</div>' +
          '<div class="cart-item-price">' + fmtPrice(p.price * q) + '</div>' +
          '<div class="cart-qty-row">' +
            '<button class="qty-btn" onclick="changeQty(\'' + id + '\',-1)">&#x2212;</button>' +
            '<span class="qty-val">'  + q + '</span>' +
            '<button class="qty-btn" onclick="changeQty(\'' + id + '\',1)">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-remove" onclick="removeFromCart(\'' + id + '\')" title="Remove">&#x1F5D1;</button>' +
      '</div>';
  });

  list.innerHTML = html;
  document.getElementById('cart-total-val').textContent = fmtPrice(cartTotal());
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
}
function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

/* ════════════════════════════════════════════
   CART DRAWER
════════════════════════════════════════════ */
function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════════
   CHECKOUT
════════════════════════════════════════════ */
function openCheckout() {
  if (cartCount() === 0) return;
  closeCart();

  /* populate order summary */
  var html = '';
  Object.keys(cart).forEach(function(id) {
    var p = PRODUCTS[id]; var q = cart[id];
    html +=
      '<div class="co-sum-item">' +
        '<span class="co-sum-name">' + p.name + ' &times; ' + q + '</span>' +
        '<span class="co-sum-val">'  + fmtPrice(p.price * q) + '</span>' +
      '</div>';
  });
  document.getElementById('co-sum-items').innerHTML = html;
  document.getElementById('co-grand-val').textContent = fmtPrice(cartTotal());

  /* show step 1 */
  document.getElementById('co-step1').style.display = 'block';
  document.getElementById('co-step2').style.display = 'none';
  document.getElementById('co-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('co-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function backToForm() {
  document.getElementById('co-step1').style.display = 'block';
  document.getElementById('co-step2').style.display = 'none';
}

function proceedToComplete() {
  var name    = document.getElementById('co-name').value.trim();
  var phone   = document.getElementById('co-phone').value.trim();
  var address = document.getElementById('co-address').value.trim();
  var city    = document.getElementById('co-city').value.trim();
  var country = document.getElementById('co-country').value.trim();

  if (!name || !phone || !address || !city || !country) {
    alert('Please fill in all required fields (marked with *).');
    return;
  }
  document.getElementById('co-step1').style.display = 'none';
  document.getElementById('co-step2').style.display = 'block';
  document.getElementById('co-modal').scrollTop = 0;
}

/* ── BUILD ORDER TEXT ── */
function buildOrderText() {
  var name    = document.getElementById('co-name').value.trim();
  var phone   = document.getElementById('co-phone').value.trim();
  var email   = document.getElementById('co-email').value.trim();
  var address = document.getElementById('co-address').value.trim();
  var city    = document.getElementById('co-city').value.trim();
  var country = document.getElementById('co-country').value.trim();
  var notes   = document.getElementById('co-notes').value.trim();

  var lines = [
    '*NEW ORDER — Ajogunba Herbal Clinic*', '',
    '*Customer Details*',
    'Name: '    + name,
    'Phone: '   + phone
  ];
  if (email) lines.push('Email: ' + email);
  lines.push('Address: ' + address + ', ' + city + ', ' + country);
  lines.push('', '*Order Items*');
  Object.keys(cart).forEach(function(id) {
    var p = PRODUCTS[id]; var q = cart[id];
    lines.push('\u2022 ' + p.name + ' \xd7 ' + q + '  \u2014  ' + fmtPrice(p.price * q));
  });
  lines.push('', '*Order Total: ' + fmtPrice(cartTotal()) + '*');
  if (notes) lines.push('', 'Notes: ' + notes);
  lines.push('', '_Sent from Ajogunba Herbal Clinic website_');
  return lines.join('\n');
}

function sendViaWhatsApp() {
  var msg = buildOrderText();
  window.open('https://wa.me/' + CLINIC_WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
  orderDone();
}

function sendViaEmail() {
  var name    = document.getElementById('co-name').value.trim();
  var subject = 'New Product Order \u2014 ' + name;
  var body    = buildOrderText().replace(/\*/g, '').replace(/_/g, '');
  window.location.href = 'mailto:' + CLINIC_EMAIL +
    '?subject=' + encodeURIComponent(subject) +
    '&body='    + encodeURIComponent(body);
  orderDone();
}

function orderDone() {
  setTimeout(function() {
    closeCheckout();
    cart = {};
    updateCartUI();
    alert(
      '\u2705 Your order has been sent!\n\n' +
      'Thank you for ordering from Ajogunba Herbal Remedy Clinic.\n' +
      'We will confirm your order and arrange delivery shortly.\n\n' +
      'For enquiries: ' + CLINIC_PHONE_1
    );
  }, 800);
}

/* ════════════════════════════════════════════
   PHONE MODAL
════════════════════════════════════════════ */
function openPhoneModal(number) {
  var clean = number.replace(/^\+/, '');
  document.getElementById('modal-number').textContent = number;
  document.getElementById('whatsapp-btn').href =
    'https://wa.me/' + clean +
    '?text=Hello%2C%20I%20would%20like%20to%20make%20an%20enquiry%20about%20your%20herbal%20services.';
  document.getElementById('call-btn').href = 'tel:' + number;
  document.getElementById('phone-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePhoneModal(e) {
  if (e && e.target !== document.getElementById('phone-modal')) return;
  document.getElementById('phone-modal').style.display = 'none';
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════════
   NAVIGATION & SCROLL
════════════════════════════════════════════ */
function smoothGoto(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function closeMobile() {
  document.getElementById('mobile-menu').classList.remove('open');
}

/* navbar scroll effect */
window.addEventListener('scroll', function() {
  var nb = document.getElementById('navbar');
  if (window.scrollY > 70) nb.classList.add('scrolled');
  else nb.classList.remove('scrolled');
});

/* ── SERVICES: show all ── */
function showAllServices() {
  document.querySelectorAll('.service-pill.extra').forEach(function(el) {
    el.classList.remove('hidden');
  });
  document.getElementById('show-more-btn').style.display = 'none';
}

/* ── ESCAPE KEY closes everything ── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
    document.getElementById('phone-modal').style.display = 'none';
    document.body.style.overflow = '';
  }
});

/* ── SCROLL REVEAL ── */
(function() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    obs.observe(el);
  });
})();

/* ── CONTACT FORM SUBMIT ── */
function handleFormSubmit() {
  var inputs  = document.querySelectorAll('.form-input, .form-textarea');
  var allFull = Array.from(inputs).every(function(i) { return i.value.trim() !== ''; });
  if (!allFull) {
    alert('Please fill in all fields before sending.');
    return;
  }
  alert(
    'Thank you for your message!\n' +
    'We will get back to you shortly.\n\n' +
    'Alternatively call us:\n' +
    CLINIC_PHONE_1 + ' \xb7 ' + CLINIC_PHONE_2
  );
  inputs.forEach(function(i) { i.value = ''; });
}