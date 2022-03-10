const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/albumValidation');

/* Get all albums */
router.get('/', albumController.getAlbums);

/* Get a single album */
router.get('/:albumId', albumController.showAlbum);

/* Add a new album */
router.post('/', albumValidationRules.createRules, albumController.addAlbum);

/* Update a specific album */
router.put('/:albumId', albumValidationRules.updateRules, albumController.updateAlbum);

/* Add a photo in album */
router.post('/:albumId/photos', albumValidationRules.newPhotoRules, albumController.newPhoto);

module.exports = router;