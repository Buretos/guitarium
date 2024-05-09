import { request } from '../utils/request';

export const addOrderAsync =
	(userId, productsInCart, paymentMethod, deliveryMethod, countAll, totalAmount) =>
	(dispatch) => {
		request('/orders', 'POST', {
			userId,
			productsInCart,
			paymentMethod,
			deliveryMethod,
			countAll,
			totalAmount,
		});
	};
