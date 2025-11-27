// Security utility functions for input validation and sanitization

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return {
            isValid: false,
            message: `كلمة المرور يجب أن تكون ${minLength} أحرف على الأقل`
        };
    }

    if (!hasUpperCase) {
        return {
            isValid: false,
            message: 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل'
        };
    }

    if (!hasLowerCase) {
        return {
            isValid: false,
            message: 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل'
        };
    }

    if (!hasNumbers) {
        return {
            isValid: false,
            message: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'
        };
    }

    if (!hasSpecialChar) {
        return {
            isValid: false,
            message: 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل'
        };
    }

    return {
        isValid: true,
        message: 'كلمة مرور قوية'
    };
};

/**
 * Sanitizes input to prevent XSS attacks
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Validates account number format (7 digits)
 * @param {string} accountNumber - Account number to validate
 * @returns {boolean} - True if valid
 */
export const validateAccountNumber = (accountNumber) => {
    const accountRegex = /^\d{7,}$/;
    return accountRegex.test(accountNumber);
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

/**
 * Validates text input (prevents SQL injection patterns)
 * @param {string} text - Text to validate
 * @returns {boolean} - True if valid
 */
export const validateTextInput = (text) => {
    // Check for common SQL injection patterns
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
        /(--|\;|\/\*|\*\/)/,
        /(\bOR\b.*=.*)/i,
        /(\bAND\b.*=.*)/i
    ];

    for (const pattern of sqlPatterns) {
        if (pattern.test(text)) {
            return false;
        }
    }

    return true;
};

/**
 * Validates file upload
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {object} - Validation result
 */
export const validateFile = (file, allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'], maxSize = 5 * 1024 * 1024) => {
    if (!file) {
        return {
            isValid: false,
            message: 'لم يتم اختيار ملف'
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            message: 'نوع الملف غير مسموح به. يرجى اختيار PDF أو صورة'
        };
    }

    if (file.size > maxSize) {
        return {
            isValid: false,
            message: `حجم الملف كبير جداً. الحد الأقصى ${maxSize / (1024 * 1024)} ميجابايت`
        };
    }

    return {
        isValid: true,
        message: 'الملف صالح'
    };
};

/**
 * Escapes special characters for safe display
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
export const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};
