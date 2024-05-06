import { request } from '../utils/request';
import { removeComment } from './remove-comment copy';

export const removeCommentAsync = (productId, id) => (dispatch) => {
	request(`/products/${productId}/comments/${id}`, 'DELETE').then(() => {
		dispatch(removeComment(id));
	});
};
