import React, { Component } from 'react';
import CountrySelector from './CountrySelector';

class NestedEventRegistration extends Component {
	constructor(props) {
		super();
		this.onChange = props.onChange.bind(this);
		this.onLocationChange = props.onLocationChange.bind(this);
	}

	render() {
		return (
			<div>
				<h5>Dates:</h5>
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
				<h5>Location:</h5>
				<ul>
					<li>
						<label htmlFor="country_code">Country: </label>
						<CountrySelector onChange={this.onLocationChange} />
					</li>
					<li>
						<label htmlFor="administrative_area">State/Province: </label>
						<input
							placeholder="Enter State/Province"
							name="administrative_area"
							type="text"
							onChange={this.onLocationChange}
						/>
					</li>
					<li>
						<label htmlFor="locality">City/Town: </label>
						<input
							placeholder="Enter City/Town"
							name="locality"
							type="text"
							onChange={this.onLocationChange}
						/>
					</li>
					<li>
						<label htmlFor="postal_code">Zip Code: </label>
						<input
							placeholder="Enter Zip Code"
							name="postal_code"
							type="text"
							onChange={this.onLocationChange}
						/>
					</li>
					<li>
						<label htmlFor="thoroughfare">Street Address: </label>
						<input
							placeholder="Enter Street Address"
							name="thoroughfare"
							type="text"
							onChange={this.onLocationChange}
						/>
					</li>
				</ul>
			</div>
		);
	}
}

export default NestedEventRegistration;
