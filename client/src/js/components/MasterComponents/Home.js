import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//import master components
// import Nav from '../ChildComponents/Nav.js';
import FrontPage from '../ChildComponents/Home/FrontPage.js';
import About from '../ChildComponents/Home/About.js';
import Footer from '../ChildComponents/Footer.js';

class Home extends Component {
	render() {
		return (
			<div>
				<FrontPage />
				<About />
				<Footer />
			</div>
		);
	}
}
export default Home;
