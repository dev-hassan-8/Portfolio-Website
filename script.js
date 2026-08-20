/* ============================================================
   Portfolio Script — Muhammad Hassan Amin
   ============================================================ */

'use strict';

/* ---- Navbar: scroll effect + active link ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Add scrolled class for glass effect
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

/* ---- Mobile Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

/* ---- Typing Animation ---- */
const typedEl = document.getElementById('typed-text');
const phrases = [
    'Full-Stack Developer.',
    'React.js Specialist.',
    'Frontend Engineer.',
    'Python & Backend Developer.',
    'UI/UX Designer.',
    'Software Engineer.'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
    }

    typingTimeout = setTimeout(typeLoop, delay);
}
typeLoop();

/* ---- Counter Animation ---- */
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

/* ---- Intersection Observer for reveal + skills + counters ---- */
const revealEls = document.querySelectorAll('.reveal');
const skillFills = document.querySelectorAll('.skill-fill');
const statNums = document.querySelectorAll('.stat-num');

let statsAnimated = false;
let skillsAnimated = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Reveal animation
        if (entry.target.classList.contains('reveal')) {
            entry.target.classList.add('visible');
        }

        // Stats counters — trigger once when stats row is visible
        if (entry.target.id === 'stats-row' && !statsAnimated) {
            statsAnimated = true;
            statNums.forEach(el => animateCounter(el));
        }

        // Skill bars — trigger once when skills section is visible
        if (entry.target.id === 'skills-list' && !skillsAnimated) {
            skillsAnimated = true;
            skillFills.forEach(fill => {
                fill.style.width = fill.getAttribute('data-width') + '%';
            });
        }
    });
}, { threshold: 0.2 });

// Observe reveal elements
revealEls.forEach(el => observer.observe(el));

// Observe stats row & skills list
const statsRow = document.getElementById('stats-row');
const skillsList = document.getElementById('skills-list');
if (statsRow) observer.observe(statsRow);
if (skillsList) observer.observe(skillsList);

/* ---- Add reveal class to section children dynamically ---- */
document.querySelectorAll('.service-card, .project-card, .contact-card, .timeline-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
});

document.querySelectorAll('.about-image-wrap, .about-text, .section-tag, .section-title, .section-subtitle').forEach(el => {
    el.classList.add('reveal');
});

// Re-observe after adding classes
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---- Project Filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeSlideUp 0.4s ease both';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    const subject = document.getElementById('subject-input').value.trim();
    const message = document.getElementById('message-input').value.trim();

    if (!name || !email || !subject || !message) return;

    // Simulate sending (visual feedback)
    const submitBtn = document.getElementById('form-submit');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
        formSuccess.classList.add('visible');
        contactForm.reset();
        submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
        submitBtn.disabled = false;

        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    }, 1200);
});

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ---- AOS Animation Initialization ---- */
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: false,
        offset: 50,
    });
}

/* ---- Cursor Spotlight Follower (Framer-Motion style) ---- */
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* ---- 3D Card Tilt Micro-Interaction ---- */
const tiltCards = document.querySelectorAll('.project-card, .service-card, .timeline-card, .contact-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ---- Magnetic Button Hover Effect ---- */
const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-contact, .social-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ---- Theme toggle (decorative) ---- */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
let isDark = true;

if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        themeIcon.textContent = isDark ? '☀️' : '🌙';
        document.body.style.setProperty('--bg-primary', isDark ? '#0d0718' : '#13092a');
        document.body.style.setProperty('--bg-secondary', isDark ? '#110c20' : '#170d2e');
    });
}
