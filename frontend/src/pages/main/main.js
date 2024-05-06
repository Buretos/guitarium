import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paginate from 'react-paginate'; // import Paginate from 'react-paginate';
import _ from 'lodash';
import { PAGINATION_LIMIT, ROLE } from '../../constants';
import { ProductCard, Search, SortSelect, CategoriesSelect } from './components';
import { debounce } from './utils';
import { addToCart } from '../../actions';
import { checkAccess, ratingProduct } from '../../utils';
import { selectUserRole } from '../../selectors';
import { Loader } from '../../components';
import styled from 'styled-components';
import { request } from '../../utils/request';

const sortOption = [
	{
		value: ' ',
		label: 'Сортировка',
		sort: (data) => _.orderBy(data, [' '], ['desc']),
	},
	{
		value: 'priceASK',
		label: 'по возрастанию цены',
		sort: (data) =>
			_.orderBy(
				data,
				[(currentProducts) => parseFloat(currentProducts.price)],
				['asc'],
			),
	},
	{
		value: 'priceDESC',
		label: 'по убыванию цены',
		sort: (data) =>
			_.orderBy(
				data,
				[(currentProducts) => parseFloat(currentProducts.price)],
				['desc'],
			),
	},
	{
		value: 'ratingASC',
		label: 'по рейтингу',
		sort: (data) =>
			_.orderBy(
				data,
				[
					(currentProducts) =>
						parseFloat(ratingProduct(currentProducts.comments)),
				],
				['desc'],
			),
	},
	{
		value: 'ratingDESC',
		label: 'по рейтингу (обратный пордяок)',
		sort: (data) =>
			_.orderBy(
				data,
				[
					(currentProducts) =>
						parseFloat(ratingProduct(currentProducts.comments)),
				],
				['asc'],
			),
	},
];

const MainContainer = ({ className }) => {
	const dispatch = useDispatch();
	const [products, setProducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false); // флаг, срабатывающий после истечения 2 секунд задержки в debounce
	const [categoryId, setCategoryId] = useState('');
	const [sorting, setSorting] = useState('NO'); //priceDESC
	const [isLoading, setIsLoading] = useState(false);
	const roleId = useSelector(selectUserRole);
	const isSalesman = checkAccess([ROLE.SALESMAN], roleId);
	const isAdmin = checkAccess([ROLE.ADMIN], roleId);

	const handleCategoryChange = (category) => {
		setCategoryId(category);
	};

	const handlePageChange = (selectedPage) => {
		setCurrentPage(selectedPage.selected);
	};

	const handleAddToCart = (product) => {
		dispatch(addToCart(product));
	};

	useEffect(() => {
		setIsLoading(true);
		request(`/products?search=${searchPhrase}`).then(({ products }) => {
			setProducts(products);
			setIsLoading(false);
		});
		setSorting('NO');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldSearch, categoryId]);

	const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);
	// startDelayedSearch спустя 2 секудны поменяет флаг поиска и поиск сработает в useEffect
	// благодаря useMemo ссылка на startDelayedSearch будет сохранятся между рендерами, она не будет сбрасываться и отработает нормально

	const onSearch = ({ target }) => {
		setSearchPhrase(target.value); // устанавливаем searchPhrase из значения ввода
		startDelayedSearch(!shouldSearch); // через 2 секунды инвертируем (меняем) флаг поиска. При этом searchPhrase отправляется в операцию на серевер (см. useEffect)
	};

	const filteredProducts = categoryId // фильтруем список полученный с сервера и отобранный по поисковой фразе (запрос на json-server с поисковой фразой)
		? products.filter((product) => product.categoryId.toString() === categoryId)
		: products;
	const startIndex = currentPage * PAGINATION_LIMIT; // Здесь PAGINATION_LIMIT = 9 - количество элементов на странице
	const endIndex = startIndex + PAGINATION_LIMIT; // Здесь PAGINATION_LIMIT = 9 - количество элементов на странице
	const currentProducts = filteredProducts.slice(startIndex, endIndex);

	const handleSort = (e) => {
		setSorting(e.target.value);
	};

	useEffect(() => {
		const sortObJ = sortOption.find((option) => option.value === sorting);
		if (sortObJ) {
			setProducts(sortObJ.sort(filteredProducts));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sorting, categoryId]);

	return (
		<div className={className}>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<div className="mainHeader">
						{' '}
						<div>
							<CategoriesSelect
								categoryId={categoryId}
								onChange={(e) => handleCategoryChange(e.target.value)}
							/>
						</div>
						<div>
							<Search searchPhrase={searchPhrase} onChange={onSearch} />
						</div>
						<div>
							<SortSelect
								options={sortOption}
								onSort={handleSort}
								value={sorting}
							/>
						</div>
					</div>
					<div className="product-and-search">
						{currentProducts.length > 0 ? (
							<div className="product-list">
								{currentProducts.map(
									({
										id,
										title,
										imageUrl,
										categoryId,
										model,
										manufacturer,
										quanthy,
										price,
										comments,
										commentsCount = comments.length,
										commentsRating = ratingProduct(comments),
									}) => (
										<ProductCard
											key={id}
											id={id}
											title={title}
											imageUrl={imageUrl}
											categoryId={categoryId}
											model={model}
											manufacturer={manufacturer}
											quanthy={quanthy}
											price={price}
											commentsCount={commentsCount}
											commentsRating={commentsRating}
											cardOnly={
												isSalesman || isAdmin ? true : false
											}
											onClick={() =>
												handleAddToCart({
													id,
													title,
													imageUrl,
													categoryId,
													model,
													manufacturer,
													quanthy,
													price,
													commentsCount,
													commentsRating,
												})
											}
										/>
									),
								)}
							</div>
						) : (
							<div className="no-product-found">Товары не найдены</div>
						)}
					</div>
					<div className="pag-bottom">
						{filteredProducts.length > PAGINATION_LIMIT && (
							<Paginate
								previousLabel="Предыдущая"
								nextLabel="Следующая"
								breakLabel="..."
								breakClassName="break-me"
								pageCount={Math.ceil(
									filteredProducts.length / PAGINATION_LIMIT,
								)} // Здесь 9 - количество элементов на странице
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								onPageChange={handlePageChange}
								containerClassName="pagination"
								activeClassName="active"
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export const Main = styled(MainContainer)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	& .mainHeader {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

	& .selectCategory {
		margin: 20px;
		height: 40px;
		padding: 10px;
	}

	& .product-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 0 20px;
	}

	& .no-product-found {
		font-size: 18px;
		margin-top: 40px;
		text-align: center;
	}

	& .pag-top {
		margin: 40px 0 10px;
	}

	& .pag-bottom {
		margin-bottom: 40px;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		padding: 0;
		margin: 10px;
	}

	.pagination li {
		display: inline-block;
		margin-right: 10px;
		font-size: 17px;
		border: 1px solid #000;
	}

	.pagination li a {
		display: block;
		padding: 8px 12px;
		background-color: #f2f2f2;
		color: #333;
		text-decoration: none;
		border-radius: 4px;
		transition: background-color 0.3s ease;
	}

	.pagination li.active a,
	.pagination li a:hover {
		background-color: #ccc;
	}

	.pagination li.disabled a {
		pointer-events: none;
		opacity: 0.5;
	}
`;
