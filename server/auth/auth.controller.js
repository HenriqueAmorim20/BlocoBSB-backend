const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../user/user.model');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);

const apiAuth = {
  /**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
  async login(req, res, next) {
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
  },

  async encrypt(req, res, next) {
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    const data = req.body.data;
    let encryptedData = '';

    try {
      encryptedData = cipher.update(data, 'utf-8', 'hex');
      encryptedData += cipher.final('hex');
      return res.json({ encrypted: encryptedData });
    } catch (error) {
      const err = new APIError('Erro na criptografia', httpStatus.NOT_FOUND, true);
      return next(err);
    }
  },

  async decrypt(req, res, next) {
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    const data = req.body.data;
    let decryptedData = '';
    try {
      decryptedData = decipher.update(data, 'hex', 'utf-8');
      decryptedData += decipher.final('utf8');
      return res.json({ decrypted: decryptedData });
    } catch (error) {
      const err = new APIError('Erro na criptografia', httpStatus.NOT_FOUND, true);
      return next(err);
    }
  }
};

module.exports = apiAuth;
