const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./newsletter.validation');
const ctrl = require('./newsletter.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')

    .get(validate(paramValidation.listNewsletter), ctrl.listNewsletters)

    .post(validate(paramValidation.saveNewsletter), ctrl.saveNewsletter);


router.route('/:idNewsletter')

    .get(validate(paramValidation.getNewsletter), ctrl.getNewsletter)

    .patch(validate(paramValidation.updateNewsletter), ctrl.updateNewsletter)

    .delete(validate(paramValidation.deleteNewsletter), ctrl.deleteNewsletter);

module.exports = router;
