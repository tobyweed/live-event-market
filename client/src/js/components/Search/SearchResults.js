import React, { Component } from 'react';
import { withRouter } from 'react-router';
import qs from 'query-string';
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
			let query = qs.parse(location.search);
			this.searchEvents(query.name, query.start_date, query.end_date);
		});
	}

	componentWillUnmount() {
		this.unlisten(); //stop listening
	}

	componentDidMount() {
		//Intialize results based on query string
		let query = qs.parse(this.props.location.search);
		this.searchEvents(query.name, query.start_date, query.end_date);
	}

	searchEvents(name, start_date, end_date) {
		search(name, start_date, end_date)
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
