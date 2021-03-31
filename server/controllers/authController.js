const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
// const { findOne } = require('../models/Crag');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.send('Not Logged In...');
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			console.log('Logged In...');
			return res.send(req.user);
		});
	})(req, res, next);
};

exports.logout = (req, res) => {
	req.logout();
	res.send('Logged out..');
	console.log('Logged out..');
};

exports.isAuth = async (req, res, next) => {
	const user = await User.findById(req.body.user);
	if (user) {
		next();
		return;
	} else {
		res.send('You must be logged in to do that...');
	}
};

exports.forgot = async (req, res) => {
	// 1. See if a user with that email exists
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		res.send({ msg: 'No account with that email address exists 😟' });
	}
	// 2. Set reset tokens and expiry on their account
	user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
	user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
	await user.save();
	// 3. Send them an email with the token
	const resetURL = `http://localhost:3000/account/reset/${user.resetPasswordToken}`;
	await mail.send({
		user: user,
		subject: 'Password Reset Request',
		resetURL,
		filename: 'password-reset',
	});

	res.send({
		msg: `You have been emailed a password to ${req.body.email}`,
		// link: `${resetURL}`,
	});
	// 4. redirect to login page
};

exports.reset = async (req, res) => {
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() },
	});
	if (!user) {
		res.send({
			msg: 'Password reset has expired or is invalid. Sorry...😟',
		});
	}
	res.send(user);
};

exports.confirmedPasswords = (req, res, next) => {
	if (req.body.password === req.body.passwordConfirm) {
		// console.log('Passwords Match!!');
		next();
		return;
	}
	res.send('Paswords do not match!!');
};

exports.updatePassword = async (req, res) => {
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() },
	});
	if (!user) {
		res.send({
			msg: 'Password reset has expired or is invalid. Sorry...😟',
		});
	}
	const setPassword = promisify(user.setPassword, user);
	await setPassword(req.body.password);
	// delete password token and expiry date in MongoDB
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	const updatedUser = await user.save();
	await req.login(updatedUser);

	res.send({ updatedUser, redirect: updatedUser._id });
};
