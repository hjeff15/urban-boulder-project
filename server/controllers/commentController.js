const mongoose = require('mongoose');
// const Comment = mongoose.Model('Comment');
const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
	// req.body.author = req.body.user;
	req.body.review.crag = req.params.id;
	console.log(req.body.review);
	const newComment = new Comment(req.body.review);
	await newComment.save();
	res.send({ msg: 'Thanks for your comments!' });
};
