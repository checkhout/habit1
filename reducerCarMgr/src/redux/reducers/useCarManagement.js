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

