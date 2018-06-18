import React, { Component } from 'react';
import axios from 'axios';

import withAuth from '../../utils/auth/withAuth';

class PromoterAddUser extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	render() {
		return (
			<div className="promoter-add-user">
				<h3>Add Another User to this Promoter Account</h3>
				<form onSubmit={this.handleFormSubmit}>
					<label htmlFor="promoter-add-user-username">
						Enter the username of the person you would like to add:
					</label>
					<input
						id="promoter-add-user-username"
						className="form-item"
						placeholder="Username"
						name="username"
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
			.post('/promoter/adduser', {
				username: this.state.username
			})
			.catch(err => {
				alert(err);
			});
	}
}

export default PromoterAddUser;
