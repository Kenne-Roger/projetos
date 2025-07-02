// ===== BEAUTY STUDIO - JAVASCRIPT INTERATIVO =====
// Desenvolvido com JavaScript puro para máxima performance e compatibilidade

(function() {
    'use strict';

    // ===== VARIÁVEIS GLOBAIS =====
    const elements = {
        header: null,
        hamburger: null,
        navMenu: null,
        hero: null,
        contactForm: null,
        whatsappFloat: null,
        scrollIndicator: null
    };

    const state = {
        isMenuOpen: false,
        currentBackground: 1,
        isScrolling: false,
        formSubmitting: false
    };

    // ===== INICIALIZAÇÃO =====
    document.addEventListener('DOMContentLoaded', function() {
        initializeElements();
        initializeEventListeners();
        initializeAnimations();
        console.log('Beauty Studio - Site carregado com sucesso!');
    });

    // ===== INICIALIZAÇÃO DE ELEMENTOS =====
    function initializeElements() {
        elements.header = document.getElementById('header');
        elements.hamburger = document.getElementById('hamburger');
        elements.navMenu = document.querySelector('.nav-menu');
        elements.hero = document.querySelector('.hero');
        elements.contactForm = document.getElementById('contactForm');
        elements.whatsappFloat = document.getElementById('whatsappFloat');
        elements.scrollIndicator = document.querySelector('.scroll-indicator');

        // Verificar se elementos críticos existem
        if (!elements.header || !elements.hero) {
            console.error('Elementos críticos não encontrados!');
            return;
        }
    }

    // ===== EVENT LISTENERS =====
    function initializeEventListeners() {
        // Scroll Events
        window.addEventListener('scroll', throttle(handleScroll, 16)); // 60fps
        
        // Menu Mobile
        if (elements.hamburger && elements.navMenu) {
            elements.hamburger.addEventListener('click', toggleMobileMenu);
        }

        // Smooth Scroll para links internos
        document.addEventListener('click', handleSmoothScroll);

        // Formulário de Contato
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleFormSubmit);
            
            // Validação em tempo real
            const inputs = elements.contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
        }

        // Máscara para telefone
        const phoneInput = document.getElementById('telefone');
        if (phoneInput) {
            phoneInput.addEventListener('input', applyPhoneMask);
        }

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (state.isMenuOpen && !elements.navMenu.contains(e.target) && !elements.hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Redimensionamento da janela
        window.addEventListener('resize', debounce(handleResize, 250));

        // Intersection Observer para animações
        initializeIntersectionObserver();
    }

    // ===== CONTROLE DE SCROLL =====
    function handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Header com efeito de transparência
        updateHeaderOnScroll(scrollY);
        
        // Mudança de background do hero
        updateHeroBackground(scrollY);
        
        // Mostrar/esconder WhatsApp flutuante
        updateWhatsAppFloat(scrollY);
        
        // Esconder indicador de scroll
        updateScrollIndicator(scrollY);
    }

    function updateHeaderOnScroll(scrollY) {
        if (!elements.header) return;
        
        if (scrollY > 100) {
            elements.header.classList.add('scrolled');
        } else {
            elements.header.classList.remove('scrolled');
        }
    }

    function updateHeroBackground(scrollY) {
        if (!elements.hero) return;
        
        const heroHeight = elements.hero.offsetHeight;
        const scrollProgress = scrollY / heroHeight;
        
        // Mudança de background baseada no progresso do scroll
        let newBackground = 1;
        if (scrollProgress > 0.3 && scrollProgress <= 0.6) {
            newBackground = 2;
        } else if (scrollProgress > 0.6) {
            newBackground = 3;
        }
        
        if (newBackground !== state.currentBackground) {
            state.currentBackground = newBackground;
            elements.hero.className = `hero background-${newBackground}`;
        }
    }

    function updateWhatsAppFloat(scrollY) {
        if (!elements.whatsappFloat) return;
        
        if (scrollY > 300) {
            elements.whatsappFloat.style.opacity = '1';
            elements.whatsappFloat.style.visibility = 'visible';
        } else {
            elements.whatsappFloat.style.opacity = '0';
            elements.whatsappFloat.style.visibility = 'hidden';
        }
    }

    function updateScrollIndicator(scrollY) {
        if (!elements.scrollIndicator) return;
        
        if (scrollY > 100) {
            elements.scrollIndicator.style.opacity = '0';
        } else {
            elements.scrollIndicator.style.opacity = '1';
        }
    }

    // ===== MENU MOBILE =====
    function toggleMobileMenu() {
        if (state.isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        if (!elements.hamburger || !elements.navMenu) return;
        
        state.isMenuOpen = true;
        elements.hamburger.classList.add('active');
        elements.navMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    function closeMobileMenu() {
        if (!elements.hamburger || !elements.navMenu) return;
        
        state.isMenuOpen = false;
        elements.hamburger.classList.remove('active');
        elements.navMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // ===== SMOOTH SCROLL =====
    function handleSmoothScroll(e) {
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;
        
        e.preventDefault();
        const targetId = target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = elements.header ? elements.header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile se estiver aberto
            if (state.isMenuOpen) {
                closeMobileMenu();
            }
        }
    }

    // ===== VALIDAÇÃO DE FORMULÁRIO =====
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (state.formSubmitting) return;
        
        const formData = new FormData(elements.contactForm);
        const data = Object.fromEntries(formData);
        
        // Validar todos os campos
        if (!validateForm(data)) {
            showFormMessage('Por favor, corrija os erros antes de enviar.', 'error');
            return;
        }
        
        // Simular envio (integração com WhatsApp)
        submitForm(data);
    }

    function validateForm(data) {
        let isValid = true;
        
        // Validar nome
        if (!data.nome || data.nome.trim().length < 2) {
            showFieldError('nome', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }
        
        // Validar telefone
        if (!data.telefone || !isValidPhone(data.telefone)) {
            showFieldError('telefone', 'Telefone inválido');
            isValid = false;
        }
        
        // Validar email
        if (!data.email || !isValidEmail(data.email)) {
            showFieldError('email', 'E-mail inválido');
            isValid = false;
        }
        
        // Validar serviço
        if (!data.servico) {
            showFieldError('servico', 'Selecione um serviço');
            isValid = false;
        }
        
        return isValid;
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        clearFieldError(field.id);
        
        switch (field.id) {
            case 'nome':
                if (value.length > 0 && value.length < 2) {
                    showFieldError('nome', 'Nome deve ter pelo menos 2 caracteres');
                }
                break;
            case 'telefone':
                if (value.length > 0 && !isValidPhone(value)) {
                    showFieldError('telefone', 'Formato: (11) 99999-9999');
                }
                break;
            case 'email':
                if (value.length > 0 && !isValidEmail(value)) {
                    showFieldError('email', 'E-mail inválido');
                }
                break;
        }
    }

    function clearFieldError(fieldId) {
        const field = typeof fieldId === 'string' ? document.getElementById(fieldId) : fieldId;
        if (!field) return;
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        clearFieldError(fieldId);
        
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '5px';
        errorElement.style.display = 'block';
        
        field.parentNode.appendChild(errorElement);
    }

    function submitForm(data) {
        state.formSubmitting = true;
        const submitButton = elements.contactForm.querySelector('.form-submit');
        const originalText = submitButton.innerHTML;
        
        // Mostrar loading
        submitButton.innerHTML = '<span>Enviando...</span>';
        submitButton.disabled = true;
        elements.contactForm.classList.add('loading');
        
        // Simular delay de envio
        setTimeout(() => {
            // Criar mensagem para WhatsApp
            const message = createWhatsAppMessage(data);
            const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
            
            // Abrir WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Resetar formulário
            elements.contactForm.reset();
            showFormMessage('Redirecionando para o WhatsApp...', 'success');
            
            // Restaurar botão
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            elements.contactForm.classList.remove('loading');
            state.formSubmitting = false;
            
            // Tracking
            trackWhatsAppClick('form-submit');
            
        }, 1500);
    }

    function createWhatsAppMessage(data) {
        return `🌸 *AGENDAMENTO - BEAUTY STUDIO* 🌸

👤 *Nome:* ${data.nome}
📱 *Telefone:* ${data.telefone}
📧 *E-mail:* ${data.email}
💅 *Serviço:* ${getServiceName(data.servico)}

${data.mensagem ? `💬 *Mensagem:* ${data.mensagem}` : ''}

Gostaria de agendar um horário! 😊`;
    }

    function getServiceName(serviceValue) {
        const services = {
            'cabeleireiro': 'Cabeleireiro',
            'manicure': 'Manicure & Pedicure',
            'maquiagem': 'Maquiagem',
            'estetica': 'Estética Facial',
            'sobrancelhas': 'Design de Sobrancelhas',
            'massagem': 'Massagem Relaxante',
            'multiplos': 'Múltiplos Serviços'
        };
        return services[serviceValue] || serviceValue;
    }

    function showFormMessage(message, type) {
        // Remover mensagem anterior
        const existingMessage = elements.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.padding = '15px';
        messageElement.style.borderRadius = '8px';
        messageElement.style.marginTop = '20px';
        messageElement.style.textAlign = 'center';
        messageElement.style.fontWeight = '600';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.border = '1px solid #c3e6cb';
        } else {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
        }
        
        elements.contactForm.appendChild(messageElement);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    // ===== MÁSCARA DE TELEFONE =====
    function applyPhoneMask(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        }
        
        e.target.value = value;
    }

    // ===== VALIDAÇÕES =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // ===== TRACKING WHATSAPP =====
    window.trackWhatsAppClick = function(source) {
        console.log(`WhatsApp clicado - Origem: ${source}`);
        
        // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'engagement',
                'event_label': source
            });
        }
        
        // Salvar no localStorage para analytics
        const clicks = JSON.parse(localStorage.getItem('whatsapp_clicks') || '[]');
        clicks.push({
            source: source,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
        localStorage.setItem('whatsapp_clicks', JSON.stringify(clicks));
    };

    // ===== INTERSECTION OBSERVER PARA ANIMAÇÕES =====
    function initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos que devem ser animados
        const animatedElements = document.querySelectorAll('.service-card, .contact-item, .about-img');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ===== REDIMENSIONAMENTO =====
    function handleResize() {
        // Fechar menu mobile se a tela ficar grande
        if (window.innerWidth > 768 && state.isMenuOpen) {
            closeMobileMenu();
        }
        
        // Recalcular posições se necessário
        if (elements.whatsappFloat) {
            updateWhatsAppFloat(window.pageYOffset);
        }
    }

    // ===== ANIMAÇÕES INICIAIS =====
    function initializeAnimations() {
        // Adicionar classes CSS para animações
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            .field-error {
                animation: slideDown 0.3s ease;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .form-input.error,
            .form-select.error,
            .form-textarea.error {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== UTILITÁRIOS =====
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== EASTER EGG =====
    let clickCount = 0;
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-logo')) {
            clickCount++;
            if (clickCount === 5) {
                console.log('🌸 Beauty Studio - Desenvolvido com amor e dedicação! 🌸');
                clickCount = 0;
            }
        }
    });

    // ===== PERFORMANCE MONITORING =====
    window.addEventListener('load', function() {
        // Medir performance
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Site carregado em ${loadTime}ms`);
        }
    });

    // ===== FALLBACKS PARA NAVEGADORES ANTIGOS =====
    if (!window.IntersectionObserver) {
        // Fallback para navegadores sem suporte ao Intersection Observer
        const animatedElements = document.querySelectorAll('.service-card, .contact-item, .about-img');
        animatedElements.forEach(el => {
            el.classList.add('animate-in');
        });
    }

    if (!Element.prototype.closest) {
        // Polyfill para closest()
        Element.prototype.closest = function(s) {
            var el = this;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

})();

// ===== FUNÇÕES GLOBAIS EXPOSTAS =====
window.BeautyStudio = {
    // API pública para interações externas
    openWhatsApp: function(message = '') {
        const url = `https://wa.me/5511999999999${message ? `?text=${encodeURIComponent(message)}` : ''}`;
        window.open(url, '_blank');
        trackWhatsAppClick('api-call');
    },
    
    scrollToSection: function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            window.scrollTo({
                top: element.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    },
    
    getAnalytics: function() {
        return {
            whatsappClicks: JSON.parse(localStorage.getItem('whatsapp_clicks') || '[]'),
            pageViews: localStorage.getItem('page_views') || 0
        };
    }
};

// ===== ANALYTICS BÁSICO =====
(function() {
    // Contar visualizações de página
    const pageViews = parseInt(localStorage.getItem('page_views') || '0') + 1;
    localStorage.setItem('page_views', pageViews.toString());
    
    // Registrar sessão
    const sessionData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        page: window.location.pathname
    };
    
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    sessions.push(sessionData);
    
    // Manter apenas as últimas 50 sessões
    if (sessions.length > 50) {
        sessions.splice(0, sessions.length - 50);
    }
    
    localStorage.setItem('sessions', JSON.stringify(sessions));
})();

