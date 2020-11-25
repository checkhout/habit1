import {
	createQuery,
	// Service
} from './ajax'
import { SERVER_IP } from "@config/index"
import { getUrlConcat } from "@utils"


//获取车牌列表
export const get_car_plates_api = createQuery('/car/api/v2/car2c/getCarPlates','get');
//导出用车记录列表
export const export_car_apply_list_api = (query) => `${SERVER_IP}/car/api/v1/apply/export${getUrlConcat(query)}`;
//查询用车任务列表
export const get_car_apply_list_api = createQuery('/car/api/v1/apply/carApply/list', "post");																		//查询用车任务列表
