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

  // Redirect to pay.html when MetaMask is selected
  const paymentMethodSelect = document.getElementById('payment-method');
  paymentMethodSelect.addEventListener('change', function() {
    if (this.value === 'ewallet') {
      window.location.href = 'pay.html';
    }
  });

  // MetaMask integration functions
  async function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  }

  async function connectMetaMask() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      throw new Error('Koneksi MetaMask dibatalkan atau gagal.');
    }
  }

  async function sendMetaMaskPayment() {
    if (!await isMetaMaskInstalled()) {
      alert('MetaMask tidak terdeteksi. Silakan instal MetaMask terlebih dahulu.');
      return false;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const from = accounts[0];
      const transactionParameters = {
        to: '0xYourMetaMaskWalletAddressHere', // Ganti dengan alamat tujuan pembayaran
        from: from,
        value: '0x' + (50000 * 1000000000000000).toString(16), // Contoh nilai 0.05 ETH dalam wei (ubah sesuai kebutuhan)
      };
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      return true;
    } catch (error) {
      alert('Pembayaran MetaMask gagal: ' + error.message);
      return false;
    }
  }

  payBtn.addEventListener('click', async function() {
    const method = document.getElementById('payment-method').value;
    if (method === 'ewallet') {
      // Redirect to pay.html for MetaMask payment
      window.location.href = 'pay.html';
    } else {
      alert(`Pembayaran berhasil dengan metode ${method}! Fitur premium telah diaktifkan.`);
      paymentModal.classList.add('hidden');
    }
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
