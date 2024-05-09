import PropTypes from 'prop-types';
import { Icon } from '../../../../components';
import { TableRow } from '../table-row/table-row';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../../../../utils/request';
import styled from 'styled-components';

const OrderRowContainer = ({
	className,
	id,
	userLogin,
	productsInCart,
	createdOrderAt,
	deliveryMethod,
	paymentMethod,
	countAll,
	totalAmount,
	statusId,
	status,
	lastChangedStatusOrderAt,
	isClient,
	updateOrders,
}) => {
	const navigate = useNavigate();
	const [initialStatusId, setInitialStatusId] = useState(statusId); // изначальный статус заказа, отображаемый в поле выбора статусов (см. тег select)
	const [selectedStatusId, setSelectedStatusId] = useState(statusId); // Новый статус  из списка (перед выбором она соответствует текущей роли)

	const onStatusChange = ({ target }) => {
		// обработчик изменения статуса выбранной из  выпадающего списка
		setSelectedStatusId(Number(target.value)); // изменение id  статуса на выбранное значение поля, value={roleId}
	};

	const onStatusSave = (orderId, newOrderStatusId) => {
		// обработчик сохранения выбранного статуса
		request(`/orders/${orderId}`, 'PATCH', { statusId: newOrderStatusId }).then(
			() => {
				// запрос на сервер и обновление id статуса в методе orders
				setInitialStatusId(newOrderStatusId);
				updateOrders();
			},
		);
	};

	const isSaveButtonDisabled = selectedStatusId === initialStatusId; // флаг выключения активности кнопки сохранить при совпадении выбранного  статуса с изначальным, т.е.  когда статус не изменился.

	const onOrderInfo = () => {
		navigate('/order', {
			state: {
				id,
				userLogin,
				productsInCart,
				createdOrderAt,
				deliveryMethod,
				paymentMethod,
				countAll,
				totalAmount,
				statusId,
				status,
				lastChangedStatusOrderAt,
			},
		});
	};

	return (
		<div className={className}>
			<TableRow border={true}>
				<div className="id-column">{id}</div>
				<div className="item1-column">{userLogin}</div>
				<div className="item2-column">{createdOrderAt.split('T')[0]}</div>
				<div className="item1-column">{totalAmount}</div>
				{isClient ? (
					<div className="status-client-column">
						{status.find((item) => item.id === statusId).name}
					</div>
				) : (
					<div className="status-column">
						<select value={selectedStatusId} onChange={onStatusChange}>
							{status.map(
								(
									{ id: statusId, name: statusName }, // вывод выпадающего списка ролей (массивом map) по названию roleName контекст тега option, который соответствует полю name, и значению, соответствующему полю id массива roles, т.е. roleId
								) => (
									<option key={statusId} value={statusId}>
										{statusName}
									</option>
								),
							)}
						</select>
						<div className="save-role-button">
							<Icon
								title="сохранить изменение статуса заказа"
								id="fa-floppy-o"
								margin="0 0 0 10px"
								disabled={isSaveButtonDisabled}
								onClick={() => onStatusSave(id, selectedStatusId)}
							/>
						</div>
					</div>
				)}
			</TableRow>
			<Icon
				title="подробная информация о заказе"
				id="fa-info-circle"
				margin="0 0 0 20px"
				onClick={() => onOrderInfo()}
			/>
		</div>
	);
};

export const OrderRow = styled(OrderRowContainer)`
	display: flex;
	margin-top: 10px;

	& select {
		font-size: 16px;
		padding: 0 5px;
	}
`;

OrderRowContainer.propTypes = {
	className: PropTypes.string, // Обычно не является обязательным, потому что может быть предоставлено styled-компонентом
	id: PropTypes.string.isRequired,
	userLogin: PropTypes.string.isRequired,
	productsInCart: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			price: PropTypes.string.isRequired,
			quanthy: PropTypes.number.isRequired,
		}),
	).isRequired,
	createdOrderAt: PropTypes.string.isRequired,
	deliveryMethod: PropTypes.string.isRequired,
	paymentMethod: PropTypes.string.isRequired,
	countAll: PropTypes.number.isRequired,
	totalAmount: PropTypes.number.isRequired,
	statusId: PropTypes.number.isRequired,
	status: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
		}),
	).isRequired,
	lastChangedStatusOrderAt: PropTypes.string,
	isClient: PropTypes.bool,
};
