import {
	createQuery, Service,
	// Service
} from './ajax'
import { SERVER_IP } from "@config/index"
import { getUrlConcat } from "@utils"


//获取车牌列表
export const get_car_plates_api = createQuery('/car/api/v2/car2c/getCarPlates','get');
//导出用车记录列表
export const export_car_apply_list_api = (query) => `${SERVER_IP}/car/api/v1/apply/export${getUrlConcat(query)}`;
export const getCarApplyListHttp = (param) => Service('/car/api/v1/apply/carApply/list', "post", param);																		//查询用车任务列表
