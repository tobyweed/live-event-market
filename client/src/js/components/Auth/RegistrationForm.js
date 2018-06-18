import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthService from '../../utils/auth/AuthService';
import '../../../css/App.css';
import { refreshData } from '../../actions';

class RegistrationForm extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.Auth = new AuthService();
	}

	state = {
		errorMessage: ''
	};

	componentWillMount() {
		//Redirect if we are already logged in
		if (this.Auth.loggedIn()) {
			this.props.history.replace('/');
		}
	}

	render() {
		return (
			<div>
				<h1 className="registration-form">Sign Up</h1>
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
					<input
						className="form-item"
						placeholder="Enter First Name"
						name="firstName"
						type="text"
						onChange={this.handleChange}
					/>
					<input
						className="form-item"
						placeholder="Enter Last Name"
						name="lastName"
						type="text"
						onChange={this.handleChange}
					/>
					<br />
					<input
						className="form-item"
						placeholder="Enter Email"
						name="email"
						type="email"
						onChange={this.handleChange}
						required
					/>
					<input
						className="form-item"
						placeholder="Enter Phone Number"
						name="phoneNumber"
						type="text"
						onChange={this.handleChange}
					/>
					{/* This is temporary. It will be an upload input once we deal with image handling*/}
					<input
						className="form-item"
						placeholder="Profile Image Url"
						name="proPic"
						type="text"
						onChange={this.handleChange}
					/>
					<input
						className="form-item"
						placeholder="Your Organization"
						name="organization"
						type="text"
						onChange={this.handleChange}
					/>
					<br />
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
		//Login on form submit
		e.preventDefault();

		this.Auth.register(this.state)
			.then(res => {
				if (this.Auth.loggedIn()) {
					// get user and promoter data in an object from Auth
					this.Auth.getData().then(res => {
						this.props.dispatch(refreshData(res)); //add that to redux state
						console.log(res);
						this.props.history.replace('/');
					});
				} else {
					this.setState({ errorMessage: res });
				}
			})
			.catch(err => {
				this.setState({ errorMessage: err });
			});
	}
}

function mapStateToProps(state) {
	return {
		username: state.username
	};
}

export default connect(mapStateToProps)(RegistrationForm);
