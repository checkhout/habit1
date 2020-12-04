import { handleActions } from 'redux-actions'


//所有部门列表
export const departmentListResult = handleActions({
	'get_department_list_start'(state) {
		return { ...state, loading: true}
	},
	'get_department_list_end'(state, action) {
		//格式化treeData
		const { res, res: { company, department } } = action.payload;
		console.log(company, department);
		//外层为公司
		const treeData = [{ title: `${company.name}(${company.staffNum})`, children : [], key: 0, value: 0,}];
		const renderImportGroupData = (data) => {
			return data.map(item => {
				const { name, id, childs, userCount } = item;

				//临界条件
				if (childs && childs.length) {
					return (
						{ title: `${name}(${userCount})`, children: renderImportGroupData(childs), key: Number(id), value: Number(id), }
					)
				}
				return { title: `${name}(${userCount})`, key: Number(id), value: Number(id), children: [] }
			})
		};

		department.forEach(i => {
			const { name, id, childs } = i;
			treeData[0].children.push({
				title: `${name}(${i.userCount})`,
				children : childs && childs.length ? renderImportGroupData(childs) : [],
				key: Number(id),
				value: Number(id),
			})
		});

		return { data: res, treeData, loading: false}
	},
}, { data: [], treeData: [], loading: false});

//部门员工列表
export const orgEmployeesListResult = handleActions({
	'get_org_employees_list_start'(state) {
		return { ...state, loading: true }
	},
	'get_org_employees_list_end'(state, action) {
		return { ...action.payload.res, loading: false }
	},
}, { data: [], total: 0, userCount: 0, loading: false });

//角色列表
export const roleListResult = handleActions({
	'get_role_list_start'(state) {
		return { ...state, loading: true }
	},
	'get_role_list_end'(state, action) {
		const { res } = action.payload;
		return { ...res, total: res.data.length,  loading: false }
	},
}, { data: [], total: 0, loading: false });

//待审批任务列表
export const auditTaskListResult = handleActions({
	'get_audit_task_list_start'(state) {
		return { ...state, loading: true }
	},
	'get_audit_task_list_end'(state, action) {
		return { ...action.payload.res, loading: false }
	},
}, { data: [], total: 0, loading: false });

//自动填充已有员工
export const autoCompleteResult = handleActions({
	'get_auto_complete_staff_start'(state) {
		return { ...state, loading: true }
	},
	'get_auto_complete_staff_end'(state, action) {
		return { ...action.payload.res, loading: false }
	},
}, { data: [], total: 0, loading: false });


