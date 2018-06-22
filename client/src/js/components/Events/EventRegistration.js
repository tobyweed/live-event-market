import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updatePromoter } from '../../actions';
import AuthService from '../../utils/auth/AuthService';

class EventRegistration extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);

		this.Auth = new AuthService();
	}

	state = {
		errorMessage: ''
	};

	render() {
		return (
			<div className="event-registration">
				<h3>Create a New Event</h3>
				<form onSubmit={this.handleFormSubmit}>
					<input
						className="form-item"
						placeholder="Enter Event Name"
						name="name"
						type="text"
						onChange={this.handleChange}
					/>
					<input
						className="form-item"
						placeholder="Enter Event Start Date"
						name="start_date"
						type="text"
						onChange={this.handleChange}
					/>
					<input
						className="form-item"
						placeholder="Enter Event End Date"
						name="end_date"
						type="text"
						onChange={this.handleChange}
					/>
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

	handleFormSubmit(e) {
		//Login on form submit
		e.preventDefault();

		axios
			.post('/create-event', {
				name: this.state.name,
				events: [
					{
						start_date: this.state.start_date,
						end_date: this.state.end_date
					}
				]
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
