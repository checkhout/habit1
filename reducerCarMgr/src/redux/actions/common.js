import {createAction} from 'redux-actions'

import { common } from '@api'
import { createAjaxAction } from '@api/ajax'

//重置Store
export const reset_store_action = createAction('reset_store');

export const login_action = createAjaxAction(
	common.login_api,
	createAction('request_login_start'),
	createAction('request_login_end')
);
export const query_user_info_action = createAjaxAction(
	common.query_user_info_api,
	createAction('request_user_info_start'),
	createAction('request_user_info_end')
);
export const query_company_info_action = createAjaxAction(
	common.query_company_info_api,
	createAction('request_company_info_start'),
	createAction('request_company_info_end')
);




/*
* 页面状态缓存思路
1. 将页面搜索状态缓存到store
2. 页面加载时读取缓存数据
3. 缓存数据或者加载新页面
4. persist到sessionStorage
* */
export const persistPageStatusByKey = key => {
	switch (key) {
		case 'useCarManagementStatus':
			return createAction("useCarManagementStatus");
		case 'addressBookStatus':
			return createAction("addressBookStatus");
		default:
			return '';
	}
};