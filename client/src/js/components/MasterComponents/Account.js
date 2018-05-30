import React, { Component } from 'react';

import AuthService from '../../utils/auth/AuthService';
import withAuth from '../../utils/auth/withAuth';
import hidden from '../../utils/auth/hidden';

class Account extends Component {
	render() {
		return <div>{this.props.user.identity}</div>;
	}
}

export default hidden(withAuth(Account));
