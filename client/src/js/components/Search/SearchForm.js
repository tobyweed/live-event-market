import React, { Component } from 'react';
import AuthService from '../../utils/auth/AuthService';
import '../../../css/App.css';
import { connect } from 'react-redux';
import { refreshData } from '../../actions';
import { withRouter } from 'react-router';

class SearchForm extends Component {
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
			<div className="form">
				<div className="form_content">
					<form onSubmit={this.handleFormSubmit}>
						<input
							className="button_plain form_search"
							placeholder="Search Event, Promoter, or Sponsor"
							name="name"
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
							onChange={this.handleChange}
						/>
					</form>
					<p>{this.state.errorMessage}</p>
				</div>
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

		//convert undefined attributes into empty strings for the search
		var args = [this.state.name, this.state.start_date, this.state.end_date];
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
