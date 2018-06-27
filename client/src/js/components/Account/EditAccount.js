import React, { Component } from 'react';
import axios from 'axios';
import '../../../css/App.css';
import { connect } from 'react-redux';
import { setUserData } from '../../actions.js';

class EditAccount extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showForm: false,
			errorMessage: '',
			firstName: props.userData.firstName,
			lastName: props.userData.lastName,
			email: props.userData.email,
			phoneNumber: props.userData.phoneNumber,
			proPicUrl: props.userData.proPicUrl,
			organization: props.userData.organization
		};

		this.onClick = this.onClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	render() {
		if (this.props.userData) {
			return (
				<div>
					<button onClick={this.onClick}>Edit</button>
					{this.state.showForm ? (
						<div>
							<h4 className="edit-account-form">Edit Your Information</h4>
							<form onSubmit={this.handleFormSubmit}>
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
									value={this.state.proPicUrl}
									name="proPicUrl"
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
							<p>{this.state.editFormMessage}</p>
							<p />
						</div>
					) : null}
				</div>
			);
		} else {
			return null;
		}
	}

	//toggle form visibility
	onClick(e) {
		e.preventDefault();
		this.setState(prevstate => ({ showForm: !prevstate.showForm }));
	}

	//bind state to inputs
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleFormSubmit(e) {
		e.preventDefault();
		//Edit the user and set the state accordingly
		axios
			.put('/user/' + this.props.userData.username, {
				username: this.props.userData.username,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				email: this.state.email,
				phoneNumber: this.state.phoneNumber,
				proPicUrl: this.state.proPicUrl,
				organization: this.state.organization
			})
			.then(res => {
				this.props.dispatch(
					setUserData({
						username: res.data.username,
						firstName: res.data.firstName,
						lastName: res.data.lastName,
						email: res.data.email,
						phoneNumber: res.data.phoneNumber,
						proPicUrl: res.data.proPicUrl,
						organization: res.data.organization
					})
				);
				this.setState({
					editFormMessage: 'Your account data has been updated.'
				});
			})
			.catch(err => {
				this.setState({ editFormMessage: err });
			});
	}
}

function mapStateToProps(state) {
	return {
		userData: state.idData.userData,
		promoterData: state.idData.promoterData
	};
}

export default connect(mapStateToProps)(EditAccount);
