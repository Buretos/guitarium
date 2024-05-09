import PropTypes from 'prop-types';
import styled from 'styled-components';

const FilterBlockContainer = ({
	className,
	searchTerm,
	setSearchTerm,
	setSelectedStatus,
}) => {
	return (
		<div className={className}>
			<div>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Поиск по ID, имени, дате и сумме заказа"
				/>
			</div>

			<div>
				<select onChange={(e) => setSelectedStatus(e.target.value)}>
					<option value="all">Просмотр всех заказов</option>
					<option value="0">Заказы со статусом СОЗДАН</option>
					<option value="1">Заказы со статусом ДОСТАВЛЯЕТСЯ</option>
					<option value="2">Заказы со статусом ВРУЧЁН</option>
					<option value="3">Заказы со статусом ОТМЕНЁН</option>
					{/* Другие статусы */}
				</select>
			</div>
		</div>
	);
};

export const FilterBlock = styled(FilterBlockContainer)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 80%;
	margin: 20px 0;

	& > div {
		width: calc(50% - 10px);
		margin: 0;
	}

	& input,
	& select {
		width: 95%;
		font-size: 17px;
		padding: 5px 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
`;

FilterBlockContainer.propTypes = {
	searchTerm: PropTypes.string,
	setSearchTerm: PropTypes.func.isRequired,
	setSelectedStatus: PropTypes.func.isRequired,
};
