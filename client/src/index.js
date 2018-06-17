import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';

import App from './js/components/App';
import AuthService from './js/utils/auth/AuthService';
const Auth = new AuthService();

function run() {
	const initialState = {
		userData: null
	};

	function reducer(state = initialState, action) {
		switch (action.type) {
			case 'SET_USER':
				return {
					user: action.user
				};
			case 'SET_USER_DATA':
				return {
					userData: action.userData
				};
			default:
				return state;
		}
	}

	const store = createStore(reducer);

	const AppBase = () => (
		<Provider store={store}>
			<App />
		</Provider>
	);

	ReactDOM.render(<AppBase />, document.getElementById('root'));
	registerServiceWorker();
}

//before running anything, set headers and refresh token if necessary
Auth.initialize().then(res => {
	run();
});
