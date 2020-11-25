import { handleActions } from 'redux-actions'


export const carPlatesResult = handleActions({
	'get_car_plates_start'(state) {
		return { ...state}
	},
	'get_car_plates_end'(state, action) {
		let cars = action.payload.res;

		cars = cars.map(item => {
			return {txt: item, value: item}
		});
		cars.unshift({txt: "全部", value: -1});
		return { data: cars}
	},
}, { data: [] });


export const useCarRecordResult = handleActions({
	'get_car_apply_list_start'(state) {
		return { ...state, loading: true }
	},
	'get_car_apply_list_end'(state, action) {
		const { data, total } = action.payload.res;
		return { data, total, loading: false }
	},
}, { data: [], loading: false, total: 0 });

