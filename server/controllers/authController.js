const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

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

exports.isAuth = (req, res) => {
	if (req.isAuthenticated()) {
		// res.send(req.user);
		next();
		return;
	} else {
		res.send('You must be logged in to do that...');
	}
};
