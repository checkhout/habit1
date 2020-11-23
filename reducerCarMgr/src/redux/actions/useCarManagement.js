import { createAjaxAction } from "@api/ajax"
import { useCarManagement } from "@api"
import { createAction } from "redux-actions";


export const get_car_plates_action = createAjaxAction(
	useCarManagement.get_car_plates_api,
	createAction('get_car_plates_start'),
	createAction('get_car_plates_end')
);