import { useEffect } from 'react';
import { useStore } from 'react-redux';

export const useResetForm = (reset) => {
	const store = useStore();

	useEffect(() => {
		let currentWasLogout = store.getState().app.wasLogout;

		return store.subscribe(() => {
			let previosWasLogout = currentWasLogout;
			currentWasLogout = store.getState().app.wasLogout;

			if (currentWasLogout !== previosWasLogout) {
				reset();
			}
		});
	}, [reset, store]); // reset, store меняться не будут, но чтобы не ругался отладчик используем. Кстати useStore() рекомедуют использовать именно потому, чтобы store сохранялся между вызовами компонента, чтобы useEffect у нас не дергался лишний раз.
};
