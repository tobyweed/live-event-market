import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setPromoterData } from '../../actions';

import withAuth from '../../utils/auth/withAuth';

class PromoterRegistration extends Component {
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
			<div className="promoter-registration">
				<h3>Create a Promoter Account</h3>
				<form onSubmit={this.handleFormSubmit}>
					<input
						className="form-item"
						placeholder="Enter Promoter Name"
						name="name"
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
			.post('/promoters/registration', {
				name: this.state.name
			})
			.then(res => {
				console.log(res);
				if (res.status === 200) {
					this.props.dispatch(setPromoterData(res.data));
				} else {
					this.setState({ errorMessage: res });
				}
			})
			.catch(err => {
				this.setState({ errorMessage: err });
			});
	}
}

function mapStateToProps(state) {
	return {
		promoterData: state.promoterData
	};
}

export default connect(mapStateToProps)(PromoterRegistration);
