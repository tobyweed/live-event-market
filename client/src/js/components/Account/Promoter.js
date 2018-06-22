import React, { Component } from 'react';
import { connect } from 'react-redux';

import AccountEvents from './AccountEvents';
import PromoterAddUser from '../Account/PromoterAddUser';

class Promoter extends Component {
	render() {
		const users = this.props.promoterData.users;

		return (
			<div className="Promoter-page">
				<h1>Promoter</h1>
				<h3>Details</h3>
				<ul>
					<li>Name: {this.props.promoterData.name}</li>
					<li>
						Users:
						{users && (
							<ul>
								{users.map(function(member, i) {
									return <li key={i}>{member.username}</li>;
								})}
							</ul>
						)}
					</li>
					{/*<li>Last Name: {this.state.userData.lastName}</li>
						<li>Email: {this.state.userData.email}</li>
						<li>Phone #: {this.state.userData.phoneNumber}</li>
						<li>Organization: {this.state.userData.organization}</li>*/}
				</ul>
				<PromoterAddUser />
				<AccountEvents />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		userData: state.idData.userData,
		promoterData: state.idData.promoterData
	};
}

export default connect(mapStateToProps)(Promoter);
