import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventRegistration from '../Events/EventRegistration';

import EventListing from '../Events/EventListing';

class AccountEvents extends Component {
	render() {
		const eventInfos = this.props.promoterData.event_infos;

		return (
			<div>
				<h1>Events</h1>
				<h3>Events Created by This Promoter Account:</h3>
				<div>
					{eventInfos ? (
						<ul>
							{eventInfos.map(function(eventInfo, i) {
								return (
									<li key={i}>
										<EventListing eventId={eventInfo.id} />
									</li>
								);
							})}
						</ul>
					) : (
						<span>This promoter account has not created any events.</span>
					)}
				</div>
				<h3>Create a New Event</h3>
				<EventRegistration />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		promoterData: state.idData.promoterData
	};
}

export default connect(mapStateToProps)(AccountEvents);
