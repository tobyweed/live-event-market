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
				{eventInfo.events.map(function(event, i) {
					return (
						<ul key={i}>
							<li>Start Date: {event.start_date}</li>
							<li>End Date: {event.end_date}</li>
						</ul>
					);
				})}
			</div>
		) : (
			<span>The page is loading</span>
		);
	}
}

export default AccountEvents;
