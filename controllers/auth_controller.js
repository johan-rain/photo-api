 const bcrypt = require('bcrypt');
 const debug = require('debug')('photos:auth_controller');
 const { matchedData, validationResult } = require('express-validator');
 const models = require('../models');
 const jwt = require('jsonwebtoken');
 

 /**
 * Login
 */
 
 const login = async (req, res) => {
 
	const { email, password } = req.body;

    // login the user
    const user = await models.User.login(email, password);
    if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authorization failed',
		});
	}

	// make jwt payload
	const payload = {
		sub: user.get('email'),
		user_id: user.get('id'),
		name: user.get('first_name') + ' ' + user.get('last_name'),
	};

	// sign payload and get access token
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
	});

	// sign the payload and refresh token
	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w',
	});
	
	//respond with the access token
	return res.send({
		status: 'success',
		data: {
			access_token,
			refresh_token,
		},
	});
};

/**
 * Validate refresh token and issue a new access token
*/
const refresh = (req, res) => {
	try {
		// verify token using the refresh token secret
		const payload = jwt.verify(req.body.token,process.env.REFRESH_TOKEN_SECRET);
		
		// remove iat nad exp from refresh token payload
		delete payload.iat;
		delete payload.exp;

		// sign payload and get access-token
		const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
		});

		// send the access token to the client
		return res.send({
			status: 'success',
			data: {
				access_token,
			},
		});
	} catch (error) {
		return res.status(401).send({
			status: 'fail',
			data: 'invalid token',
		});
	}
};


 /**
  * Register a new user
  */
 const register = async (req, res) => {
	 // check for validation errors
	 const errors = validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(422).send({ status: 'fail', data: errors.array() });
	 }

	 // only the validated data from request
	 const validData = matchedData(req);

	 // generate a hash of validData.password
	 try {
		 validData.password = await bcrypt.hash(validData.password, 10);

	 } catch {
		 res.status(500).send({
			 status: 'error',
			 message: 'Exception thrown in database when hashing the password.',
		 });
		 throw error;
	 }

	 try {
		 const user = await new models.User(validData).save();
		 debug('Created new user successfully: %O', user);

		 res.send({
			 status: 'success',
			 data: {
				 email: validData.email,
				 first_name: validData.first_name,
				 last_name: validData.last_name,
			 },
		 });

	 } catch (error) {
		 res.status(500).send({
			 status: 'error',
			 message: 'Exception thrown in database when creating a new user.',
		 });
		 throw error;
	 }
 };
 

 
module.exports = {
	 login,
	 refresh, 
	 register,
};