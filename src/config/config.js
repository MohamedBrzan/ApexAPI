export default {
    jwt: {
        accessSecret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        resetSecret: process.env.JWT_RESET_SECRET,
        accessExpiration: '15m',
        refreshExpiration: '7d',
        resetExpiration: '1h'
    }
};