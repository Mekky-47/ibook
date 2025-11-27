// Authentication and session management utilities

const SESSION_KEY = 'ibok_session';
const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000; // 30 minutes
const MAX_LOGIN_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;
const LOCKOUT_DURATION = parseInt(import.meta.env.VITE_LOCKOUT_DURATION) || 300000; // 5 minutes

/**
 * Generates a secure random token
 * @returns {string} - Random token
 */
const generateToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Creates a new session
 * @param {object} userData - User data to store in session
 * @returns {object} - Session object
 */
export const createSession = (userData) => {
    const token = generateToken();
    const session = {
        token,
        user: userData,
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_TIMEOUT,
        lastActivity: Date.now()
    };

    // Store in sessionStorage (more secure than localStorage)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Start inactivity timer
    startInactivityTimer();

    return session;
};

/**
 * Gets the current session
 * @returns {object|null} - Session object or null if not found/expired
 */
export const getSession = () => {
    const sessionData = sessionStorage.getItem(SESSION_KEY);

    if (!sessionData) {
        return null;
    }

    try {
        const session = JSON.parse(sessionData);

        // Check if session is expired
        if (Date.now() > session.expiresAt) {
            destroySession();
            return null;
        }

        // Update last activity
        session.lastActivity = Date.now();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return session;
    } catch (error) {
        console.error('Error parsing session:', error);
        destroySession();
        return null;
    }
};

/**
 * Updates session data
 * @param {object} updates - Data to update
 */
export const updateSession = (updates) => {
    const session = getSession();

    if (!session) {
        return;
    }

    const updatedSession = {
        ...session,
        user: {
            ...session.user,
            ...updates
        },
        lastActivity: Date.now()
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
};

/**
 * Destroys the current session
 */
export const destroySession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    stopInactivityTimer();
};

/**
 * Checks if user is authenticated
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
    return getSession() !== null;
};

/**
 * Gets the current user data
 * @returns {object|null} - User data or null
 */
export const getCurrentUser = () => {
    const session = getSession();
    return session ? session.user : null;
};

// Inactivity timer
let inactivityTimer = null;

/**
 * Starts the inactivity timer
 */
const startInactivityTimer = () => {
    stopInactivityTimer();

    const checkInactivity = () => {
        const session = getSession();

        if (!session) {
            stopInactivityTimer();
            return;
        }

        const inactiveTime = Date.now() - session.lastActivity;

        if (inactiveTime > SESSION_TIMEOUT) {
            destroySession();
            window.location.href = '/login';
        }
    };

    // Check every minute
    inactivityTimer = setInterval(checkInactivity, 60000);

    // Reset timer on user activity
    const resetTimer = () => {
        const session = getSession();
        if (session) {
            session.lastActivity = Date.now();
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
    };

    // Listen for user activity
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('click', resetTimer);
    document.addEventListener('scroll', resetTimer);
};

/**
 * Stops the inactivity timer
 */
const stopInactivityTimer = () => {
    if (inactivityTimer) {
        clearInterval(inactivityTimer);
        inactivityTimer = null;
    }
};

// Login attempt tracking
const LOGIN_ATTEMPTS_KEY = 'ibok_login_attempts';

/**
 * Records a failed login attempt
 * @param {string} accountNumber - Account number
 */
export const recordFailedLogin = (accountNumber) => {
    const attempts = getLoginAttempts(accountNumber);
    attempts.count += 1;
    attempts.lastAttempt = Date.now();

    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
        attempts.lockedUntil = Date.now() + LOCKOUT_DURATION;
    }

    localStorage.setItem(`${LOGIN_ATTEMPTS_KEY}_${accountNumber}`, JSON.stringify(attempts));
};

/**
 * Gets login attempts for an account
 * @param {string} accountNumber - Account number
 * @returns {object} - Attempts data
 */
export const getLoginAttempts = (accountNumber) => {
    const data = localStorage.getItem(`${LOGIN_ATTEMPTS_KEY}_${accountNumber}`);

    if (!data) {
        return {
            count: 0,
            lastAttempt: null,
            lockedUntil: null
        };
    }

    try {
        const attempts = JSON.parse(data);

        // Check if lockout has expired
        if (attempts.lockedUntil && Date.now() > attempts.lockedUntil) {
            resetLoginAttempts(accountNumber);
            return {
                count: 0,
                lastAttempt: null,
                lockedUntil: null
            };
        }

        return attempts;
    } catch (error) {
        console.error('Error parsing login attempts:', error);
        return {
            count: 0,
            lastAttempt: null,
            lockedUntil: null
        };
    }
};

/**
 * Resets login attempts for an account
 * @param {string} accountNumber - Account number
 */
export const resetLoginAttempts = (accountNumber) => {
    localStorage.removeItem(`${LOGIN_ATTEMPTS_KEY}_${accountNumber}`);
};

/**
 * Checks if account is locked
 * @param {string} accountNumber - Account number
 * @returns {object} - Lock status
 */
export const isAccountLocked = (accountNumber) => {
    const attempts = getLoginAttempts(accountNumber);

    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
        const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
        return {
            isLocked: true,
            remainingSeconds: remainingTime
        };
    }

    return {
        isLocked: false,
        remainingSeconds: 0
    };
};

/**
 * Gets remaining login attempts
 * @param {string} accountNumber - Account number
 * @returns {number} - Remaining attempts
 */
export const getRemainingAttempts = (accountNumber) => {
    const attempts = getLoginAttempts(accountNumber);
    return Math.max(0, MAX_LOGIN_ATTEMPTS - attempts.count);
};
