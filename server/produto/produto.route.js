const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./produto.validation');
const ctrl = require('./produto.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')

    .get(validate(paramValidation.listProduto), ctrl.listProdutos)

    .post(validate(paramValidation.saveProduto), ctrl.saveProduto);


router.route('/:idProduto')

    .get(validate(paramValidation.getProduto), ctrl.getProduto)

    .patch(validate(paramValidation.updateProduto), ctrl.updateProduto)

    .delete(validate(paramValidation.deleteProduto), ctrl.deleteProduto);

module.exports = router;
