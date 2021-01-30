const mongoose = require('mongoose');
const Crag = require('../models/Crag');

exports.homePage = (req, res) => {
	const hugo = { name: 'Hugo', age: 29, feeling: 'odd' };
	res.json(hugo);
};

exports.addCrag = (req, res) => {
	res.json(res.json);
};

exports.createCrag = async (req, res) => {
	// console.log(req.body);
	// res.json(req.body);
	const crag = new Crag(req.body);
	await crag.save();
	console.log('It worked!!');
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
	//find and update the crag
	const crag = await Crag.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, //returns a new store instead of the old one
		runValidators: true,
	}).exec();

	//redirect to crag and tell then it worked
	// console.log(req.params.id + 'has been updated');

	res.send(crag);
};

exports.getCragBySlug = async (req, res) => {
	const crag = await Crag.findOne({ slug: req.params.slug }).populate();
};
