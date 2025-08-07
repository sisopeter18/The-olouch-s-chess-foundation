document.querySelector('.nav-bar-placeholder').innerHTML = `
    <nav class="navbar">
        <!-- logo -->
        <div class="nav-logo" onclick="window.location.href = 'index.html'">
            <img src="chesslogo.png" alt="Logo">
            <span>The Olouch Chess Foundation</span>
        </div>

        <!-- Hamburger Menu Button -->
        <button class="hamburger-menu" aria-label="Toggle navigation menu">
            <i class="fas fa-bars"></i>
        </button>

        <!-- Navigation Menu (will be toggled) -->
        <div class="nav-menu">
            <div class="nav-items">
                <!-- navigation links -->
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="programs.html">Programs</a></li>
                    <li><a href="donate.html">Donate</a></li>
                </ul>
            </div>
            <!-- Auth buttons -->
            <div class="auth-buttons">
                <a href="signup.html" class="btn">Sign Up</a>
                <a href="login.html" class="btn">Login</a>
            </div>
            <div class="language-selector">
                <select id="language-select" class="btn">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ar">العربية</option>
                    <option value="pt">Português</option>
                    <option value="sw">Kiswahili</option>
                </select>
            </div>
        </div>
    </nav>
`;

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle menu visibility on hamburger click
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked (useful for single-page apps or when navigating)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Optional: Close the menu if clicked outside
    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

// on about page

// Make Sign Up button go to signup page
document.getElementById('signup-btn').onclick = function () {
    window.location.href = "signup.html";
};
// Make Login button go to login page (if you have a login.html, otherwise use signup.html for demo)
document.getElementById('login-btn').onclick = function () {
    window.location.href = "signup.html";
};

// Add a return button on signup and login pages
// This code assumes you have a button with id="return-btn" on those pages
// Example for signup.html and login.html:
// <button id="return-btn" class="btn">Return to About Us</button>
//
// Place this script on those pages:
if (document.getElementById('return-btn')) {
    document.getElementById('return-btn').onclick = function () {
        window.location.href = "about.html";
    };
}

// Simple translations for demo (expand as needed)
const translations = {
    en: {
        heroTitle: "Empowering Minds Through Chess",
        heroText: "Join us in promoting chess education, strategy, and community growth.",
        donate: "Support Our Mission",
        events: "Upcoming Events",
        puzzle: "Chess Puzzle of the Day",
        puzzleText: "Can you find the best move for White?",
        hint: "Get Hint",
        solution: "Show Solution"
    },
    fr: {
        heroTitle: "Valoriser les esprits grâce aux échecs",
        heroText: "Rejoignez-nous pour promouvoir l'éducation aux échecs, la stratégie et la croissance communautaire.",
        donate: "Soutenez notre mission",
        events: "Événements à venir",
        puzzle: "Problème d'échecs du jour",
        puzzleText: "Pouvez-vous trouver le meilleur coup pour les Blancs ?",
        hint: "Obtenir un indice",
        solution: "Voir la solution"
    },
    es: {
        heroTitle: "Empoderando mentes a través del ajedrez",
        heroText: "Únete a nosotros para promover la educación de ajedrez, la estrategia y el crecimiento comunitario.",
        donate: "Apoya nuestra misión",
        events: "Próximos eventos",
        puzzle: "Problema de ajedrez del día",
        puzzleText: "¿Puedes encontrar la mejor jugada para las blancas?",
        hint: "Obtener pista",
        solution: "Mostrar solución"
    },
    de: {
        heroTitle: "Geistige Förderung durch Schach",
        heroText: "Begleiten Sie uns bei der Förderung von Schachbildung, Strategie und Gemeinschaft.",
        donate: "Unterstützen Sie unsere Mission",
        events: "Bevorstehende Veranstaltungen",
        puzzle: "Schachrätsel des Tages",
        puzzleText: "Können Sie den besten Zug für Weiß finden?",
        hint: "Tipp erhalten",
        solution: "Lösung anzeigen"
    },
    zh: {
        heroTitle: "通过国际象棋启迪心灵",
        heroText: "加入我们，推广国际象棋教育、策略和社区发展。",
        donate: "支持我们的使命",
        events: "即将举行的活动",
        puzzle: "每日国际象棋难题",
        puzzleText: "你能找到白方的最佳着法吗？",
        hint: "获取提示",
        solution: "显示答案"
    },
    ar: {
        heroTitle: "تمكين العقول من خلال الشطرنج",
        heroText: "انضم إلينا في تعزيز تعليم الشطرنج والاستراتيجية ونمو المجتمع.",
        donate: "ادعم مهمتنا",
        events: "الأحداث القادمة",
        puzzle: "لغز الشطرنج اليومي",
        puzzleText: "هل يمكنك إيجاد أفضل نقلة للأبيض؟",
        hint: "احصل على تلميح",
        solution: "عرض الحل"
    },
    pt: {
        heroTitle: "Capacitando mentes através do xadrez",
        heroText: "Junte-se a nós para promover educação, estratégia e crescimento comunitário no xadrez.",
        donate: "Apoie nossa missão",
        events: "Próximos eventos",
        puzzle: "Desafio de xadrez do dia",
        puzzleText: "Você consegue encontrar o melhor lance para as brancas؟",
        hint: "Obter dica",
        solution: "Mostrar solução"
    },
    sw: {
        heroTitle: "Kuimarisha Akili Kupitia Chess",
        heroText: "Jiunge nasi kukuza elimu ya chess, mikakati na maendeleo ya jamii.",
        donate: "Saidia Dhamira Yetu",
        events: "Matukio Yanayokuja",
        puzzle: "Fumbo la Chess la Siku",
        puzzleText: "Je, unaweza kupata hatua bora kwa White؟",
        hint: "Pata Dokezo",
        solution: "Onyesha Suluhisho"
    }
};

function setLanguage(lang) {
    const t = translations[lang] || translations.en;
    // Update hero section
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) heroTitle.textContent = t.heroTitle;
    const heroText = document.querySelector('.hero-content p');
    if (heroText) heroText.textContent = t.heroText;
    const donateBtn = document.querySelector('.hero-content .btn');
    if (donateBtn) donateBtn.textContent = t.donate;
    // Update events section
    const eventsTitle = document.querySelector('#events h2');
    if (eventsTitle) eventsTitle.textContent = t.events;
    // Update puzzle section
    const puzzleTitle = document.querySelector('.puzzle h2');
    if (puzzleTitle) puzzleTitle.textContent = t.puzzle;
    const puzzleText = document.querySelector('.puzzle p');
    if (puzzleText) puzzleText.textContent = t.puzzleText;
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) hintBtn.textContent = t.hint;
    const solutionBtn = document.getElementById('solution-btn');
    if (solutionBtn) solutionBtn.textContent = t.solution;
}

document.getElementById('language-select').addEventListener('change', function () {
    setLanguage(this.value);
});

// Set default language on load
window.onload = function () {
    setLanguage(document.getElementById('language-select').value);
};

const slides = document.querySelectorAll('.hero-bg-slide');
let current = 0;
setInterval(() => {
    slides[current].classList.remove('active');
    slides[current].classList.add('prev');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
    slides[current].classList.remove('prev');

}, 4000);
// Mobile Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('active');
});

// Events Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.querySelector('.next-btn').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
});

document.querySelector('.prev-btn').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
});

function updateSlider() {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(-${currentSlide * 100}%)`;
    });
}

// Simple Chessboard (Interactive Puzzle)
const chessboard = document.getElementById('chessboard');
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.style.backgroundColor = (i + j) % 2 === 0 ? '#f0d9b5' : '#b58863';
        chessboard.appendChild(square);
    }
}

// Form Submissions (Simulated)
document.getElementById('donation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your donation!');
    e.target.reset();
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
    e.target.reset();
});

// Hint & Solution Buttons
document.getElementById('hint-btn').addEventListener('click', () => {
    alert('Hint: Control the center and look for a fork!');
});

document.getElementById('solution-btn').addEventListener('click', () => {
    alert('Solution: Qh5+ forces the king to move, leading to a winning position.');
});


   const axios = require('axios');
const crypto = require('crypto');

// M-Pesa Configuration
const mpesaConfig = {
  // Sandbox or Production credentials
  environment: 'sandbox', // 'sandbox' or 'production'
  
  // Sandbox credentials
  sandbox: {
    consumerKey: 'RkH13bbIBYasLSWLttEtxEneZedxppWX8P84j9muHP4v4c5e', // Replace with your sandbox consumer key
    consumerSecret: 'bgaFUkC4UASTuVSH2lqGrLgIqRkJ5VK4xP9uNkDPu4UKWZFtAzFAIlbblUVUL5tP', // Replace with your sandbox consumer secret
    shortCode: '174379', // Sandbox shortcode (Paybill or Buygoods)
    initiatorName: 'testapi', // Sandbox initiator name
    securityCredential: 'your_sandbox_security_credential', // Encrypted sandbox credential
    passKey: 'your_sandbox_passkey', // Sandbox passkey
    callbackURL: 'https://yourdomain.com/callback', // Your callback URL
    baseURL: 'https://sandbox.safaricom.co.ke',
  },
  
  // Production credentials
  production: {
    consumerKey: 'RkH13bbIBYasLSWLttEtxEneZedxppWX8P84j9muHP4v4c5e', // Replace with your production consumer key
    consumerSecret: 'bgaFUkC4UASTuVSH2lqGrLgIqRkJ5VK4xP9uNkDPu4UKWZFtAzFAIlbblUVUL5tP', // Replace with your production consumer secret
    shortCode: '174379', // Your business shortcode
    initiatorName: 'your_initiator_name', // Your initiator name
    securityCredential: 'your_production_security_credential', // Encrypted production credential
    passKey: 'your_production_passkey', // Production passkey
    callbackURL: 'https://yourdomain.com/callback', // Your production callback URL
    baseURL: 'https://api.safaricom.co.ke',
  },
  
  // Common configuration
  transactionType: 'CustomerPayBillOnline', // or 'CustomerBuyGoodsOnline'
  accountReference: 'The olouch chess foundation', // Your company name
  transactionDesc: 'Payment for services', // Transaction description
};

// Get current config based on environment
function getConfig() {
  return mpesaConfig[mpesaConfig.environment];
}

// Generate access token
async function generateAccessToken() {
  const config = getConfig();
  const consumerKey = config.consumerKey;
  const consumerSecret = config.consumerSecret;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  try {
    const response = await axios.get(`${config.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Generate security credential (for production)
function generateSecurityCredential(password) {
  const config = getConfig();
  const publicKey = `-----BEGIN PUBLIC KEY-----
  YOUR_MPESA_PUBLIC_KEY_HERE
  -----END PUBLIC KEY-----`;
  
  const buffer = Buffer.from(password, 'utf8');
  const encrypted = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, buffer);
  
  return encrypted.toString('base64');
}

// Generate timestamp in required format (YYYYMMDDHHmmss)
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Generate password for STK push
function generatePassword() {
  const config = getConfig();
  const timestamp = generateTimestamp();
  const shortCode = config.shortCode;
  const passKey = config.passKey;
  
  const concatenated = `${shortCode}${passKey}${timestamp}`;
  const buffer = Buffer.from(concatenated, 'utf8');
  return buffer.toString('base64');
}

// Lipa Na M-Pesa Online (STK Push)
async function initiateSTKPush(phone, amount, reference) {
  try {
    const accessToken = await generateAccessToken();
    const config = getConfig();
    const timestamp = generateTimestamp();
    const password = generatePassword();
    
    const requestData = {
      BusinessShortCode: config.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: mpesaConfig.transactionType,
      Amount: amount,
      PartyA: phone,
      PartyB: config.shortCode,
      PhoneNumber: phone,
      CallBackURL: config.callbackURL,
      AccountReference: reference || mpesaConfig.accountReference,
      TransactionDesc: mpesaConfig.transactionDesc,
    };
    
    const response = await axios.post(`${config.baseURL}/mpesa/stkpush/v1/processrequest`, requestData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error initiating STK Push:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// C2B Register URL
async function registerC2BUrl() {
  try {
    const accessToken = await generateAccessToken();
    const config = getConfig();
    
    const requestData = {
      ShortCode: config.shortCode,
      ResponseType: 'Completed',
      ConfirmationURL: `${config.callbackURL}/confirmation`,
      ValidationURL: `${config.callbackURL}/validation`,
    };
    
    const response = await axios.post(`${config.baseURL}/mpesa/c2b/v1/registerurl`, requestData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error registering C2B URL:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// B2C Payment
async function initiateB2CPayment(phone, amount, remarks) {
  try {
    const accessToken = await generateAccessToken();
    const config = getConfig();
    
    const requestData = {
      InitiatorName: config.initiatorName,
      SecurityCredential: config.securityCredential,
      CommandID: 'BusinessPayment', // or 'SalaryPayment', 'PromotionPayment'
      Amount: amount,
      PartyA: config.shortCode,
      PartyB: phone,
      Remarks: remarks || 'Payment',
      QueueTimeOutURL: `${config.callbackURL}/b2c/timeout`,
      ResultURL: `${config.callbackURL}/b2c/result`,
      Occasion: 'Payment',
    };
    
    const response = await axios.post(`${config.baseURL}/mpesa/b2c/v1/paymentrequest`, requestData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error initiating B2C payment:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Transaction Status Query
async function checkTransactionStatus(transactionID) {
  try {
    const accessToken = await generateAccessToken();
    const config = getConfig();
    const timestamp = generateTimestamp();
    
    const requestData = {
      Initiator: config.initiatorName,
      SecurityCredential: config.securityCredential,
      CommandID: 'TransactionStatusQuery',
      TransactionID: transactionID,
      PartyA: config.shortCode,
      IdentifierType: '4', // 1=MSISDN, 2=Till, 4=Shortcode
      ResultURL: `${config.callbackURL}/transaction/result`,
      QueueTimeOutURL: `${config.callbackURL}/transaction/timeout`,
      Remarks: 'Check transaction status',
      Occasion: 'Transaction status',
    };
    
    const response = await axios.post(`${config.baseURL}/mpesa/transactionstatus/v1/query`, requestData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error checking transaction status:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    // Example STK Push
    const stkResponse = await initiateSTKPush('254712345678', '100', 'ORDER123');
    console.log('STK Push Response:', stkResponse);
    
    // Example C2B URL registration
    // const c2bResponse = await registerC2BUrl();
    // console.log('C2B URL Registration Response:', c2bResponse);
    
    // Example B2C Payment
    // const b2cResponse = await initiateB2CPayment('254712345678', '500', 'Salary payment');
    // console.log('B2C Response:', b2cResponse);
    
    // Example Transaction Status Check
    // const statusResponse = await checkTransactionStatus('OEI2AK4Q16');
    // console.log('Transaction Status:', statusResponse);
  } catch (error) {
    console.error('Error in example usage:', error);
  }
})();
};

//call button functionality
document.getElementById('call-btn').onclick = function() {
    // This will prompt the device to start a phone call if supported
    window.location.href = "tel:+2540111231789";
};
//contactform message display
document.getElementById('contact-form').onsubmit = function(e) {
    e.preventDefault();
    document.getElementById('message-status').style.display = 'block';
    document.getElementById('message-status').textContent = "Thank you! Your message has been sent.";
    this.reset();
};

// Dynamic youth chess activities data
const programs = [
    {
        icon: "fas fa-graduation-cap",
        title: "Youth Chess Clubs",
        desc: "Weekly sessions for kids to learn and compete."
    },
    {
        icon: "fas fa-trophy",
        title: "Tournaments",
        desc: "Local & national chess competitions."
    },
    {
        icon: "fas fa-chalkboard-teacher",
        title: "Teacher Training",
        desc: "Workshops for educators to integrate chess in schools."
    },
    {
        icon: "fas fa-puzzle-piece",
        title: "Chess Puzzles & Challenges",
        desc: "Interactive puzzle sessions to boost problem-solving skills."
    },
    {
        icon: "fas fa-users",
        title: "Team Matches",
        desc: "Group competitions to encourage teamwork and strategy."
    },
    {
        icon: "fas fa-laptop",
        title: "Online Chess Camps",
        desc: "Virtual chess camps with live coaching and games."
    },
    {
        icon: "fas fa-lightbulb",
        title: "Mentorship Program",
        desc: "Pairing young players with experienced mentors for growth."
    },
    {
        icon: "fas fa-book",
        title: "Chess & Life Skills Workshops",
        desc: "Sessions combining chess learning with leadership and critical thinking."
    }
];

// Render programs dynamically
const container = document.getElementById('programs-container');
programs.forEach(program => {
    const card = document.createElement('div');
    card.className = 'program-card';
    card.innerHTML = `
        <i class="${program.icon}"></i>
        <h3>${program.title}</h3>
        <p>${program.desc}</p>
    `;
    container.appendChild(card);
});
