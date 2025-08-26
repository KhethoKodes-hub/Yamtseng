/**
 * Yamtseng SA (PTY) LTD - Global JavaScript
 * Common functionality for all website pages
 */

// Global Variables
let isScrolling = false;
let currentPage = '';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGlobalFeatures();
    detectCurrentPage();
    initializePageSpecificFeatures();
});

/**
 * Initialize global features that work on all pages
 */
function initializeGlobalFeatures() {
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Scroll animations
    initScrollAnimations();
    
    // Navbar effects
    initNavbarEffects();
    
    // Interactive sparkle effects
    initSparkleEffects();
    
    // Loading animations
    initLoadingAnimations();
    
    // Responsive utilities
    initResponsiveUtilities();
    
    // Accessibility features
    initAccessibilityFeatures();
    
    // Performance optimizations
    initPerformanceOptimizations();
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add staggered animation for multiple elements
                if (entry.target.classList.contains('stagger')) {
                    const delay = Math.random() * 200;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                }
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .stagger').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Navbar dynamic effects
 */
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Background change on scroll
        if (scrollTop > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(44, 90, 160, 0.95), rgba(44, 62, 80, 0.95))';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.classList.add('scrolled');
        } else {
            navbar.style.background = 'linear-gradient(135deg, var(--primary-color), var(--dark-color))';
            navbar.style.backdropFilter = 'none';
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 100));
}

/**
 * Interactive sparkle effects
 */
function initSparkleEffects() {
    let sparkleCount = 0;
    const maxSparkles = 5;
    
    document.addEventListener('mousemove', throttle((e) => {
        if (sparkleCount >= maxSparkles) return;
        
        // Only create sparkles on certain elements
        const target = e.target.closest('.service-card, .value-card, .story-card, .btn-custom, .hero');
        if (!target) return;
        
        createSparkle(e.clientX, e.clientY);
    }, 100));
    
    function createSparkle(x, y) {
        sparkleCount++;
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #f39c12;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            opacity: 0.7;
            animation: sparkle 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
            sparkleCount--;
        }, 1000);
    }
    
    // Add sparkle animation CSS
    if (!document.querySelector('#sparkle-styles')) {
        const style = document.createElement('style');
        style.id = 'sparkle-styles';
        style.textContent = `
            @keyframes sparkle {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 0.7;
                }
                50% {
                    transform: scale(1) rotate(180deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(0) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Loading animations for page transitions
 */
function initLoadingAnimations() {
    // Fade in body content
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        
        // Trigger entrance animations
        setTimeout(() => {
            document.querySelectorAll('.hero-content, .navbar-brand').forEach(el => {
                el.style.animation = 'fadeInUp 1s ease-out';
            });
        }, 200);
    });
}

/**
 * Detect current page for specific functionality
 */
function detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    if (filename.includes('about') || document.querySelector('.about-hero')) {
        currentPage = 'about';
    } else if (filename.includes('services') || document.querySelector('.services-hero')) {
        currentPage = 'services';
    } else if (filename.includes('contact') || document.querySelector('.contact-hero')) {
        currentPage = 'contact';
    } else {
        currentPage = 'home';
    }
    
    // Add page-specific class to body
    document.body.classList.add(`page-${currentPage}`);
}

/**
 * Initialize page-specific features
 */
function initializePageSpecificFeatures() {
    switch(currentPage) {
        case 'home':
            initHomePageFeatures();
            break;
        case 'about':
            initAboutPageFeatures();
            break;
        case 'services':
            initServicesPageFeatures();
            break;
        case 'contact':
            initContactPageFeatures();
            break;
    }
}

/**
 * Home page specific features
 */
function initHomePageFeatures() {
    // Hero animation sequence
    const heroElements = document.querySelectorAll('.hero h1, .hero .lead, .hero .btn');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200 + 500);
    });
    
    // Stat counter animation
    initStatCounters();
    
    // Service preview hover effects
    initServicePreview();
}

/**
 * About page specific features
 */
function initAboutPageFeatures() {
    // Timeline animations
    initTimelineAnimations();
    
    // Value card interactions
    initValueCardInteractions();
    
    // Leader card animations
    initLeaderCardAnimations();
    
    // Mission/Vision card effects
    initMissionVisionEffects();
}

/**
 * Services page specific features
 */
function initServicesPageFeatures() {
    // Service filtering
    initServiceFiltering();
    
    // Service card advanced interactions
    initAdvancedServiceCards();
    
    // Service comparison
    initServiceComparison();
    
    // Quote request functionality
    initQuoteRequests();
}

/**
 * Contact page specific features
 */
function initContactPageFeatures() {
    // Contact form validation
    initContactFormValidation();
    
    // Map interactions
    initMapFeatures();
    
    // Office hours display
    initOfficeHours();
}

/**
 * Animated stat counters
 */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, '')) || 100;
        const isPercentage = counter.textContent.includes('%');
        const isYear = counter.textContent.includes('20');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, target, isPercentage, isYear);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function animateCounter(element, target, isPercentage = false, isYear = false) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (isPercentage) {
            element.textContent = displayValue + '%';
        } else if (isYear) {
            element.textContent = displayValue;
        } else {
            element.textContent = displayValue + '+';
        }
    }, stepTime);
}

/**
 * Timeline animations for about page
 */
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-timeline');
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(item);
    });
}

/**
 * Service filtering functionality
 */
function initServiceFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceItems = document.querySelectorAll('.service-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter services
            serviceItems.forEach((item, index) => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Advanced service card interactions
 */
function initAdvancedServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
        
        // Click to expand details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.service-btn')) {
                toggleServiceDetails(card);
            }
        });
    });
}

/**
 * Toggle service details
 */
function toggleServiceDetails(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other expanded cards
    document.querySelectorAll('.service-card.expanded').forEach(c => {
        if (c !== card) {
            c.classList.remove('expanded');
        }
    });
    
    if (!isExpanded) {
        card.classList.add('expanded');
        // Add detailed content if needed
        showServiceModal(card);
    } else {
        card.classList.remove('expanded');
    }
}

/**
 * Show service modal
 */
function showServiceModal(card) {
    const title = card.querySelector('.service-title').textContent;
    const description = card.querySelector('.service-description').textContent;
    
    // Create modal if it doesn't exist
    let modal = document.querySelector('#serviceModal');
    if (!modal) {
        modal = createServiceModal();
        document.body.appendChild(modal);
    }
    
    // Update modal content
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-body p').textContent = description;
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/**
 * Create service modal
 */
function createServiceModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'serviceModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p></p>
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Key Features:</h6>
                            <ul class="list-unstyled">
                                <li><i class="fas fa-check text-success me-2"></i>Professional Quality</li>
                                <li><i class="fas fa-check text-success me-2"></i>Timely Delivery</li>
                                <li><i class="fas fa-check text-success me-2"></i>Competitive Pricing</li>
                                <li><i class="fas fa-check text-success me-2"></i>Local Expertise</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h6>Why Choose Us:</h6>
                            <ul class="list-unstyled">
                                <li><i class="fas fa-star text-warning me-2"></i>100% Black Owned</li>
                                <li><i class="fas fa-star text-warning me-2"></i>Community Focused</li>
                                <li><i class="fas fa-star text-warning me-2"></i>Experienced Team</li>
                                <li><i class="fas fa-star text-warning me-2"></i>Quality Guaranteed</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Request Quote</button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

/**
 * Contact form validation
 */
function initContactFormValidation() {
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateContactForm(form)) {
                submitContactForm(form);
            }
        });
    });
}

/**
 * Validate contact form
 */
function validateContactForm(form) {
    const fields = form.querySelectorAll('[required]');
    let isValid = true;
    
    fields.forEach(field => {
        const value = field.value.trim();
        const fieldContainer = field.closest('.form-group') || field.parentElement;
        
        // Remove existing error messages
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate field
        if (!value) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-danger small mt-1';
    errorDiv.textContent = message;
    
    const fieldContainer = field.closest('.form-group') || field.parentElement;
    fieldContainer.appendChild(errorDiv);
    
    field.classList.add('is-invalid');
    field.addEventListener('input', () => {
        field.classList.remove('is-invalid');
        errorDiv.remove();
    }, { once: true });
}

/**
 * Email validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Phone validation
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Submit contact form
 */
function submitContactForm(form) {
    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Responsive utilities
 */
function initResponsiveUtilities() {
    // Handle window resize
    window.addEventListener('resize', throttle(() => {
        handleResponsiveChanges();
    }, 250));
    
    // Initial call
    handleResponsiveChanges();
}

/**
 * Handle responsive changes
 */
function handleResponsiveChanges() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // Update body classes
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('tablet', isTablet);
    document.body.classList.toggle('desktop', !isMobile && !isTablet);
    
    // Adjust animations for mobile
    if (isMobile) {
        // Reduce animation complexity on mobile
        document.querySelectorAll('.service-card').forEach(card => {
            card.style.transform = 'none';
        });
    }
}

/**
 * Accessibility features
 */
function initAccessibilityFeatures() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only-focusable';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
    `;
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add aria-labels to interactive elements
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Service ${index + 1}: ${card.querySelector('.service-title')?.textContent}`);
    });
}

/**
 * Performance optimizations
 */
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Memory cleanup
    window.addEventListener('beforeunload', () => {
        // Clean up event listeners and observers
        cleanup();
    });
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
    const criticalUrls = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css'
    ];
    
    criticalUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

/**
 * Throttle function for performance
 */
function throttle(func, wait) {
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

/**
 * Debounce function for performance
 */
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

/**
 * Cleanup function
 */
function cleanup() {
    // Remove any remaining sparkles
    document.querySelectorAll('.sparkle-effect').forEach(sparkle => {
        sparkle.remove();
    });
    
    // Clear any timeouts/intervals
    // Additional cleanup as needed
}

/**
 * Utility functions
 */
const YamtsengUtils = {
    // Smooth scroll to element
    scrollTo(element, offset = 80) {
        const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - offset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    
    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },
    
    // Format phone number
    formatPhone(phone) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },
    
    // Get current time in South Africa
    getSouthAfricaTime() {
        return new Intl.DateTimeFormat('en-ZA', {
            timeZone: 'Africa/Johannesburg',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(new Date());
    },
    
    // Check if office hours
    isOfficeHours() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        // Monday to Friday, 8 AM to 5 PM
        return day >= 1 && day <= 5 && hour >= 8 && hour < 17;
    }
};

// Make utils globally available
window.YamtsengUtils = YamtsengUtils;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YamtsengUtils;
}