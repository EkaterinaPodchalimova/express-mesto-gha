const jwt = require('jsonwebtoken');

const handleAuthError = (res) => res.status(401).send({ message: 'Необходима авторизация' });

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    handleAuthError(res);
  }
  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload;
  next();
};
