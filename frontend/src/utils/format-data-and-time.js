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

//   const originalDate = "2023-04-20T14:45:00Z";
//   const formattedDateAndTime = formatDateAndTime(originalDate);
//   console.log(formattedDateAndTime); // Вывод: "20.04.2023, 17:45" (зависит от временной зоны)
