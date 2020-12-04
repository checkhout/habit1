import { combineReducers } from 'redux';

import * as common from './common';
import * as useCarManagement from './useCarManagement';
import * as addressBook from './addressBook';

const appReducer = combineReducers({
	...common,
	...useCarManagement,
	...addressBook,
});

//退出登录重置store
const rootReducer = (state, action) => {
	if (action.type === 'reset_store') {
		state = undefined
	}

	return appReducer(state, action)
};

export default rootReducer;