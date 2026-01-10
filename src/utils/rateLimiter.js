const STORAGE_KEY = 'auth-rate-limit_community-feedback';
const MAX_ATTEMPTS = 5;
const TIME_WINDOW = 60 * 1000;
const COOLDOWN_PERIOD = 5 * 60 * 1000;


const getRateLimitData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading rate limit data:', error);
        return null;
    }
};
const saveRateLimitData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving rate limit data:', error);
    }
};

/**
 * @returns {Object} { isBlocked: boolean, remainingTime: number (seconds) }
 */
export const checkRateLimit = () => {
    const now = Date.now();
    const data = getRateLimitData();

    if (!data) {
        return { isBlocked: false, remainingTime: 0 };
    }
    if (data.blockedUntil && now < data.blockedUntil) {
        const remainingTime = Math.ceil((data.blockedUntil - now) / 1000);
        return { isBlocked: true, remainingTime };
    }
    if (data.blockedUntil && now >= data.blockedUntil) {
        localStorage.removeItem(STORAGE_KEY);
        return { isBlocked: false, remainingTime: 0 };
    }
    const validAttempts = data.attempts.filter(
        timestamp => now - timestamp < TIME_WINDOW
    );
    if (validAttempts.length < MAX_ATTEMPTS) {
        return { isBlocked: false, remainingTime: 0 };
    }
    const blockedUntil = now + COOLDOWN_PERIOD;
    saveRateLimitData({
        attempts: validAttempts,
        blockedUntil,
        exceededAt: now
    });

    return {
        isBlocked: true,
        remainingTime: Math.ceil(COOLDOWN_PERIOD / 1000)
    };
};


export const recordAttempt = () => {
    const now = Date.now();
    const data = getRateLimitData();

    if (!data || data.blockedUntil) {
        const attempts = data ? data.attempts : [];
        saveRateLimitData({
            attempts: [...attempts, now],
            blockedUntil: data?.blockedUntil
        });
        return;
    }

    const validAttempts = data.attempts.filter(
        timestamp => now - timestamp < TIME_WINDOW
    );

    validAttempts.push(now);

    if (validAttempts.length >= MAX_ATTEMPTS) {
        const blockedUntil = now + COOLDOWN_PERIOD;
        saveRateLimitData({
            attempts: validAttempts,
            blockedUntil,
            exceededAt: now
        });
    } else {
        saveRateLimitData({
            attempts: validAttempts
        });
    }
};

export const clearRateLimit = () => {
    localStorage.removeItem(STORAGE_KEY);
};

/**
 * @param {number} seconds 
 * @returns {string} "5:30" atau "0:45"
 */
export const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};