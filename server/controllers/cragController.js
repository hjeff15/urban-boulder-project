const mongoose = require('mongoose');
const Crag = require('../models/Crag');
const User = require('../models/User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const slug = require('slugs');
const fs = require('fs');
const util = require('util');
const { findById } = require('../models/User');
const { uploadS3File, getFileStream } = require('../s3');

const unlinkFile = util.promisify(fs.unlink);

const multerOptions = {
	dest: 'public/images',
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({ message: "That file type isn't allowed!!" }, false);
		}
	},
};

exports.addCrag = (req, res) => {
	res.json(res.json);
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
	//check if there is no new file to resize
	if (!req.file) {
		next(); //skip to the next middleware
		return;
	}

	const s3Location = await uploadS3File(req.file);
	try {
		await unlinkFile(req.file.path);
	} catch (e) {
		console.error(e);
	}

	req.body.photo = s3Location.key;
	req.body.s3photo = s3Location.key;

	//OLD CODE BELOW IF IMG SAVED TO SERVER. DOES NOT WORK ON HEROKU UNPAID TIER BUT HERE FOR POSTERITY?
	// const extension = req.file.mimetype.split('/')[1];
	// req.body.photo = `${uuid.v4()}.${extension}`;

	// then resize it....
	// const photo = await jimp.read(req.file.buffer);
	// await photo.resize(800, jimp.AUTO);
	// await photo.write(`../server/public/images/${req.body.photo}`, (err) =>
	// 	console.error('jimp write error: ', err)
	// );
	// Once saved, keep going....
	next();
};

exports.createCrag = async (req, res) => {
	// req.body must be stringified in order to recieve image file
	const obj = JSON.parse(JSON.stringify(req.body));
	// function to Parse the location coordinates BACK into integers
	const cleanData = (data) => {
		const coordinates = data.location.coordinates.split(',');
		const lng = parseFloat(coordinates[0]);
		const lat = parseFloat(coordinates[1]);
		const newLocation = [lng, lat];
		let newData = { ...data };
		newData.location.coordinates = newLocation;
		return newData;
	};
	const crag = new Crag(cleanData(obj));
	await crag.save();
	res.send(crag);
};

exports.getCrags = async (req, res) => {
	const page = req.params.page || 1;
	const limit = 6;
	const skip = page * limit - limit;
	// Query the database for all crags, and organise by the most recently created (this includes updates at the moment)
	const cragsPromise = Crag.find()
		.skip(skip)
		.limit(limit)
		.sort({ created: -1 });
	const countPromise = Crag.countDocuments();
	const [crags, count] = await Promise.all([cragsPromise, countPromise]);
	//Use forEach below to attach photo file to each
	//crags.forEach((x) => {x.newElement = 'Hi'})
	const pages = Math.ceil(count / limit);
	const data = {
		crags: crags,
		page: page,
		pages: pages,
		count: count,
	};
	res.send(data);
};

exports.editCrag = async (req, res) => {
	//find store given the ID
	const crag = await Crag.findOne({ _id: req.params.id });
	res.json(crag);
	//confirm they are the user
	// THIS IS STILL TODO ?
};

exports.updateCrag = async (req, res) => {
	// format the incoming FormData
	const obj = JSON.parse(JSON.stringify(req.body));
	// change the coordinates from a string to array of Floats
	const cleanData = (data) => {
		const coordinates = data.location.coordinates.split(',');
		const lng = parseFloat(coordinates[0]);
		const lat = parseFloat(coordinates[1]);
		const newLocation = [lng, lat];
		let newData = { ...data };
		newData.location.coordinates = newLocation;
		return newData;
	};
	// Add Slug
	const cragToBeEdited = new Crag(cleanData(obj));
	const cragSlug = slug(cragToBeEdited.cragName);
	// Check if there are any other slugs with this name in the database...
	// If so, tack a 1 or 2 or etc on to the end of it (this function is also in the Schema when created)
	const slugRegEx = new RegExp(`^(${cragSlug})((-[0-9]*$)?)$`, 'i');
	const cragsWithSlug = await Crag.find({ slug: slugRegEx });
	if (cragsWithSlug.length) {
		cragToBeEdited.slug = `${cragSlug}-${cragsWithSlug.length + 1}`;
	} else {
		cragToBeEdited.slug = cragSlug;
	}
	// find and update the crag
	const crag = await Crag.findOneAndUpdate(
		{ _id: cragToBeEdited._id },
		cragToBeEdited,
		{
			new: true, //returns a new store instead of the old one
			runValidators: true,
			useFindAndModify: false,
		}
	).exec();
	// Send the new crag back to React to go to the updated slug
	const newCrag = await Crag.findOne({ _id: cragToBeEdited._id });
	res.send(newCrag);
};

exports.getCragBySlug = async (req, res) => {
	const crag = await Crag.findOne({ slug: req.params.slug }).populate(
		'comments'
	);
	if (!crag) return next();
	res.send(crag);
};

exports.searchCrags = async (req, res) => {
	const crags = await Crag
		// Find crags first
		.find(
			{
				$text: {
					$search: req.query.q,
				},
			},
			{
				score: { $meta: 'textScore' },
			}
		)
		// Then sort the crags
		.sort({
			score: { $meta: 'textScore' },
		})
		// limit the number of crags returned
		.limit(5);
	res.send(crags);
};

exports.mapCrags = async (req, res) => {
	const coordinates = [req.query.lng, req.query.lat].map(parseFloat);

	const q = {
		location: {
			$near: {
				$geometry: {
					type: 'Point',
					coordinates: coordinates,
				},
				$maxDistance: req.query.radius, //km
			},
		},
	};

	const crags = await Crag.find(q).select(
		'cragName location difficulty photo s3photo slug minDifficulty maxDifficulty'
	);
	res.send(crags);
};

exports.likeCrag = async (req, res) => {
	const user = await User.findById(req.body.userId);
	const crag = await Crag.findById(req.params.id);

	const cragLikes = crag.likes.map((obj) => obj.toString());
	const cragOperator = cragLikes.includes(req.body.userId)
		? '$pull'
		: '$addToSet';
	const cragToUpdate = await Crag.findByIdAndUpdate(
		req.params.id,
		{ [cragOperator]: { likes: req.body.userId } },
		{ new: true }
	);
	// Add/Remove liked crags from user profile
	const likes = user.likes.map((obj) => obj.toString());
	const operator = likes.includes(req.params.id) ? '$pull' : '$addToSet';
	const userToUpdate = await User.findByIdAndUpdate(
		req.body.userId,
		{ [operator]: { likes: req.params.id } },
		{ new: true }
	);
	res.send(userToUpdate);
};
