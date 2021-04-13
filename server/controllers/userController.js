const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const promisify = require('es6-promisify');
const User = mongoose.model('User');

exports.loginForm = (req, res) => {
	res.send('Login is working');
};

exports.validateRegister = async (req, res, next) => {
	req.sanitizeBody('name');
	req.checkBody('name', 'You must supply a name').notEmpty();
	req.checkBody('email', 'You must supply an email').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false,
	});
	req.checkBody('password', 'Password cannot be blank!').notEmpty();
	req.checkBody(
		'passwordConfirm',
		'Confirmed password cannot be blank'
	).notEmpty();
	req.checkBody(
		'passwordConfirm',
		'Ooops, looks like your passwords do not match...'
	).equals(req.body.password);

	const checkIfName = await User.findOne({ name: req.body.name });
	const checkIfEmail = await User.findOne({ email: req.body.email });
	if (checkIfName || checkIfEmail) {
		res.send('User Found');
		return;
	} else {
		const errors = req.validationErrors();
		if (errors) {
			const sendErrors = errors.map((err) => err.msg);
			res.send(sendErrors);
		} else {
			next();
		}
	}
};

exports.register = async (req, res, next) => {
	const user = new User({ email: req.body.email, name: req.body.name });
	const register = promisify(User.register, User);
	await register(user, req.body.password);
	next();
};

exports.account = async (req, res) => {
	// console.log(req.params.id);
	const user = await User.findOne({ _id: req.params.id });
	const returnedData = {};
	returnedData.name = user.name;
	returnedData.email = user.email;
	// console.log(returnedData);
	res.json(returnedData);
};

exports.updateAccount = async (req, res) => {
	// console.log(req.params.id);
	// console.log(req.body);
	const updates = {
		name: req.body.name,
		email: req.body.email,
	};
	const user = await User.findOneAndUpdate(
		{ _id: req.params.id },
		{ $set: updates },
		{ new: true, runValidators: true, context: 'query' }
	);

	res.json(user);
};
