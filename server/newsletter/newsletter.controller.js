const Newsletter = require('./newsletter.model');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const apiNewsletters = {
  /**
   * Lista Newsletters
   * @param { query?: { pagina?: Int, tamanhoPagina?: Int, filtros?: {}, campos?: [] } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async listNewsletters(req, res, next) {
    let filtros = {};
    let campos = [];

    const pagina = parseInt(req.query.pagina || 0, 10);
    const tamanhoPagina = Math.min(parseInt(req.query.tamanhoPagina || 20, 10), 100);

    if (req.query.filtros) {
      try {
        filtros = JSON.parse(req.query.filtros);
      } catch (error) {
        next(new APIError('Filtro mal formatado, esperado um json', httpStatus.BAD_REQUEST, true));
      }
    }

    if (req.query.campos) {
      campos = req.query.campos.split(',');
    }

    try {
      const result = await Newsletter.list({ pagina, tamanhoPagina, filtros, campos });
      res.status(httpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Insere um novo Newsletter
   * @param { body: { preco: String, nome?: String, descricao?: String, tipo: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async saveNewsletter(req, res, next) {
    const novoNewsletter = new Newsletter(req.body);
    try {
      const status = await novoNewsletter.save();
      res.status(httpStatus.CREATED).json(status);
    } catch (error) {
      next(new APIError(error.message, httpStatus.NOT_FOUND));
    }
  },

  /**
   * Busca uma Newsletter por id
   * @param { params: { idNewsletter: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async getNewsletter(req, res, next) {
    const _idNewsletter = req.params.idNewsletter;

    try {
      const newsletter = await Newsletter.get(_idNewsletter);
      res.status(httpStatus.OK).json(newsletter);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualiza um Newsletter
   * @param { params: { idNewsletter: String }, body: [ { chave: String, valor: String } ] } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async updateNewsletter(req, res, next) {
    const _idNewsletter = req.params.idNewsletter;
    const updateFields = req.body;

    try {
      const status = await Newsletter.updateById({ idNewsletter: _idNewsletter, updates: updateFields });
      res.status(httpStatus.OK).json(status);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove um Newsletter
   * @param { params: { idNewsletter: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async deleteNewsletter(req, res, next) {
    const _idNewsletter = req.params.idNewsletter;

    try {
      const status = await Newsletter.delete({ idNewsletter: _idNewsletter });
      res.status(httpStatus.OK).json(status);
    } catch (error) {
      next(error);
    }
  },

};
module.exports = apiNewsletters;
