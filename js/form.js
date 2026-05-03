/* ═══════════════════════════════════════════════════════
   SAMEER GHORSANE — form.js
   Sends contact form via FormSubmit AJAX,
   shows in-page success/error notice (no redirect).
═══════════════════════════════════════════════════════ */

'use strict';

const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitComment')
                    || contactForm?.querySelector('button[type="submit"]');
const formNotice  = document.getElementById('formNotice');

const nameField  = document.getElementById('cf-name');
const emailField = document.getElementById('cf-email');
const phoneField = document.getElementById('cf-phone');
const msgField   = document.getElementById('cf-msg');

function showNotice(type, message) {
  if (!formNotice) return;
  formNotice.className     = `form-notice ${type}`;
  formNotice.innerHTML     = message;
  formNotice.style.display = 'block';
  formNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideNotice() {
  if (!formNotice) return;
  formNotice.style.display = 'none';
  formNotice.className     = 'form-notice';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearForm() {
  [nameField, emailField, phoneField, msgField].forEach(f => {
    if (f) f.value = '';
  });
}

function setSubmitting(isSubmitting) {
  if (!submitBtn) return;
  submitBtn.disabled = isSubmitting;
  submitBtn.innerHTML = isSubmitting
    ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…'
    : '<i class="fa-solid fa-paper-plane"></i> Send Message';
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault(); // stop browser navigation to FormSubmit thank-you page
  hideNotice();

  const name  = nameField?.value.trim()  || '';
  const email = emailField?.value.trim() || '';
  const msg   = msgField?.value.trim()   || '';

  // Client-side validation
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

  setSubmitting(true);

  try {
    const formData = new FormData(contactForm);

    const res = await fetch(contactForm.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    const data = await res.json().catch(() => ({}));

    // FormSubmit AJAX returns { success: "true", message: "..." } on success
    const ok = res.ok && (data.success === 'true' || data.success === true);

    if (!ok) {
      const apiMsg = data.message || 'Something went wrong. Please try again or email me directly at sameerghorsane@gmail.com.';
      showNotice('error', `<i class="fa-solid fa-circle-exclamation"></i> ${apiMsg}`);
      setSubmitting(false);
      return;
    }

    clearForm();
    setSubmitting(false);

    showNotice(
      'success',
      '<i class="fa-solid fa-circle-check"></i> Thank you, ' + name.split(' ')[0] +
      '! Your message has been received and I will revert at the earliest.'
    );

  } catch (err) {
    showNotice(
      'error',
      '<i class="fa-solid fa-circle-exclamation"></i> Network error. Please check your connection and try again, or email me directly at sameerghorsane@gmail.com.'
    );
    setSubmitting(false);
  }
});

// Clear notice when user starts typing again
[nameField, emailField, phoneField, msgField].forEach(field => {
  field?.addEventListener('input', hideNotice);
});
