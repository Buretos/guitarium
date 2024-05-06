const mongoose = require('mongoose');
const mapComment = require('./mapComment');

module.exports = function (product) {
	return {
		id: product.id,
		title: product.title,
		imageUrl: product.image,
		content: product.content,
		comments: product.comments.map((comment) =>
			mongoose.isObjectIdOrHexString(comment) ? comment : mapComment(comment),
		),
		categoryId: product.category,
		manufacturer: product.manufacturer,
		model: product.model,
		quanthy: product.quanthy,
		price: product.price,
	};
};
