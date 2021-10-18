const Produto = require('./produto.model');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const apiProdutos = {
  /**
   * Lista Produtos
   * @param { query?: { pagina?: Int, tamanhoPagina?: Int, filtros?: {}, campos?: [] } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async listProdutos(req, res, next) {
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
      result = await Produto.list({ pagina, tamanhoPagina, filtros, campos });
    } catch (error) {
      next(error);
    }

    res.setHeader('X-Total-Count', result.count);
    res.status(httpStatus.OK).json(result.produtos);
  },

  /**
   * Insere um novo Produto
   * @param { body: { preco: String, nome?: String, descricao?: String, tipo: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async saveProduto(req, res, next) {
    const novoProduto = new Produto(req.body);
    try {
      const status = await novoProduto.save();
      res.status(httpStatus.CREATED).json(status);
    } catch (error) {
      next(new APIError(error.message, httpStatus.NOT_FOUND));
    }
  },

  /**
   * Busca uma Produto por id
   * @param { params: { idProduto: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async getProduto(req, res, next) {
    const _idProduto = req.params.idProduto;

    try {
      const produto = await Produto.get(_idProduto);
      res.status(httpStatus.OK).json(produto);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualiza um Produto
   * @param { params: { idProduto: String }, body: [ { chave: String, valor: String } ] } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async updateProduto(req, res, next) {
    const _idProduto = req.params.idProduto;
    const updateFields = req.body;
    let status;

    try {
      status = await Produto.updateById({ idProduto: _idProduto, updates: updateFields });
      res.status(httpStatus.OK).json(status);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove um Produto
   * @param { params: { idProduto: String } } req - Express Request
   * @param {*} res
   * @param {*} next
   */
  async deleteProduto(req, res, next) {
    const _idProduto = req.params.idProduto;
    let status;

    try {
      status = await Produto.delete({ idProduto: _idProduto });
      res.status(httpStatus.OK).json(status);
    } catch (error) {
      next(error);
    }
  },

};
module.exports = apiProdutos;
