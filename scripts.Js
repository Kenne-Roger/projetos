document.addEventListener('DOMContentLoaded', function() {
    
    const navbar = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const heroBackground = document.querySelector('.hero-background');
    const contactForm = document.getElementById('contactForm');
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    let scrollPosition = 0;
    let ticking = false;

    function updateScrollPosition() {
        scrollPosition = window.pageYOffset;
        updateNavbar();
        updateHeroBackground();
        updateAnimations();
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    function updateNavbar() {
        if (scrollPosition > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    function updateHeroBackground() {
        const scrollPercent = scrollPosition / window.innerHeight;
        
        if (scrollPercent < 0.3) {
            heroBackground.className = 'hero-background scroll-background-1';
        } else if (scrollPercent < 0.6) {
            heroBackground.className = 'hero-background scroll-background-2';
        } else {
            heroBackground.className = 'hero-background scroll-background-3';
        }

        const parallaxSpeed = scrollPosition * 0.5;
        heroBackground.style.transform = `translateY(${parallaxSpeed}px)`;
    }

    function updateAnimations() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    function initAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .feature-item, .contact-item');
        animatedElements.forEach(element => {
            element.classList.add('fade-in');
        });
    }

    initAnimations();

    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const phoneNumber = this.getAttribute('data-number') || '5511999999999';
            let message = 'Olá! Gostaria de agendar um horário no Beauty Studio.';
            
            if (this.closest('.service-card')) {
                const serviceName = this.closest('.service-card').querySelector('.service-title').textContent;
                message = `Olá! Gostaria de agendar um horário para ${serviceName} no Beauty Studio.`;
            }
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                window.open(whatsappUrl, '_blank');
            }, 150);
        });
    });

    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        const errors = [];
        
        if (name.length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
        if (!phoneRegex.test(phone)) {
            errors.push('Telefone deve ter formato válido');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('E-mail deve ter formato válido');
        }
        
        if (message.length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }
        
        return errors;
    }

    function showFormMessage(message, isError = false) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
        messageDiv.textContent = message;
        
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 10px;
            text-align: center;
            font-weight: 500;
            background: ${isError ? '#ffebee' : '#e8f5e8'};
            color: ${isError ? '#c62828' : '#2e7d32'};
            border: 1px solid ${isError ? '#ef5350' : '#66bb6a'};
            animation: slideIn 0.3s ease;
        `;
        
        contactForm.insertBefore(messageDiv, contactForm.firstChild);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const errors = validateForm();
        
        if (errors.length > 0) {
            showFormMessage(errors.join('. '), true);
            return;
        }
        
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        
        setTimeout(() => {
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const message = formData.get('message');
            
            const whatsappMessage = `*Nova mensagem do site Beauty Studio*\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*E-mail:* ${email}\n*Mensagem:* ${message}`;
            const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;
            
            window.open(whatsappUrl, '_blank');
            
            showFormMessage('Mensagem enviada com sucesso! Você será redirecionado para o WhatsApp.');
            contactForm.reset();
            
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        }, 2000);
    });

    function addInputAnimations() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.parentElement.style.transition = 'transform 0.3s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
            
            input.addEventListener('input', function() {
                if (this.value.length > 0) {
                    this.style.borderColor = '#c2185b';
                } else {
                    this.style.borderColor = '#e0e0e0';
                }
            });
        });
    }

    addInputAnimations();

    function addHoverEffects() {
        const cards = document.querySelectorAll('.service-card, .feature-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addHoverEffects();

    function addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    addSmoothScrolling();

    function addLoadingAnimation() {
        const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
        elements.forEach((element, index) => {
            element.style.animationDelay = `${0.5 + index * 0.3}s`;
        });
    }

    addLoadingAnimation();

    function addScrollIndicator() {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '↓';
        scrollIndicator.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 2rem;
            animation: bounce 2s infinite;
            cursor: pointer;
            z-index: 1000;
            transition: opacity 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
                40% { transform: translateX(-50%) translateY(-10px); }
                60% { transform: translateX(-50%) translateY(-5px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(scrollIndicator);
        
        scrollIndicator.addEventListener('click', function() {
            document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }

    addScrollIndicator();

    function addPhoneMask() {
        const phoneInput = document.getElementById('phone');
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length >= 1) {
                value = value.replace(/(\d{0,2})/, '($1');
            }
            
            e.target.value = value;
        });
    }

    addPhoneMask();

    function addClickEffects() {
        const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addClickEffects();

    console.log('Beauty Studio - Site carregado com sucesso! ✨');
});

