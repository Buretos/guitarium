import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { Gitarium } from './gitarium';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<PersistGate loading={null} persistor={persistor}>
		<BrowserRouter>
			<Provider store={store}>
				<Gitarium />
			</Provider>
		</BrowserRouter>
		,
	</PersistGate>,
);
