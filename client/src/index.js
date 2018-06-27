import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

import './css/index.css';

import registerServiceWorker from './registerServiceWorker';
import rootReducer from './js/reducers/';

import App from './js/components/App';
import AuthService from './js/utils/auth/AuthService';
import AuthGate from './js/components/Auth/AuthGate';

const Auth = new AuthService();

function runApp() {
	const persistConfig = {
		key: 'root',
		storage
	};

	const persistedReducer = persistReducer(persistConfig, rootReducer);

	const store = createStore(persistedReducer);
	const persistor = persistStore(store);

	const AppBase = () => (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	);

	ReactDOM.render(<AppBase />, document.getElementById('root'));
	registerServiceWorker();
}

function runAuthGate() {
	ReactDOM.render(<AuthGate />, document.getElementById('root'));
}

//BaseAuth stuff is for login protection for site during development, will be removed for production
let baseAuthIsPassed = localStorage.getItem('baseAuthIsPassed');
if (baseAuthIsPassed === 'yes') {
	//before running anything, set headers and refresh token if necessary
	Auth.initialize().then(res => {
		runApp();
	});
} else {
	runAuthGate();
}
