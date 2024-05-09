import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
	appReducer,
	userReducer,
	cartReducer,
	productReducer,
	categoriesReducer,
} from './reducers';

const reducer = combineReducers({
	app: appReducer,
	user: userReducer,
	cart: cartReducer,
	product: productReducer,
	categories: categoriesReducer,
});

const persistConfig = {
	key: 'root',
	storage,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(
	persistedReducer,
	composeEnhancers(applyMiddleware(thunk)),
);
export const persistor = persistStore(store);
