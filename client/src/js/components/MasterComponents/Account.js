import React, { Component } from 'react';
import axios from 'axios';

import AuthService from '../../utils/auth/AuthService';
import withAuth from '../../utils/auth/withAuth';
import hidden from '../../utils/auth/hidden';

class Account extends Component {
	state = {
		userData: ''
	};

	//Get user info
	componentDidMount() {
		axios.get('/user/' + this.props.user.identity).then(res => {
			this.setState({ userData: res.data });
		});
	}

	render() {
		const user = this.props.user;
		if (user) {
			return (
				<div className="account-page">
					<ul>
						{/* Currently just rendering a list of user info. Basically that's all there is to it
            to the account page, plus styling, editing, and promoter account creation */}
						<li>{this.state.userData.username}</li>
						<li>{this.state.userData.firstName}</li>
						<li>{this.state.userData.lastName}</li>
						<li>{this.state.userData.email}</li>
						<li>{this.state.userData.phoneNumber}</li>
						<li>{this.state.userData.organization}</li>
					</ul>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default hidden(withAuth(Account));
