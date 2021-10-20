const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../user/user.model');
const crypto = require('crypto');

const apiAuth = {
  /**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
  async login(req, res, next) {
    const userRequest = req.body;
    try {
      const user = await User.find({ email: userRequest.email });
      const cipher = crypto.createCipheriv(config.crypto.algorithm, config.crypto.securitykey, config.crypto.initVector);
      let encryptedData = cipher.update(userRequest.senha, 'utf-8', 'hex');
      encryptedData += cipher.final('hex');

      if (user[0].senha === encryptedData) {
        const token = jwt.sign({
          email: user.email
        }, config.jwtSecret);
        return res.json({
          token,
          user: user[0]
        });
      }
      const err = new APIError('Senha incorreta.', httpStatus.UNAUTHORIZED, true);
      return next(err);
    } catch (error) {
      const err = new APIError('Email não encontrado.', httpStatus.NOT_FOUND, true);
      return next(err);
    }
  },

  async encrypt(req, res, next) {
    const cipher = crypto.createCipheriv(config.crypto.algorithm, config.crypto.securitykey, config.crypto.initVector);
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
    const decipher = crypto.createDecipheriv(config.crypto.algorithm, config.crypto.securitykey, config.crypto.initVector);
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
