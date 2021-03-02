const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const commentSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now,
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author',
	},
	crag: {
		type: mongoose.Schema.ObjectId,
		ref: 'Crag',
		required: 'You must supply a crag',
	},
	text: {
		type: String,
		required: 'Your review must have text!',
	},
	difficulty: {
		type: String,
		required: 'Please let us know the overall grade for the crag',
	},
});

function autopopulate(next) {
	this.populate('author');
	next();
}

commentSchema.pre('find', autopopulate);
commentSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Comment', commentSchema);
