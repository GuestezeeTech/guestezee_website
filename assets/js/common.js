// ===== Sidebar toggle =====
function toggleSidebar() {
  var sidebar = document.getElementById('mobileSidebar');
  var overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}

// ===== Enquiry Modal =====
function openEnquiryModal() {
  document.getElementById('enquiryModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeEnquiryModal() {
  document.getElementById('enquiryModal').style.display = 'none';
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('enquiryModal')) {
    closeEnquiryModal();
  }
}

// Room counter
function changeRooms(delta) {
  var input = document.getElementById('eq-rooms');
  var val = parseInt(input.value) || 1;
  val += delta;
  if (val < 1) val = 1;
  input.value = val;
}

// ===== Back to top =====
window.onscroll = function () {
  var btn = document.getElementById('myBtn');
  if (btn) {
    btn.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? 'block' : 'none';
  }
};

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Login redirect =====
function toLogin() {
  window.location.href='https://guestezee.com/hotel-registration';
}

// ===== Brochure download =====
function downloadBrochure() {
  var url = 'assets/images/GuestEzee-Brochure.pdf';
  var fileName = 'GuestEzee-Brochure.pdf';

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('PDF not found');
      }

      return response.blob();
    })
    .then(function (blob) {
      var blobUrl = URL.createObjectURL(blob);

      var link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    })
    .catch(function (error) {
      console.error('Download failed:', error);
    });
}
// ===== Alerts =====
function showAlert(msg) {
  var alert = document.getElementById('success-alert-global');
  var msgEl = document.getElementById('global-alert-msg');
  msgEl.textContent = msg;
  alert.style.display = 'flex';
  setTimeout(function () { alert.style.display = 'none'; }, 4000);
}

// ===== Validation helpers =====
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10,15}$/.test(phone);
}

// ===== Submit enquiry form =====
function submitEnquiryForm() {
  var form = document.getElementById('enquiryForm');
  var fields = ['eq-fullname', 'eq-address1', 'eq-email', 'eq-address2', 'eq-mobile', 'eq-city', 'eq-organization', 'eq-state', 'eq-zipcode', 'eq-country', 'eq-description'];
  var valid = true;

  fields.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var val = el.value.trim();
    if (!val || (el.type === 'email' && !isValidEmail(val)) || (el.type === 'number' && !isValidPhone(val))) {
      el.classList.add('is-invalid');
      valid = false;
    } else {
      el.classList.remove('is-invalid');
    }
  });

  if (!valid) return;

  var customerName = document.getElementById('eq-fullname').value;
  var customerMobile = document.getElementById('eq-mobile').value;
  var customerEmail = document.getElementById('eq-email').value;

  var payload = {
    domain_name: 'https://www.guestezee.com',
    user_id: 17,
    to: 'support@guestezee.com',
    templateCode: 'Hotel_Enquiry',
    data: {
      customer: {
        name: customerName,
        mobile: customerMobile,
        email: customerEmail
      },
      enquiry: {
        company_name: document.getElementById('eq-organization').value,
        rooms: document.getElementById('eq-rooms').value,
        queries: document.getElementById('eq-description').value,
        address_line1: document.getElementById('eq-address1').value,
        address_line2: document.getElementById('eq-address2').value,
        city: document.getElementById('eq-city').value,
        state: document.getElementById('eq-state').value,
        zipcode: document.getElementById('eq-zipcode').value,
        country: document.getElementById('eq-country').value
      }
    }
  };

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://www.guestezee.com:8008/email/send', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      showAlert('Enquiry submitted successfully!');
      form.reset();
      closeEnquiryModal();

      var replyPayload = {
        domain_name: 'https://www.guestezee.com',
        user_id: 17,
        to: customerEmail,
        templateCode: 'Enquiry_Reply',
        data: {
          customer: { name: customerName, email: customerEmail }
        }
      };
      var replyXhr = new XMLHttpRequest();
      replyXhr.open('POST', 'https://www.guestezee.com:8008/email/send', true);
      replyXhr.setRequestHeader('Content-Type', 'application/json');
      replyXhr.send(JSON.stringify(replyPayload));
    } else {
      showAlert('Something went wrong. Please try again.');
    }
  };
  xhr.onerror = function () {
    showAlert('Network error. Please try again.');
  };
  xhr.send(JSON.stringify(payload));
}

// ===== Remove validation state on input =====
document.addEventListener('input', function (e) {
  if (e.target.classList.contains('is-invalid')) {
    e.target.classList.remove('is-invalid');
  }
});

// Hide back-to-top on load
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('myBtn');
  if (btn) btn.style.display = 'none';
});
