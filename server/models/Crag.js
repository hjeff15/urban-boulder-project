const { fromString } = require('html-to-text');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const { stringify } = require('uuid');

const cragSchema = new mongoose.Schema(
	{
		cragName: {
			type: String,
			trim: true,
			required: "Please enter your crag's name!",
		},
		slug: String,
		cragDescription: {
			type: String,
			trim: true,
		},
		difficulty: {
			type: String,
			required: 'Please let us know the overall grade for the crag',
		},
		minDifficulty: {
			type: Number,
			required:
				'Please let us know the overall minimum difficulty for the crag',
		},
		maxDifficulty: {
			type: Number,
			required:
				'Please let us know the overall maximum difficulty for the crag',
		},
		freeAllDay: {
			type: Boolean,
		},
		busyWeekend: {
			type: Boolean,
		},
		avoidRush: {
			type: Boolean,
		},
		created: {
			type: Date,
			default: Date.now,
		},
		location: {
			type: {
				type: String,
				default: 'Point',
			},
			coordinates: [
				{
					type: Number,
					required: 'You must supply coordinates!',
				},
			],
		},
		photo: {
			type: String,
		},
		author: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: 'You must supply an author',
		},
		likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//Define our indexes
cragSchema.index({
	cragName: 'text',
	cragDescription: 'text',
});

cragSchema.index({
	location: '2dsphere',
});

cragSchema.pre('save', async function (next) {
	if (!this.isModified('cragName')) {
		next();
		return;
	} else {
		this.slug = slug(this.cragName);
		// find other stores that have the slug of this.name-1 , this.name-2 etc...
		// This function is duplicated in the 'updateCrag' middleware too...TODO - tidy up...??
		const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
		const cragsWithSlug = await this.constructor.find({ slug: slugRegEx });
		if (cragsWithSlug.length) {
			this.slug = `${this.slug}-${cragsWithSlug.length + 1}`;
		}
		next();
	}
});

// find reviews where the crags _id === reviews crag property
cragSchema.virtual('comments', {
	ref: 'Comment', // what model to use
	localField: '_id', // which filed on the crag
	foreignField: 'crag', //which field on the review
});

module.exports = mongoose.model('Crag', cragSchema);
