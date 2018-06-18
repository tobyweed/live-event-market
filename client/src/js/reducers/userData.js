const initialState = {
	userData: null,
	promoterData: null
};

const userData = (state = initialState, action) => {
	switch (action.type) {
		case 'REFRESH_DATA':
			return {
				userData: action.data.userData,
				promoterData: action.data.promoterData
			};
		case 'SET_USER_DATA':
			return {
				...state,
				userData: action.userData
			};
		case 'SET_PROMOTER_DATA':
			return {
				...state,
				promoterData: action.promoterData
			};
		case 'CLEAR_USER_DATA':
			return {
				userData: null,
				promoterData: null
			};
		default:
			return state;
	}
};

export default userData;
