const { fromString } = require('html-to-text');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const { stringify } = require('uuid');

const cragSchema = new mongoose.Schema({
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
	// location: {
	//     type: {
	//         type: String,
	//         default : "Point"
	//     },
	//     coordinates: [{
	//         type: Number,
	//         required: 'You must supply coordinates!'
	//     }],
	//     address: {
	//         type: String,
	//         required: "You must supply an address!"
	//     }
	// },
	difficulty: {
		type: String,
		required: 'Please let us know the overall grade for the crag',
	},
	// file: {
	// 	type: Buffer,
	// 	required: 'Please add a photo!',
	// },
	// imagePreviewUrl:{

	// }
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
});

cragSchema.pre('save', function (next) {
	if (!this.isModified('cragName')) {
		next();
		return;
	} else {
		this.slug = slug(this.cragName);
		console.log(this.slug);
		next();
	}
});

module.exports = mongoose.model('Crag', cragSchema);
