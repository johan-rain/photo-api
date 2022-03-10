const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation/photoValidation');

/* Get all photos */
router.get('/', photoController.getPhotos);

/* Get a single photo */
router.get('/:photoId', photoController.showPhoto);

/* Add a new photo */
router.post('/', photoValidationRules.createRules, photoController.newPhoto);

/* Update a single photo */
router.put('/:photoId', photoValidationRules.updateRules, photoController.updatePhoto);

module.exports = router;