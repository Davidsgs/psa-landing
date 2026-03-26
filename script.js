document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. Scroll Experience: Logo & Header
    // ==========================================
    const header = document.getElementById("main-header");
    const scrollWrapper = document.getElementById("scroll-wrapper");

    // We get the original logo in the hero and the target container in the nav
    const logoHeroWrapper = document.getElementById("hero-logo-wrapper");
    const animatedLogo = document.getElementById("animated-logo");
    const navLogoContainer = document.getElementById("nav-logo-container");

    // Configuration Constants
    const SCROLL_DURATION = 100; // Duration of section transition in ms
    const BUSINESS_PHONE_NUMBER = "5491130144852";

    let isHeaderVisible = false;

    if (scrollWrapper) {
        // Listen to scroll events to animate header appearance
        scrollWrapper.addEventListener("scroll", () => {
            const scrollPosition = scrollWrapper.scrollTop;

            // Trigger threshold: when scrolled past 150px
            const threshold = 150;

            if (scrollPosition > threshold) {
                if (!isHeaderVisible) {
                    header.classList.add("visible");
                    isHeaderVisible = true;
                }
            } else {
                if (isHeaderVisible) {
                    header.classList.remove("visible");
                    isHeaderVisible = false;
                }
            }
        });

        // ==========================================
        // 2. Custom One-Time Smooth Scrolling
        // ==========================================
        const sections = Array.from(document.querySelectorAll("section, .footer"));
        let isScrolling = false;
        let startY = 0;

        function smoothScrollTo(targetPosition, duration = SCROLL_DURATION) {
            isScrolling = true;
            const startPosition = scrollWrapper.scrollTop;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                // Easing (easeInOutCubic)
                const ease = progress < 0.5 ? 4 * progress * Math.pow(progress, 2) : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                scrollWrapper.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    setTimeout(() => { isScrolling = false; }, 300); // 300ms cooldown
                }
            }
            requestAnimationFrame(animation);
        }

        function getNextSectionIndex(direction) {
            const currentPos = scrollWrapper.scrollTop;
            let currentIndex = 0;
            let minDiff = Infinity;

            sections.forEach((sec, index) => {
                const diff = Math.abs(sec.offsetTop - currentPos);
                if (diff < minDiff) {
                    minDiff = diff;
                    currentIndex = index;
                }
            });

            if (direction === 1 && currentIndex < sections.length - 1) {
                return currentIndex + 1;
            } else if (direction === -1 && currentIndex > 0) {
                return currentIndex - 1;
            }
        }

        function isMobile() {
            return window.innerWidth < 768;
        }

        // Wheel events (Desktop)
        scrollWrapper.addEventListener("wheel", (e) => {
            if (isMobile()) return; // Allow native scrolling on mobile dimensions
            if (e.target.tagName.toLowerCase() === 'textarea') return;

            e.preventDefault();
            if (isScrolling) return;

            const direction = e.deltaY > 0 ? 1 : -1;
            const nextIndex = getNextSectionIndex(direction);
            smoothScrollTo(sections[nextIndex].offsetTop);
        }, { passive: false });

        // Touch events (Mobile)
        scrollWrapper.addEventListener("touchstart", (e) => {
            if (isMobile()) return;
            if (e.target.tagName.toLowerCase() === 'textarea') return;
            startY = e.touches[0].clientY;
        }, { passive: true });

        scrollWrapper.addEventListener("touchmove", (e) => {
            if (isMobile()) return;
            if (e.target.tagName.toLowerCase() === 'textarea') return;
            e.preventDefault(); // Prevents native drag scrolling
        }, { passive: false });

        scrollWrapper.addEventListener("touchend", (e) => {
            if (isMobile()) return;
            if (e.target.tagName.toLowerCase() === 'textarea') return;
            if (isScrolling) return;

            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;

            if (Math.abs(diff) > 30) {
                const direction = diff > 0 ? 1 : -1;
                const nextIndex = getNextSectionIndex(direction);
                smoothScrollTo(sections[nextIndex].offsetTop);
            }
        }, { passive: true });

        // Keyboard events (Desktop)
        document.addEventListener("keydown", (e) => {
            if (isMobile()) return;
            // Don't interfere if user is typing in a form field
            const tagName = e.target.tagName.toLowerCase();
            if (tagName === 'textarea' || tagName === 'input') return;

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                if (isScrolling) return;

                const direction = e.key === "ArrowDown" ? 1 : -1;
                const nextIndex = getNextSectionIndex(direction);
                if (nextIndex !== undefined) {
                    smoothScrollTo(sections[nextIndex].offsetTop);
                }
            }
        });

        // Update Nav links to use Custom Scroll
        const navLinks = document.querySelectorAll("nav a, .hero-buttons a, .scroll-indicator");
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                let href = link.getAttribute("href");

                // If it's the scroll indicator, target the next section (Nosotros)
                if (link.classList.contains('scroll-indicator')) {
                    href = "#servicios";
                }

                if (href && href.startsWith("#")) {
                    const targetSec = document.querySelector(href);
                    if (targetSec) {
                        if (isMobile()) {
                            // If mobile, let native browser hash navigation handle it but smooth
                            targetSec.scrollIntoView({ behavior: 'smooth' });
                            e.preventDefault();
                        } else if (!isScrolling) {
                            e.preventDefault();
                            smoothScrollTo(targetSec.offsetTop);
                        }
                    }
                }
            });
        });

        // ==========================================
        // 2.5. Dot Navigation (Scroll Spy)
        // ==========================================
        const dots = document.querySelectorAll('.dot-nav .dot');
        const dotIndicator = document.getElementById('dot-indicator');
        const dotNav = document.getElementById('dot-nav');

        function updateDotNavigation() {
            if (!dotIndicator || dots.length === 0) return;

            let currentIndex = 0;
            let minDiff = Infinity;
            const currentPos = scrollWrapper.scrollTop;

            // Find which section is currently focused (nearest)
            sections.forEach((sec, index) => {
                const diff = Math.abs(sec.offsetTop - currentPos);
                if (diff < minDiff) {
                    minDiff = diff;
                    currentIndex = index;
                }
            });

            // Map index to dot (e.g. if we are in footer, keep last dot active)
            const dotIndex = Math.min(currentIndex, dots.length - 1);

            // Update dots
            dots.forEach((dot, index) => {
                if (index === dotIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Animate indicator circle
            const activeDot = dots[dotIndex];
            if (activeDot) {
                const parentLi = activeDot.parentElement;
                const topPos = parentLi.offsetTop + (parentLi.offsetHeight / 2);
                dotIndicator.style.transform = `translateY(${topPos}px)`;
            }

            // Invert colors if the current section is bright
            if (sections[currentIndex] && ['nosotros', 'contacto'].includes(sections[currentIndex].id)) {
                dotNav.classList.add('light-mode');
            } else {
                dotNav.classList.remove('light-mode');
            }
        }

        // Initialize and listen
        setTimeout(updateDotNavigation, 100);
        scrollWrapper.addEventListener('scroll', updateDotNavigation, { passive: true });

        // ==========================================
        // 3. Scroll Reveal Animations (Intersection Observer)
        // ==========================================
        const observerOptions = {
            root: scrollWrapper,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target); // Animate only once
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // ==========================================
    // 4. Portfolio Swiper Carousel Initialization
    // ==========================================
    const swiperContainer = document.querySelector('.multiple-slide-carousel');
    if (swiperContainer) {
        new Swiper('.multiple-slide-carousel', {
            loop: true,
            slidesPerView: 1.2,
            centeredSlides: true,
            spaceBetween: 16,
            navigation: {
                nextEl: '.portfolio-carousel-container .swiper-button-next',
                prevEl: '.portfolio-carousel-container .swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    centeredSlides: false,
                    spaceBetween: 24
                },
                1024: {
                    slidesPerView: 3,
                    centeredSlides: false,
                    spaceBetween: 32
                },
                1280: {
                    slidesPerView: 4,
                    centeredSlides: false,
                    spaceBetween: 32
                }
            }
        });
    }

    // ==========================================
    // 5. Contact Form Interception (WhatsApp)
    // ==========================================
    const wpForm = document.getElementById("whatsapp-form");

    if (wpForm) {
        wpForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Extract form values
            const nombre = document.getElementById("nombre").value.trim();
            const servicio = document.getElementById("servicio").value;
            const consulta = document.getElementById("consulta").value.trim();

            if (!nombre || !servicio || !consulta) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            // Construct template message
            const rawMessage = `¡Hola, equipo de PAS! Mi nombre es ${nombre}. Quisiera saber más sobre ${servicio}. ${consulta}`;

            // URL Encode the message
            const encodedMessage = encodeURIComponent(rawMessage);

            // Construct Full WhatsApp URL
            const whatsappUrl = `https://wa.me/${BUSINESS_PHONE_NUMBER}?text=${encodedMessage}`;

            // Open in new tab
            window.open(whatsappUrl, "_blank");

            // Optional: reset form after sending
            wpForm.reset();
            const nombreCount = document.getElementById("nombre-count");
            const consultaCount = document.getElementById("consulta-count");
            if (nombreCount) nombreCount.textContent = "0";
            if (consultaCount) consultaCount.textContent = "0";
        });

        // 5. Character Counters logic
        const nombreInput = document.getElementById("nombre");
        const nombreCount = document.getElementById("nombre-count");
        if (nombreInput && nombreCount) {
            nombreInput.addEventListener("input", function () {
                nombreCount.textContent = this.value.length;
            });
        }

        const consultaTextarea = document.getElementById("consulta");
        const consultaCount = document.getElementById("consulta-count");
        if (consultaTextarea && consultaCount) {
            consultaTextarea.addEventListener("input", function () {
                consultaCount.textContent = this.value.length;
            });
        }
    }

    // ==========================================
    // 6. Image Modal Logic (Portfolio)
    // ==========================================
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (imageModal && modalImage && closeModalBtn) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', function () {
                const img = this.querySelector('img');
                if (img) {
                    modalImage.src = img.src;
                    imageModal.classList.add('show');
                    modalImage.classList.remove('zoomed');
                }
            });
        });

        const wrapper = document.getElementById('modal-content-wrapper');

        let isDragging = false;
        let startX, startY;
        let translateX = 0, translateY = 0;
        let initialTranslateX = 0, initialTranslateY = 0;
        const ZOOM_SCALE = 2.5;
        let hasDragged = false;

        // Mouse and Touch events for drag-to-pan via CSS Transforms (solves all native overflow layout bugs)
        if (wrapper) {
            const startDrag = (e) => {
                if (!modalImage.classList.contains('zoomed')) return;
                isDragging = true;
                hasDragged = false;

                modalImage.classList.add('dragging');

                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

                startX = clientX;
                startY = clientY;
                initialTranslateX = translateX;
                initialTranslateY = translateY;
            };

            const endDrag = () => {
                if (isDragging) {
                    isDragging = false;
                    modalImage.classList.remove('dragging');
                }
            };

            const doDrag = (e) => {
                if (!isDragging) return;

                // Only preventDefault on touchmove to stop page scrolling,
                // but we also prevent default on mousemove to avoid selecting text/ghost dragging.
                if (e.cancelable) e.preventDefault();

                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

                const moveX = clientX - startX;
                const moveY = clientY - startY;

                if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
                    hasDragged = true;
                }

                translateX = initialTranslateX + moveX;
                translateY = initialTranslateY + moveY;

                // Calculate pixel-perfect screen bounds
                const scaledWidth = modalImage.clientWidth * ZOOM_SCALE;
                const scaledHeight = modalImage.clientHeight * ZOOM_SCALE;

                // We only allow dragging if the scaled image is bigger than the screen.
                const boundX = Math.max(0, (scaledWidth - wrapper.clientWidth) / 2);
                const boundY = Math.max(0, (scaledHeight - wrapper.clientHeight) / 2);

                translateX = Math.max(-boundX, Math.min(boundX, translateX));
                translateY = Math.max(-boundY, Math.min(boundY, translateY));

                // apply translate FIRST then scale so values are in raw screen pixels
                modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${ZOOM_SCALE})`;
            };

            // Mouse bindings
            wrapper.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e); });
            wrapper.addEventListener('mousemove', doDrag);
            wrapper.addEventListener('mouseup', endDrag);
            wrapper.addEventListener('mouseleave', endDrag);

            // Touch bindings 
            // passive: false on touchmove is required to allow e.preventDefault() which blocks browser pull-to-refresh / scrolling
            wrapper.addEventListener('touchstart', startDrag, { passive: true });
            wrapper.addEventListener('touchmove', doDrag, { passive: false });
            wrapper.addEventListener('touchend', endDrag);
            wrapper.addEventListener('touchcancel', endDrag);
        }

        // Close on X button
        closeModalBtn.addEventListener('click', () => {
            imageModal.classList.remove('show');
            modalImage.classList.remove('zoomed');
            modalImage.style.transform = '';
            translateX = 0; translateY = 0;
        });

        // Close on background click
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.classList.contains('modal-content-wrapper')) {
                if (hasDragged) {
                    hasDragged = false;
                    return;
                }
                imageModal.classList.remove('show');
                modalImage.classList.remove('zoomed');
                modalImage.style.transform = '';
                translateX = 0; translateY = 0;
            }
        });

        // Toggle zoom on image click
        modalImage.addEventListener('click', () => {
            if (hasDragged) {
                hasDragged = false; // Reset for next time
                return;
            }

            modalImage.classList.toggle('zoomed');

            if (modalImage.classList.contains('zoomed')) {
                translateX = 0;
                translateY = 0;
                modalImage.style.transform = `translate(0px, 0px) scale(${ZOOM_SCALE})`;
            } else {
                translateX = 0;
                translateY = 0;
                modalImage.style.transform = '';
            }
        });
    }

});
