import React, { Component } from 'react';
import { withRouter } from 'react-router';
import qs from 'qs';

import CountrySelector from '../Events/CountrySelector';

class SearchForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errorMessage: '',
			event_types: []
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	componentDidMount() {
		let query = qs.parse(this.props.location.search.slice(1));
		let initialSearch = query;
		//If the search query has a string representing event types, make them into a nice array for prepopulating the form
		let event_types = initialSearch.event_types;
		if (event_types) {
			event_types = event_types.slice(1, -1).split(',');
		} else {
			event_types = [];
		}
		//prepopulate state with values from the query string, for the form to use to populate itself
		if (initialSearch) {
			this.setState({
				searchName: initialSearch.name,
				start_date: initialSearch.start_date,
				country_code: initialSearch.country_code,
				administrative_area: initialSearch.administrative_area,
				locality: initialSearch.locality,
				postal_code: initialSearch.postal_code,
				thoroughfare: initialSearch.thoroughfare,
				event_types: event_types
			});
		}
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleFormSubmit} className="search-form">
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
						value={this.state.start_date}
						type="datetime-local"
						onChange={this.handleChange}
					/>
					<input
						name="end_date"
						value={this.state.end_date}
						type="datetime-local"
						onChange={this.handleChange}
					/>
					<br />
					<h6>Search by Location*:</h6>
					<span>
						*The wider search terms must be implemented for the narrower ones to
						work, e.g.: If you search based on a state, like 'New York', you
						must also search based on a country, like "United States". Searching
						for "New York" without selecting "United States" will not do
						anything.
					</span>
					<CountrySelector onChange={this.handleChange} />
					<input
						placeholder="Enter State/Province"
						name="administrative_area"
						value={this.state.administrative_area}
						type="text"
						onChange={this.handleChange}
					/>
					<input
						placeholder="Enter City/Town"
						name="locality"
						value={this.state.locality}
						type="text"
						onChange={this.handleChange}
					/>
					<input
						placeholder="Enter Zip Code"
						name="postal_code"
						value={this.state.postal_code}
						type="text"
						onChange={this.handleChange}
					/>
					<input
						placeholder="Enter Street Address"
						name="thoroughfare"
						value={this.state.thoroughfare}
						type="text"
						onChange={this.handleChange}
					/>
					<br />
					<h6>Search by Type:</h6>
					<input
						type="checkbox"
						name="event_types[]"
						checked={this.state.event_types.includes('Music')}
						value="Music"
						onChange={this.handleCheckboxChange}
					/>Music
					<input
						type="checkbox"
						name="event_types[]"
						checked={this.state.event_types.includes('Sports')}
						value="Sports"
						onChange={this.handleCheckboxChange}
					/>Sports
					<input
						type="checkbox"
						name="event_types[]"
						checked={this.state.event_types.includes('Food')}
						value="Food"
						onChange={this.handleCheckboxChange}
					/>Food
					<input
						type="checkbox"
						name="event_types[]"
						checked={this.state.event_types.includes('Conferences')}
						value="Conferences"
						onChange={this.handleCheckboxChange}
					/>Conferences<br />
					<input type="submit" value="Search" />
				</form>
				<p>{this.state.errorMessage}</p>
			</div>
		);
	}

	//bind state to inputs
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleCheckboxChange(e) {
		const event_types = this.state.event_types;
		let index;

		if (e.target.checked) {
			event_types.push(e.target.value);
		} else {
			index = event_types.indexOf(e.target.value);
			event_types.splice(index, 1);
		}
		this.setState({ event_types: event_types });
	}

	handleFormSubmit(e) {
		//Login on form submit
		e.preventDefault();
		//convert undefined attributes into empty strings for the search
		var args = [
			this.state.searchName,
			this.state.start_date,
			this.state.end_date,
			this.state.country_code,
			this.state.administrative_area,
			this.state.locality,
			this.state.postal_code,
			this.state.thoroughfare,
			JSON.stringify(this.state.event_types).replace(/"([^"]+(?="))"/g, '$1')
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
				args[2] +
				'&country_code=' +
				args[3] +
				'&administrative_area=' +
				args[4] +
				'&locality=' +
				args[5] +
				'&postal_code=' +
				args[6] +
				'&thoroughfare=' +
				args[7] +
				'&event_types=' +
				args[8]
		);
	}
}

export default withRouter(SearchForm);
