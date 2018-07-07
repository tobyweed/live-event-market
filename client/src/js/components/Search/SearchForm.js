import React, { Component } from 'react';
import { withRouter } from 'react-router';
import qs from 'qs';
import update from 'immutability-helper';

import CountrySelector from '../Events/CountrySelector';
import BooleanFilter from './BooleanFilter';

class SearchForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errorMessage: '',
			event_types: [],
			showFilters: false,
			series: {
				use: false, //to tell whether to use this filter
				term: '' //the value of the filter for the search (true or false when used)
			},
			ticketed: {
				use: false, //to tell whether to use this filter
				term: '' //the value of the filter for the search (true or false when used)
			},
			private: {
				use: false, //to tell whether to use this filter
				term: '' //the value of the filter for the search (true or false when used)
			}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleEventTypeCheckboxChange = this.handleEventTypeCheckboxChange.bind(
			this
		);
		this.handleBooleanCheckboxChange = this.handleBooleanCheckboxChange.bind(
			this
		);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.showFilters = this.showFilters.bind(this);
		this.useFilter = this.useFilter.bind(this);
		this.getNumOfActiveFilters = this.getNumOfActiveFilters.bind(this);
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

			//For each of the boolean filters, If the querystring series says "true", then set series.term to true.
			//Otherwise set it to false
			const boolFilters = ['series', 'ticketed', 'private'];
			let is = {};
			let use = {};
			boolFilters.forEach(filter => {
				is[filter] =
					initialSearch[filter] === 'true'
						? true
						: initialSearch[filter] === 'false' ? false : '';

				//check whether to initialize use[filter] to true or false based on whether is[filter] has a value
				use[filter] = is[filter] !== '';
			});

			//prepopulate state with values from the query string, for the form to use to populate itself
			if (initialSearch) {
				this.setState({
					searchText: initialSearch.text,
					start_date: initialSearch.start_date,
					country_code: initialSearch.country_code,
					administrative_area: initialSearch.administrative_area,
					locality: initialSearch.locality,
					postal_code: initialSearch.postal_code,
					thoroughfare: initialSearch.thoroughfare,
					event_types: event_types,
					series: {
						term: is['series'],
						use: use['series']
					},
					ticketed: {
						term: is['ticketed'],
						use: use['ticketed']
					},
					private: {
						term: is['private'],
						use: use['private']
					}
				});
			}
		}
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleFormSubmit} className="search-form">
					<h6>Search by Name/Description:</h6>
					<input
						placeholder="Search Events"
						value={this.state.searchText}
						name="searchText"
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
					<button onClick={this.showFilters}>Show More Filters</button>
					<span>
						There are currently{' '}
						{this.getNumOfActiveFilters([
							this.state.series,
							this.state.ticketed,
							this.state.private
						])}{' '}
						active filters
					</span>
					{this.state.showFilters ? (
						<div>
							<ul>
								<li>
									<BooleanFilter
										filterName="series"
										filter={this.state.series}
										useFilter={this.useFilter('series')}
										handleBooleanCheckboxChange={
											this.handleBooleanCheckboxChange
										}
									/>
								</li>
								<li>
									<BooleanFilter
										filterName="ticketed"
										filter={this.state.ticketed}
										useFilter={this.useFilter('ticketed')}
										handleBooleanCheckboxChange={
											this.handleBooleanCheckboxChange
										}
									/>
								</li>
								<li>
									<BooleanFilter
										filterName="private"
										filter={this.state.private}
										useFilter={this.useFilter('private')}
										handleBooleanCheckboxChange={
											this.handleBooleanCheckboxChange
										}
									/>
								</li>
							</ul>
						</div>
					) : (
						''
					)}
					<br />
					<input type="submit" value="Search" />
				</form>
				<p>{this.state.errorMessage}</p>
			</div>
		);
	}

	getNumOfActiveFilters(filters) {
		let numOfActiveFilters = 0;
		filters.forEach(filter => {
			if (filter.use) {
				numOfActiveFilters++;
			}
		});
		return numOfActiveFilters;
	}

	showFilters(e) {
		e.preventDefault();
		this.setState(prevState => ({ showFilters: !prevState.showFilters }));
	}

	useFilter = filter => e => {
		e.preventDefault();
		let term;
		//switch the value of filter.use, and make term an empty string if we are switching from use to not use
		this.state[filter]['use'] ? (term = '') : (term = false);
		this.setState(prevState => ({
			[filter]: {
				term: term,
				use: !prevState[filter]['use']
			}
		}));
	};

	//bind state to inputs
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleBooleanCheckboxChange(e) {
		let target = e.target.name;
		//switch the value of the term as long as we are using the filter
		if (this.state[target]['use']) {
			this.setState(prevState => ({
				[target]: {
					...prevState[target],
					term: !prevState[target]['term']
				}
			}));
		}
	}

	handleEventTypeCheckboxChange(e) {
		const event_types = this.state.event_types;
		let newEventTypes;

		//If the checkbox is now checked, add that type to the event_types in state for searching.
		//Otherwise, remove that event type from the state.
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
		//check whether the boolean filters should be used or not
		const series = this.state.series.use ? this.state.series.term : '';
		const ticketed = this.state.ticketed.use ? this.state.ticketed.term : '';
		const isPrivate = this.state.private.use ? this.state.private.term : ''; //is isPrivate because private is a reserved word

		//Login on form submit
		e.preventDefault();
		var args = [
			this.state.searchText,
			this.state.start_date,
			this.state.end_date,
			this.state.country_code,
			this.state.administrative_area,
			this.state.locality,
			this.state.postal_code,
			this.state.thoroughfare,
			//convert the event types array into a string and remove double quotes around items
			JSON.stringify(this.state.event_types).replace(/"([^"]+(?="))"/g, '$1'),
			series,
			ticketed,
			isPrivate
		];

		//convert undefined attributes into empty strings for the search
		args.forEach((arg, i) => {
			args[i] = arg === undefined ? '' : arg;
		});

		//Add the search terms to our url
		this.props.history.push(
			'/search-results?text=' +
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
				args[9] +
				'&ticketed=' +
				args[10] +
				'&private=' +
				args[11]
		);
	}
}

export default withRouter(SearchForm);
