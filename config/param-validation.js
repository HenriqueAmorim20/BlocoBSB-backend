const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().required(),
      nome: Joi.string().required(),
      senha: Joi.string().required()
    }
  },

  createUserGoogle: {
    body: {
      email: Joi.string().required(),
      nome: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {},
    params: {}
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      senha: Joi.string().required()
    }
  }
};
