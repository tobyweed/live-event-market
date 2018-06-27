import React, { Component } from 'react';
import axios from 'axios';

class AccountEvents extends Component {
	state = {
		eventInfo: ''
	};

	componentDidMount() {
		axios.get('/event/' + this.props.eventId).then(res => {
			this.setState({ eventInfo: res.data });
		});
	}

	componentWillReceiveProps(nextProps) {
		axios.get('/event/' + nextProps.eventId).then(res => {
			this.setState({ eventInfo: res.data });
		});
	}

	render() {
		const eventInfo = this.state.eventInfo;
		return eventInfo ? (
			<div>
				<h4>{eventInfo.name}</h4>
				Dates & Locations:
				<ul>
					{eventInfo.events.map(function(event, i) {
						const start_date = new Date(event.start_date);
						const end_date = new Date(event.end_date);
						return (
							<li key={i}>
								Event {i + 1}
								<ul>
									<li>Start Date: {start_date.toString()}</li>
									<li>End Date: {end_date.toString()}</li>
								</ul>
							</li>
						);
					})}
				</ul>
			</div>
		) : (
			<span>
				This event listing is still loading. Try refreshing the page if load
				does not occur.
			</span>
		);
	}
}

export default AccountEvents;
