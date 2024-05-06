module.exports = function (order) {
	return {
		id: order.id,
		userId: order.userId.login,
		statusId: order.statusId,
		productsInCart: order.productsInCart,
		paymentMethod: order.paymentMethod,
		deliveryMethod: order.deliveryMethod,
		countAll: order.countAll,
		totalAmount: order.totalAmount,
		createdOrderAt: order.createdAt,
		lastChangedStatusOrderAt: order.updatedAt,
	};
};
