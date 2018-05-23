import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
	const Auth = new AuthService();
	return class AuthWrapped extends Component {
		// Code here now
	};
}
