import Token from "../models/Token.js";

export default class TokenService {
    static async storeRefreshToken(userId, tokenData) {
        await Token.deleteMany({ user: userId });
        return Token.create({
            user: userId,
            ...tokenData
        });
    }

    static async revokeToken(tokenId) {
        return Token.findByIdAndDelete(tokenId);
    }

    static async revokeAllTokensForUser(userId) {
        return Token.deleteMany({ user: userId });
    }

    static async findValidToken(token) {
        return Token.findOne({
            refreshToken: token,
            expiresAt: { $gt: new Date() }
        });
    }
}