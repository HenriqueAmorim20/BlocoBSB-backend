const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

module.exports = {

  listSlide: {
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

  saveSlide: {
    params: {},
    query: {},
    body: {
      url: Joi.string().required(),
    },
  },

  getSlide: {
    // params: { idSlide: Joi.objectId().required(), },
    query: {},
    body: {},
  },

  updateSlide: {
    // params: { idSlide: Joi.objectId().required() },
    query: {},
    body: { updates: Joi.array() },
  },

  deleteSlide: {
    // params: { idSlide: Joi.objectId().required() },
    query: {},
    body: {},
  },

};
