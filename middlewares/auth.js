const jwt = require('jsonwebtoken');
const { LoginError } = require('../errors/login-error');

const handleAuthError = () => new LoginError('Необходима авторизация');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload;
  next();
};
