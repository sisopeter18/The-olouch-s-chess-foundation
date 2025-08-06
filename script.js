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

//mpesa integration
document.getElementById('mpesa-btn').addEventListener('click', () => {
    alert('MPESA integration is currently under development. Stay tuned for updates!');
});
// Mpesa Daraja Integration Example
document.getElementById('mpesa-pay-btn').onclick = function() {
    // Replace with your Daraja API endpoint and credentials
    const amount = prompt("Enter amount to donate via Mpesa:");
    if (!amount || isNaN(amount) || amount <= 0) return;

    fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "BusinessShortCode": "123456",
            "Password": "GENERATED_PASSWORD",
            "Timestamp": "YYYYMMDDHHMMSS",
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": "USER_PHONE_NUMBER",
            "PartyB": "123456",
            "PhoneNumber": "USER_PHONE_NUMBER",
            "CallBackURL": "https://yourdomain.com/mpesa/callback",
            "AccountReference": "MindMoveChess",
            "TransactionDesc": "Donation"
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("Mpesa STK Push initiated. Check your phone to complete the payment.");
    })
    .catch(error => {
        alert("Error initiating Mpesa payment.");
    });
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