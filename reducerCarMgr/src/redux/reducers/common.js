import { handleActions } from 'redux-actions'


export const loginResult = handleActions({
	'request_login_start'(state) {
		return { ...state}
	},
	'request_login_end'(state, action) {
		const { res } = action.payload;

		return { data: res}
	},
}, { data: {} });


export const userInfoResult = handleActions({
	'request_user_info_start'(state) {
		return { ...state}
	},
	'request_user_info_end'(state, action) {
		const { res } = action.payload;
		const userInfo = res;
		userInfo.isSuperAdmin = res.roles.filter(item => item === "ROLE_ddp2b_superadmin").length > 0;
		userInfo.isAdmin = res.roles.filter(item => item === "ROLE_ddp2b_admin").length > 0;
		userInfo.isCertificationAudit = res.roles.filter(item => item === "ROLE_ddp2b_platform_operator").length > 0;
		//loading 不停止
		return { data: userInfo}
	},
}, { data: {} });


export const companyInfoResult = handleActions({
	'request_company_info_start'(state) {
		return { ...state, loadingCompanyInfo: true }
	},
	'request_company_info_end'(state, action) {
		const { res } = action.payload;
		//loading 停止
		return { data: res, loadingCompanyInfo: false }
	},
}, { data: {}, loadingCompanyInfo: false});



/*
* 该 state 专门用来保存各个页面的搜索状态
* 根据不同的action覆盖其中的数据
* 必须拥有对应的defaultState并在组件中初始化
* */
export const persistPageStatusResult = handleActions({
		'useCarManagementStatus'(state, action) {//用车管理
			return {...state, useCarManagementStatus: {...action.payload}}
		},
		'addressBookStatus'(state, action) {//通讯录
			return {...state, addressBookStatus: {...action.payload}}
		},
	}, {
		useCarManagementStatus: {
			pageNum: 1,
			pageSize: 10,
			startTime: 0,
			endTime: 0,
			applicant: "",	//申请人账号
			type: 0,				//用车类型
			status: "",			//行程状态，1-未开始，5-进行中，6-已结束
			carPlate: "",		//车牌
			active: 1, 			//默认选中今天
		},
		addressBookStatus: {

		},
	}
);