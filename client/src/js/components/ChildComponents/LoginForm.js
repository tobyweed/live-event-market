import React, { Component } from 'react';
import AuthService from '../../utils/auth/AuthService';
import '../../../css/App.css';

class LoginForm extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.Auth = new AuthService();
	}

	componentWillMount() {
		//Redirect if we are already logged in
		if (this.Auth.loggedIn()) {
			this.props.history.replace('/');
		}
	}

	render() {
		return (
			<div>
				<h1 className="login-form">Login</h1>
				<form onSubmit={this.handleFormSubmit}>
					<input
						className="form-item"
						placeholder="Enter Username"
						name="username"
						type="text"
						onChange={this.handleChange}
						required
					/>
					<input
						className="form-item"
						placeholder="Enter Password"
						name="password"
						type="password"
						onChange={this.handleChange}
						required
					/>
					<input className="form-submit" value="Submit" type="submit" />
				</form>
				<p />
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

		this.Auth.login(this.state.username, this.state.password)
			.then(res => {
				if (this.Auth.loggedIn()) {
					this.props.history.replace('/');
				}
			})
			.catch(err => {
				alert(err);
			});
	}
}

export default LoginForm;
