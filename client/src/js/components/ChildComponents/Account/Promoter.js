import React, { Component } from 'react';
import axios from 'axios';

import withAuth from '../../../utils/auth/withAuth';
import hidden from '../../../utils/auth/hidden';

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
						{/* Currently just rendering a list of user info. Basically that's all there is to it
            to the Promoter page, plus styling, editing, and promoter Promoter creation */}
						<li>Name: {this.state.promoterData.name}</li>
						{/*<li>First Name: {this.state.userData.firstName}</li>
						<li>Last Name: {this.state.userData.lastName}</li>
						<li>Email: {this.state.userData.email}</li>
						<li>Phone #: {this.state.userData.phoneNumber}</li>
						<li>Organization: {this.state.userData.organization}</li>*/}
					</ul>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default withAuth(Promoter);
