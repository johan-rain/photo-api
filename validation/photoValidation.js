const { body } = require('express-validator');

const updateRules = [
	body('title').optional().isLength({ min: 3 }),
	body('url').optional().isURL().isLength({ min: 3 }),
	body('comment').optional().isLength({ min: 3 }),
];

const createRules = [
	body('title').exists().isLength({ min: 3 }),
	body('url').exists().isURL().isLength({ min: 3 }),
	body('comment').optional().isLength({ min: 3 }),
];

module.exports = {
	updateRules,
	createRules,
};