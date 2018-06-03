import React, { Component } from 'react';
import axios from 'axios';

import withAuth from '../../../utils/auth/withAuth';

class Promoter extends Component {
	constructor() {
		super();
	}

	state = {
		promoterData: ''
	};

	//Get promoter info
	componentDidMount() {
		axios.get('/promoter/' + this.props.user.identity).then(res => {
			this.setState({ promoterData: res.data });
		});
	}

	render() {
		const user = this.props.user;

		if (user) {
			return (
				<div className="Promoter-page">
					<h1>Promoter</h1>
					<h3>Details</h3>
					<ul>
						<li>Name: {this.state.promoterData.name}</li>
						{/*<li>First Name: {this.state.userData.firstName}</li>
						<li>Last Name: {this.state.userData.lastName}</li>
						<li>Email: {this.state.userData.email}</li>
						<li>Phone #: {this.state.userData.phoneNumber}</li>
						<li>Organization: {this.state.userData.organization}</li>*/}
					</ul>
					{/* Insert component with promoter and user props.  */}
				</div>
			);
		} else {
			return null;
		}
	}
}

export default withAuth(Promoter);
