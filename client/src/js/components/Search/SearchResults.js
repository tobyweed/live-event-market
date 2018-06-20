import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'query-string';
import { search } from '../../utils/functions';

class Account extends Component {
	state = {
		results: '',
		errorMessage: ''
	};

	componentDidMount() {
		const query = qs.parse(this.props.location.search);
		console.log(query);
		search(query.name, query.start_date, query.end_date)
			.then(res => {
				console.log(res);
				this.setState({ results: res }); //add that to redux state
			})
			.catch(err => {
				console.log(err);
				this.setState({ errorMessage: 'Something went wrong.' });
			});
	}

	render() {
		const results = this.state.results;
		console.log(results);
		return (
			<div className="search-results-page">
				{results ? (
					<ul>
						<li>wooohoo</li>
					</ul>
				) : (
					<p>arojadsflj</p>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		userData: state.idData.userData,
		promoterData: state.idData.promoterData
	};
}

export default connect(mapStateToProps)(withRouter(Account));
