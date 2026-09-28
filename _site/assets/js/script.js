document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', mobileNav.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!event.target.closest('nav')) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Sticky nav shadow after scrolling
    const nav = document.querySelector('nav');
    if (nav) {
        const onScroll = () => {
            nav.classList.toggle('scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Scroll reveal animations: auto-tag content blocks, then observe
    const revealSelectors = [
        '.hero-section .group',
        '.page-header',
        '.about-section .group',
        '.service-card',
        '.timeline-item',
        '.featured-card',
        '.project-card',
        '.skills-card',
        '.edu-card',
        '.contact-section .group'
    ];
    const revealElements = document.querySelectorAll(revealSelectors.join(', '));
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach((el) => observer.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add('visible'));
    }
});
