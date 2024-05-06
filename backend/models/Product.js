const mongoose = require('mongoose');
const validator = require('validator');

const ProductSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
			validate: {
				validator: validator.isURL,
				message: 'Image should be a valid url',
			},
		},
		content: {
			type: String,
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		category: {
			type: Number,
			required: true,
		},
		manufacturer: {
			type: String,
			required: true,
		},
		model: {
			type: String,
			required: true,
		},
		quanthy: {
			type: Number,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
