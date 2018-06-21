import React, { Component } from 'react';
import AuthService from '../../utils/auth/AuthService';
import '../../../css/App.css';
import { connect } from 'react-redux';
import { refreshData } from '../../actions';
import { withRouter } from 'react-router';
import qs from 'query-string';

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
		let query = qs.parse(this.props.location.search);
		let initialSearchName = query.name;
		if (initialSearchName) {
			this.setState({ searchName: initialSearchName });
		}
	}

	render() {
		return (
			<div className="form">
				<div className="form_content">
					<form onSubmit={this.handleFormSubmit}>
						{/* value={this.state.initialContent} */}
						<input
							className="button_plain form_search"
							placeholder="Search Events"
							value={this.state.searchName}
							name="searchName"
							type="text"
							onChange={this.handleChange}
							required
						/>
						{/*<input
						className="form-item"
						placeholder="Enter Password"
						name="password"
						type="password"
						onChange={this.handleChange}
						required
					/>*/}
						<input
							className="button_color form_submit"
							type="submit"
							value="Search"
						/>
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
