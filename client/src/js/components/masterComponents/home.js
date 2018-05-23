import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//import master components
import  Nav from '../childComponents/Nav.js';
import  FrontPage from '../childComponents/FrontPage.js';
import  About from '../childComponents/About.js';
import  Footer from '../childComponents/Footer.js';

class Home extends Component{
render() {
	return (
		<div>
		<Nav></Nav>
		<FrontPage></FrontPage>
		<About></About>
		<Footer></Footer>
		</div>
	);}
}
export default Home;
