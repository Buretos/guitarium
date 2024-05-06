export const debounce = (fn, delay) => {
	let timeoutId;

	return (...args) => {
		clearTimeout(timeoutId); // отмена функции fn, если она вызывается до истечения времени delay
		timeoutId = setTimeout(fn, delay, ...args);
		// setTimeout(() => fn(...args), delay); равнозначная строка что и выше. Так в функцию в setTimeout можно передавать аргументы. См. использоватнгие setTimeout
		// т.е. функция вызывается через время в мс delay и в неё передаются аргументы ...args
		// если функци. вызовут повторно до истечения времени (например произведён ввод в поле поиска), то её нужно отменить clearTimeout и снова отсчитывается время delay
		// переменная timeoutId должна храниться в замыкации
	};
};
