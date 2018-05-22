import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../../css/Footer.css';
import '../../images/blank_prof.png';

class Footer extends Component {
	render() {
		return (
			<div class="banner">
				<div class="banner_wrapper">
					<img class="banner" src="blank_prof" />
					<p>Name</p>
				</div>
			</div>
		);
	}
}

export default Footer;
