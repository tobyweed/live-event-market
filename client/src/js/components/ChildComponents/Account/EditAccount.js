import React, { Component } from 'react';
import axios from 'axios';
import '../../../../css/App.css';

class EditAccount extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showForm: false,
			firstName: props.userData.firstName,
			lastName: props.userData.lastName,
			email: props.userData.email,
			phoneNumber: props.userData.phoneNumber,
			proPic: props.userData.proPic,
			organization: props.userData.organization
		};

		this.handleChange = this.handleChange.bind(this);
		this.editFormSubmit = this.props.editFormSubmit.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	render() {
		return (
			<div>
				<button onClick={this.onClick}>Edit</button>
				{this.state.showForm ? (
					<div>
						<h4 className="edit-account-form">Edit Your Information</h4>
						<form onSubmit={this.editFormSubmit}>
							<input
								className="form-item"
								placeholder="Enter First Name"
								value={this.state.firstName}
								name="firstName"
								type="text"
								onChange={this.handleChange}
							/>
							<input
								className="form-item"
								placeholder="Enter Last Name"
								value={this.state.lastName}
								name="lastName"
								type="text"
								onChange={this.handleChange}
							/>
							<input
								className="form-item"
								placeholder="Enter Email"
								value={this.state.email}
								name="email"
								type="email"
								onChange={this.handleChange}
								required
							/>
							<br />
							<input
								className="form-item"
								placeholder="Enter Phone Number"
								value={this.state.phoneNumber}
								name="phoneNumber"
								type="text"
								onChange={this.handleChange}
							/>
							{/* This is temporary. It will be an upload input once we deal with image handling*/}
							<input
								className="form-item"
								placeholder="Profile Image Url"
								value={this.state.proPic}
								name="proPic"
								type="text"
								onChange={this.handleChange}
							/>
							<input
								className="form-item"
								placeholder="Your Organization"
								value={this.state.organization}
								name="organization"
								type="text"
								onChange={this.handleChange}
							/>
							<br />
							<input className="form-submit" value="Submit" type="submit" />
						</form>
						<p>{this.props.editFormMessage}</p>
						<p />
					</div>
				) : null}
			</div>
		);
	}

	onClick() {
		const showing = this.state.showForm;
		if (showing) {
			this.setState({ showForm: false });
		} else {
			this.setState({ showForm: true });
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
}

export default EditAccount;
