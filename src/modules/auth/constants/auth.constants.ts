export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '15m',
    refreshExpiresIn: '7d',
};

export const BCRYPT_SALT_ROUNDS = 12;