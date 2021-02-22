import { createAjaxAction } from "@api/ajax"
import { addressBook } from "@api"
import { createAction } from "redux-actions";

export const get_department_list_action = createAjaxAction(
	addressBook.get_department_list_api,
	createAction('get_department_list_start'),
	createAction('get_department_list_end')
);

//部门员工列表
const orgEmployeesStart = createAction('get_org_employees_list_start');
const orgEmployeesEnd = createAction('get_org_employees_list_end');
export const get_employees_list_action = createAjaxAction(
	addressBook.get_employees_list_api,
	orgEmployeesStart,
	orgEmployeesEnd
);
export const get_department_by_id_action = createAjaxAction(
	addressBook.get_department_by_id_api,
	orgEmployeesStart,
	orgEmployeesEnd
);
export const get_employees_list_by_search_action = createAjaxAction(
	addressBook.get_employees_list_by_search_api,
	orgEmployeesStart,
	orgEmployeesEnd
);
//自动填充和搜索时同一个接口
export const get_auto_complete_staff_action = createAjaxAction(
	addressBook.get_employees_list_by_search_api,
	createAction('get_auto_complete_staff_start'),
	createAction('get_auto_complete_staff_end')
);

//角色列表
const roleListStart = createAction('get_role_list_start');
const roleListEnd = createAction('get_role_list_end');
export const get_admin_list_action = createAjaxAction(
	addressBook.get_admin_list_api,
	roleListStart,
	roleListEnd
);
export const get_carAuditor_list_action = createAjaxAction(
	addressBook.get_carAuditor_list_api,
	roleListStart,
	roleListEnd
);
export const get_operator_list_action = createAjaxAction(
	addressBook.get_operator_list_api,
	roleListStart,
	roleListEnd
);
export const get_driver_list_action = createAjaxAction(
	addressBook.get_driver_list_api,
	roleListStart,
	roleListEnd
);

export const get_audit_task_list_action = createAjaxAction(
	addressBook.get_audit_task_api,
	createAction('get_audit_task_list_start'),
	createAction('get_audit_task_list_end')
);

// export const get_all_employees_list_action = createAjaxAction(
// 	addressBook.get_all_employees_list_api,
// 	createAction('get_all_employees_list_start'),
// 	createAction('get_all_employees_list_end')
// );