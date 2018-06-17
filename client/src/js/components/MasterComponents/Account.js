import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Promoter from '../ChildComponents/Account/Promoter';
import PromoterRegistration from '../ChildComponents/Account/PromoterRegistration';
import PromoterAddUser from '../ChildComponents/Account/PromoterAddUser';
import EditAccount from '../ChildComponents/Account/EditAccount';

import withAuth from '../../utils/auth/withAuth';
import AuthService from '../../utils/auth/AuthService';

class Account extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	render() {
		const userData = this.props.userData;

		// const promoterSection = this.props.userData.promoter_name ? (
		// 	<div>
		// 		<Promoter />
		// 		<PromoterAddUser />
		// 	</div>
		// ) : (
		// 	<PromoterRegistration />
		// );

		if (this.props.userData) {
			return (
				<div className="account-page">
					<h1>Account</h1>
					<h3>Details</h3>
					<ul>
						{/* Currently just rendering a list of user info. Basically that's all there is to it
            to the account page, plus styling, editing, and promoter account creation */}
						<li>Username: {this.props.userData.username}</li>
						<li>First Name: {userData.firstName}</li>
						<li>Last Name: {userData.lastName}</li>
						<li>Email: {userData.email}</li>
						<li>Phone #: {userData.phoneNumber}</li>
						<li>Organization: {userData.organization}</li>
						<EditAccount />
					</ul>
					this.props.userData.promoter_name ? (
					<div>
						<Promoter />
						<PromoterAddUser />
					</div>
					) : (
					<PromoterRegistration />
					);
					<div>
						<h3>Logout</h3>
						<button
							type="button"
							className="form-submit"
							onClick={this.handleLogout.bind(this)}
						>
							Logout
						</button>
					</div>
				</div>
				// )
			);
		} else {
			return 'The page is loading...';
		}
	}

	handleLogout() {
		this.Auth.logout();
		this.props.history.replace('/login');
	}
}

function mapStateToProps(state) {
	return {
		userData: state.userData
	};
}

export default connect(mapStateToProps)(Account);
