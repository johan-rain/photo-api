// Setting up the database connection
const knex = require('knex')({
	debug: true,
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 3306,
		charset: process.env.DB_CHARSET || 'utf8mb4',
		database: process.env.DB_NAME || 'photoApi',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
	}
});

const bookshelf = require('bookshelf')(knex);

const models = {};
models.User = require('./userModel')(bookshelf);
models.Photo = require('./photoModel')(bookshelf);
models.Album = require('./albumModel')(bookshelf);

module.exports = {
	bookshelf,
	...models,
};
