const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../user/user.model');

// sample user, used for authentication
// const user = {
//   username: 'react',
//   password: 'express'
// };

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  try {
    const user = await User.find({ email: req.body.email });

    if (req.body.senha === user[0].senha) {
      const token = jwt.sign({
        email: user.email
      }, config.jwtSecret);
      return res.json({
        token,
        user: user[0]
      });
    }
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  } catch (error) {
    const err = new APIError('Email não encontrado', httpStatus.NOT_FOUND, true);
    return next(err);
  }
}

module.exports = { login };
