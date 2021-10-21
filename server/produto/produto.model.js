const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const ObjectId = mongoose.Types.ObjectId;

const Produtoschema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: String, required: true },
  descricao: { type: String, required: true },
  urlMiniatura: { type: String, required: true },
  urlImagens: [{ type: String, required: true }],
  tipo: { type: String, enum: ['adulto', 'infantil'], required: true },
  destaque: { type: Boolean, required: false, default: false }
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
Produtoschema.method({});

/**
 * Statics
 */
Produtoschema.statics = {
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
        const err = new APIError('No such Produto exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Lista produtos
   * @param {number} pagina - Numero da pagina atual.
   * @param {number} tamanhoPagina - Numero de patentes por pagina.
   * @param {*} filtros - JSON no formato de um filtro de projecao.
   * @param {Array} campos - Campos que devem ser projetados.
   * @returns {Promise<Produtos[]>}
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
      const produtos = await this
        .find(mongoQuery, mongoProjection)
        .skip(pagina * tamanhoPagina)
        .limit(+tamanhoPagina ? +tamanhoPagina : limit)
        .exec();
      return { produtos, count };
    } catch (error) {
      throw error;
    }
  },

  async search(filtros = {}) {
    const mongoQuery = { nome: { $regex: new RegExp(filtros.nome), $options: 'i' } };
    try {
      const count = await this.find(mongoQuery).count().exec();
      let limit = count;
      if (!limit) {
        limit = 1;
      }
      const produtos = await this
        .find(mongoQuery)
        .limit(limit)
        .exec();
      return { produtos, count };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza produto
   * @param {String} idProduto - Id do respondente
   * @param {[ { chave: String, valor: {*} } ]} updates - Array de campos que devem ser atualizados
   * @returns {Produto} - Documento atualizado
   * @throws {APIError} - Erro
   */
  async updateById({
    idProduto,
    updates
  } = {}) {
    const _idProduto = new ObjectId(idProduto);
    const updateQuery = {};
    updateQuery[updates.chave] = updates.valor;

    try {
      const result = await this.findOneAndUpdate({ _id: _idProduto }, { $set: updateQuery }, { new: true }).exec();
      if (!result) throw new APIError('Não existe Produto com esse identificador', httpStatus.NOT_FOUND);
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deleta Produto por Id
   * @param {String} idProduto - Id do respondente
   * @returns {*} - Resultado
   * @throws {APIError} - Erro
   */
  async delete({
    idProduto
  } = {}) {
    try {
      const result = await this.remove({ _id: idProduto }).exec();
      if (result.deletedCount === 0 && result.n === 0) {
        throw new APIError('Não existe Produto com esse identificador', httpStatus.NOT_FOUND);
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
module.exports = mongoose.model('Produto', Produtoschema);
