import axios from 'axios';
import AuthService from './utils/auth/AuthService';

const Auth = new AuthService();

const SET_USER_DATA = 'SET_USER_DATA';
const SET_PROMOTER_DATA = 'SET_PROMOTER_DATA';
const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
const REFRESH_DATA = 'REFRESH_DATA';

export function setPromoterData(promoterData) {
	return { type: SET_PROMOTER_DATA, promoterData: promoterData };
}

export function clearUserData() {
	return { type: CLEAR_USER_DATA };
}

export function setUserData(userData) {
	return { type: SET_USER_DATA, userData: userData };
}

export function refreshData(data) {
	return { type: REFRESH_DATA, data: data };
}
