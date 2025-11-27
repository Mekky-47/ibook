# Security Documentation

## Overview

This document outlines the comprehensive security measures implemented in the iBOK Internet Banking application.

## 🔐 Security Layers

### 1. Input Validation & Sanitization

#### Client-Side Validation
All user inputs are validated before processing:

**Email Validation**
- Regex pattern: `/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
- Prevents malformed email addresses

**Password Validation**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Real-time strength feedback

**Account Number Validation**
- Minimum 7 digits
- Numeric only
- Pattern: `/^\d{7,}$/`

**Text Input Validation**
- SQL injection pattern detection
- Blocks: SELECT, INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, EXEC
- Blocks: --, ;, /*, */
- Blocks: OR/AND with = patterns

**File Upload Validation**
- Allowed types: PDF, JPEG, PNG
- Maximum size: 5MB
- MIME type verification
- File extension check

#### XSS Prevention
All inputs are sanitized using HTML entity encoding:
```javascript
& → &amp;
< → &lt;
> → &gt;
" → &quot;
' → &#x27;
/ → &#x2F;
```

### 2. Authentication & Authorization

#### Rate Limiting
- **Maximum Attempts:** 5 failed login attempts
- **Lockout Duration:** 5 minutes (300,000ms)
- **Tracking:** Per account number
- **Storage:** localStorage with timestamp
- **Auto-Reset:** After lockout expires

#### Account Lockout
```javascript
// Lockout mechanism
if (failedAttempts >= 5) {
  lockAccount(accountNumber, 5 * 60 * 1000);
  showCountdownTimer();
}
```

#### Password Security
- Strong password requirements enforced
- Password visibility toggle for user convenience
- No password storage in plain text
- Passwords should be hashed on backend (not implemented in demo)

### 3. Session Management

#### Secure Token Generation
```javascript
// Cryptographically secure random token
const generateToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
};
```

#### Session Storage
- **Storage Type:** sessionStorage (cleared on tab close)
- **Token Length:** 64 characters (256-bit entropy)
- **Session Timeout:** 30 minutes (1,800,000ms)
- **Activity Tracking:** Mouse, keyboard, click, scroll events

#### Auto-Logout
```javascript
// Inactivity detection
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

if (Date.now() - lastActivity > SESSION_TIMEOUT) {
  destroySession();
  redirectToLogin();
}
```

#### Session Data Structure
```javascript
{
  token: "64-char-random-token",
  user: { /* user data */ },
  createdAt: 1234567890,
  expiresAt: 1234569690,
  lastActivity: 1234567890
}
```

### 4. API Security

#### HTTPS Enforcement
```html
<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" 
      content="upgrade-insecure-requests" />
```

#### Request Validation
- Token validation before every protected action
- Session expiration check
- User authentication verification

#### Error Handling
- Generic error messages (no sensitive data exposure)
- Detailed errors only in development mode
- Failed attempts logged for monitoring

### 5. EmailJS Security

#### Environment Variables
All sensitive EmailJS credentials stored in `.env`:
```env
VITE_EMAILJS_SERVICE_ID=xxx
VITE_EMAILJS_TEMPLATE_ID_LOGIN=xxx
VITE_EMAILJS_TEMPLATE_ID_UPDATE=xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
```

#### Rate Limiting
- **Limit:** 5 emails per user per hour
- **Window:** 3,600,000ms (1 hour)
- **Tracking:** In-memory Map with timestamp cleanup
- **Purpose:** Prevent spam and abuse

```javascript
const EMAIL_RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 3600000; // 1 hour

if (emailsSentInLastHour >= 5) {
  throw new Error('Rate limit exceeded');
}
```

#### Data Sanitization
- All email parameters sanitized before sending
- No sensitive data in email subjects
- Timestamps in local timezone
- IP address anonymization option

### 6. Data Protection

#### Sensitive Data Handling
- No passwords stored in frontend
- Session tokens never logged
- EmailJS private keys never exposed
- User data cleared on logout

#### Local Storage Security
```javascript
// Login attempts tracking
localStorage: {
  'ibok_login_attempts_1234567': {
    count: 3,
    lastAttempt: 1234567890,
    lockedUntil: null
  }
}

// Session data (more secure)
sessionStorage: {
  'ibok_session': {
    token: "...",
    user: { /* sanitized data */ }
  }
}
```

## 🛡️ Security Checklist

### Implemented ✅
- [x] Input validation (email, password, account number)
- [x] XSS prevention through sanitization
- [x] SQL injection pattern detection
- [x] Rate limiting (5 attempts)
- [x] Account lockout with countdown
- [x] Password strength validation
- [x] Secure session tokens (crypto API)
- [x] Auto-logout on inactivity
- [x] Activity tracking
- [x] HTTPS enforcement (CSP)
- [x] EmailJS rate limiting
- [x] Environment variable protection
- [x] File upload validation
- [x] Error handling
- [x] Session expiration

### Recommended for Production 🔄
- [ ] Backend API with proper authentication
- [ ] Password hashing (bcrypt, argon2)
- [ ] Two-factor authentication (2FA)
- [ ] CAPTCHA on login
- [ ] IP-based rate limiting
- [ ] Security headers (HSTS, X-Frame-Options)
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] SSL/TLS certificates
- [ ] Database encryption
- [ ] Audit logging
- [ ] Intrusion detection
- [ ] DDoS protection
- [ ] Regular dependency updates
- [ ] Security monitoring

## 🚨 Security Incidents

### Failed Login Attempts
```javascript
// Tracked per account
{
  accountNumber: "1234567",
  attempts: 3,
  lastAttempt: "2024-01-01T12:00:00Z",
  status: "active" | "locked"
}
```

### Session Hijacking Prevention
- Tokens regenerated on sensitive actions
- Session bound to browser fingerprint (recommended)
- Short session lifetime (30 min)
- Secure token generation

### CSRF Protection
- SameSite cookies (when using cookies)
- Token validation
- Origin checking

## 📊 Security Monitoring

### Metrics to Track
1. Failed login attempts per account
2. Account lockouts per day
3. Session timeout events
4. Email send rate
5. File upload attempts
6. Invalid input patterns

### Logging (Development)
```javascript
console.log('🔐 Security Event:', {
  type: 'failed_login',
  account: '1234567',
  timestamp: Date.now(),
  remainingAttempts: 2
});
```

## 🔧 Security Configuration

### Adjustable Parameters

**Rate Limiting:**
```env
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_DURATION=300000  # 5 minutes
```

**Session Management:**
```env
VITE_SESSION_TIMEOUT=1800000  # 30 minutes
```

**File Upload:**
```javascript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
```

## 🎯 Best Practices

### For Developers
1. Never commit `.env` files
2. Use environment variables for all secrets
3. Sanitize all user inputs
4. Validate on both client and server
5. Use HTTPS in production
6. Keep dependencies updated
7. Regular security audits
8. Follow OWASP guidelines

### For Users
1. Use strong, unique passwords
2. Don't share account credentials
3. Log out after use
4. Use secure networks
5. Keep browser updated
6. Enable 2FA (when available)

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)
- [EmailJS Security](https://www.emailjs.com/docs/security/)
- [React Security Best Practices](https://react.dev/learn/security)

## 🔄 Security Updates

### Version 1.0.0
- Initial security implementation
- Rate limiting
- Session management
- Input validation
- EmailJS integration

---

**Last Updated:** 2024-01-01  
**Security Level:** Development/Demo  
**Production Ready:** Requires backend implementation
