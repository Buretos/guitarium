import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCart, selectUserId, selectUserRole } from '../../selectors';
import {
	CLOSE_MODAL,
	addOrderAsync,
	addToCart,
	clearCart,
	openModal,
	removeFromCart,
} from '../../actions';
import { Button, H2 } from '../../components';
import { ProductCard } from '../main/components';
import { checkAccess } from '../../utils';
import { ROLE } from '../../constants';
import styled from 'styled-components';

const CartContainer = ({ className }) => {
	const dispatch = useDispatch();
	const cart = useSelector(selectCart);
	const userId = useSelector(selectUserId);
	const roleId = useSelector(selectUserRole);
	const countAll = cart.productsInCart.reduce((sum, item) => sum + item.count, 0);
	const navigate = useNavigate();

	// Добавленные состояния для способов доставки и оплаты
	const [deliveryMethod, setDeliveryMethod] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('');

	const totalAmount = cart.productsInCart.reduce((sum, item) => {
		return sum + parseFloat(item.price) * item.count;
	}, 0);

	const handleClearCart = () => {
		dispatch(clearCart()); // Очистка корзины
	};

	const handleAddToCart = (product) => {
		dispatch(addToCart(product));
	};

	const handleRemoveFromCart = (productId) => {
		dispatch(removeFromCart(productId)); // Удаление одной единицы товара из корзины
	};

	const messageCreatedOrder = () => {
		dispatch(
			openModal({
				text: 'Спасибо! Ваш заказ оформлен. Хотите посмотреть историю ваших заказов?',
				onConfirm: () => {
					navigate(`/orders`);
					dispatch(CLOSE_MODAL);
				},
				onCancel: () => {
					navigate('/');
					dispatch(CLOSE_MODAL);
				},
			}),
		);
	};

	const handleCreateOrder = async (
		userId,
		{ productsInCart },
		paymentMethod,
		deliveryMethod,
		countAll,
		totalAmount,
	) => {
		await dispatch(
			addOrderAsync(
				userId,
				productsInCart,
				paymentMethod,
				deliveryMethod,
				countAll,
				totalAmount,
			),
		);
		dispatch(clearCart());
		messageCreatedOrder();
	};

	const canCheckout = countAll > 0 && deliveryMethod && paymentMethod;

	const isClient = checkAccess([ROLE.CLIENT], roleId);
	return (
		<div className={className}>
			<div className="order">
				<H2>Корзина покупателя</H2>
				<div className="order-heder">
					Всего товаров в корзине: <b>{countAll}</b> шт.
				</div>
				<Button className="button-order" onClick={handleClearCart}>
					Очистить корзину
				</Button>
			</div>
			{cart.productsInCart.map(
				({
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
					count,
				}) => (
					<div className="product-bloc" key={id}>
						<div className="product-card">
							<ProductCard
								key={id}
								id={id}
								title={title}
								imageUrl={imageUrl}
								categoryId={categoryId}
								model={model}
								quanthy={quanthy}
								price={price}
								commentsCount={commentsCount}
								commentsRating={commentsRating}
								cardOnly={true}
							/>
						</div>
						<div className="product-info">
							<div className="product-title">
								<b>{title}</b>
							</div>
							<div>
								Производитель: <b>{manufacturer}</b>
							</div>
							<div>
								Модель: <b>{model}</b>
							</div>
							<div>
								Количество: <b>{count}</b> шт.
							</div>
							<div className="block-button-cart">
								<div className="button-cart">
									<Button
										onClick={() => handleRemoveFromCart({ id })}
										border="0"
										fontWeight="900"
									>
										-1
									</Button>
								</div>
								<div className="button-cart">
									<Button
										onClick={() =>
											handleAddToCart({
												id,
												title,
												imageUrl,
												categoryId,
												model,
												quanthy,
												price,
												commentsCount,
												commentsRating,
											})
										}
										border="0"
										fontWeight="900"
									>
										+1
									</Button>
								</div>
							</div>
							<div>
								Цена: <b>{price}</b> руб./шт.
							</div>
							<div>
								Всего за этот товар:
								<br /> <b>{count}</b> x <b>{price}</b> ={' '}
								<b>{count * price}</b> руб.
							</div>
						</div>
					</div>
				),
			)}

			<div className="checkout-options">
				<div className="total-amount">
					<div>
						Всего товаров в корзине: <strong>{countAll}</strong> шт.
					</div>
					<div>
						Итоговая сумма: <strong>{totalAmount}</strong> руб.{' '}
					</div>
				</div>
				<div className="bloc-select">
					<select
						onChange={(e) => setDeliveryMethod(e.target.value)}
						value={deliveryMethod}
					>
						<option value="">Выберите способ доставки</option>
						<option value="Самовывоз">Самовывоз</option>
						<option value="Доставка курьером">Доставка курьером</option>
						<option value="Почтовая отправка">Почтовая отправка</option>
					</select>

					<select
						onChange={(e) => setPaymentMethod(e.target.value)}
						value={paymentMethod}
					>
						<option value="">Выберите способ оплаты</option>
						<option value="Банковской картой">Банковской картой</option>
						<option value="Наличными при получении">
							Наличными при получении
						</option>
						<option value="Онлайн-оплата">Онлайн-оплата</option>
					</select>
				</div>

				<Button
					className="button-order"
					disabled={!canCheckout}
					onClick={() => {
						isClient
							? handleCreateOrder(
									userId,
									cart,
									paymentMethod,
									deliveryMethod,
									countAll,
									totalAmount,
							  )
							: navigate('/login');
					}}
				>
					Оформление заказа
				</Button>
			</div>
		</div>
	);
};

export const Cart = styled(CartContainer)`
	width: 70%;
	margin: 0 auto;
	align-items: center;

	& .order-heder {
		margin: 0 0 30px;
		font-size: 21px;
	}

	& .order {
		margin: 0 auto;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	& .product-bloc {
		display: flex;
		justify-content: space-between;
		padding: 10px 0;
		border-bottom: 1px solid #ccc;
	}

	& .product-card {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-rigth: 0 auto;
		width: 570px;
	}

	& .product-info {
		display: flex;
		flex-direction: column;
		margin: 20px;
		width: 570px;
		justify-content: space-between;
		font-size: 19px;
	}

	& .product-title {
		font-size: 22px;
	}

	& .block-button-cart {
		display: flex;
	}

	& .button-cart {
		display: flex;
		justify-content: space-between;
		width: 80%;
	}

	& .button-order {
		height: 40px;
		margin: 10px 0 50px;
	}

	& .checkout-options {
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;

		& .total-amount {
			margin: 40px 0 20px;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 21px;
			text-align: center;
		}

		& .bloc-select {
			display: flex;
			justify-content: space-between;
		}

		select {
			padding: 10px;
			min-width: 200px;
			margin: 20px;
			width: 317px;
			font-size: 17px;
		}
	}
`;
