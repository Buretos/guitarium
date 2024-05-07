import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { H2, Icon } from '../../../../components';
import { SpecialPannel } from '../special-panel/special-panel';
import { PROP_TYPE } from '../../../../constants';
import styled from 'styled-components';

const ProductContentContainer = ({
	className,
	product: {
		id,
		title,
		imageUrl,
		categoryId,
		manufacturer,
		model,
		quanthy,
		price,
		content,
		comments,
	},
}) => {
	const navigate = useNavigate();

	return (
		<div className={className}>
			<img src={imageUrl} alt={title} />
			<H2>{title}</H2>
			<SpecialPannel
				id={id}
				categoryId={categoryId}
				comments={comments}
				quanthy={quanthy}
				price={price}
				margin="-20px 0 12px"
				editButton={
					<Icon
						title="редактирование товара"
						id="fa-pencil-square-o"
						size="22px"
						onClick={() => navigate(`/product/${id}/edit`)}
					/>
				}
			/>
			<div className="product-info">
				<div>
					Производитель: &nbsp;<strong>{manufacturer}</strong>
				</div>
				<div>
					Модель:&nbsp;<strong>{model}</strong>
				</div>
			</div>
			<div className="product-text">{content}</div>
		</div>
	);
};

export const ProductContent = styled(ProductContentContainer)`
	& img {
		float: left;
		width: 280px;
		margin: 0 20px 10px 0;
	}

	& .product-text {
		font-size: 18px;
		white-space: pre-line;
		margin: 20px 0;
	}
`;

ProductContent.propTypes = {
	product: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		imageUrl: PropTypes.string.isRequired,
		categoryId: PropTypes.number.isRequired,
		manufacturer: PropTypes.string,
		model: PropTypes.string,
		quanthy: PropTypes.number,
		price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		content: PropTypes.string.isRequired,
		comments: PropTypes.arrayOf(PROP_TYPE.COMMENT).isRequired,
	}).isRequired,
};
