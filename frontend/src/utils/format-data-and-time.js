export function formatDateAndTime(dateString) {
	const options = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	};
	const date = new Date(dateString);
	return date.toLocaleString('ru-RU', options);
}
