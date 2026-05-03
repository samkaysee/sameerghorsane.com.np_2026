/* ═══════════════════════════════════════════════════════
   SAMEER GHORSANE — form.js
   Contact form handler — stores locally, shows clean feedback
═══════════════════════════════════════════════════════ */

'use strict';

const submitBtn  = document.getElementById('submitComment');
const formNotice = document.getElementById('formNotice');

const nameField  = document.getElementById('cf-name');
const emailField = document.getElementById('cf-email');
const phoneField = document.getElementById('cf-phone');
const msgField   = document.getElementById('cf-msg');

function showNotice(type, message) {
  if (!formNotice) return;
  formNotice.className  = `form-notice ${type}`;
  formNotice.innerHTML  = message;
  formNotice.style.display = 'block';
  formNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideNotice() {
  if (!formNotice) return;
  formNotice.style.display = 'none';
  formNotice.className = 'form-notice';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearForm() {
  [nameField, emailField, phoneField, msgField].forEach(f => {
    if (f) f.value = '';
  });
}

function saveSubmission(data) {
  try {
    const existing = JSON.parse(localStorage.getItem('sg_contact_submissions') || '[]');
    existing.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem('sg_contact_submissions', JSON.stringify(existing));
  } catch (_) {
    // Storage unavailable — silently continue
  }
}

submitBtn?.addEventListener('click', () => {
  hideNotice();

  const name  = nameField?.value.trim()  || '';
  const email = emailField?.value.trim() || '';
  const phone = phoneField?.value.trim() || '';
  const msg   = msgField?.value.trim()   || '';

  // Validation
  if (!name) {
    showNotice('error', '<i class="fa-solid fa-circle-exclamation"></i> Please enter your full name.');
    nameField?.focus();
    return;
  }
  if (!email || !validateEmail(email)) {
    showNotice('error', '<i class="fa-solid fa-circle-exclamation"></i> Please enter a valid email address.');
    emailField?.focus();
    return;
  }
  if (!msg) {
    showNotice('error', '<i class="fa-solid fa-circle-exclamation"></i> Please write a message before sending.');
    msgField?.focus();
    return;
  }

  // Save locally
  saveSubmission({ name, email, phone, message: msg });

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';

  // Simulate brief delay for UX
  setTimeout(() => {
    clearForm();
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';

    showNotice(
      'success',
      '<i class="fa-solid fa-circle-check"></i> Thank you, ' + name.split(' ')[0] + '! Your message has been received. I will be in touch within one business day.'
    );
  }, 900);
});

// Clear notice when user starts typing again
[nameField, emailField, phoneField, msgField].forEach(field => {
  field?.addEventListener('input', hideNotice);
});
