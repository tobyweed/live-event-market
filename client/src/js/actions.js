const SET_USER = 'SET_USER';
const SET_USER_DATA = 'SET_USER_DATA';

export function setUser(profile) {
	return { type: SET_USER, user: profile };
}

export function setUserData(userData) {
	return { type: SET_USER_DATA, userData: userData };
}
