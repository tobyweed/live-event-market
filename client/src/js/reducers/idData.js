const initialState = {
	userData: null,
	promoterData: null
};

const idData = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_USER_DATA':
			return {
				...state,
				userData: action.userData
			};
		case 'UPDATE_USER':
			return {
				...state,
				userData: {
					...state.userData,
					[action.key]: action.value
				}
			};
		case 'SET_PROMOTER_DATA':
			return {
				...state,
				promoterData: action.promoterData
			};
		case 'ADD_USER':
			return {
				...state,
				promoterData: {
					...state.promoterData,
					users: [...state.promoterData.users, { username: action.user }]
				}
			};
		case 'REFRESH_DATA':
			return {
				promoterData: action.data.promoterData,
				userData: action.data.userData
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

export default idData;
