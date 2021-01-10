import { combineReducers } from 'redux';

import * as common from './common';
// import * as dashboard from './dashboard';

const appReducer = combineReducers({
	...common,
	// ...dashboard,
});

//退出登录重置store
const rootReducer = (state, action) => {
	if (action.type === 'reset_store') {
		state = undefined
	}

	return appReducer(state, action)
};

export default rootReducer;
