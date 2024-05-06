import { ACTION_TYPE } from './action-type';
import { request } from '../utils/request';

export const logout = () => {
	request('/logout', 'Post');

	return {
		type: ACTION_TYPE.LOGOUT,
	};
};
