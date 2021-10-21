const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./slide.validation');
const ctrl = require('./slide.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')

    .get(validate(paramValidation.listSlide), ctrl.listSlides)

    .post(validate(paramValidation.saveSlide), ctrl.saveSlide);


router.route('/:idSlide')

    .get(validate(paramValidation.getSlide), ctrl.getSlide)

    .patch(validate(paramValidation.updateSlide), ctrl.updateSlide)

    .delete(validate(paramValidation.deleteSlide), ctrl.deleteSlide);

module.exports = router;
