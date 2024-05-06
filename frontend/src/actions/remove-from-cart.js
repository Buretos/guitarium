import { ACTION_TYPE } from './action-type';

export const removeFromCart = (productId) => ({
	type: ACTION_TYPE.REMOVE_FROM_CART,
	payload: productId,
});
