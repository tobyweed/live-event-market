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
		userData: null,
		promoterData: null
	};

	function reducer(state = initialState, action) {
		switch (action.type) {
			case 'REFRESH_DATA':
				return {
					userData: action.data.userData,
					promoterData: action.data.promoterData
				};
			case 'SET_USER_DATA':
				return {
					userData: action.userData
				};
			case 'SET_PROMOTER_DATA':
				return {
					promoterData: action.promoterData
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
