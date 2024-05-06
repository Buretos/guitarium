const mongoose = require('mongoose');
const status = require('../constants/status');

const OrderSchema = mongoose.Schema(
	{
		userId: {
			// type: String,
			// required: true,
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		productsInCart: [
			{
				title: {
					type: String,
					required: true,
				},
				imageUrl: {
					type: String,
				},
				categoryId: {
					type: Number,
					required: true,
				},
				manufacturer: {
					type: String,
				},
				model: {
					type: String,
				},
				quanthy: {
					type: Number,
				},
				price: {
					type: String,
					required: true,
				},
				commentsCount: {
					type: Number,
				},
				commentsRating: {
					type: Number,
				},
				count: {
					type: Number,
					required: true,
				},
			},
		],
		paymentMethod: {
			type: String,
		},
		deliveryMethod: {
			type: String,
		},
		statusId: {
			type: Number,
			default: status.CREATED,
		},
		countAll: {
			type: Number,
		},
		totalAmount: {
			type: Number,
		},
	},
	{ timestamps: true },
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
