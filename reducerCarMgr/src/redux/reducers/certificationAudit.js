import { handleActions } from 'redux-actions'

//部门员工列表
export const certificationAuditListResult = handleActions({
	'get certification audit start'(state) {
		return { ...state, loading: true }
	},
	'get certification audit end'(state, action) {
		return { ...action.payload.res, loading: false }
	},
}, { data: [], total: 0, userCount: 0, loading: false });


