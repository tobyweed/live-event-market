import React, { Component } from 'react';
import axios from 'axios';
import '../../css/App.css';

import AuthService from '../utils/auth/AuthService';
import withAuth from '../utils/auth/withAuth';
const Auth = new AuthService();

class App extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	state = {
		loggedIn: 'false',
		yo: 'hi'
	};


//Working on setting auth headers to access protected data from the
//db rn, so ignore this method for now. This whole file is a bit of a WIP
	componentDidMount() {
		if (this.Auth.loggedIn()) {
			this.setState({ loggedIn: 'true' });
			// this.Auth.setHeader();
			axios.defaults.headers.common['Authorization'] = this.Auth.getAccess();
			axios.get('/yo').then(res => {
				this.setState({ yo: 'yoooooo' });
				console.log('ah yea');
			});
		}
	}

	render() {
		const { loggedIn, yo } = this.state;
		return (
			<div>
				<div className="App">APP</div>
				<div className="App">
					<div className="App-header">
						<h2>
							Welcome {this.props.user.identity} & {yo}
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
		Auth.logout();
		this.props.history.replace('/login');
	}
}

export default withAuth(App);
