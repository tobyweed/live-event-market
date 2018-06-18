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
				const access = res.data.access_token;
				const refresh = res.data.refresh_token;
				if (!!access && !!refresh) {
					//if we got the access tokens, put them in localStorage
					this.setAccess(res.data.access_token);
					this.setRefresh(res.data.refresh_token);
				} else {
					return res.data.message; //The message from the server
				}
			})
			.catch(err => {
				return err;
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
				const access = res.data.access_token;
				const refresh = res.data.refresh_token;
				if (!!access && !!refresh) {
					//if we got the access tokens, put them in localStorage
					this.setAccess(res.data.access_token);
					this.setRefresh(res.data.refresh_token);
				} else {
					return res.data.message; //The message from the server
				}
			})
			.catch(err => {
				return err;
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

	//get user info from their access token
	getProfile() {
		return decode(this.getAccess());
	}

	//set header and refresh access token if needed
	initialize() {
		const refresh = this.getRefresh();
		return new Promise((resolve, reject) => {
			if (this.loggedIn()) {
				this.setHeader(); //Set axios header
				resolve('axios header set');
			} else if (!!refresh && !this.isTokenExpired(refresh)) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${refresh}`; //set the header to be the refresh token
				axios
					.post('/token/refresh')
					.then(res => {
						//refresh access token
						this.setAccess(res.data.access_token);
						this.setRefresh(res.data.refresh_token);

						this.setHeader(); //Set axios header
						resolve(res);
					})
					.catch(err => reject(err));
			} else {
				resolve('Not logged in');
			}
		});
	}

	//return user and promoter data in a single object
	getData() {
		let data = {};
		return new Promise((resolve, reject) => {
			if (this.loggedIn()) {
				const profile = this.getProfile(); //Get the info from our jwt token
				//now get and set userData
				axios.get('/user/' + profile.identity).then(res => {
					data.userData = res.data;
					axios.get('/promoter/' + profile.identity).then(res => {
						data.promoterData = res.data;
						resolve(data);
					});
				});
			} else {
				data.userData = null;
				data.promoterData = null;
				resolve(data);
			}
		});
	}

	//set axios header
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
