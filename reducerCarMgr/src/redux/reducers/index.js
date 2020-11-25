import { combineReducers } from 'redux';

import * as common from './common';
import * as useCarManagement from './useCarManagement';

const appReducer = combineReducers({
	...common,
	...useCarManagement,
});

//退出登录重置store
const rootReducer = (state, action) => {
	if (action.type === 'reset_store') {
		state = undefined
	}

	return appReducer(state, action)
};

export default rootReducer;