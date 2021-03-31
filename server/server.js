require('dotenv').config({ path: './variables.env' });
// Import all our models here
require('./models/Crag');
require('./models/User');
require('./models/Comment');

const express = require('express');
const app = express();
const path = require('path');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const multer = require('multer');
const passport = require('passport');
const promisify = require('es6-promisify');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');

//MongoDB
mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// useFindAndModify: false,
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
	console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});
// See mongoose errors
// mongoose.set('debug', true);
// See this link for the reason the below is here - https://stackoverflow.com/questions/51960171/node63208-deprecationwarning-collection-ensureindex-is-deprecated-use-creat
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(cors());

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// app.set('view engine', 'json');

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/index');
// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(
	session({
		secret: process.env.SECRET,
		key: process.env.KEY,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

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
// app.use(errorHandlers.productionErrors);

app.listen(process.env.PORT || 4000, function () {
	console.log('Server is running on Port: ' + process.env.PORT);
});
