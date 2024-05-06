// const mongoose = require("mongoose");
const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		evaluation: {
			type: Number,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true },
);

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
