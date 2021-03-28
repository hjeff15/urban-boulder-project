const express = require('express');
const router = express.Router();
const cragController = require('../controllers/cragController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(cragController.getCrags));
router.get('/pages/:page', catchErrors(cragController.getCrags));
router.get('/crag/:slug', catchErrors(cragController.getCragBySlug));

router.get('/createCrag', catchErrors(cragController.addCrag));
router.post(
	'/createCrag',
	cragController.upload,
	catchErrors(cragController.resize),
	catchErrors(cragController.createCrag)
);

router.get('/crags/:id/edit', catchErrors(cragController.editCrag));
router.post(
	'/crags/:id/edit',
	cragController.upload,
	catchErrors(cragController.resize),
	catchErrors(cragController.updateCrag)
);

router.post('/login', authController.login);

// 1. Validate the registration data
// 2. register the user
// 3. need to log them in...
router.post(
	'/register',
	userController.validateRegister,
	userController.register,
	authController.login
);

router.get('/logout', authController.logout);

router.get('/account/:id', userController.account);
router.post('/account/:id', userController.updateAccount);

router.post('/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post(
	'/account/reset/:token',
	authController.confirmedPasswords,
	authController.updatePassword
);

router.post(
	'/comments/:id',
	authController.isAuth,
	commentController.addComment
);

/* 
	API
*/
router.get('/api/search', catchErrors(cragController.searchCrags));
router.get('/api/crags/near', catchErrors(cragController.mapCrags));
router.post('/api/crags/:id/like', catchErrors(cragController.likeCrag));

module.exports = router;
