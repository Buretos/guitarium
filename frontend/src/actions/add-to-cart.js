import { ACTION_TYPE } from './action-type';

export const addToCart = (product) => {
	return {
		type: ACTION_TYPE.ADD_TO_CART,
		payload: product,
	};
};
