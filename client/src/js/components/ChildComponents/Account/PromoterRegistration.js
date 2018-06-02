import React, { Component } from 'react';
import axios from 'axios';

import AuthService from '../../../utils/auth/AuthService';
import withAuth from '../../../utils/auth/withAuth';
import hidden from '../../../utils/auth/hidden';

class PromoterRegistration extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	render() {
		return (
			<div className="promoter-registration">
				<h3>Create a Promoter Account</h3>
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
			</div>
		);
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

export default hidden(withAuth(PromoterRegistration));
