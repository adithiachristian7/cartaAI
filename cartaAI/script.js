// script.js for cartaAI

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('invitation-form');
  const input = document.getElementById('prompt-input');
  const promptButtons = document.querySelectorAll('.prompt-button');
  const loginBtn = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const loginForm = document.getElementById('login-form');
  const loginCancel = document.getElementById('login-cancel');
  const upgradeBtn = document.getElementById('upgrade-btn');
  const paymentModal = document.getElementById('payment-modal');
  const paymentCancel = document.getElementById('payment-cancel');
  const payBtn = document.getElementById('pay-btn');

  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const prompt = input.value.trim();
    if (prompt) {
      alert(`Prompt Anda: "${prompt}". Fitur AI akan segera diimplementasikan!`);
      input.value = '';
    } else {
      alert('Silakan masukkan prompt untuk undangan.');
    }
  });

  // Handle prompt button clicks
  promptButtons.forEach(button => {
    button.addEventListener('click', function() {
      const prompt = this.getAttribute('data-prompt');
      input.value = prompt;
      input.focus();
    });
  });

  // Add loading animation on submit
  form.addEventListener('submit', function() {
    const button = form.querySelector('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="animate-spin">⏳</span> Memproses...';
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  });

  // Login modal
  loginBtn.addEventListener('click', function() {
    loginModal.classList.remove('hidden');
  });

  loginCancel.addEventListener('click', function() {
    loginModal.classList.add('hidden');
  });

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
      alert(`Login berhasil untuk ${username}!`);
      loginModal.classList.add('hidden');
      loginBtn.textContent = 'Logout';
      loginBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
      loginBtn.classList.add('bg-red-600', 'hover:bg-red-700');
    } else {
      alert('Silakan isi username dan password.');
    }
  });

  // Payment modal
  upgradeBtn.addEventListener('click', function() {
    paymentModal.classList.remove('hidden');
  });

  paymentCancel.addEventListener('click', function() {
    paymentModal.classList.add('hidden');
  });

  payBtn.addEventListener('click', function() {
    const method = document.getElementById('payment-method').value;
    alert(`Pembayaran berhasil dengan metode ${method}! Fitur premium telah diaktifkan.`);
    paymentModal.classList.add('hidden');
  });

  // Close modals on outside click
  [loginModal, paymentModal].forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
});
