import qs from 'qs'
import { Service } from "./ajax"

import {
	getUrlConcat
} from '@/utils'
import { SERVER_IP } from '@config'

import * as common from './common'
import * as useCarManagement from './useCarManagement'
import * as addressBook from './addressBook'

export {
	common,
	addressBook,
	useCarManagement,
}

/**
 * common
 *
 */
export const captchaHttp = `${SERVER_IP}/captcha`; //登录时的验证码
export const loginHttp = (param) => Service('/login', 'post', qs.stringify(param), {'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest'});
export const getUserInfoHttp = () => Service('/account/api/v1/account/etr/queryUserInfo', "get");//查询用户信息
export const getCompanyByUserHttp = () => Service('/account/api/v1/account/etr/getCompanyByUser', "get");//查询员工所在企业信息


/**
 * 通讯录
 *
 */
export const getAllDepartmentHttp = () => Service('/account/api/v1/department/list', "get");																								//查询所有部门列表
export const createDepartmentHttp = (param) => Service('/account/api/v1/department/add', "post", param);																		//新建部门
export const getDepartmentDetailHttp = (id, query) => Service(`/account/api/v1/department/${id}${getUrlConcat(query)}`, 'get');							//查询单个部门详情
export const getEmployeesListHttp = (query) => Service(`/account/api/v1/account/etr/getAllStaff${getUrlConcat(query)}`, 'get');							//查询员工列表
export const updateEmployeesHttp = (id, type, param) => Service(`/account/api/v1/account/etr/${id}/editStaffInfo/${type}`, 'put', param);	  //编辑个人信息
export const updateDepartmentHttp = (id, param) => Service(`/account/api/v1/department/${id} `, 'put', param); 															//编辑部门信息
export const deleteDepartmentHttp = (id) => Service(`/account/api/v1/department/${id}`, 'delete'); 																					//删除部门
export const getAdminListHttp = (query) => Service(`/account/api/v1/account/etr/getAdmin${getUrlConcat(query)}`, 'get'); 										//查询普通管理员列表
export const getDriverListHttp = () => Service(`/account/api/v1/account/etr/getDriver`, 'get'); 																						//查询驾驶员列表
export const getCarAuditorListHttp = (query) => Service(`/account/api/v1/account/etr/getCarAuditor${getUrlConcat(query)}`, 'get'); 					//查询车辆审核员列表 0-查询企业所有用车审核员，1-查询本部门用车审核员
export const getOperatorListHttp = () => Service(`/account/api/v1/account/etr/getOperator`, 'get'); 					//
export const getAuditTaskHttp = (type, query) => Service(`/car/api/v1/apply/getAuditTask/${type}${getUrlConcat(query)}`, 'get'); 						//查询待审批任务
export const searchEmployeesHttp = (param) => Service(`/account/api/v1/account/etr/getStaffByType`, 'post', param); 												//根据筛选条件查询员工


/**
 * 用车管理
 */
export const getCurrentCarTaskDetailHttp = (id) => Service(`/car/api/v1/apply/${id}/getCarTask`, "get");																		//查询车辆当前任务详情
export const getCarApplyListHttp = (param) => Service('/car/api/v1/apply/carApply/list', "post", param);																		//查询用车任务列表
// export const getCarPlatesHttp = () => Service(`/car/api/v2/car2c/getCarPlates`, "get");																											//查询车牌号列表
// export const exportCarApplyListHttp = (query) => `${SERVER_IP}/car/api/v1/apply/export${getUrlConcat(query)}`;															//导出用车记录列表


/**
 * 认证审核
 */
export const certificationAuditListHttp = (param) => Service('/account/api/v1/company/auth/list', "post", param);														//查询企业认证列表
export const auditApplyHttp = (param) => Service('/account/api/v1/company/auditCompany', "post", param);																		//审核认证


