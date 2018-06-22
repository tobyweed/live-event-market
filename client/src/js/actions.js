const SET_USER_DATA = 'SET_USER_DATA';
const UPDATE_USER = 'UPDATE_USER';
const SET_PROMOTER_DATA = 'SET_PROMOTER_DATA';
const UPDATE_PROMOTER = 'UPDATE_PROMOTER';
const ADD_USER = 'ADD_USER';
const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
const REFRESH_DATA = 'REFRESH_DATA';

//idData
export function setUserData(userData) {
	return { type: SET_USER_DATA, userData: userData };
}

export function updateUser(key, value) {
	return { type: UPDATE_USER, key: key, value: value };
}

export function setPromoterData(promoterData) {
	return { type: SET_PROMOTER_DATA, promoterData: promoterData };
}

export function updatePromoter(key, value) {
	return { type: UPDATE_PROMOTER, key: key, value: value };
}

export function addUser(user) {
	return { type: ADD_USER, user: user };
}

export function refreshData(data) {
	return { type: REFRESH_DATA, data: data };
}

export function clearUserData() {
	return { type: CLEAR_USER_DATA };
}
