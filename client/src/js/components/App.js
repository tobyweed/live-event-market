import React, { Component } from 'react';
import axios from 'axios';
import '../../css/App.css';

import AuthService from '../utils/auth/AuthService';
import withAuth from '../utils/auth/withAuth';
import hidden from '../utils/auth/hidden';

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
							{/*the code below only tries to return an identity if there is a user*/}
							Welcome {!!this.props.user ? this.props.user.identity + ', ' : ''}
							and {yo}
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

export default hidden(withAuth(App));
