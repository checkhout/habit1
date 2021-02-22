import { handleActions } from 'redux-actions'


//所有部门列表
export const departmentListResult = handleActions({
	'get_department_list_start'(state) {
		return { ...state, loading: true}
	},
	'get_department_list_end'(state, action) {
		//格式化treeData
		const { res, res: { company, department } } = action.payload;
		//扁平化所有部门到同一维度
		let horizontalData = [];
		//外层为公司
		const treeData = [{ title: `${company.name}`, children : [], key: 0, value: 0,}];
		const treeDataHasNum = [{ title: `${company.name}(${company.staffNum})`, children : [], key: 0, value: 0,}];
		const renderImportGroupData = (data, hasNum) => {
			return data.map(item => {
				const { name, id, childs, userCount } = item;

				//临界条件
				if (childs && childs.length) {
					horizontalData = [...horizontalData, { title: name, id }];
					return (
						{ title: hasNum ? `${name}(${userCount})` : name, children: renderImportGroupData(childs, hasNum), key: Number(id), value: Number(id), }
					)
				}
				else {
					//过滤重复的
					if (horizontalData.filter(f => f.id === id).length === 0) {
						horizontalData.push({title: name, id});
					}
					return { title: hasNum ? `${name}(${userCount})` : name, key: Number(id), value: Number(id), children: [] }
				}
			})
		};

		department.forEach(i => {
			const { name, id, childs } = i;

			horizontalData.push({title: name, id});
			treeData[0].children.push({
				title: `${name}`,
				children : childs && childs.length ? renderImportGroupData(childs,false) : [],
				key: Number(id),
				value: Number(id),
			});
			treeDataHasNum[0].children.push({
				title: `${name}(${i.userCount})`,
				children : childs && childs.length ? renderImportGroupData(childs, true) : [],
				key: Number(id),
				value: Number(id),
			});
		});

		// console.log('horizontalData ', horizontalData);
		return { data: res, treeData, treeDataHasNum, horizontalData, loading: false}
	},
}, { data: [], treeData: [], treeDataHasNum: [], horizontalData: [], loading: false});

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
		return { data: res, total: res.length,  loading: false }
	},
}, { data: [], total: 0, loading: false });

//待审批任务列表
export const auditTaskListResult = handleActions({
	'get_audit_task_list_start'(state) {
		return { ...state, loading: true }
	},
	'get_audit_task_list_end'(state, action) {
		const { res } = action.payload;
		return { data: res, total: res.length, loading: false }
	},
}, { data: [], total: 0, loading: false });

//自动填充 已有员工
export const autoCompleteResult = handleActions({
	'get_auto_complete_staff_start'(state) {
		return { ...state, loading: true }
	},
	'get_auto_complete_staff_end'(state, action) {
		const { res } = action.payload;
		//非正式员工只有inviteId
		const formalStaff = res.data.filter(item => item.id);
		return { ...res, formalStaff, loading: false }
	},
}, { data: [], formalStaff: [], total: 0, loading: false });


