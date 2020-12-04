import {
	createQuery, Service,
} from './ajax'
// import { SERVER_IP } from "@config/index"
// import { getUrlConcat } from "@utils"

// export const export_car_apply_list_api = (query) => `${SERVER_IP}/car/api/v1/apply/export${getUrlConcat(query)}`;


//查询所有部门列表
export const get_department_list_api = createQuery('/account/api/v1/department/list','get');
//查询员工列表
export const get_employees_list_api = createQuery('/account/api/v1/account/etr/getAllStaff','get');
//查询单个部门详情
export const get_department_by_id_api = createQuery('/account/api/v1/department','get');
//根据筛选条件查询员工
export const get_employees_list_by_search_api = createQuery('/account/api/v1/account/etr/getStaffByType', "post");
//编辑部门信息
export const update_department_api = (id, param) => Service(`/account/api/v1/department/${id} `, 'put', param);
//删除部门
export const delete_department_api = (id) => Service(`/account/api/v1/department/${id}`, 'delete');

//查询普通管理员列表
export const get_admin_list_api = () => Service('/account/api/v1/account/etr/getAdmin', 'get');
//查询车辆审核员列表
export const get_carAuditor_list_api = () => Service('/account/api/v1/account/etr/getCarAuditor', 'get');
//查询运维员列表
export const get_operator_list_api = () => Service('/account/api/v1/account/etr/getOperator', 'get');
//查询驾驶员列表
export const get_driver_list_api = () => Service('/account/api/v1/account/etr/getDriver', 'get');

//查询待审批任务 驾驶人申请
export const get_audit_task_api = () => Service('/car/api/v1/apply/getAuditTask', 'get');
// 编辑用户角色信息
export const update_role_api = (id, param) => Service(`/account/api/v1/account/etr/${id}/updateRole`, 'put', param);
//审批任务
export const dispose_audit_task_api = (id, param) => Service(`/car/api/v1/apply/${id}/auditTask`, 'put', param);
//发送企业邀请
export const send_invitation_api = (param) => Service(`/account/api/v1/account/etr/sendInvitation`, 'post', param);
//重新发送企业邀请
export const send_invitation_again_api = (id, param) => Service(`/account/api/v1/account/etr/${id}/resendInvitation `, 'put', param);
//删除员工信息
export const delete_employee_api = (id, type) => Service(`/account/api/v1/account/etr/${id}/delStaff/${type}`, 'get');



