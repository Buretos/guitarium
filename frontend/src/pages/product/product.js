import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useParams } from 'react-router-dom';
import { Comments, ProductForm, ProductContent } from './components';
import { RESET_PRODUCT_DATA, loadProductAsync } from '../../actions';
import { Error, Loader, PrivateContent } from '../../components';
import { selectProduct } from '../../selectors';
import { ROLE } from '../../constants';
import styled from 'styled-components';

const ProductContainer = ({ className }) => {
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	const params = useParams(); //  извлечения параметров из текущего URL
	const [isLoading, setIsLoading] = useState(false); // Чтобы реагироапть на загрузуу
	const isCreating = useMatch('/product'); // Возвращает данные соответствия о маршруте по заданному пути относительно текущего местоположения.
	const isEditing = useMatch('/product/:id/edit');
	const product = useSelector(selectProduct);

	// Данные продукта сбрасываем при каждом монтировании компонента Product (чтобы синхронизировать с данными сервера). Для этого используем синхронный аналог useEffect, т.е. useLayoutEffect, который срабатывает  при его (поста) монтировании, а потом данные будут подгружаться уже через useEffect
	useLayoutEffect(() => {
		setIsLoading(true);
		dispatch(RESET_PRODUCT_DATA);
	}, [dispatch, isCreating]);

	useEffect(() => {
		if (isCreating) {
			setIsLoading(false);
			return;
		}
		// В строке адреса товара  может существовать id реального товара. И любой знак после "/product" может интерпретироваться как id товара. Поэтому когда придёт ответ после запроса на сервер, нужно проверить есть ли такая статья. Если нет, то нужно выдать ошибку "Такой статьи нет". Стоит посмотреть экшен loadProductAsync.
		dispatch(loadProductAsync(params.id)).then((productData) => {
			// Проверяем полученный ответ, записываем ответ по ошибке (текст ошибки.или null) и устанавливаем её в state.
			setError(productData.error);
			setIsLoading(false);
		});
	}, [dispatch, params.id, isCreating]);
	// странная история с обновлением категории продукта. Она не обновляется сразу, только после перезагрузки страницы.

	const SpecificProductPage = isLoading ? (
		<Loader />
	) : isCreating || isEditing ? (
		<PrivateContent access={[ROLE.SALESMAN, ROLE.ADMIN]} error={error}>
			<div className={className}>
				<ProductForm product={product} />
			</div>
		</PrivateContent>
	) : (
		<div className={className}>
			<ProductContent product={product} />
			<Comments comments={product.comments} productId={product.id} />
		</div>
	);

	// Смотрим есть ли ошибка. Если есть, то выдаём её, если нет, то выдаём контент ответа в зависимости от того просматриваем, редактируем или создаём статью товара  (см. выше SpecificProductPage).
	return error ? <Error error={error} /> : SpecificProductPage;
};

export const Product = styled(ProductContainer)`
	margin: 40px 0;
	padding: 0 80px;
`;
