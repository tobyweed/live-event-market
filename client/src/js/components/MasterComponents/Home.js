import React, { Component } from 'react';

import FrontPage from '../ChildComponents/Home/FrontPage';
import About from '../ChildComponents/Home/About';

class Home extends Component {
	render() {
		return (
			<div>
				<FrontPage />
				<About />
			</div>
		);
	}
}
export default Home;
