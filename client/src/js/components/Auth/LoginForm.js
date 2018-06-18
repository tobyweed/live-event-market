import React, { Component } from 'react';
import AuthService from '../../utils/auth/AuthService';
import '../../../css/App.css';
import { connect } from 'react-redux';
import { refreshData } from '../../actions';
class LoginForm extends Component {
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

		this.Auth.login(this.state.username, this.state.password)
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

export default connect(mapStateToProps)(LoginForm);
