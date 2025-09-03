// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });

    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function handleFormSubmission(form) {
    const submitButton = form.querySelector('.form-submit');
    const originalText = submitButton.textContent;
    
    // Clear any existing messages
    clearFormMessages();
    
    // Validate form
    if (!validateForm(form)) {
        showFormMessage('Please correct the errors above and try again.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Sending Message...';
    submitButton.disabled = true;
    form.classList.add('form-loading');
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Simulate successful submission
        showFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        form.reset();
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        form.classList.remove('form-loading');
        
        // Track form submission (replace with actual analytics)
        trackFormSubmission(data);
        
    }, 2000);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    // Clear any existing errors
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('field-error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error-message';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('field-error');
    
    const existingError = field.parentNode.querySelector('.field-error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showFormMessage(message, type) {
    clearFormMessages();
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-${type}`;
    messageElement.innerHTML = `
        <div class="message-content">
            <span class="message-text">${message}</span>
        </div>
    `;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(messageElement, form.firstChild);
    
    // Scroll message into view
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearFormMessages() {
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(message => message.remove());
}

// Validation utilities
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Analytics tracking (replace with actual implementation)
function trackFormSubmission(data) {
    console.log('Form submission tracked:', data);
    
    // Example: Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            event_category: 'Contact',
            event_label: 'Contact Form',
            form_type: 'contact',
            service_interest: data.services
        });
    }
    
    // Example: Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Contact Form',
            content_category: 'Contact'
        });
    }
}

// Add field error styles
function addFieldErrorStyles() {
    if (!document.querySelector('#field-error-styles')) {
        const style = document.createElement('style');
        style.id = 'field-error-styles';
        style.textContent = `
            .field-error {
                border-color: var(--error-500) !important;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
            }
            
            .field-error-message {
                color: var(--error-500);
                font-size: 14px;
                margin-top: 6px;
                font-weight: 500;
            }
            
            .form-message {
                margin-bottom: 24px;
                padding: 16px 20px;
                border-radius: 8px;
                font-weight: 500;
            }
            
            .form-success {
                background-color: #f0fff4;
                color: #065f46;
                border-left: 4px solid var(--success-500);
            }
            
            .form-error {
                background-color: #fef2f2;
                color: #991b1b;
                border-left: 4px solid var(--error-500);
            }
            
            .message-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize field error styles
addFieldErrorStyles();
