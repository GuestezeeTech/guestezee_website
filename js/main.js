// API Configuration
const API_ENDPOINT = 'https://www.guestezee.com:8008/email/send';
const DOMAIN_NAME = 'https://www.guestezee.com';
const USER_ID = 17;

// ========== Sidebar Toggle ==========
function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
  } else {
    sidebar.classList.add('open');
    overlay.style.display = 'block';
  }
}

// ========== Login Redirect ==========
function toLogin() {
  window.location.href = 'https://guestezee.com/hotel-registration';
}

// ========== Enquiry Modal ==========
function openEnquiryModal() {
  document.getElementById('enquiryModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeEnquiryModal() {
  document.getElementById('enquiryModal').style.display = 'none';
  document.body.style.overflow = '';
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('enquiryModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeEnquiryModal();
      }
    });
  }
});

// ========== Room Counter ==========
function changeRooms(delta) {
  var input = document.getElementById('eq-rooms');
  var val = parseInt(input.value) || 1;
  val += delta;
  if (val < 1) val = 1;
  input.value = val;
}

// ========== YouTube Video Player ==========
var ytPlayerReady = false;
var ytPlayer = null;

function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    ytPlayerReady = true;
    return;
  }
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(tag, firstScript);
}

window.onYouTubeIframeAPIReady = function () {
  ytPlayerReady = true;
};

function playVideo(videoId) {
  var thumbnail = document.getElementById('videoThumbnail');
  var container = document.getElementById('videoContainer');
  if (thumbnail) thumbnail.style.display = 'none';

  container.innerHTML = '';
  var iframe = document.createElement('iframe');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  container.style.position = 'relative';
  container.style.paddingBottom = '56.25%';
  container.style.height = '0';
  container.style.overflow = 'hidden';
  container.appendChild(iframe);
}

// ========== FAQ Accordion ==========
document.addEventListener('DOMContentLoaded', function () {
  var questions = document.querySelectorAll('.faq-question');
  questions.forEach(function (question) {
    question.addEventListener('click', function () {
      var item = this.parentElement;
      var answer = this.nextElementSibling;
      var isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(function (faqItem) {
        faqItem.classList.remove('active');
        var ans = faqItem.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});

// ========== Scroll Functions ==========
function scrollToContact() {
  var el = document.getElementById('contactSection');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide back-to-top button
window.addEventListener('scroll', function () {
  var btn = document.getElementById('myBtn');
  if (btn) {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  }
});

// ========== Form Validation & Submission ==========
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile) {
  return /^[0-9]{10,15}$/.test(mobile);
}

function validateName(name) {
  return /^[a-zA-Z\s]{2,}$/.test(name);
}

function showAlert(elementId, message, isSuccess) {
  var alert = document.getElementById(elementId);
  if (!alert) return;
  var msgEl = alert.querySelector('.alert-message');
  if (msgEl) msgEl.textContent = message + '!';
  alert.className = 'alert ' + (isSuccess ? 'success' : 'error');
  alert.style.display = 'flex';
  setTimeout(function () {
    alert.style.display = 'none';
  }, isSuccess ? 2000 : 3000);
}

// Contact Form Submission
function submitContactForm() {
  var form = document.getElementById('contactForm');
  var fullname = document.getElementById('ct-fullname').value.trim();
  var mobile = document.getElementById('ct-mobile').value.trim();
  var email = document.getElementById('ct-email').value.trim();
  var description = document.getElementById('ct-description').value.trim();

  // Clear previous validation
  form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });

  var isValid = true;
  if (!fullname || !validateName(fullname)) {
    document.getElementById('ct-fullname').classList.add('is-invalid');
    isValid = false;
  }
  if (!mobile || !validateMobile(mobile)) {
    document.getElementById('ct-mobile').classList.add('is-invalid');
    isValid = false;
  }
  if (!email || !validateEmail(email)) {
    document.getElementById('ct-email').classList.add('is-invalid');
    isValid = false;
  }
  if (!description) {
    document.getElementById('ct-description').classList.add('is-invalid');
    isValid = false;
  }

  if (!isValid) return;

  var requestData = {
    domain_name: DOMAIN_NAME,
    user_id: 1,
    to: 'support@guestezee.com',
    templateCode: 'Customer_Enquiry_Template',
    data: {
      customer: {
        name: fullname,
        mobile: mobile,
        email: email
      }
    }
  };

  fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  })
    .then(function (resp) { return resp.json(); })
    .then(function (data) {
      // Send reply email
      var replyData = {
        domain_name: DOMAIN_NAME,
        user_id: 1,
        to: email,
        templateCode: 'Enquiry_Reply',
        data: {
          customer: {
            name: fullname,
            email: email
          }
        }
      };
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyData)
      }).catch(function () { });

      // Reset form
      form.reset();
      showAlert('contact-success-alert', 'Thank you for connecting with us', true);
      window.scrollTo(0, 0);
    })
    .catch(function () {
      showAlert('contact-success-alert', 'There was an error submitting your Contact. Please try again later', false);
    });
}

// Enquiry Form Submission
function submitEnquiryForm() {
  var form = document.getElementById('enquiryForm');
  var fullname = document.getElementById('eq-fullname').value.trim();
  var email = document.getElementById('eq-email').value.trim();
  var mobile = document.getElementById('eq-mobile').value.trim();
  var organization = document.getElementById('eq-organization').value.trim();
  var address1 = document.getElementById('eq-address1').value.trim();
  var address2 = document.getElementById('eq-address2').value.trim();
  var city = document.getElementById('eq-city').value.trim();
  var state = document.getElementById('eq-state').value;
  var zipcode = document.getElementById('eq-zipcode').value.trim();
  var country = document.getElementById('eq-country').value;
  var rooms = document.getElementById('eq-rooms').value;
  var description = document.getElementById('eq-description').value.trim();

  // Clear previous validation
  form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });

  var isValid = true;
  if (!fullname) { document.getElementById('eq-fullname').classList.add('is-invalid'); isValid = false; }
  if (!email || !validateEmail(email)) { document.getElementById('eq-email').classList.add('is-invalid'); isValid = false; }
  if (!mobile || !validateMobile(mobile)) { document.getElementById('eq-mobile').classList.add('is-invalid'); isValid = false; }
  if (!organization) { document.getElementById('eq-organization').classList.add('is-invalid'); isValid = false; }
  if (!address1) { document.getElementById('eq-address1').classList.add('is-invalid'); isValid = false; }
  if (!city) { document.getElementById('eq-city').classList.add('is-invalid'); isValid = false; }
  if (!state) { document.getElementById('eq-state').classList.add('is-invalid'); isValid = false; }
  if (!zipcode) { document.getElementById('eq-zipcode').classList.add('is-invalid'); isValid = false; }
  if (!country) { document.getElementById('eq-country').classList.add('is-invalid'); isValid = false; }
  if (!description) { document.getElementById('eq-description').classList.add('is-invalid'); isValid = false; }

  if (!isValid) return;

  var requestData = {
    domain_name: DOMAIN_NAME,
    user_id: USER_ID,
    to: 'support@guestezee.com',
    templateCode: 'Hotel_Enquiry',
    data: {
      customer: {
        name: fullname,
        mobile: mobile,
        email: email
      },
      enquiry: {
        company_name: organization,
        rooms: rooms,
        queries: description,
        address_line1: address1,
        address_line2: address2,
        city: city,
        state: state,
        zipcode: zipcode,
        country: country
      }
    }
  };

  fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  })
    .then(function (resp) { return resp.json(); })
    .then(function (data) {
      // Send reply email
      var replyData = {
        domain_name: DOMAIN_NAME,
        user_id: USER_ID,
        to: email,
        templateCode: 'Enquiry_Reply',
        data: {
          customer: {
            name: fullname,
            email: email
          }
        }
      };
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyData)
      }).catch(function () { });

      form.reset();
      document.getElementById('eq-rooms').value = 1;
      showAlert('enquiry-alert', 'Thank you! Your Enquiry has been successfully submitted', true);
      window.scrollTo(0, 0);
      setTimeout(function () { closeEnquiryModal(); }, 2000);
    })
    .catch(function () {
      showAlert('enquiry-alert', 'There was an error submitting your enquiry. Please try again later', false);
    });
}

// ========== Load SVGs ==========
document.addEventListener('DOMContentLoaded', function () {
  // Load top SVG
  fetch('assets/svg-top.html')
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var el = document.getElementById('topSvgContainer');
      if (el) el.innerHTML = html;
    })
    .catch(function () { });

  // Load bottom SVG
  fetch('assets/svg-bottom.html')
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var el = document.getElementById('bottomSvgContainer');
      if (el) el.innerHTML = html;
    })
    .catch(function () { });
});

// ========== AOS Init ==========
document.addEventListener('DOMContentLoaded', function () {
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }
});

// ========== YouTube API Load ==========
document.addEventListener('DOMContentLoaded', function () {
  loadYouTubeAPI();
});

// ========== Number input spinner hide ==========
// Prevent scroll on number inputs
document.addEventListener('wheel', function (e) {
  if (document.activeElement && document.activeElement.type === 'number') {
    document.activeElement.blur();
  }
}, { passive: true });
