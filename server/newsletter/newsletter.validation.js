const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

module.exports = {

  listNewsletter: {
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

  saveNewsletter: {
    params: {},
    query: {},
    body: {
      email: Joi.string().required(),
    },
  },

  getNewsletter: {
    // params: { idNewsletter: Joi.objectId().required(), },
    query: {},
    body: {},
  },

  updateNewsletter: {
    // params: { idNewsletter: Joi.objectId().required() },
    query: {},
    body: { updates: Joi.array() },
  },

  deleteNewsletter: {
    // params: { idNewsletter: Joi.objectId().required() },
    query: {},
    body: {},
  },

};
