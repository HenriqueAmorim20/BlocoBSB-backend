const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const ObjectId = mongoose.Types.ObjectId;

const Newsletterschema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
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
Newsletterschema.method({});

/**
 * Statics
 */
Newsletterschema.statics = {
  /**
   * Busca por id
   * @param {String} id - O codigo da quesao.
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((newsletter) => {
        if (newsletter) {
          return newsletter;
        }
        const err = new APIError('No such Newsletter exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Lista Newsletters
   * @param {number} pagina - Numero da pagina atual.
   * @param {number} tamanhoPagina - Numero de patentes por pagina.
   * @param {*} filtros - JSON no formato de um filtro de projecao.
   * @param {Array} campos - Campos que devem ser projetados.
   * @returns {Promise<Newsletters[]>}
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
      const newsletters = await this
        .find(mongoQuery, mongoProjection)
        .skip(pagina * tamanhoPagina)
        .limit(+tamanhoPagina ? +tamanhoPagina : limit)
        .exec();
      return { newsletters, count };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza Newsletter
   * @param {String} idNewsletter - Id do respondente
   * @param {[ { chave: String, valor: {*} } ]} updates - Array de campos que devem ser atualizados
   * @returns {Newsletter} - Documento atualizado
   * @throws {APIError} - Erro
   */
  async updateById({
    idNewsletter,
    updates
  } = {}) {
    const _idNewsletter = new ObjectId(idNewsletter);
    const updateQuery = {};
    updateQuery[updates.chave] = updates.valor;

    try {
      const result = await this.findOneAndUpdate({ _id: _idNewsletter }, { $set: updateQuery }, { new: true }).exec();
      if (!result) throw new APIError('Não existe Newsletter com esse identificador', httpStatus.NOT_FOUND);
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deleta Newsletter por Id
   * @param {String} idNewsletter - Id do respondente
   * @returns {*} - Resultado
   * @throws {APIError} - Erro
   */
  async delete({
    idNewsletter
  } = {}) {
    try {
      const result = await this.remove({ _id: idNewsletter }).exec();
      if (result.deletedCount === 0 && result.n === 0) {
        throw new APIError('Não existe Newsletter com esse identificador', httpStatus.NOT_FOUND);
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
module.exports = mongoose.model('Newsletter', Newsletterschema);
