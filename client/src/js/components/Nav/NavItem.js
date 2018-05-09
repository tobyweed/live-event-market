import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavItem extends Component {
	render() {
		return (
			<li className="NavItem">
				<Link to={'/' + this.props.itemName}>{this.props.itemName}</Link>
			</li>
		);
	}
}

export default NavItem;
