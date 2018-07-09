import React, { Component } from 'react';
import axios from 'axios';

import blank_prof from '../../../images/blank_prof.png';

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
				Created by Promoter: {eventInfo.promoter_name}
				<br />
				Series: {eventInfo.series ? <span>Yes.</span> : <span>No.</span>}
				<br />
				Dates & Locations:
				<ul>
					{/* Map eventinfo events array and format each event to be displayed*/}
					{eventInfo.events.map(function(event, i) {
						const start_date = new Date(event.start_date);
						const end_date = new Date(event.end_date);
						return (
							<li key={i}>
								Event {i + 1}
								<ul>
									{event.start_date ? (
										<li>Start Date: {start_date.toString()}</li>
									) : (
										''
									)}
									{event.end_date ? (
										<li>End Date: {end_date.toString()}</li>
									) : (
										''
									)}
									{/* Check if the event has a location attribute and whether that location
										attribute has any non-null values before trying to display it*/}
									{event.location &&
									Object.values(event.location).some(el => {
										return el !== null;
									}) ? (
										<li>
											Location:&nbsp;
											{event.location.thoroughfare
												? event.location.thoroughfare
												: ''}
											,&nbsp;
											{event.location.locality ? event.location.locality : ''}
											&nbsp;
											{event.location.administrative_area
												? event.location.administrative_area
												: ''}
											&nbsp;
											{event.location.postal_code
												? event.location.postal_code
												: ''}
											,&nbsp;
											{event.location.country_code
												? event.location.country_code
												: ''}
											&nbsp;
										</li>
									) : (
										''
									)}
								</ul>
							</li>
						);
					})}
				</ul>
				{eventInfo.event_types[0] ? (
					<div>
						Type:
						{eventInfo.event_types.map(function(event_type, i) {
							return <span key={i}>&nbsp;{event_type.type}.&nbsp;</span>;
						})}
					</div>
				) : (
					''
				)}
				<div>
					{eventInfo.description ? (
						<div>Description: {eventInfo.description}</div>
					) : (
						''
					)}
				</div>
				{eventInfo.pro_pic_url ? (
					<div>
						Profile Picture:
						<div className="event-pro-pic">
							{eventInfo.pro_pic_url ? (
								<img
									src={eventInfo.pro_pic_url}
									onError={e => {
										e.target.src =
											'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
									}}
									alt="Profile"
								/>
							) : (
								<img
									src={
										'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
									}
									alt="blank profile icon"
								/>
							)}
						</div>
					</div>
				) : (
					''
				)}
				{eventInfo.event_images[0] ? (
					<div>
						Pictures:
						<br />
						{eventInfo.event_images.map(function(eventImage, i) {
							return (
								<div key={i} className="event-image">
									{eventImage.img ? (
										<img
											src={eventImage.img}
											onError={e => {
												e.target.src =
													'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
											}}
											alt="User"
										/>
									) : (
										<img
											src={
												'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
											}
											alt="blank profile icon"
										/>
									)}
									{eventImage.description ? (
										<span>{eventImage.description}</span>
									) : (
										''
									)}
								</div>
							);
						})}
					</div>
				) : (
					''
				)}
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
