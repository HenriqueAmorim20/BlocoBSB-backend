const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

module.exports = {

  listFeedback: {
    params: {
      pagina: Joi.number(),
      tamanhoPagina: Joi.number(),
      filtros: Joi.object(),
      campos: Joi.string()
    },
    query: {
    },
    body: {},
  },

  saveFeedback: {
    params: {},
    query: {},
    body: {
      email: Joi.string().email().required(),
      nome: Joi.string(),
      assunto: Joi.string(),
      mensagem: Joi.string().required(),
    },
  },

  getFeedback: {
    // params: { idFeedback: Joi.objectId().required(), },
    query: {},
    body: {},
  },

  updateFeedback: {
    // params: { idFeedback: Joi.objectId().required() },
    query: {},
    body: { updates: Joi.array() },
  },

  deleteFeedback: {
    // params: { idFeedback: Joi.objectId().required() },
    query: {},
    body: {},
  },

};
