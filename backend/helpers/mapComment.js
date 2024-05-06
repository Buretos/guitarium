module.exports = function (comment) {
	return {
		content: comment.content,
		author: comment.author.login,
		id: comment._id,
		evaluation: comment.evaluation,
		publishedAt: comment.createdAt,
	};
};
