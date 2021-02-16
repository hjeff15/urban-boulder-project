const mongoose = require('mongoose');
const Crag = require('../models/Crag');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const slug = require('slugs');

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({ message: "That file type isn't allowed!!" }, false);
		}
	},
};

exports.homePage = (req, res) => {
	const hugo = { name: 'Hugo', age: 29, feeling: 'odd' };
	res.json(hugo);
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
	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extension}`;
	// then resize it....
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(800, jimp.AUTO);
	await photo.write(`../client/public/images/${req.body.photo}`, (err) =>
		console.error('jimp write error: ', err)
	);
	// Once saved, keep going....
	next();
};

exports.createCrag = async (req, res) => {
	// console.log(req.body);
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
	// Query the database for all crags
	const crags = await Crag.find();
	// console.log(crags);
	res.send(crags);
};

exports.editCrag = async (req, res) => {
	//find store given the ID
	const crag = await Crag.findOne({ _id: req.params.id });
	res.json(crag);
	//confirm they are the user
	// THIS IS STILL TODO
	//render out the edit form  so the user can update their store
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
		console.log(cragToBeEdited.slug);
	} else {
		cragToBeEdited.slug = cragSlug;
		console.log(cragToBeEdited.slug);
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
	const crag = await Crag.findOne({ slug: req.params.slug });
	if (!crag) return next();
	res.send(crag);
};

exports.searchCrags = async (req, res) => {
	console.log(req.query.q);
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
	console.log(crags);
	res.send(crags);
};
