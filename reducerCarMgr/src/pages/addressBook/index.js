import React from 'react'
import {AutoComplete, Button, Input, Tree, message } from 'antd'
import { connect } from "react-redux"

import BaseComponent from '@/components/BaseComponent'
import ToCopy from '@/components/toCopy'
import DataTable from '@/components/DataTable'
import SearchBar from '@/components/searchBar'
import ModalInfo from '@/components/modalInfo'
import {
	get_department_list_action,
	get_employees_list_action,
	get_department_by_id_action,
	get_employees_list_by_search_action,

	get_admin_list_action,
	get_carAuditor_list_action,
	get_operator_list_action,
	get_driver_list_action,
	get_audit_task_list_action,
} from '@actions/addressBook'
import {
	createDepartmentHttp,
	deleteEmployeeHttp, updateDepartmentHttp, deleteDepartmentHttp, sendInvitationHttp,
	getAdminListHttp, getCarAuditorListHttp, getDriverListHttp, updateRoleHttp, getAuditTaskHttp, disposeAuditTaskHttp,
	searchEmployeesHttp, sendInvitationHttpAgain, getOperatorListHttp,
} from "@/api/index";
import { isEmpty, regExpConfig, formatType, formatUsername } from "@utils/index";

import { addrBookOrganization, addrBookRoleMgr} from './utils'
import { RoleSwitchSex, RoleSwitchType } from "./utils";
import OperateEmployeesModal from './operateEmployeesModal'
import OperateDepartmentModal from './operateDepartmentModal'
import Organization from './organization'
import RoleManage from './roleManage'
import {transformTime} from "../../components/moment";
import LeftTab from './leftTab'
import driverAvatarImg from '../../assets/imgs/addressBook/driverAvatar@2x.png'
import './index.less'

const { Option } = AutoComplete;
const { TreeNode } = Tree;
const {TextArea} = Input;

@connect((state) => ({
	departmentListResult: state.departmentListResult,
	allEmployeesListResult: state.allEmployeesListResult,
	departmentEmployeesListResult: state.departmentEmployeesListResult,
	companyInfoResult: state.companyInfoResult,
	userInfoResult: state.userInfoResult,
}))
class AddressBook extends BaseComponent {
	state = {
		currentDepartmentObj: {							//当前查看、编辑的部门
			department: {
				userCount: 0,
				id: 0,
				name: '',
				parentId: 0,
			}
		},
		addressBookActiveKey: 'orgTree',		//受控tab activeKey : orgTree 组织结构  roleMgr 角色管理
		roleBookActiveKey: this.props.userInfoResult.data.roles[0],//受控tab activeKey 角色管理各个角色
		currentRoleList: [],                //当前角色列表
		roleDescribeTxt: '',                //角色描述
		willAddRoleEmployeesId: "",         //即将被添加角色的员工的名字
		haveCurrentRoleFlag: false,         //即将被添加角色是否已有当前角色，如果已有，禁止提交
		driverAuditTaskTotal: 0,            //待审批驾驶人任务数量
		driverAuditTaskList: [],            //待审批驾驶人列表

		operateDepartmentVisible: false,    //操作部门 新建、编辑
		editDepartmentFlag: false,          //编辑部门标识
		dissolveDepartmentVisible: false,   //解散部门


		/*组织结构页面状态*/
		organizationStructurePageNum: 1,//组织结构分页
		organizationStructurePageSize: 10,
		leftTreeSelectedKey: [0],				//结构树默认选中选中 0：公司

		roleManagePageNum: 1,//角色管理分页
		roleManagePageSize: 10,
		currentRole: { value: 'ROLE_ddp2b_admin', txt: '管理员' },//当前角色

		driverAuditPageNum: 1,//角色管理 驾驶人申请审核
		driverAuditPageSize: 10,
	};

	tablePage = {
		commonPageSize: 10,
		commonPageNum: 1,
		driverAuditPageNum: 1,	//驾驶资格申请页码
		driverAuditPageSize: 10,
	};

	selectedCarAuditorAuditDepartment = [];	//添加车辆审核员选择审批部门


	/*
	* 缓存组织结构和角色管理的页面状态，在即将销毁的时候存入reducer
	* */
	pageStatus = {
		organizationStructurePageNum: 1,//组织结构
		organizationStructurePageSize: 10,
		driverAuditPageNum: 1,	//驾驶资格申请页码
		driverAuditPageSize: 10,
		type: 1, //0-查询该部门下的员工,1-查询部门及子部门下的员工
	};

	componentDidMount() {
		console.log('通讯录init >>>>>>>>>', this.state.addressBookActiveKey, this.state.currentRole.value);
		//获取组织结构相关数据
		if (this.state.addressBookActiveKey === 'orgTree') {
			this.getDepartmentTreeData();
			//获取当前部门员工列表
			this.getDepartmentStaffBySelectedKey();
		}
		//获取角色管理相关数据
		else {
			console.log('角色管理初始角色 >>>>>> ', this.props.userInfoResult.data.roles[0], '======state======',this.state.currentRole);
			//获取角色列表
			this.requestRoleListData(this.state.currentRole.value);
		}

	}

	//获取组织结构
	getDepartmentTreeData = () => {
		this.props.dispatch(get_department_list_action({}, (res) => {
			// console.log('获取组织结构 === ', res);
		}, () => {}));
	};
	//选择部门
	onSelectLeftOrganizationTree = (selectKey) => {//[21]
		if (
			selectKey && (+selectKey[0] || +selectKey[0] === 0)
			&& (+selectKey[0] !== +this.state.leftTreeSelectedKey[0])
		) {
			this.setState({
				leftTreeSelectedKey: selectKey,
				organizationStructurePageNum: 1,
			}, () => {
				this.getDepartmentStaffBySelectedKey()
			})
		}
	};
	//更新公司员工列表 更新部门员工列表 : 需更新完state.leftTreeSelectedKey再重置页码
	getDepartmentStaffBySelectedKey = () => {
		const { leftTreeSelectedKey } = this.state;
		const id = +leftTreeSelectedKey[0];
		const {
			type,
		} = this.pageStatus;
		const {
			organizationStructurePageNum, organizationStructurePageSize,
		} = this.state;
		let param = {
			pageNum: organizationStructurePageNum,
			pageSize: organizationStructurePageSize,
		};

		//选择的是公司
		if (id === 0) {
			this.props.dispatch(get_employees_list_action(param, (res) => {
				const { data } = this.props.companyInfoResult;
				this.setState({
					currentDepartmentObj: {
						department: {
							userCount: res.userCount,
							id,
							name: data.name,
							parentId: data.id,//公司没有parentId，用公司真实的id代替
						}
					},
				})
			}));
		}
		//选择的是部门
		else {
			param = {
				...param,
				type,
				urlData: id,
			};

			this.props.dispatch(get_department_by_id_action(param, (res) => {
				// console.log("部门员工列表 === ", res);

				this.setState({
					currentDepartmentObj: res,
				})
			}, () => {}));
		}
	};
	//组织结构换页
	onOrganizationPageChange = (page, pageSize) => {
		this.setState({
			organizationStructurePageNum: page,
			organizationStructurePageSize: pageSize,
		}, () => {
			this.getDepartmentStaffBySelectedKey();
		})
	};
	//角色管理换页
	roleManagePageChange = (page, pageSize) => {
		this.setState({
			roleManagePageNum: page,
			roleManagePageSize: pageSize,
		}, () => {

		})
	};
	//组织结构查询
	onSearchEmployees = (searchFields) => {
		const { type, inputSearch } = searchFields;

		//查询重置页码
		this.setState({
			organizationStructurePageNum: 1,
		}, () => {
			//缓存搜索状态，销毁时统一存redux
			this.pageStatus[type] = inputSearch || '';

			// 查询
			if (inputSearch) {

				let param = {};
				param[type] = inputSearch;

				this.props.dispatch(get_employees_list_by_search_action(param, (res) => {
					// console.log('搜索员工 ===== ', res);
				}, () => {}));
			}
			// 重置
			else {
				this.getDepartmentStaffBySelectedKey();
			}
		})
	};


	//确认操作部门
	handleConfirmCreateDepartment = (values) => {
		console.log( '确认操作部门', values, this.state.editDepartmentFlag);
		let param = {
			name: values.departmentName,
			parentId: +values.parentDepartment !== +this.props.companyInfoResult.data.id ? +values.parentDepartment : 0,  //如果为公司,传0
		};

		if (this.state.editDepartmentFlag) {
			updateDepartmentHttp(this.state.leftTreeSelectedKey[0], param).then(res => {
				this.getDepartmentTreeData();
				this.getDepartmentStaffBySelectedKey();

				message.success("编辑成功")
			}).catch(err => {
				if (+err.error_code === -1) {
					message.error("禁止移动到子部门")
				}
			})
		} else {
			createDepartmentHttp(param).then(() => {
				this.getDepartmentTreeData();
				message.success("创建成功")
			}).catch(() => {})
		}
	};


	renderImportGroupData = (data) => {
		return data.map(item => {
			if (item.childs && item.childs.length) {
				return (
					{ value: String(item.id), title: item.name, children: this.renderImportGroupData(item.childs), key: item.id, }
				)
			}
			return { value: String(item.id), title: item.name, key: item.id, }
		})
	};

	//解散部门
	handleDissolveDepartment = () => {
		this.setState({ dissolveDepartmentVisible: true })
	};
	//组织结构 orgTree -角色管理roleMgr  切换部门
	handleLeftTabSwitch = (key) => {
		this.setState({
			addressBookActiveKey: key
		}, () => {
			if (key === 'orgTree') {
				this.getDepartmentStaffBySelectedKey();
				this.getDepartmentTreeData();
			}
			else {
				//角色管理
				this.requestRoleListData(this.state.currentRole.value);
			}
		})
	};
	//角色管理切换角色
	handleSwitchRole = (key) => {
		this.requestRoleListData(key);
	};

	//获取角色列表
	requestRoleListData = key => {
		console.log('角色管理', key);
		const getRoleListByKey = () => {
			//请求角色列表
			switch (key) {
				case "ROLE_ddp2b_admin":
					this.props.dispatch(get_admin_list_action({type: 1}));
					break;
				case "ROLE_ddp2b_car_auditor":
					this.props.dispatch(get_carAuditor_list_action({type: 0}));
					break;
				case "ROLE_ddp2b_platform_operator"://企业审核员
					this.props.dispatch(get_operator_list_action({}));
					break;
				case "expensesApproval"://报销审批员
					break;
				case "financialAuditor"://财务审核员
					break;
				case "ROLE_ddp2b_driver":
					this.props.dispatch(get_driver_list_action({}, () => {
						this.requestAuditTask();
					}));
					break;
				default:
					break;
			}
		};
		//更新角色 先更新UI 同步请求角色列表
		if ( key !== this.state.currentRole.value) {
			this.setState({
				currentRole: addrBookRoleMgr.filter(item => item.value === key)[0],
			}, () => {
				getRoleListByKey()
			});
		}
		else {
			getRoleListByKey()
		}
	};

	//查询驾驶人申请
	requestAuditTask = () => {
		const { driverAuditPageNum, driverAuditPageSize } = this.state;
		const param = {
			pageNum: driverAuditPageNum,
			pageSize: driverAuditPageSize,
			urlData: 3, // type: 3  1-加入企业申请,2-使用车辆申请,3-驾驶资格申请
		};
		this.props.dispatch(get_audit_task_list_action(param));
	};












	//确认解散
	handleConfirmDissolve = () => {
		const _that = this;

		deleteDepartmentHttp(_that.state.leftTreeSelectedKey[0]).then(res => {
			message.success("操作成功");
			_that.setState({
				operateDepartmentVisible: false,
				dissolveDepartmentVisible: false,
				editDepartmentFlag: false,
				leftTreeSelectedKey: [0],//初始化为公司
			}, () => {
				_that.getDepartmentTreeData();
				_that.getDepartmentStaffBySelectedKey();
			})
		}).catch(err => {})

	};







	//生成树
	renderTreeNodes = (data) => {

		return data.map(item => {
			if (item.childs && item.childs.length) {
				return (
					<TreeNode title={`${item.name} ${item.id > 1 ? `(${item.userCount})` : ""}`} key={item.id} dataRef={item}>
						{this.renderTreeNodes(item.childs)}
					</TreeNode>
				);
			}
			return <TreeNode  title={`${item.name} ${item.id > 1 ? `(${item.userCount})` : ""}`} key={item.id} dataRef={item}/>;
		});

	};



	//新建、编辑部门
	requestOperateDepartment = (flag) => () => {
		//编辑部门，
		if (flag) {
			this.setState({
				operateDepartmentVisible: true,
				editDepartmentFlag: true,
			})
		}
		//新建部门
		else {
			this.setState({
				operateDepartmentVisible: true,
				editDepartmentFlag: false,
			})
		}
	};

	onRef = (LeftTab) => {
		this.leftTab = LeftTab
	};

	operateDepartmentRef = (department) => {
		this.department = department
	};

	handleCancelModal = (visible) => () => {
		this.selectedCarAuditorAuditDepartment = [];
		this.setState({
			[visible]: false,
			currentEmployees: {},
			willAddRoleEmployeesId: "",
			warningMsg: "",
		})
	};
	render() {
		const {
			addressBookActiveKey,

			currentDepartmentObj,
			leftTreeSelectedKey,
			organizationStructurePageNum,
			organizationStructurePageSize,
			operateDepartmentVisible,    //操作部门 新建、编辑
			editDepartmentFlag,          //编辑部门标识
			dissolveDepartmentVisible,	 //解散部门

			currentRole,
		} = this.state;

		const {
			companyInfoResult,
		} = this.props;

		return (<div className="flex-row address-book">

			{/*左边内容*/}
			<LeftTab
				onRef={this.onRef}
				requestOperateDepartment={this.requestOperateDepartment}
				handleLeftTabSwitch={this.handleLeftTabSwitch}
				handleSwitchRole={this.handleSwitchRole}
				handleSwitchDepartment={this.getDepartmentStaffBySelectedKey}
				companyId={companyInfoResult.data.id}
				selectedKeys={leftTreeSelectedKey}
				addressBookActiveKey={addressBookActiveKey}
				currentRole={currentRole}
				onSelect={this.onSelectLeftOrganizationTree}
			/>

			{/*右边内容*/}
			{
				addressBookActiveKey === 'orgTree'
					/*组织结构*/
					? <Organization
						pageNum={organizationStructurePageNum}
						pageSize={organizationStructurePageSize}
						onOrganizationPageChange={this.onOrganizationPageChange} //pageSize change
						currentDepartmentObj={currentDepartmentObj}
						editDepartmentFlag={editDepartmentFlag}
						requestOperateDepartment={this.requestOperateDepartment}
						onSearchEmployees={this.onSearchEmployees}
						getDepartmentStaffBySelectedKey={this.getDepartmentStaffBySelectedKey} //刷新员工列表
						getDepartmentTreeData={this.getDepartmentTreeData} //刷新组织结构
					/>
					/*角色管理*/
					: <RoleManage
						pageNum={organizationStructurePageNum}
						pageSize={organizationStructurePageSize}
						roleManagePageChange={this.roleManagePageChange} //pageSize change
						currentRole={currentRole}
						handleSwitchRole={this.handleSwitchRole}
					/>
			}

			{/*部门设置' : '新建部门*/}
			<OperateDepartmentModal
				onRef={this.operateDepartmentRef}
				visible={operateDepartmentVisible}
				handleCancelModal={this.handleCancelModal('operateDepartmentVisible')}
				handleConfirm={this.handleConfirmCreateDepartment}
				currentDepartment={currentDepartmentObj}
				editDepartmentFlag={editDepartmentFlag}
				handleDissolveDepartment={this.handleDissolveDepartment}
				companyId={companyInfoResult.data.id}
			/>

			{/*确定解散*/}
			<ModalInfo width={400} className="delete-modal"
								 title="确定解散？"
								 showTxt="dissolveDepartmentVisible"
								 visible={dissolveDepartmentVisible}
								 content="确定解散该部门吗？解散部门后，部门成员将默认分配到上级部门"
								 okText="确定解散"
								 cancel={this.handleCancelModal}
								 confirm={this.handleConfirmDissolve}
								 zIndex={1001} // modal 不设置层级默认为1000
			/>



		</div>)
	}
}
export default AddressBook
//我们必须习惯,站在人生的交叉路口,却没有红绿灯的事实。—— 海明威
