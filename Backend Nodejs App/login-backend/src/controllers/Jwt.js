const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('./Users');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            '/login',
            '/register',
            { url: /^/, methods: ['GET'] },
            '/:id',
            '/verify',
            '/forgot',
            { url: /^.*/, methods: ['GET', 'PUT', 'DELETE'] }
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // Eğer user yoksa tokeni revoke eder.
    if (!user) {
        return done(null, true);
    }

    done();
};
