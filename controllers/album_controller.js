const debug = require('debug')('books:example_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get albums
 */
 const getAlbums = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['albums'],
	});

	res.status(200).send({
		status: 'success',
		data: {
			album: user.related('albums'),
		},
	});
};

/**
 * Get specific album
 */
 const showAlbum = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['albums'],
	});

	const userAlbums = user.related('albums');

	const album = userAlbums.find(album => album.id == req.params.albumId);

	if (!album) {
		return res.status(404).send({
			status: 'fail',
			message: 'No album here',
		});
	}

	const albumId = await models.Album.fetchById(req.params.albumId, {
		withRelated: ['photos'],
	});

	res.send({
		status: 'success',
		data: {
			album: albumId,
		},
	});
};

/**
 * Add a new album
 */
const newAlbum = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// Only get the validated and requested data
	const validData = matchedData(req);
	
	validData.user_id = req.user.user_id;

	try {
		const album = await new models.Album(validData).save();
		debug("Created new album successfully: %O", album);

		res.send({
			status: 'success',
			data: album,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
}

/**
 * Update album
 */
 const updateAlbum = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['albums'],
	});
	// get album by id
	const album = await models.Album.fetchById(req.params.albumId);

	const userAlbum = user
		.related('albums')
		.find(album => album.id == req.params.albumId);

	// check if album exists
	if (!album) {
		debug('Album to update was not found. %o', { id: req.params.albumId });
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}

	// only if user owns the album
	if (!userAlbum) {
		debug('Cannot update due to album belonging to other user. %o', {
			id: req.params.albumId,
		});
		return res.status(403).send({
			status: 'fail',
			data: 'Action denied. Try again',
		});
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// Only get the validated and requested data
	const validData = matchedData(req);

	try {
		const updatedAlbum = await album.save(validData);
		debug('Successfully updated album: %O', updatedAlbum);

		res.send({
			status: 'success',
			data: updatedAlbum,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new album.',
		});
		throw error;
	}
};

const newPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// Only get the validated and requested data
	const validData = matchedData(req);

	const user = await models.User.fetchById(req.user.user_id, {
		withRelated: ['albums', 'photos'],
	});

	const userAlbum = user
		.related('albums')
		.find(album => album.id == req.params.albumId);

	const userPhoto = user
		.related('photos')
		.find(photo => photo.id == validData.photo_id);

	const album = await models.Album.fetchById(req.params.albumId, {
		withRelated: ['photos'],
	});

	// Check if album exists so user can add new photo
	const existing_photo = album
		.related('photos')
		.find(photo => photo.id == validData.photo_id);

	// Check if albumId is there
	if (!album) {
		debug('Album to update was not found. %o', { id: req.params.albumId });
		res.status(404).send({
			status: 'fail',
			data: 'No album here',
		});
		return;
	}

	// Check if the photo is there
	if (existing_photo) {
		return res.send({
			status: 'fail',
			data: 'Photo already here',
		});
	}

	// If album belongs to another user, deny.
	if (!userAlbum || !userPhoto) {
		debug('Cannot add photo to album you do not own. %o', {
			id: req.params.albumId,
		});
		res.status(403).send({
			status: 'fail',
			data: 'Action denied. Try again!',
		});
		return;
	}

	try {
		const result = await album.photos().attach(validData.photo_id);
		debug('Successfully added photo to album : %O', result);

		res.send({
			status: 'success',
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to an album.',
		});
		throw error;
	}
};

module.exports = {
	getAlbums,
	showAlbum,
	newAlbum,
	updateAlbum,
	newPhoto,
};