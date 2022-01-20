const auth = require('../services/auth');
const socialAuth = require('../services/socialAuth');

exports.signup = auth.signup;
exports.login = auth.login;
exports.logout = auth.logout;
exports.socialAuth = socialAuth.auth;
exports.verify = auth.verify;
