import { request } from '../utils/request';
import { addComment } from './add-comment';

export const addCommentAsync = (productId, content, evaluation) => (dispatch) => {
	request(`/products/${productId}/comments`, 'POST', { content, evaluation }).then(
		(comment) => {
			dispatch(addComment(comment.data));
		},
	);
};
