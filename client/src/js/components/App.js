import React, { Component } from 'react';
import axios from 'axios';
import AuthService from './Auth/AuthService';
import '../../css/App.css';

class App extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	state = {
		loggedIn: 'false'
	};

	componentDidMount() {
		if (this.Auth.loggedIn()) {
			this.setState({ loggedIn: 'true' });
		}
	}

	render() {
		const { loggedIn } = this.state;
		return (
			<div>
				<div className="App">APP</div>
				<p> {loggedIn} </p>
			</div>
		);
	}
}

export default App;
