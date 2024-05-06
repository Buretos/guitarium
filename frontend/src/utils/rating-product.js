export const ratingProduct = (comments) =>
	comments.length === 0
		? 0
		: parseFloat(
				(
					comments.reduce((total, comment) => total + comment.evaluation, 0) /
					comments.length
				).toFixed(1),
		  );
