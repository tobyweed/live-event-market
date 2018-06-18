import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './js/reducers/';

import App from './js/components/App';
import AuthService from './js/utils/auth/AuthService';

const Auth = new AuthService();

function run() {
	const store = createStore(rootReducer);

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
