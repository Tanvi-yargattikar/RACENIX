import { animate, scroll, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";

// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Framer Motion Hero Animations
window.addEventListener('load', () => {
    animate(".scroll-indicator", { opacity: [0, 0.5] }, { duration: 1, delay: 1.8 });
});

// Cinematic Scrollytelling - GSAP ScrollTrigger
if (window.innerWidth > 768) { 
    gsap.set(".track-container", { transformPerspective: 600, rotationX: 80, transformOrigin: "bottom center" });
    gsap.set(".grid-bottom", { transformPerspective: 600, rotationX: 60, transformOrigin: "bottom center" });
    
    const cinematicTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=150%", // Pins for 1.5x height
            pin: true,
            scrub: 1, // Smooth fluid scrubbing
        }
    });

    cinematicTl
        .to(".track-container", { scale: 1.6, y: 50, ease: "power1.inOut" }, 0)
        .to(".grid-bottom", { scale: 2, opacity: 0.1, ease: "power1.inOut" }, 0)
        .to(".f1-car-container", { scale: 1.15, y: 30, ease: "power1.inOut" }, 0)
        .to(".light-streaks", { scale: 1.2, opacity: 0.3, ease: "power1.inOut" }, 0)
        .to(".windflow-lines", { scaleX: 1.5, opacity: 0.8, ease: "power1.inOut" }, 0)
        .to(".hero-overlay", { opacity: 0.8, ease: "power1.inOut" }, 0)
        .to(".hero-content", { y: -80, opacity: 0, ease: "power2.in" }, 0)
        .to(".scroll-indicator", { y: 50, opacity: 0, ease: "power2.in" }, 0);
}

// Replaced canvas animation with CSS-based mesh gradient

// Framer Motion About Section Reveal
inView(".about", () => {
    animate(".about-content h2", { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, easing: "ease-out" });
    animate(".about-content .line", { width: [0, 60] }, { duration: 0.8, delay: 0.2, easing: "ease-out" });
    animate(".about-desc", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.4, easing: "ease-out" });
    
    animate(
        ".point-item",
        { opacity: [0, 1], y: [20, 0] },
        { delay: stagger(0.15, { startDelay: 0.5 }), duration: 0.6, easing: "ease-out" }
    );
}, { margin: "-20%" });

// Framer Motion Features Section Reveal
inView(".features", () => {
    animate(".section-header h2", { opacity: [0, 1], x: [-50, 0] }, { duration: 1, easing: "ease-out" });
    animate(".section-header .line", { width: [0, 60] }, { duration: 1, delay: 0.3, easing: "ease-out" });
    animate(".section-desc", { opacity: [0, 1] }, { duration: 1, delay: 0.4, easing: "ease-out" });
    
    animate(
        ".f-card",
        { opacity: [0, 1], y: [60, 0] },
        { delay: stagger(0.2, { startDelay: 0.2 }), duration: 0.8, easing: "ease-out" }
    );
}, { margin: "-20%" });

// 3D Tilt Effect on Feature Cards
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (!isTouchDevice && window.innerWidth >= 768) {
    document.querySelectorAll('.f-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
        });
    });
}

// Framer Motion Tech Section Reveal
inView(".tech", () => {
    animate(".visual-circle.inner", { scale: [0, 1], opacity: [0, 1] }, { duration: 1.5 });
    animate(".tech-item", { x: [-30, 0], opacity: [0, 1] }, { duration: 0.8, delay: stagger(0.2), easing: "ease-out" });
    animate(".tech-node", { scale: [0, 1], opacity: [0, 1] }, { duration: 1, delay: stagger(0.1, { startDelay: 0.5 }) });
}, { margin: "-20%" });

// Nav Bar & Progress Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.glass-nav');
    const progressBar = document.getElementById('scroll-progress');
    
    // Navbar Shrink/Blur
    if (window.scrollY > 50) {
        nav.style.padding = '0.75rem 2rem';
        nav.style.background = 'rgba(5, 5, 5, 0.95)';
    } else {
        nav.style.padding = '1.25rem 2rem';
        nav.style.background = 'rgba(5, 5, 5, 0.7)';
    }

    // Scroll Progress
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';
    }
});



// Lucide Icons Refresh
if (window.lucide) {
    lucide.createIcons();
}


