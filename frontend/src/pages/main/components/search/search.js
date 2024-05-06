import PropTypes from 'prop-types';
import { Icon, Input } from '../../../../components';
import styled from 'styled-components';

// Управляемый ввод из родительского компонента приходит и искомаяя фраза и onChange
const SearchContainer = ({ className, searchPhrase, onChange }) => {
	return (
		<div className={className}>
			<Input
				value={searchPhrase}
				placeholder="Поиск по заголовкам..."
				onChange={onChange}
			/>
			<Icon inactive={true} id="fa-search" size="21px" />
		</div>
	);
};

export const Search = styled(SearchContainer)`
	display: flex;
	position: relative;
	width: 280px;
	height: 40px;
	margin: 40px auto 20px;

	& > input {
		padding: 10px 36px 10px 20px;
	}

	& > div {
		position: absolute;
		top: 4px;
		right: 10px;
	}
`;

Search.propTypes = {
	searchPhrase: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
