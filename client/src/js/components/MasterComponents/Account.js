import React, { Component } from 'react';
import axios from 'axios';

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
		this.editFormSubmit = this.editFormSubmit.bind(this);
	}

	state = {
		userData: '',
		editFormMessage: ''
	};

	//Get user info
	componentDidMount() {
		//If we are not logged in, redirect us to login
		if (!this.Auth.loggedIn()) {
			this.props.history.replace('/login');
		}

		axios.get('/user/' + this.props.user.identity).then(res => {
			this.setState({ userData: res.data });
		});
	}

	render() {
		const user = this.props.user;
		const userData = this.state.userData;

		const promoterSection = this.state.userData.promoter_name ? (
			<div>
				<Promoter />
				<PromoterAddUser />
			</div>
		) : (
			<PromoterRegistration />
		);

		if (user) {
			return (
				<div className="account-page">
					<h1>Account</h1>
					<h3>Details</h3>
					<ul>
						{/* Currently just rendering a list of user info. Basically that's all there is to it
            to the account page, plus styling, editing, and promoter account creation */}
						<li>Username: {userData.username}</li>
						<li>First Name: {userData.firstName}</li>
						<li>Last Name: {userData.lastName}</li>
						<li>Email: {userData.email}</li>
						<li>Phone #: {userData.phoneNumber}</li>
						<li>Organization: {userData.organization}</li>
						{userData && (
							<EditAccount
								userData={userData}
								editFormSubmit={this.editFormSubmit}
								editFormMessage={this.state.editFormMessage}
							/>
						)}
					</ul>
					<div>{promoterSection}</div>
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
			return null;
		}
	}

	editFormSubmit(e) {
		e.preventDefault();
		const userData = this.state.userData;
		//Edit the user and set the state accordingly
		axios
			.put('/user/' + userData.username, {
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				email: this.state.email,
				phoneNumber: this.state.phoneNumber,
				proPic: this.state.proPic,
				organization: this.state.organization
			})
			.then(res => {
				axios.get('/user/' + this.props.user.identity).then(res => {
					this.setState({
						userData: res.data,
						editFormMessage: 'Your account data has been updated.'
					});
				});
			})
			.catch(err => {
				this.setState({ editFormMessage: err });
			});
	}

	handleLogout() {
		this.Auth.logout();
		this.props.history.replace('/login');
	}
}

export default withAuth(Account);
