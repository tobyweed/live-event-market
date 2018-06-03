import axios from 'axios';
import decode from 'jwt-decode';

//This class handles client-side auth logic

class AuthService {
	login(username, password) {
		return axios
			.post('/login', {
				username: username,
				password: password
			})
			.then(res => {
				this.setAccess(res.data.access_token);
				this.setRefresh(res.data.refresh_token);
				return Promise.resolve(res);
			});
	}

	register(data) {
		return axios
			.post('/registration', {
				username: data.username,
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phoneNumber: data.phoneNumber,
				proPic: data.proPic,
				organization: data.organization
			})
			.then(res => {
				this.setAccess(res.data.access_token);
				this.setRefresh(res.data.refresh_token);
				return Promise.resolve(res);
			});
	}

	loggedIn() {
		const token = this.getAccess();
		return !!token && !this.isTokenExpired(token) && this.isTokenValid(token);
	}

	isTokenExpired(token) {
		try {
			const decoded = decode(token);
			if (decoded.exp < Date.now() / 1000) {
				return true;
			} else return false;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	isTokenValid(token) {
		try {
			const decoded = decode(token);
			if (!!decoded) {
				return true;
			} else return false;
		} catch (err) {
			return false;
		}
	}

	setAccess(idToken) {
		localStorage.setItem('id_access_token', idToken);
	}

	setRefresh(idToken) {
		localStorage.setItem('id_refresh_token', idToken);
	}

	getAccess() {
		return localStorage.getItem('id_access_token');
	}

	getRefresh() {
		return localStorage.getItem('id_refresh_token');
	}

	logout() {
		// const access_token = this.getAccess();
		// const access_token = this.getRefresh();
		// axios.post(
		// 	'/logout/access',
		// 	{ headers: {"Authorization" : `Bearer ${tokenStr}`} }
		// );
		// axios.post(
		// 	'/logout/refresh',
		// 	{ headers: {"Authorization" : `Bearer ${tokenStr}`} }
		// );
		localStorage.removeItem('id_access_token');
		localStorage.removeItem('id_refresh_token');
	}

	getProfile() {
		return decode(this.getAccess());
	}

	setHeader() {
		if (this.loggedIn()) {
			axios.defaults.headers.common['Authorization'] =
				'Bearer ' + this.getAccess();
		}
	}
}

/* The following is a command to enter in console in the browser.
It changes the access token to an expired one. This is how to test
refresh token functionality.

localStorage.setItem('id_access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwOTZlMzhiNC01NGNhLTQ4ZjYtYjA2Mi02MjY1NGMxNzBkN2MiLCJleHAiOjE1Mjc5NjQ2MjksImZyZXNoIjpmYWxzZSwiaWF0IjoxNTI3OTYzNzI5LCJ0eXBlIjoiYWNjZXNzIiwibmJmIjoxNTI3OTYzNzI5LCJpZGVudGl0eSI6InRlc3QifQ.Eg5je9u-vQNT1vAl33j-wlZ7lBB5ObzymntdLUV-qEI');
*/

export default AuthService;
