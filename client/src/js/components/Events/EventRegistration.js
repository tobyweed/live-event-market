import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updatePromoter } from '../../actions';
import AuthService from '../../utils/auth/AuthService';
import update from 'immutability-helper';

import NestedEventRegistration from './NestedEventRegistration';

class EventRegistration extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleNestedChange = this.handleNestedChange.bind(this);
		this.handleEventLocationChange = this.handleEventLocationChange.bind(this);
		this.handleAddNested = this.handleAddNested.bind(this);
		this.handleRemoveNested = this.handleRemoveNested.bind(this);
		this.handleBooleanCheckboxChange = this.handleBooleanCheckboxChange.bind(
			this
		);
		this.handleEventTypeCheckboxChange = this.handleEventTypeCheckboxChange.bind(
			this
		);

		this.Auth = new AuthService();
	}

	state = {
		errorMessage: '',
		events: [{ start_date: '', end_date: '', location: {} }],
		event_images: [{ img: '', description: '' }],
		event_types: []
	};

	render() {
		return (
			<div className="event-registration">
				<h3>Create a New Event</h3>
				<form onSubmit={this.handleFormSubmit}>
					<label htmlFor="name">
						<h5>Event Name: </h5>
					</label>
					<input
						className="form-item"
						placeholder="Enter Event Name"
						name="name"
						type="text"
						onChange={this.handleChange}
						required
					/>
					<br />
					<label htmlFor="series">
						<h5>Series: </h5>
					</label>
					<input
						className="form-item"
						name="series"
						type="checkbox"
						onChange={this.handleBooleanCheckboxChange}
					/>
					{/*Add nested Events which can be added or subtracted from state if series is selected, otherwise add only one Event form*/}
					{this.state.series ? (
						<div>
							<br />
							<h5>Individual Events: </h5>
							<ul>
								{this.state.events.map((event, i) => (
									<li key={i}>
										<NestedEventRegistration
											onChange={this.handleNestedChange(i, 'events')}
											onLocationChange={this.handleEventLocationChange(i)}
										/>
									</li>
								))}
								<li>
									Add or Remove an Event:
									<button
										type="button"
										onClick={this.handleAddNested('events')}
									>
										+
									</button>
									/
									<button
										type="button"
										onClick={this.handleRemoveNested('events')}
									>
										-
									</button>
								</li>
							</ul>
						</div>
					) : (
						<NestedEventRegistration
							onChange={this.handleNestedChange(0, 'events')}
							onLocationChange={this.handleEventLocationChange(0)}
						/>
					)}
					<br />
					<h5>Type:</h5>
					<input
						type="checkbox"
						name="event_types[]"
						value="Music"
						onChange={this.handleEventTypeCheckboxChange}
					/>Music
					<input
						type="checkbox"
						name="event_types[]"
						value="Sports"
						onChange={this.handleEventTypeCheckboxChange}
					/>Sports
					<input
						type="checkbox"
						name="event_types[]"
						value="Food"
						onChange={this.handleEventTypeCheckboxChange}
					/>Food
					<input
						type="checkbox"
						name="event_types[]"
						value="Conferences"
						onChange={this.handleEventTypeCheckboxChange}
					/>Conferences
					<br />
					<h5>Description:</h5>
					<br />
					<textarea
						className="form-item"
						placeholder="Enter a Description of This Event"
						name="description"
						onChange={this.handleChange}
					/>
					<br />
					<h5>Profile Picture:</h5>
					<br />
					<input
						className="form-item"
						placeholder="Enter an Image Url"
						name="proPicUrl"
						type="text"
						onChange={this.handleChange}
					/>
					<br />
					<div>
						<br />
						<h5>Images: </h5>
						<ul>
							{this.state.event_images.map((image, i) => (
								<li key={i}>
									<label htmlFor="img">Image URL: </label>
									<input
										placeholder="Enter URL"
										name="img"
										type="text"
										onChange={this.handleNestedChange(i, 'event_images')}
									/>
									<label htmlFor="description">Image Description: </label>
									<input
										placeholder="Enter Description"
										name="description"
										type="text"
										onChange={this.handleNestedChange(i, 'event_images')}
									/>
								</li>
							))}
							<li>
								Add or Remove an Image:
								<button
									type="button"
									onClick={this.handleAddNested('event_images')}
								>
									+
								</button>
								/
								<button
									type="button"
									onClick={this.handleRemoveNested('event_images')}
								>
									-
								</button>
							</li>
						</ul>
					</div>
					<input className="form-submit" value="Submit" type="submit" />
				</form>
				{this.state.errorMessage}
			</div>
		);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	//==============Types & Booleans==============
	handleBooleanCheckboxChange(e) {
		let target = e.target.name;
		//If we are checking or unchecking series, then remove all but one event
		if (target === 'series') {
			let newEvents = update(this.state.events, {
				$splice: [[0, this.state.events.length - 1]]
			});
			this.setState({ events: newEvents });
		}

		this.setState(prevState => ({
			//set the state to be the opposite of what it was before
			[target]: !prevState[target]
		}));
	}

	handleEventTypeCheckboxChange(e) {
		const event_types = this.state.event_types;
		let index;

		if (e.target.checked) {
			event_types.push({ type: e.target.value });
		} else {
			index = event_types.findIndex(el => {
				return el.type === e.target.value;
			});
			event_types.splice(index, 1);
		}
		this.setState({ event_types: event_types });
	}

	//==============Nested Events & Images==============
	handleNestedChange = (i, target) => e => {
		let newArray = update(this.state[target], {
			[i]: {
				[e.target.name]: { $set: e.target.value }
			}
		});
		this.setState({
			[target]: newArray
		});
	};

	handleEventLocationChange = i => e => {
		let newEvents = update(this.state.events, {
			[i]: {
				location: {
					[e.target.name]: { $set: e.target.value }
				}
			}
		});
		this.setState({
			events: newEvents
		});
	};

	handleRemoveNested = target => e => {
		let newArray = update(this.state[target], {
			$splice: [[-1, 1]]
		});
		this.setState({ [target]: newArray });
	};

	handleAddNested = target => e => {
		let newArray = update(this.state[target], {
			$push: [{ start_date: '', end_date: '', location: {} }]
		});
		this.setState({ [target]: newArray });
	};

	//==============Submit==============
	handleFormSubmit(e) {
		//Login on form submit
		e.preventDefault();

		axios
			.post('/create-event', {
				name: this.state.name,
				series: this.state.series,
				events: this.state.events,
				event_images: this.state.event_images,
				event_types: this.state.event_types,
				description: this.state.description,
				pro_pic_url: this.state.proPicUrl
			})
			.then(res => {
				//if we get data in our response and that data is an array, then add that data to state
				if (res.data && res.data.constructor === Array) {
					this.props.dispatch(updatePromoter('event_infos', res.data));
					this.setState({
						errorMessage: 'Event ' + this.state.name + ' was created.'
					});
				} else {
					this.setState({ errorMessage: res.data.message });
				}
			})
			.catch(err => {
				console.log(err);
				this.setState({ errorMessage: 'Something went wrong.' });
			});
	}
}

function mapStateToProps(state) {
	return {
		promoterData: state.promoterData
	};
}

export default connect(mapStateToProps)(EventRegistration);
