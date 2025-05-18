export const jwtConstants = {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
};
