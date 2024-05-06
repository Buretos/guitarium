import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const CategoriesSelectContainer = ({ className, onChange, categoryId }) => {
	return (
		<div className={className}>
			<select className="selectCategory" onChange={onChange} value={categoryId}>
				<option value="">Все категории</option>
				<option value="0">Гитары</option>
				<option value="1">Струны</option>
				<option value="2">Аксессуары</option>
				<option value="3">Литература</option>
				{/* Другие варианты категорий */}
			</select>
		</div>
	);
};

export const CategoriesSelect = styled(CategoriesSelectContainer)`
	margin-top: 20px;

	& .selectCategory {
		margin: 20px;
		height: 40px;
		padding: 10px;
		font-size: 17px;
		width: 280px;
	}
`;

CategoriesSelectContainer.propTypes = {
	onChange: PropTypes.func.isRequired,
	categoryId: PropTypes.string,
};
