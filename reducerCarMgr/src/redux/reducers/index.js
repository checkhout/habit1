import { combineReducers } from 'redux';

import * as common from './common';

const appReducer = combineReducers({
	...common,
});

//退出登录重置store
const rootReducer = (state, action) => {
	if (action.type === 'reset_store') {
		state = undefined
	}

	return appReducer(state, action)
};

export default rootReducer;