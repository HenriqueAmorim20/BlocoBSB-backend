const Slide = require('./slide.model');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const apiSlides = {
  /**
   * Lista Slides
   * @param { query?: { pagina?: Int, tamanhoPagina?: Int, filtros?: {}, campos?: [] } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async listSlides(req, res, next) {
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
      result = await Slide.list({ pagina, tamanhoPagina, filtros, campos });
    } catch (error) {
      next(error);
    }

    res.setHeader('X-Total-Count', result.count);
    res.status(httpStatus.OK).json(result.slides);
  },

  /**
   * Insere um novo Slide
   * @param { body: { preco: String, nome?: String, descricao?: String, tipo: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async saveSlide(req, res, next) {
    const novoSlide = new Slide(req.body);
    try {
      const status = await novoSlide.save();
      res.status(httpStatus.CREATED).json(status);
    } catch (error) {
      next(new APIError(error.message, httpStatus.NOT_FOUND));
    }
  },

  /**
   * Busca uma Slide por id
   * @param { params: { idSlide: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async getSlide(req, res, next) {
    const _idSlide = req.params.idSlide;

    try {
      const slide = await Slide.get(_idSlide);
      res.status(httpStatus.OK).json(slide);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualiza um Slide
   * @param { params: { idSlide: String }, body: [ { chave: String, valor: String } ] } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async updateSlide(req, res, next) {
    const _idSlide = req.params.idSlide;
    const updateFields = req.body;

    try {
      const status = await Slide.updateById({ idSlide: _idSlide, updates: updateFields });
      res.status(httpStatus.OK).json(status);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove um Slide
   * @param { params: { idSlide: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async deleteSlide(req, res, next) {
    const _idSlide = req.params.idSlide;

    try {
      const status = await Slide.delete({ idSlide: _idSlide });
      res.status(httpStatus.OK).json(status);
    } catch (error) {
      next(error);
    }
  },

};
module.exports = apiSlides;
