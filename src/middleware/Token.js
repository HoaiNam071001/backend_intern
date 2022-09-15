const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    try {
        if (!token) throw 'missing authorization credentials';
        jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, function (err, decoded) {
            if (err) throw 'Unauthorized';
            req.payload = { id: decoded._id };
        });

        next();
    } catch (err) {
        res.status(401).json({
            status: 'error',
            message: err,
        });
    }
};
const CheckToken = (req, res, next) => {
    const token = req.header('Authorization');
    try {
        if (!token) {
            next();
            return;
        }
        jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, function (err, decoded) {
            if (!err) req.payload = { id: decoded._id };
        });
        next();
    } catch (err) {
        res.status(401).json({
            status: 'error',
            message: err,
        });
    }
};
module.exports = { VerifyToken, CheckToken };
