import { handleActions } from 'redux-actions'


//看板列表
export const dashboardListResult = handleActions(
	{
		'get dashboard list start'(state) {
			return { ...state, loading: true }
		},
		'get dashboard list end'(state, action) {
			const { res } = action.payload;
			return { data: res, total: res.length, loading: false }
		},
	},
	{ data: [], total: 0, loading: false }
);

