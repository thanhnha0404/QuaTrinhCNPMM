require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const allowLists = ['/register', '/login'];

    // Allow non-API routes (e.g., views) to pass through
    if (!req.originalUrl.includes('/v1/api')) return next();

    // Allow public API routes
    if (allowLists.find((item) => req.originalUrl.endsWith(item))) return next();

    if (req.headers.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                email: decoded.email,
                name: decoded.name,
            };
            console.log('>>> check token: ', decoded);
            return next();
        } catch (error) {
            return res.status(401).json({
                message: 'Token bị hết hạn/hoặc không hợp lệ'
            });
        }
    }

    return res.status(401).json({
        message: 'Bạn chưa truyền Access Token ở header/hoặc token bị hết hạn'
    });
}

module.exports = auth;









