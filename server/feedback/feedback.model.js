const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const ObjectId = mongoose.Types.ObjectId;

const FeedbackSchema = new mongoose.Schema({
  email: { type: String, required: true },
  nome: { type: String, required: false, default: null },
  assunto: { type: String, required: false, default: null },
  mensagem: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
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
FeedbackSchema.method({});

/**
 * Statics
 */
FeedbackSchema.statics = {
  /**
   * Busca por id
   * @param {String} id - O codigo da quesao.
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such feedback exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Lista feedbacks
   * @param {number} pagina - Numero da pagina atual.
   * @param {number} tamanhoPagina - Numero de patentes por pagina.
   * @param {*} filtros - JSON no formato de um filtro de projecao.
   * @param {Array} campos - Campos que devem ser projetados.
   * @returns {Promise<Feedbacks[]>}
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
      const feedbacks = await this
        .find(mongoQuery, mongoProjection)
        .skip(pagina * tamanhoPagina)
        .limit(+tamanhoPagina ? +tamanhoPagina : limit)
        .exec();
      return { feedbacks, count };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza feedback
   * @param {String} idFeedback - Id do respondente
   * @param {[ { chave: String, valor: {*} } ]} updates - Array de campos que devem ser atualizados
   * @returns {Feedback} - Documento atualizado
   * @throws {APIError} - Erro
   */
  async updateById({
    idFeedback,
    updates
  } = {}) {
    const _idFeedback = new ObjectId(idFeedback);
    const updateQuery = {};

    for (let i = 0; i < updates.updates.length; i += 1) {
      updateQuery[updates.updates[i].chave] = updates.updates[i].valor;
    }

    try {
      const result = await this.findOneAndUpdate({ _id: _idFeedback }, { $set: updateQuery }, { new: true }).exec();
      if (!result) throw new APIError('Não existe feedback com esse identificador', httpStatus.NOT_FOUND);
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deleta feedback por Id
   * @param {String} idFeedback - Id do respondente
   * @returns {*} - Resultado
   * @throws {APIError} - Erro
   */
  async delete({
    idFeedback
  } = {}) {
    try {
      const result = await this.remove({ _id: idFeedback }).exec();
      if (result.deletedCount === 0 && result.n === 0) {
        throw new APIError('Não existe feedback com esse identificador', httpStatus.NOT_FOUND);
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
module.exports = mongoose.model('Feedback', FeedbackSchema);
