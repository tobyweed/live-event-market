import React, { Component } from 'react';

class NestedEventRegistration extends Component {
	constructor(props) {
		super();
		this.onChange = props.onChange.bind(this);
	}

	render() {
		return (
			<div>
				Dates:
				<input
					placeholder="Enter Event Start Date"
					name="start_date"
					type="datetime-local"
					onChange={this.onChange}
				/>
				<input
					placeholder="Enter Event End Date"
					name="end_date"
					type="datetime-local"
					onChange={this.onChange}
				/>
				<br />
				Location:
				<input
					placeholder="Enter Event Start Date"
					name="start_date"
					type="datetime-local"
					onChange={this.onChange}
				/>
				<input
					placeholder="Enter Event End Date"
					name="end_date"
					type="datetime-local"
					onChange={this.onChange}
				/>
			</div>
		);
	}
}

export default NestedEventRegistration;
