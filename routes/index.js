const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userValidationRules = require('../validation/userValidation');
const authController = require('../controllers/auth_controller');

router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'Welcome, you may now use this app' }});
});

router.use(auth.validateToken);
router.use('/photos', require('./photoRoute'));
router.use('/albums', require('./albumRoute'));

// login user get JWT token
router.post('/login', authController.login);

// Issue new access token
router.post('/refresh', authController.refresh);

// register new user
router.post('/register', userValidationRules.createRules, authController.register);

module.exports = router;