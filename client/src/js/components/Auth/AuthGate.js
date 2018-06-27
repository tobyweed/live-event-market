import React, { Component } from 'react';

class AuthGate extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	state = {
		errorMessage: ''
	};

	render() {
		return (
			<div>
				<h1 className="login-form">Login to App</h1>
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
				<p>{this.state.errorMessage}</p>
			</div>
		);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleFormSubmit(e) {
		e.preventDefault();

		if (this.state.username === 'admin' && this.state.password === '12345') {
			localStorage.setItem('baseAuthIsPassed', 'yes');
			this.setState({
				errorMessage: 'You have passed the test. Refresh the page.'
			});
		} else {
			this.setState({ errorMessage: 'Wrong credentials.' });
		}
	}
}

export default AuthGate;
