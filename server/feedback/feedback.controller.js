const Feedback = require('./feedback.model');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const apiFeedbacks = {
  /**
   * Lista Feedbacks
   * @param { query?: { pagina?: Int, tamanhoPagina?: Int, filtros?: {}, campos?: [] } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async listFeedbacks(req, res, next) {
    let filtros = {};
    let result = {};
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
      result = await Feedback.list({ pagina, tamanhoPagina, filtros, campos });
    } catch (error) {
      next(error);
    }

    res.setHeader('X-Total-Count', result.count);
    res.status(httpStatus.OK).json(result.feedbacks);
  },

  /**
   * Insere um novo feedback
   * @param { body: { email: String, nome?: String, assunto?: String, mensagem: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async saveFeedback(req, res, next) {
    const novoFeedback = new Feedback(req.body);
    try {
      const status = await novoFeedback.save();
      res.status(httpStatus.CREATED).json(status);
    } catch (error) {
      next(new APIError(error.message, httpStatus.NOT_FOUND));
    }
  },

  /**
   * Busca uma Feedback por id
   * @param { params: { idFeedback: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async getFeedback(req, res, next) {
    const _idFeedback = req.params.idFeedback;

    try {
      const feedback = await Feedback.get(_idFeedback);
      res.status(httpStatus.OK).json(feedback);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualiza um Feedback
   * @param { params: { idFeedback: String }, body: [ { chave: String, valor: String } ] } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async updateFeedback(req, res, next) {
    const _idFeedback = req.params.idFeedback;
    const updateFields = req.body;
    let status;

    try {
      status = await Feedback.updateById({ idFeedback: _idFeedback, updates: updateFields });
      res.status(httpStatus.OK).json(status);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove um Feedback
   * @param { params: { idFeedback: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async deleteFeedback(req, res, next) {
    const _idFeedback = req.params.idFeedback;
    let status;

    try {
      status = await Feedback.delete({ idFeedback: _idFeedback });
      res.status(httpStatus.OK).json(status);
    } catch (error) {
      next(error);
    }
  },

};
module.exports = apiFeedbacks;
