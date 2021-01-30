require('dotenv').config({ path: './variables.env' });
const express = require('express');
const app = express();
const path = require('path');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const errorHandlers = require('./handlers/errorHandlers');

const routes = require('./routes/index');

app.use(cors());

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// app.set('view engine', 'pug');

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
	console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// Import all our models here
require('./models/Crag');

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// pass variables to our templates + all requests
app.use((req, res, next) => {
	// res.locals.h = helpers;
	// res.locals.flashes = req.flash();
	res.locals.user = req.user || null;
	res.locals.currentPath = req.path;
	next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
	req.login = promisify(req.login, req);
	next();
});

// All our routes will be redirected to our 'routes' folder
app.use('/', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
// app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
	/* Development Error Handler - Prints stack trace */
	app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

app.listen(process.env.PORT, function () {
	console.log('Server is running on Port: ' + process.env.PORT);
});
