import React, { Component } from 'react';
import axios from 'axios';
import '../../css/App.css';

import AuthService from '../utils/auth/AuthService';
import withAuth from '../utils/auth/withAuth';

class App extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	state = {
		yo: 'hi'
	};

	componentDidMount() {
		axios.get('/yo').then(res => {
			this.setState({ yo: res.data.answer });
		});
	}

	//& {yo}
	render() {
		const { yo } = this.state;
		return (
			<div>
				<div className="App">APP</div>
				<div className="App">
					<div className="App-header">
						<h2>
							Welcome {this.props.user.identity} && {yo}
						</h2>
					</div>
					<p className="App-intro">
						<button
							type="button"
							className="form-submit"
							onClick={this.handleLogout.bind(this)}
						>
							Logout
						</button>
					</p>
				</div>

				<div />
			</div>
		);
	}

	handleLogout() {
		this.Auth.logout();
		this.props.history.replace('/login');
	}
}

export default withAuth(App);
