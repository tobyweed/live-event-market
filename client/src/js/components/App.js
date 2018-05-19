import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/App.css';

class App extends Component {
	state = {
		yo: 'hi'
	};

	componentDidMount() {
		axios
			.get('/yo')
			.then(res => {
				const yo = res.data;
				this.setState({ yo });
			})
			.catch(error => {
				console.log('Error fetching and parsing data', error);
			});
	}

	render() {
		const { yo } = this.state;
		return (
			<div>
				<div className="App">APP</div>
				<p> {yo} </p>
			</div>
		);
	}
}

export default App;
