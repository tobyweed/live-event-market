import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../../css/GlobalNav.css';
import master_logo from '../../../images/master_logo.png';
import blank_prof from '../../../images/blank_prof.png';

class Nav extends Component {
	render() {
		return (
			<div>
				<ul className="navbar fixed">
					<li className="navbar left">
						<Link to="/app">
							<img className="navbar" src={master_logo} alt="logo" />
						</Link>
					</li>
					<li className="navbar right">
						<Link to="/login">
							<img
								className="navbar"
								src={blank_prof}
								alt="blank profile icon"
							/>
						</Link>
					</li>
					<li className="navbar right">
						<Link to="/registration">
							<div className="navbar button_color">Sign Up</div>
						</Link>
					</li>
					<li className="navbar right">
						<Link to="/create-content">
							<div className="navbar button_plain">Create Content</div>
						</Link>
					</li>
					<li className="navbar right">
						<Link to="/find-partners">
							<div className="navbar button_plain">Find Partners</div>
						</Link>
					</li>
				</ul>
				<div className="nav_spacer" />
			</div>
		);
	}
}

export default Nav;
