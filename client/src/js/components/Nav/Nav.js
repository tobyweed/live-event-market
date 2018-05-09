import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../../css/Nav.css';
import NavItem from './NavItem';

class Nav extends Component {
	render() {
		return (
			<div>
				<div className="Nav">
					<ul>
						<li className="NavItem title">
							<Link to="/">First Tube Media</Link>
						</li>
						<NavItem itemName={'Account'} />
						<NavItem itemName={'Help'} />
						<NavItem itemName={'Report'} />
						<NavItem itemName={'Messages'} />
						<NavItem itemName={'Saved'} />
					</ul>
				</div>
			</div>
		);
	}
}

export default Nav;
