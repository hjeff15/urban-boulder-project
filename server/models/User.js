const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, 'Invalid Email Address'],
		required: 'Please Supply an email address',
	},
	name: {
		type: String,
		required: 'Please supply a name',
		trim: true,
	},
	emailHash: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	likes: [{ type: mongoose.Schema.ObjectId, ref: 'Crag' }],
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('email')) {
		next();
		return;
	} else {
		this.emailHash = md5(this.email);
	}
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
