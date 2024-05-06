import { request } from '../utils/request';
import { setProductData } from './set-product-data';

export const loadProductAsync = (productId) => (dispatch) =>
	request(`/products/${productId}`).then((productData) => {
		if (productData.data) {
			// Если есть статья (результат), то отправляем данные статьи в redux store (записываем в сторе)
			dispatch(setProductData(productData.data));
		}

		return productData; // в любом случае возвращаем данные запроса с сервера, чтобы иметь возможность их обработать (посмотреть ошибки)
	});
