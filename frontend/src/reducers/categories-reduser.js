import { ACTION_TYPE } from '../actions';

const initialCategoriesState = []; // Пустой массив данных пока ничего не получено
// const initialCategoriesState = [
// 	{
// 		id: 0,
// 		name: 'Гитары',
// 	},
// 	{
// 		id: 1,
// 		name: 'Струны',
// 	},
// 	{
// 		id: 2,
// 		name: 'Аксессуары',
// 	},
// 	{
// 		id: 3,
// 		name: 'Литература',
// 	},
// ];

export const categoriesReducer = (state = initialCategoriesState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_CATEGORIES:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
