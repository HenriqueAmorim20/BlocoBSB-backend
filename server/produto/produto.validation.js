const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

module.exports = {

  listProduto: {
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

  saveProduto: {
    params: {},
    query: {},
    body: {
      preco: Joi.string().required(),
      nome: Joi.string(),
      descricao: Joi.string(),
      tipo: Joi.string().required(),
      urlMiniatura: Joi.string().required(),
      urlMiniaturaAlternativa: Joi.string(),
      urlImagens: Joi.array().required()
    },
  },

  getProduto: {
    // params: { idProduto: Joi.objectId().required(), },
    query: {},
    body: {},
  },

  updateProduto: {
    // params: { idProduto: Joi.objectId().required() },
    query: {},
    body: { updates: Joi.array() },
  },

  deleteProduto: {
    // params: { idProduto: Joi.objectId().required() },
    query: {},
    body: {},
  },

};
