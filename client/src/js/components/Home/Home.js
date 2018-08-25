import React, { Component } from 'react';

import FrontPage from './FrontPage';
import About from './About';

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
