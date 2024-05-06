import styled from 'styled-components';
import { H2, Loader, PrivateContent } from '../../components';
import { useEffect, useState } from 'react';
import { ROLE } from '../../constants';
import { checkAccess } from '../../utils';
import { useSelector } from 'react-redux';
import { selectUserId, selectUserLogin, selectUserRole } from '../../selectors';
import { TableRow } from './components/table-row/table-row';
import { OrderRow } from './components/order-row/order-row';
import { request } from '../../utils/request';

const OrdersContainer = ({ className }) => {
	const [orders, setOrders] = useState([]);
	// const [users, setUsers] = useState([]); // Стейт массива users, добавляется с сервера
	const [status, setStatus] = useState([]); // Стейт массива status, добавляется с сервера
	const [changeStatus, setChangeStatus] = useState([false]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const userRole = useSelector(selectUserRole); // роль текущего пользователя, вошедшего в сессию (берётся из селектора store redux)
	const isClient = checkAccess([ROLE.CLIENT], userRole);
	const userId = useSelector(selectUserId);
	const login = useSelector(selectUserLogin);

	const updateOrders = () => {
		setChangeStatus(!changeStatus);
	};

	useEffect(() => {
		setIsLoading(true);
		if (isClient) {
			Promise.all([request('/orders/status'), request(`/orders/${userId}`)]).then(
				([statusRes, ordersUserIdRes]) => {
					setIsLoading(false);
					if (statusRes.error || ordersUserIdRes.error) {
						setErrorMessage(statusRes.error || ordersUserIdRes.error);
					}
					setStatus(statusRes.data);
					setOrders(ordersUserIdRes.data);
					return;
				},
			);
		}
		// Проверяем права доступа текущего пользователя на страницу, чтобы лишний раз не запрашивать сервер. По хорошему эту проверку надо положить в каждый обработчик, и мы положим хотя в этом компоненте есть ещё только один обработчик -)))
		if (!checkAccess([ROLE.SALESMAN, ROLE.ADMIN], userRole)) {
			return;
		}

		// Итак, проверка прошла успешно, теперь ответ должен вернуться и по пользователям и по ролям. Нам нужны оба ответа поэтому и Promise.all (для оптимизации скорости запросов), хотя можно запросить и по отдельности, но времени уйдёт больше.
		Promise.all([request('/orders/status'), request('/orders')]).then(
			([statusRes, ordersRes]) => {
				setIsLoading(false);
				if (statusRes.error || ordersRes.error) {
					// Проверка ответа запросов на ошибки, если они есть, то текст соответствующей ошибки передаётся в errorMessage
					setErrorMessage(statusRes.error || ordersRes.error);
				}
				setStatus(statusRes.data);
				setOrders(ordersRes.data);
			},
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userRole, changeStatus]);
	const reversedOrders = [...orders].reverse();

	return (
		// PrivateContent -обёртка содержимого приватной страницы (проверяет права пользователя и принимает текст ошибки )
		<PrivateContent
			access={[ROLE.CLIENT, ROLE.SALESMAN, ROLE.ADMIN]}
			serverError={errorMessage}
		>
			<div className={className}>
				{isLoading ? (
					<Loader />
				) : (
					<>
						<H2>Заказы</H2>
						<div className="table-bloc">
							<div>
								<TableRow>
									<div className="id-column">id заказа</div>
									<div className="item1-column">Клиент</div>
									<div className="item2-column">Дата</div>
									<div className="item1-column">Сумма</div>
									<div className="status-column">Статус заказа</div>
								</TableRow>
							</div>
							{reversedOrders.map(
								// распечатка массива товаров построчно
								({
									id,
									userId,
									productsInCart,
									createdOrderAt,
									deliveryMethod,
									paymentMethod,
									countAll,
									totalAmount,
									statusId,
									lastChangedStatusOrderAt,
								}) => {
									const userLogin = userId
										? userId
										: 'Неизвестный пользователь';
									return (
										<OrderRow
											key={id}
											id={id}
											userLogin={isClient ? login : userLogin}
											productsInCart={productsInCart}
											createdOrderAt={createdOrderAt}
											deliveryMethod={deliveryMethod}
											paymentMethod={paymentMethod}
											countAll={countAll}
											totalAmount={totalAmount}
											statusId={statusId}
											status={status}
											lastChangedStatusOrderAt={
												lastChangedStatusOrderAt
											}
											isClient={isClient}
											updateOrders={updateOrders}
										/>
									);
								},
							)}
						</div>
					</>
				)}
			</div>
		</PrivateContent>
	);
};

export const Orders = styled(OrdersContainer)`
display: flex;
	align-items: center;
	flex-direction: column;
	margin: auto ;
	width: 100%;
	}

& .table-bloc {
	width: 80%;
}
`;
