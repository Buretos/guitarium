import { ACTION_TYPE } from '../actions';
// Initial state
const initialCartState = {
	productsInCart: [],
};

// Reducer
export const cartReducer = (state = initialCartState, action) => {
	switch (action.type) {
		case ACTION_TYPE.ADD_TO_CART:
			const { productsInCart } = state;
			const { payload: product } = action;
			const existingProductIndex = productsInCart.findIndex(
				(p) => p.id === product.id,
			);

			if (existingProductIndex >= 0) {
				const updatedCart = [...productsInCart];
				const existingCount = updatedCart[existingProductIndex].count || 0;
				updatedCart[existingProductIndex] = {
					...updatedCart[existingProductIndex],
					count: existingCount + 1,
				};
				return { ...state, productsInCart: updatedCart };
			} else {
				return {
					...state,
					productsInCart: [...productsInCart, { ...product, count: 1 }],
				};
			}
		case ACTION_TYPE.CLEAR_CART:
			return {
				...state,
				productsInCart: [], // Обнуление корзины
			};
		case ACTION_TYPE.REMOVE_FROM_CART:
			const updatedCart = state.productsInCart.reduce((newCatr, item) => {
				if (item.id === action.payload.id) {
					// Если count больше 1, уменьшаем на 1
					if (item.count > 1) {
						newCatr.push({ ...item, count: item.count - 1 });
					}
					// Если count равен 1, товар удаляется, поэтому здесь ничего не делаем
				} else {
					// Все остальные товары просто переходят в новый список
					newCatr.push(item);
				}
				return newCatr;
			}, []);

			return {
				...state,
				productsInCart: updatedCart,
			};

		default:
			return state;
	}
};
