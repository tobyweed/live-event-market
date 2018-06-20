import React, { Component } from 'react';
import axios from 'axios';
import { addUser } from '../../actions';
import { connect } from 'react-redux';

class PromoterAddUser extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	state = {
		errorMessage: ''
	};

	render() {
		return (
			<div className="promoter-add-user">
				<h3>Add Another User to this Promoter Account</h3>
				<form onSubmit={this.handleFormSubmit}>
					<label htmlFor="promoter-add-user-username">
						Enter the username of the person you would like to add:
					</label>
					<input
						id="promoter-add-user-username"
						className="form-item"
						placeholder="Username"
						name="username"
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
		const newUserUsername = this.state.username;

		axios
			.post('/promoter/adduser', {
				username: newUserUsername
			})
			.then(res => {
				if (
					res.data.message ===
					'User ' + newUserUsername + ' was added to your promoter account.'
				) {
					this.props.dispatch(addUser(newUserUsername));
				}
				this.setState({ errorMessage: res.data.message });
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

export default connect(mapStateToProps)(PromoterAddUser);
