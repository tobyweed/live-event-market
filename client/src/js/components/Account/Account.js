import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearUserData } from '../../actions';

import Promoter from '../Account/Promoter';
import PromoterRegistration from '../Account/PromoterRegistration';
import PromoterAddUser from '../Account/PromoterAddUser';
import EditAccount from '../Account/EditAccount';

import AuthService from '../../utils/auth/AuthService';

class Account extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	render() {
		const userData = this.props.userData;
		const promoterData = this.props.promoterData;

		if (this.props.userData) {
			return (
				<div className="account-page">
					<h1>Account</h1>
					<h3>Details</h3>
					<ul>
						<li>Username: {userData.username}</li>
						<li>First Name: {userData.firstName}</li>
						<li>Last Name: {userData.lastName}</li>
						<li>Email: {userData.email}</li>
						<li>Phone #: {userData.phoneNumber}</li>
						<li>Organization: {userData.organization}</li>
						<EditAccount />
						{promoterData.name ? (
							<div>
								<Promoter />
								<PromoterAddUser />
							</div>
						) : (
							<div>
								<PromoterRegistration />
							</div>
						)}
					</ul>
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
			);
		} else {
			return "We're sorry, it appears that we can't find your account information. Please log out and try again.";
		}
	}

	handleLogout() {
		this.Auth.logout();
		this.props.history.replace('/login');
		this.props.dispatch(clearUserData());
	}
}

function mapStateToProps(state) {
	return {
		userData: state.idData.userData,
		promoterData: state.idData.promoterData
	};
}

export default connect(mapStateToProps)(Account);
