import React, { Component } from 'react';
import { withRouter } from 'react-router';
import qs from 'qs';
import update from 'immutability-helper';

import CountrySelector from '../Events/CountrySelector';

class SearchForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errorMessage: '',
			event_types: []
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleEventTypeCheckboxChange = this.handleEventTypeCheckboxChange.bind(
			this
		);
		this.handleBooleanCheckboxChange = this.handleBooleanCheckboxChange.bind(
			this
		);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	componentDidMount() {
		let initialSearch = qs.parse(this.props.location.search.slice(1));
		if (initialSearch.event_types) {
			//If the search query has a string representing event types, make them into a nice array for prepopulating the form
			let event_types = initialSearch.event_types;
			let event_types_array = event_types.slice(1, -1).split(',');
			if (event_types_array[0]) {
				//only convert event_types to array if the first element is not null. This avoids setting an empty string as first element
				event_types = event_types_array;
			} else {
				event_types = [];
			}
			//If the querystring series says "true", then set "series" to true
			let isSeries = initialSearch.series === 'true';
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
					event_types: event_types,
					series: isSeries
				});
			}
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
						onChange={this.handleEventTypeCheckboxChange}
					/>Music
					<input
						type="checkbox"
						name="event_types[]"
						checked={this.state.event_types.includes('Sports')}
						value="Sports"
						onChange={this.handleEventTypeCheckboxChange}
					/>Sports
					<input
						type="checkbox"
						name="event_types[]"
						checked={this.state.event_types.includes('Food')}
						value="Food"
						onChange={this.handleEventTypeCheckboxChange}
					/>Food
					<input
						type="checkbox"
						name="event_types[]"
						checked={this.state.event_types.includes('Conferences')}
						value="Conferences"
						onChange={this.handleEventTypeCheckboxChange}
					/>Conferences<br />
					<h6>Other:</h6>
					<input
						type="checkbox"
						name="series"
						checked={this.state.series}
						onChange={this.handleBooleanCheckboxChange}
					/>Series
					<br />
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

	handleBooleanCheckboxChange(e) {
		let target = e.target.name;
		this.setState(prevState => ({
			//set the state to be the opposite of what it was before
			[target]: !prevState[target]
		}));
	}

	handleEventTypeCheckboxChange(e) {
		const event_types = this.state.event_types;
		let newEventTypes;

		if (e.target.checked) {
			newEventTypes = update(event_types, {
				$push: [e.target.value]
			});
		} else {
			const index = event_types.indexOf(e.target.value);
			newEventTypes = update(this.state.event_types, {
				$splice: [[index, 1]]
			});
		}
		this.setState({ event_types: newEventTypes });
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
			//convert the event types array into a string and remove double quotes around items
			JSON.stringify(this.state.event_types).replace(/"([^"]+(?="))"/g, '$1'),
			this.state.series
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
				args[8] +
				'&series=' +
				args[9]
		);
	}
}

export default withRouter(SearchForm);
