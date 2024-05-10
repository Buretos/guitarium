import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_MODAL, openModal, removeCommentAsync } from '../../../../../../actions';
import { Icon } from '../../../../../../components';
import { ROLE } from '../../../../../../constants';
import { selectUserRole } from '../../../../../../selectors';
import styled from 'styled-components';

const CommentContainer = ({
	className,
	productId,
	id,
	author,
	content,
	evaluation,
	publishedAt,
}) => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);

	const onCommentRemove = (id) => {
		dispatch(
			openModal({
				text: 'Удалить комментарий?',
				onConfirm: () => {
					dispatch(removeCommentAsync(productId, id));
					dispatch(CLOSE_MODAL);
				},
				onCancel: () => dispatch(CLOSE_MODAL),
			}),
		);
	};

	const isAdminOrSalesman = [ROLE.ADMIN, ROLE.SALESMAN].includes(userRole);

	return (
		<div className={className}>
			<div className="comment">
				<div className="information-panel">
					<div className="information-author-evaluation">
						<div className="author">
							<Icon
								title="автор отзыва"
								inactive={true}
								id="fa-user-circle-o"
								size="18px"
								margin="0 10px 0 0"
								onClick={() => {}}
							/>
							{author}
						</div>
						<div className="evaluation-comment">
							<Icon
								title="оценка"
								background="#fff"
								inactive={true}
								id="fa-thumbs-o-up"
								size="18px"
								margin="0 10px 0 0"
								onClick={() => {}}
							/>
							{evaluation}
						</div>
					</div>
					<div className="published-at">
						<Icon
							title="дата публикации"
							inactive={true}
							id="fa-calendar-o"
							size="18px"
							margin="0 10px 0 0"
							onClick={() => {}}
						/>
						{publishedAt.split('T')[0]}
					</div>
				</div>
				<div className="comment-text">{content}</div>
			</div>
			{isAdminOrSalesman && (
				<Icon
					title="удалить"
					id="fa-trash-o"
					size="22px"
					margin="0 0 0 10px"
					onClick={() => onCommentRemove(id)}
				/>
			)}
		</div>
	);
};

export const Comment = styled(CommentContainer)`
	width: 800px;
	display: flex;
	margin-top: 10px;


	& .comment {
		width: 770px;
		border: 1px solid #000;
		padding: 5px 10px;z

	}

	& .information-panel {
		display: flex;
		justify-content: space-between;
	}

	& .information-author-evaluation {
		display: flex;
	}

	& .author {
		display: flex;
	}

	& .evaluation-comment {
		display: flex;
		margin-left:25px;
	}

	& .published-at {
		display: flex;
	}
`;

Comment.propTypes = {
	productId: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	evaluation: PropTypes.number.isRequired,
	publishedAt: PropTypes.string.isRequired,
};
