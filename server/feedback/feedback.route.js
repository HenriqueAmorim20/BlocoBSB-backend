const express = require('express');
const validate = require('express-validation');
const paramValidation = require('./feedback.validation');
const ctrl = require('./feedback.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')

    .get(validate(paramValidation.listFeedback), ctrl.listFeedbacks)

    .post(validate(paramValidation.saveFeedback), ctrl.saveFeedback);


router.route('/:idFeedback')

    .get(validate(paramValidation.getFeedback), ctrl.getFeedback)

    .patch(validate(paramValidation.updateFeedback), ctrl.updateFeedback)

    .delete(validate(paramValidation.deleteFeedback), ctrl.deleteFeedback);

module.exports = router;
