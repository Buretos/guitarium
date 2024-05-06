import { request } from '../utils/request';
import { setCategories } from './set-categories';

export const loadCategoriesAsync = () => (dispatch) => {
	request('/products/categories').then((categoriesData) => {
		dispatch(setCategories(categoriesData.data));
		return categoriesData;
	});
};
