import React, { Component } from 'react';
import { withRouter } from 'react-router';
import qs from 'qs';
import { search } from '../../utils/functions';
import SearchForm from './SearchForm';
import EventListing from '../Events/EventListing';

class Account extends Component {
	state = {
		search: '',
		results: '',
		errorMessage: ''
	};

	componentWillMount() {
		//Listen for url changes and re-search based on the new query string
		this.unlisten = this.props.history.listen(location => {
			let query = qs.parse(location.search.slice(1));
			this.searchEvents(
				query.name,
				query.start_date,
				query.end_date,
				query.country_code,
				query.administrative_area,
				query.locality,
				query.postal_code,
				query.thoroughfare,
				query.event_types
			);
		});
	}

	componentWillUnmount() {
		this.unlisten(); //stop listening
	}

	componentDidMount() {
		//Intialize results based on query string
		let query = qs.parse(this.props.location.search.slice(1));
		this.searchEvents(
			query.name,
			query.start_date,
			query.end_date,
			query.country_code,
			query.administrative_area,
			query.locality,
			query.postal_code,
			query.thoroughfare,
			query.event_types
		);
	}

	searchEvents(
		name,
		start_date,
		end_date,
		country_code,
		administrative_area,
		locality,
		postal_code,
		thoroughfare,
		event_types
	) {
		search(
			name,
			start_date,
			end_date,
			country_code,
			administrative_area,
			locality,
			postal_code,
			thoroughfare,
			event_types
		)
			.then(res => {
				this.setState({ results: res }); //add that to redux state
			})
			.catch(err => {
				console.log(err);
				this.setState({ errorMessage: 'Something went wrong.' });
			});
	}

	render() {
		const results = this.state.results;

		return (
			<div className="search-results-page">
				<SearchForm />
				{results.data && results.data.constructor === Array ? (
					<div>
						<h1>Search Results:</h1>
						<ul>
							{results.data.map(function(eventInfo, i) {
								return (
									<li key={i}>
										<EventListing eventId={eventInfo[0]} />
									</li>
								);
							})}
						</ul>
					</div>
				) : (
					<h1>
						There are no events matching that description. Please try something
						else.
					</h1>
				)}
			</div>
		);
	}
}

export default withRouter(Account);
