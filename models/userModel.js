/**
 * User model
 */

 const bcrypt = require('bcrypt');

 module.exports = bookshelf => {
	 return bookshelf.model('User',{
		tableName: 'users',
		photos() {
			return this.hasMany('Photo');
		},
		albums() {
			return this.hasMany('Album');
		},
	}, {

		async login(email, password) {
			
			const user = await new this({ email }).fetch({ require: false });
			if (!user) {
				return false;
			}
			const hash = user.get('password');
			
			const result = await bcrypt.compare(password, hash);
			if (!result) {
				return false;
			}
			
			// all is well, return user
			return user;
		},
		
		async fetchById(id, fetchOptions = {}) {
				 return await new this({ id }).fetch(fetchOptions);
		},
	});
};