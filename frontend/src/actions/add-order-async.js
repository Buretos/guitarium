import { request } from '../utils/request';
import { setUser } from './set-user';

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
		}).then((userData) => {
			dispatch(setUser(userData.data));
		});
	};
