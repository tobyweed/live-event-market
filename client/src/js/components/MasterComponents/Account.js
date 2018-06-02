import React, { Component } from 'react';
import axios from 'axios';

import AuthService from '../../utils/auth/AuthService';
import withAuth from '../../utils/auth/withAuth';
import hidden from '../../utils/auth/hidden';

class Account extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

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

					<div className="promoter-registration">
						<h1>Create a Promoter Account</h1>
						<form onSubmit={this.handleFormSubmit}>
							<input
								className="form-item"
								placeholder="Enter Promoter Name"
								name="name"
								type="text"
								onChange={this.handleChange}
							/>
							<input className="form-submit" value="Submit" type="submit" />
						</form>
						<p />
					</div>
				</div>
			);
		} else {
			return null;
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleFormSubmit(e) {
		//Login on form submit
		e.preventDefault();

		axios
			.post('/promoters/registration', {
				name: this.state.name
			})
			.catch(err => {
				alert(err);
			});
	}
}

export default hidden(withAuth(Account));
