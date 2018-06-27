import React, { Component } from 'react';
import '../../../css/App.css';
import { withRouter } from 'react-router';
import qs from 'qs';

class SearchForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errorMessage: '',
			searchName: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	// state = {
	// 	errorMessage: '',
	// 	initialContent: ''
	// };
	//

	componentDidMount() {
		let query = qs.parse(this.props.location.search.slice(1));
		let initialSearchName = query.name;
		if (initialSearchName) {
			this.setState({ searchName: initialSearchName });
		}
	}

	render() {
		return (
			<div>
				<div>
					<form onSubmit={this.handleFormSubmit}>
						<h6>Search by Name:</h6>
						<input
							placeholder="Search Events"
							value={this.state.searchName}
							name="searchName"
							type="text"
							onChange={this.handleChange}
						/>
						<br />
						<h6>Search by Date:</h6>
						<input
							name="start_date"
							type="datetime-local"
							onChange={this.handleChange}
						/>
						<input
							name="end_date"
							type="datetime-local"
							onChange={this.handleChange}
						/>
						<br />
						<input type="submit" value="Search" />
					</form>
					<p>{this.state.errorMessage}</p>
				</div>
			</div>
		);
	}

	//bind state to inputs
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleFormSubmit(e) {
		//Login on form submit
		e.preventDefault();

		//convert undefined attributes into empty strings for the search
		var args = [
			this.state.searchName,
			this.state.start_date,
			this.state.end_date
		];
		args.forEach((arg, i) => {
			args[i] = arg === undefined ? '' : arg;
		});
		this.props.history.push(
			'/search-results?name=' +
				args[0] +
				'&start_date=' +
				args[1] +
				'&end_date=' +
				args[2]
		);
	}
}

export default withRouter(SearchForm);
