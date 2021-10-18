const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const ObjectId = mongoose.Types.ObjectId;

const Slideschema = new mongoose.Schema({
  url: { type: String, required: true, unique: true }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
/**
 * Methods
 */
Slideschema.method({});

/**
 * Statics
 */
Slideschema.statics = {
  /**
   * Busca por id
   * @param {String} id - O codigo da quesao.
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((slide) => {
        if (slide) {
          return slide;
        }
        const err = new APIError('No such Slide exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Lista Slides
   * @param {number} pagina - Numero da pagina atual.
   * @param {number} tamanhoPagina - Numero de patentes por pagina.
   * @param {*} filtros - JSON no formato de um filtro de projecao.
   * @param {Array} campos - Campos que devem ser projetados.
   * @returns {Promise<Slides[]>}
   */
  async list({
    pagina = 0,
    tamanhoPagina = 20,
    filtros = {},
    campos = []
  } = {}) {
    const mongoQuery = {};
    let mongoProjection = {};

    if (filtros !== {} && typeof filtros === 'object') {
      Object.keys(filtros).forEach((keyFiltro) => {
        mongoQuery[keyFiltro] = filtros[keyFiltro];
      });
    }

    if (Array.isArray(campos) && campos.length > 0) {
      mongoProjection = {};
      campos.forEach((field) => {
        mongoProjection[field] = 1;
      });
    }
    try {
      const count = await this.find(mongoQuery).count().exec();
      let limit = count;
      if (!limit) {
        limit = 1;
      }
      const slides = await this
        .find(mongoQuery, mongoProjection)
        .skip(pagina * tamanhoPagina)
        .limit(+tamanhoPagina ? +tamanhoPagina : limit)
        .exec();
      return { slides, count };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza Slide
   * @param {String} idSlide - Id do respondente
   * @param {[ { chave: String, valor: {*} } ]} updates - Array de campos que devem ser atualizados
   * @returns {Slide} - Documento atualizado
   * @throws {APIError} - Erro
   */
  async updateById({
    idSlide,
    updates
  } = {}) {
    const _idSlide = new ObjectId(idSlide);
    const updateQuery = {};
    updateQuery[updates.chave] = updates.valor;

    try {
      const result = await this.findOneAndUpdate({ _id: _idSlide }, { $set: updateQuery }, { new: true }).exec();
      if (!result) throw new APIError('Não existe Slide com esse identificador', httpStatus.NOT_FOUND);
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deleta Slide por Id
   * @param {String} idSlide - Id do respondente
   * @returns {*} - Resultado
   * @throws {APIError} - Erro
   */
  async delete({
    idSlide
  } = {}) {
    try {
      const result = await this.remove({ _id: idSlide }).exec();
      if (result.deletedCount === 0 && result.n === 0) {
        throw new APIError('Não existe Slide com esse identificador', httpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * @typedef Schema
 */
module.exports = mongoose.model('Slide', Slideschema);
