// Setting up the database connection
const knex = require('knex')({
	debug: true,
	client: 'mysql',
	connection: process.env.CLEARDB_DATABASE_URL || {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 3306,
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || 'photoApi',
	}
});

const bookshelf = require('bookshelf')(knex);

const models = {};
models.Photo = require('./photoModel')(bookshelf);
models.Album = require('./albumModel')(bookshelf);
models.User = require('./userModel')(bookshelf);

module.exports = {
	bookshelf,
	...models,
};