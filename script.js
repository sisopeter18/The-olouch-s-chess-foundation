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