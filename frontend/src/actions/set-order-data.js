import { ACTION_TYPE } from './action-type';

export const setOrderData = (orderData) => ({
	type: ACTION_TYPE.SET_ORDER_DATA,
	payload: orderData,
});
