import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Comment } from './conmponents';
import { Icon } from '../../../../components';
import { selectUserRole } from '../../../../selectors';
import { addCommentAsync } from '../../../../actions';
import { PROP_TYPE, ROLE } from '../../../../constants';
import styled from 'styled-components';

const CommentsContainer = ({ className, comments, productId }) => {
	const [newComment, setNewComment] = useState('');
	const [newEvaluation, setNewEvaluation] = useState(5);
	const userRole = useSelector(selectUserRole);
	const dispatch = useDispatch();

	const onNewCommentAdd = (productId, content, evaluation) => {
		dispatch(addCommentAsync(productId, content, evaluation));
		setNewComment('');
		setNewEvaluation(5);
	};

	const isGuest = userRole === ROLE.GUEST;

	return (
		<div className={className}>
			{!isGuest && (
				<div className="new-comment">
					<div className="new-comment-header">
						<div className="new-comment-title">Новый комментарий</div>
						<div className="new-comment-evaluation-group">
							<div className="new-comment-icon-evaluation">
								<Icon
									title="оценка"
									id="fa-thumbs-o-up"
									size="22px"
									margin="0 5px 0 30px"
								/>
							</div>
							<div className="evaluation">
								<select
									className="evaluation"
									onChange={({ target }) => {
										setNewEvaluation(Number(target.value));
									}}
								>
									<option value="5">5</option>
									<option value="4">4</option>
									<option value="3">3</option>
									<option value="2">2</option>
									<option value="1">1</option>
									<option value="0">0</option>
									{/* Другие варианты категорий */}
								</select>
							</div>
						</div>
						<Icon
							title="отправить отзыв"
							id="fa-paper-plane-o"
							size="22px"
							margin="10px 0 0 8px"
							onClick={() =>
								onNewCommentAdd(productId, newComment, newEvaluation)
							}
						/>
					</div>
					<div>
						<textarea
							name="comment"
							value={newComment}
							placeholder="Комментарий..."
							onChange={({ target }) => setNewComment(target.value)}
						></textarea>
					</div>
				</div>
			)}
			<div className="comments">
				{comments.map(({ id, author, content, evaluation, publishedAt }) => (
					<Comment
						key={id}
						productId={productId}
						id={id}
						author={author}
						content={content}
						evaluation={evaluation}
						publishedAt={publishedAt}
					/>
				))}
			</div>
		</div>
	);
};

export const Comments = styled(CommentsContainer)`
	width: 800px;
	margin: 0 auto;

	& .new-comment-header {
		display: flex;
		width: 100%;
		margin: 20px 0 0;
	}

	& .new-comment-title {
		border-top: 1px solid #000;
		border-left: 1px solid #000;
		width: 770px;
		padding: 10px;
		background: #ddd;
	}

	& .new-comment-evaluation-group {
		display: flex;
		padding: 10px;
		border-top: 1px solid #000;
		border-right: 1px solid #000;
		background: #ddd;
	}

	& .new-comment-icon-evaluation {
		width: 50px;
	}

	& .evaluation {
		display: flex;
		width: 45px;
		height: 32px;
		border: 0;
		padding-left: 5px;
		background: #ddd;
	}

	& .new-comment textarea {
		width: 770px;
		height: 120px;
		font-size: 18px;
		resize: none;
		padding: 10px;
		border-top: 0;
	}
`;

Comments.propTypes = {
	comments: PropTypes.arrayOf(PROP_TYPE.COMMENT).isRequired,
	productId: PropTypes.string.isRequired,
};
