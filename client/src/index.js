import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './css/index.css';
import App from './js/components/App';
import LoginForm from './js/components/ChildComponents/LoginForm';
import Nav from './js/components/ChildComponents/Nav';
import registerServiceWorker from './registerServiceWorker';

//import master components
import Home from './js/components/MasterComponents/Home.js';
//import _search from './components/masterComponents/search';
//import _event from './components/masterComponents/event';
//import _user from './components/masterComponents/user';
//import _promoter from './components/masterComponents/promoter';

ReactDOM.render(
	<Router>
		<div>
			<Route path="/" component={Home} />
		</div>
	</Router>,

	document.getElementById('root')
);
registerServiceWorker();

//<Route path="/Search" component={_search} />
//<Route path="/Event" component={_event} />
//<Route path="/User" component={_user} />
//<Route path="/Pomoter" component={_promoter} />
