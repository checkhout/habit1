import React from 'react'
import { connect } from "react-redux"
import {AutoComplete, Select, Button, Input, message, Tree} from "antd"

import BaseComponent from '@components/BaseComponent'
import DataTable from '@components/DataTable'
import ModalInfo from '@components/modalInfo'
import ModalImg from '@components/ModalImg'
import {
    IsEmpty,
    regExpConfig,
    formatType,
    FormatUsername
} from "@utils/index";
import {
    update_role_api,
    dispose_audit_task_api,
} from '@api/addressBook'
import {
    get_auto_complete_staff_action,
} from '@actions/addressBook'

import {
    RoleSwitchSex,
    RoleSwitchType,
    addrBookOrganization,
    addrBookRoleMgr,
} from "./utils";
import { transformTime } from "../../components/moment"
import driverAvatarImg from "../../assets/imgs/addressBook/driverAvatar@2x.png";

// const { Option } = AutoComplete;
const { TreeNode } = Tree;
const { TextArea } = Input;
const { Option } = Select;


@connect((state) => ({
    userInfoResult: state.userInfoResult,
    companyInfoResult: state.companyInfoResult,
    auditTaskListResult: state.auditTaskListResult,
    roleListResult: state.roleListResult,
    autoCompleteResult: state.autoCompleteResult,
    departmentListResult: state.departmentListResult,

}))

class RoleManage extends BaseComponent {
    static defaultProps = {
        currentRole: addrBookRoleMgr[0], //初始角色管理展示-管理员 从AddressBook中获取
    };

    state = {
        operateRoleVisible: false,          //添加管理员弹窗
        addRoleVisible: false,              //添加角色弹窗
        driverAuditVisible: false,          //驾驶资格认证申请审批

        addCarAuditorVisible: false,        //添加用车/报销审批员 弹窗
        operateCarAuditor: false,           //编辑用车审批员弹窗.

        willAddRoleEmployeesId: 0,          //将被添加权限的员工id
        currentEmployees: {},                //将被添加权限的员工
        warningMsg: "",         						//禁止提交时提示文案
        noPassVisible: false,               //拒绝理由弹窗
        removeAuthVisible: false,           //解除角色权限

        viewDriverLicensesVisible: "",      //查看驾照弹窗

    };
    pageStatus = {
        driverAuditPageNum: 1,//驾驶人申请审核的页码不缓存
        driverAuditPageSize: 10,
    };
    selectedCarAuditorAuditDepartment = [];

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    handleCancelModal = (visible) => () => {
        this.setState({
            [visible]: false,
            currentEmployees: {},
            warningMsg: "",
            willAddRoleEmployeesId: undefined
        })
    };
    //角色管理列表
    roleMgrColumns = () => {
        const { currentRole, departmentListResult } = this.props;
        let columns = [
            {
                title: '员工姓名',
                name: 'nickname',
                width: "9%",
                tableItem: {
                    render: (text) => {
                        return IsEmpty(text)
                    }
                },
            },
            {
                title: '性别',
                name: 'sex',
                width: "5%",
                tableItem: {
                    render: (text) => RoleSwitchSex(IsEmpty(text))
                }
            },
            {
                title: '手机号',
                name: 'username',
                width: "13%",
                tableItem: {
                    render: (text) => {
                        return IsEmpty(FormatUsername(text));
                    }
                }
            },
            {
                title: '所属部门',
                name: 'department',
                tableItem: {
                    render: (text, record) => {
                        if (record.name) {
                            return record.name
                        } else if (record.department && record.department.name) {
                            return record.department.name
                        } else {
                            return record.companyName
                        }
                    }
                }
            },
            {
                title: '备注',
                name: 'remark',
                tableItem: {
                    render: (text, record) => {
                        let des = "";
                        const {value} = currentRole;

                        if (value === "ROLE_ddp2b_admin") {
                            if (record.roles.indexOf("ROLE_ddp2b_superadmin") !== -1) {
                                des = '全局管理；解散企业；管理员管理';
                            } else {
                                des = '全局管理';
                            }
                        } else if (value === "ROLE_ddp2b_driver") {
                            des = '允许驾驶公司车辆';
                        }

                        return  IsEmpty(des)
                    }
                }
            },
            {
                title: '操作',
                width: "12%",
                tableItem: {
                    render: (text, record) => {
                        const isSuperAdmin = record.roles && record.roles.filter(item => item === "ROLE_ddp2b_superadmin").length;

                        return <div className="operate">
                            {
                                currentRole.value === "ROLE_ddp2b_driver" ?
                                   <Button ghost={true} title={'编辑'} className="margin_r12 theme-font-blue379EEC normal_btn"
                                          onClick={this.handleOperateEmployees(record, 'viewDriverLicensesVisible')}>
                                      查看驾照
                                  </Button> : null
                            }
                            {
                                /*用车审批员可编辑*/
                                currentRole.value === "ROLE_ddp2b_car_auditor" ?
                                   <Button ghost={true} title={'编辑'} className="margin_r12 theme-font-blue379EEC normal_btn"
                                          onClick={this.handleOperateCarAuditor(record, 'operateCarAuditor')}>
                                      编辑
                                  </Button> : null
                            }
                            {
                                currentRole.value === "ROLE_ddp2b_admin" ?
                                  //管理员权限时不可解除超级管理员 || 管理员也不能编辑管理员
                                  ((isSuperAdmin || !this.props.userInfoResult.data.isSuperAdmin) ?  <div style={{width: '0px', height: '32px'}}/> :  <Button ghost={true}
                                    title={'删除'} className="theme-font-redE80000 normal_btn"
                                    onClick={this.handleOperateEmployees(record, 'removeAuthVisible')}>
                                      解除
                                  </Button>) :
                                   <Button ghost={true}
                                    title={'删除'} className="theme-font-redE80000 normal_btn"
                                    onClick={this.handleOperateEmployees(record, 'removeAuthVisible')}>
                                      解除
                                  </Button>

                            }
                        </div>

                    }
                }
            },
        ];
        const accountColumn = {
            title: '审批部门',
            name: 'role',
            tableItem: {
                render: (text, record) => {
                    //共用同一个reducer会存在切换了角色，但是角色列表数据未更新的问题 carAuditDepartments undefined
                    const carAuditDepartments = record.carAuditDepartments || [];
                    const AllDeparts = departmentListResult.horizontalData;
                    let str = "";

                    if (carAuditDepartments.length && AllDeparts.length) {
                        let auditDeparts = [];

                        carAuditDepartments.forEach(item => {
                            const departItem = AllDeparts.filter(i => +i.id === +item);
                            if (departItem[0]) auditDeparts.push(departItem[0]);
                        });

                        auditDeparts.forEach((item, index) => {
                            if (index > 0) {
                                str += `、${item.title}`
                            } else {
                                str = item.title
                            }
                        });
                        return <span className="audit-department" title={str}>{str}</span>
                    } else {
                        return "-"
                    }
                }
            }
        };
        const driverCardValidity = {
            title: '驾照有效期',
            name: 'role',
            width: "34%",
            tableItem: {
                render: (text, record) => {
                    const { driverLicenses } = record;

                    /*
										* 如果开始时间有，结束时间为0就是长期
										* 如果两个都是0，就是没填
										* */
                    if (driverLicenses && +driverLicenses.startTime) {
                        const { startTime, endTime } = driverLicenses;
                        let startStr = transformTime(+startTime, formatType.pointCutYMD);
                        let endStr = "";

                        if (endTime > 0) {
                            endStr = transformTime(+endTime, formatType.pointCutYMD);
                        }
                        else {
                            endStr = "长期";
                        }
                        return `${startStr}-${endStr}`;

                    } else {
                        return "-"
                    }

                }
            }
        };

        if (currentRole.value === "ROLE_ddp2b_car_auditor") {
            columns.splice(4, 1, accountColumn);
        }

        if (currentRole.value === "ROLE_ddp2b_driver") {
            columns.splice(5, 0, driverCardValidity);
        }

        return columns
    };

    //驾驶申请审批列表
    driverAuditColumns() {
        return [
            {
                title: '员工姓名',
                name: 'nickname',
                tableItem: {

                    render: (text, record) => {
                        return IsEmpty(record.applicant.nickname)
                    }
                },
            },
            {
                title: '性别',
                name: 'sex',
                tableItem: {
                    render: (text, record) => {
                        return RoleSwitchSex(IsEmpty(record.applicant.sex))
                    }
                }
            },
            {
                title: '手机号',
                name: 'username',
                tableItem: {
                    render: (text, record) => {
                        return IsEmpty(FormatUsername(record.applicant.username))
                    }
                }
            },
            {
                title: '所属部门',
                name: 'department',
                width: "16%",
                tableItem: {
                    render: (text, record) => {
                        if (record.department && record.department.name) {
                            return record.department.name
                        } else {
                            return this.state.currentDepartmentObj.department.name
                        }
                    }
                }
            },
            {
                title: '驾照',
                name: 'driverLicences',
                tableItem: {
                    render: (text, record) => <div  className="operate">
                         <Button ghost={true} title={'编辑'} className="theme-font-blue379EEC primary-ghost-btn" onClick={this.handleOperateEmployees(record, 'viewDriverLicensesVisible')}>查看驾照</Button>
                    </div>
                }
            },
            {
                title: '操作',
                width: 120,
                tableItem: {
                    // fixed: 'right',
                    render: (text, record) => {
                        return <div className="custom-column">
                             <Button title={'通过'} className="custom-primary-btn" onClick={this.handleDisposeDriverAudit(record, 0)} type="primary">通过</Button>
                             <Button title={'拒绝'} className="custom-primary-gray-btn" style={{color: "#555763"}} onClick={this.handleDisposeDriverAudit(record, 1)}>拒绝</Button>
                        </div>
                    }
                }
            },
        ]
    }
    renderRoleDescribeTxt = () => {
        switch (this.props.currentRole.value) {
            case 'ROLE_ddp2b_admin':
                return "*公司创建者默认成为超级管理员，具备所有管理权限。普通管理员可设置多个，但不具备【解散企业】和【管理管理员】的权限。";
            case 'ROLE_ddp2b_car_auditor':
                return "*用车审批员可在APP端审批指定的部门成员提交的用车申请，未设置审批员时，申请将直接通过。";
            case 'ROLE_ddp2b_platform_operator':
                return "*企业审核员角色可登录web后台，能看到“认证审核”功能模块";
            case 'ROLE_ddp2b_driver':
                return "*只有上传驾照的员工才允许添加为驾驶人，驾驶人角色不可登录web后台。";
            case '报销审批员':
                return "*报销审批员可在APP端审批指定的部门成员提交的报销申请，未设置审批员时，申请将直接通过。";
            case '财务审核员':
                return "*财务审核员角色可登录web后台，只能看到“报销管理”功能模块。";
            default:
                break;
        }
    };
    //添加-管理员
    handleEmployeeAddRole = () => {
        this.setState({
            addRoleVisible: true,
        })
    };
    /*
      添加管理员、
      拒绝驾驶人申请、
      (添加、编辑)用车审核员、
      ————弹窗的确认和取消按钮
	  */
    renderOperateRoleFooter = (visible) => {
        let { willAddRoleEmployeesId, haveCurrentRoleFlag, currentEmployees } = this.state;
        let btnText = "确认";
        const _that = this;

        switch (visible) {
          //	添加管理员
            case "addRoleVisible":
                btnText = "确定添加";
                break;
          //	拒绝驾驶人申请
            case "noPassVisible":
                btnText = "确定拒绝";
                break;
          //	编辑用车审核员
            case "operateCarAuditor":
                btnText = "保存";
                break;
          //	添加用车审核员
            case "addCarAuditorVisible":
                btnText = "确定添加";
                break;
            default:
                break;
        }

        let renderSubmit = () => {
            if (visible === "noPassVisible") {
                _that.requestDisposeDriverAudit("", 1);
            } else {
                _that.handleSubmitAddRole(visible);
            }
        };

        return <div className="footer">
            <Button onClick={this.handleCancelModal(visible)}>取消</Button>
            <Button
              className="ant-btn-primary"
              onClick={renderSubmit}
              disabled={!(willAddRoleEmployeesId || currentEmployees.id) || haveCurrentRoleFlag}
            >
                {btnText}
            </Button>
        </div>
    };
    //选择部门-复选框勾选
    onCheckDepartmentTreeNode = (selectedKeys, e) => {
        let filterCompany = selectedKeys.filter(item => +item === 1);

        if (filterCompany.length === 0) {
            this.selectedCarAuditorAuditDepartment = selectedKeys;
        }
        //全选
        else {
            this.selectedCarAuditorAuditDepartment = [0];
        }
    };
    //自动填充员工
    renderAutoCompleteChildren = (dataSource=[]) => {
        return dataSource.map(item => <Option key={item.id} value={item.id} label={item.nickname}>
            <div className="autoComplete-card-head">
                <img src={item.avatar || driverAvatarImg} alt="头像"/>
                <div className="driver-detail">
                    <div className="driver-nickname">{item.nickname}{`（${item.department ? item.department.name : item.companyName}）`}</div>
                    <p className="driver-username">{(() => {
                        let username = item.username;
                        return IsEmpty(FormatUsername(username))
                    })()}</p>
                </div>
            </div>
        </Option>)
    };
    //添加用车审核员
    handleEmployeeAddCarAuditor = () => {
        this.setState({
            addCarAuditorVisible: true,
        })
    };
    handleOperateCarAuditor = (record) => () => {
        record.carAuditDepartments = record.carAuditDepartments.map(item => {
            return +item
        });

        this.selectedCarAuditorAuditDepartment = record.carAuditDepartments || [];
        this.setState({
            operateCarAuditor: true,
            currentEmployees: {...record},
        })
    };
    //添加权限
    handleSubmitAddRole = (currentVisible) => {
        // willAddRoleEmployeesId 是自动填入的员工对应的员工id
        const { willAddRoleEmployeesId, currentEmployees } = this.state;
        const { currentRole } = this.props;
        //员工ID
        const roleId = willAddRoleEmployeesId || currentEmployees.id;
        //更新角色权限
        if (roleId) {
            let param = {
                type: 1,//1-添加角色,2-移除角色
                role: currentRole.value,
            };

            // 用车审批员
            if (currentRole.value === "ROLE_ddp2b_car_auditor") {
                param.departmentIds = this.selectedCarAuditorAuditDepartment;
            }

            this.requestUpdateRole(roleId, param, currentVisible);
        } else {
            message.warning("员工不存在")
        }

    };
    //更新角色权限
    requestUpdateRole = (id, param, currentVisible) => {
        const {currentRole, handleSwitchRole} = this.props;

        update_role_api(id, param).then(res => {
            message.success("操作成功");
            this.handleCancelModal(currentVisible)();
            handleSwitchRole(currentRole.value);
        }).catch(err => {
            switch (+err.error_code) {
                case 2:
                    message.warning("员工不存在");
                    break;
                case 589826:
                    message.warning("权限不足");
                    break;
                case 629142:
                    message.warning("参数错误");
                    break;
                default:
                    break;
            }
        })
    };
    //解除权限
    handleConfirmRemoveEmployeesAuth = () => {
        const { currentEmployees} = this.state;
        const { currentRole, handleSwitchRole } = this.props;

        let param = {
            type: 2,                //1-添加角色,2-移除角色
            role: currentRole.value,
        };
        update_role_api(currentEmployees.id, param).then(res => {
            this.handleCancelModal("addRoleVisible")();
            handleSwitchRole(currentRole.value);
            message.success("解除成功");

        }).catch(err => {
            switch (+err.error_code) {
                case 2:
                    message.warning("员工不存在");
                    break;
                case 589826:
                    message.warning("权限不足");
                    break;
                case 629142:
                    message.warning("参数错误");
                    break;
                default:
                    break;
            }
        })
    };
    // 同意/拒绝 驶人申请
    requestDisposeDriverAudit = (id, result) => {
        let param = {
            type: result, //0-同意申请，1-拒绝申请
        };
        if (!id) {
            id = this.state.currentEmployees.id;
            param.des = this.noPassTextarea.state.value;
        }

        dispose_audit_task_api(id, param).then(res => {
            //刷新申请、驾驶人列表
            this.props.requestAuditTask();
            this.props.handleSwitchRole("ROLE_ddp2b_driver");
            this.setState({
                noPassVisible: false,
            });
            message.success("操作成功");
        }).catch(err => {

        })

    };
    /**
     * 处理驾驶人申请
     * @param record	申请数据
     * @param result	0-同意申请，1-拒绝申请
     */
    handleDisposeDriverAudit = (record, result) => () => {

        if (+result === 0) {
            this.requestDisposeDriverAudit(record.id, result);
        }
        //拒绝-弹窗提醒后再确认
        else {
            this.setState({
                currentEmployees: {...record},
                noPassVisible: true,
            })
        }

    };

    //角色管理 - 右上角按钮
    handleRoleListUpdate = () => {
        const role = this.props.currentRole;
        switch (role.value) {
            case "ROLE_ddp2b_admin":
                // console.log("ROLE_ddp2b_admin");
                this.handleEmployeeAddRole();
                break;
            case "ROLE_ddp2b_car_auditor":
                // console.log("ROLE_ddp2b_car_auditor");
                this.handleEmployeeAddCarAuditor();
                break;
            case "expensesApproval":
                // console.log("expensesApproval");
                break;
            case "financialAuditor":
                // console.log("financialAuditor");
                break;
            case "ROLE_ddp2b_driver":
                // console.log("ROLE_ddp2b_driver");
                // 申请审批
                this.handleOperateEmployees({}, "driverAuditVisible")();
                break;
            case "ROLE_ddp2b_platform_operator":
                this.handleEmployeeAddRole();
                break;
            default:
                break;
        }
    };
    //邀请/编辑员工、查看驾照
    handleOperateEmployees = (employees, visible) => () => {
        if (!visible) visible = "operateEmployeesVisible";
        if (visible === "driverAuditVisible") this.props.requestAuditTask();
        this.setState({
            [visible]: true,
            currentEmployees: employees.id || employees.inviteId ? employees : {},
        })
    };
    //搜索补全数据
    handleSearchEmployee = value  => {
        const _that = this;
        if (value) {
            let validationEmployee = param => {
                this.props.dispatch(get_auto_complete_staff_action(param, (res) => {
                    const allEmployeesList = res.data;

                    if (allEmployeesList.length <= 0) {
                        _that.setState({
                            willAddRoleEmployeesId: undefined,
                            warningMsg: "* 员工不存在",
                            haveCurrentRoleFlag: true,
                        })
                    } else {
                        _that.setState({
                            warningMsg: "",
                            haveCurrentRoleFlag: false,
                        })
                    }
                }));
            };

            validationEmployee({nickname: value});

        }

    };
    //选择自动填充-受控管理		value结构为 员工id=员工名字的字符串
    employeeNameOnChange = (value) => {
        const _that = this;
        //清空 value： undefined
        if (!value) {
            // 点击清空图标清空
            _that.setState({
                willAddRoleEmployeesId: value,
                warningMsg: "",
                haveCurrentRoleFlag: true,
            });
        }
        else if (value.value) {
            const roleId = value.key;
            const { autoCompleteResult, currentRole } = this.props;
            const selectEmployees = autoCompleteResult.formalStaff.filter(item => +item.id === +roleId);

            // 已有该权限不可重复添加
            if (selectEmployees.length && selectEmployees[0].roles && selectEmployees[0].roles.indexOf(currentRole.value) >= 0) {
                _that.setState({
                    haveCurrentRoleFlag: true,
                    warningMsg: "* 员工已有该权限",
                    willAddRoleEmployeesId: undefined,
                })
            }
            else {
                //允许添加角色没有的权限
                _that.setState({
                    haveCurrentRoleFlag: false,
                    warningMsg: "",
                    willAddRoleEmployeesId: roleId,
                });
            }
        }
    };

    clearAutoCompleteData = () => {
        this.setState({
            haveCurrentRoleFlag: false,
            warningMsg: "",
            willAddRoleEmployeesId: undefined,
        })
    };

    render() {
        const {
        } = this.pageStatus;

        const {
            roleListResult,
            auditTaskListResult,
            autoCompleteResult,
            departmentListResult: { treeData },
            pageNum,
            pageSize,
            roleManagePageChange,
            handleChangeDriverAuditTablePage,
            currentRole,
            userInfoResult,

            driverAuditPageNum,
            driverAuditPageSize,
        } = this.props;

        const {
            driverAuditVisible,
            warningMsg,
            addCarAuditorVisible,
            operateCarAuditor,
            currentEmployees,
            noPassVisible,
            removeAuthVisible,
            viewDriverLicensesVisible,
            addRoleVisible,

        } = this.state;


        const roleMgrDataTable = {
            loading: {
                spinning: roleListResult.loading,
                delay: 500
            },
            columns: this.roleMgrColumns(),
            rowKey: 'id',
            dataItems: {
                list: roleListResult.data,
                total: roleListResult.total,
                pageNum,
                pageSize
            },
            onChange: ({ pageNum, pageSize, }) => { pageNum && roleManagePageChange(pageNum, pageSize) }
        };

        //驾驶申请审批
        const driverAuditDataTable = {
            className: "custom-table-model",
            loading: {
                spinning: auditTaskListResult.loading,
                delay: 500
            },
            columns: this.driverAuditColumns(),
            rowKey: 'id',
            dataItems: {
                list: auditTaskListResult.data,
                total: auditTaskListResult.total,
                pageNum: driverAuditPageNum,
                pageSize: driverAuditPageSize
            },
            scroll: { y: 'auto' },
            onChange: ({ pageNum, pageSize, }) => { pageNum && handleChangeDriverAuditTablePage(pageNum, pageSize) },
        };

        return (
          <React.Fragment>
              <div className="data-table-wrapper">
                  <div className="custom-table-header">
                      <span className="detail-employees-bold">
                          {currentRole.txt} <span>（{roleListResult.total}）</span>
                      </span>
                      <Button
                        disabled={currentRole.value === "ROLE_ddp2b_admin" && !userInfoResult.data.isSuperAdmin}
                        onClick={this.handleRoleListUpdate}
                        className="invite-btn"
                        type="primary">
                          {currentRole.value === "ROLE_ddp2b_driver" ? `申请审批（${ auditTaskListResult.total }）` :"添加"}
                      </Button>
                  </div>
                  <div className="parting-line"/>
                  <p className="role-describe">
                      <span>{this.renderRoleDescribeTxt()}</span>
                      <span className="theme-font-redE80000">{currentRole.txt === "用车审批员" ? "改变员工所属部门，需重新进行用车审核员分配。" : ""}</span>
                  </p>

                  <DataTable { ...roleMgrDataTable }/>
              </div>

              {/*驾驶资格认证申请审批*/}
              <ModalInfo  title="驾驶资格认证申请审批" showTxt="driverAuditVisible"
                          className="table-modal"
                          visible={driverAuditVisible}
                          footer={null}
                          cancel={this.handleCancelModal('driverAuditVisible')}
                          width={800}
              >
                  <DataTable { ...driverAuditDataTable }/>
              </ModalInfo>
              {/*添加管理员*/}
              <ModalInfo  title={currentRole.value === 'ROLE_ddp2b_platform_operator' ? '企业审核员' : '添加管理员'} showTxt="addRoleVisible"
                          visible={addRoleVisible}
                          footer={this.renderOperateRoleFooter("addRoleVisible")}
                          cancel={this.handleCancelModal('addRoleVisible')}
                          width={400}
                          closable={false}
              >
                  {
                      addRoleVisible ? <Select
                        showSearch
                        showArrow={false}
                        allowClear={true}
                        labelInValue={true}
                        optionLabelProp="label"
                        optionFilterProp="label"
                        placeholder="请输入员工姓名"
                        style={{ width: 320, height: 32, borderRadius: "3px" }}
                        onSearch={this.handleSearchEmployee}
                        onChange={this.employeeNameOnChange}
                        onClear={this.clearAutoCompleteData}

                      >
                          {
                              this.renderAutoCompleteChildren(autoCompleteResult.formalStaff)
                          }
                      </Select> : null
                  }
                  <p className="theme-font-redE80000">{warningMsg}</p>
              </ModalInfo>
              {/*添加用车审核员*/}
              <ModalInfo  title="添加用车审核员"
                          showTxt="addCarAuditorVisible"
                          visible={addCarAuditorVisible}
                          footer={this.renderOperateRoleFooter("addCarAuditorVisible")}
                          cancel={this.handleCancelModal('addCarAuditorVisible')}
                          width={400}
                          closable={false}
                          destroyOnClose={true}
              >
                  <div className="edit-car-auditor">
                      <div style={{marginBottom: "10px"}} className="flex-row">
                          <span className="add-car-custom-label">审批员</span>
                          <div>
                              <Select
                                showSearch
                                showArrow={false}
                                allowClear={true}
                                labelInValue={true}
                                optionLabelProp="label"
                                optionFilterProp="label"
                                placeholder="请输入员工姓名"
                                style={{ width: 260, height: 32, borderRadius: "3px" }}
                                onSearch={this.handleSearchEmployee}
                                onChange={this.employeeNameOnChange}
                                onClear={this.clearAutoCompleteData}
                              >
                                  {this.renderAutoCompleteChildren(autoCompleteResult.formalStaff)}
                              </Select>
                              <p className="theme-font-redE80000">{warningMsg}</p>
                          </div>
                      </div>
                      <div className="flex-row">
                          <span className="add-car-custom-label">审批部门</span>
                          <div className="add-car-custom-tree-select">
                              <Tree
                                checkable
                                defaultExpandAll={true}
                                treeData={treeData}
                                onSelect={this.handleSelectDepartmentTreeNode}/*点击树节点触发*/
                                onCheck={this.onCheckDepartmentTreeNode}/*点击复选框触发*/
                              />
                          </div>
                      </div>
                  </div>
              </ModalInfo>
              {/*编辑用车审核员*/}
              <ModalInfo  title="编辑用车审核员"
                          showTxt="operateCarAuditor"
                          visible={operateCarAuditor}
                          footer={this.renderOperateRoleFooter("operateCarAuditor")}
                          cancel={this.handleCancelModal('operateCarAuditor')}
                          width={400}
                          closable={false}
                          destroyOnClose={true}
              >
                  <div className="edit-car-auditor">
                      <div style={{marginBottom: "10px"}} className="flex-row">
                          <span className="add-car-custom-label">审批员</span>
                          <div>
                              <Input type="text"
                                     style={{ width: 260, height: 32, borderRadius: "3px" }}
                                     disabled={true}
                                     value={currentEmployees.nickname}

                              />
                          </div>
                      </div>
                      <div className="flex-row">
                          <span className="add-car-custom-label">审批部门</span>
                          <div className="add-car-custom-tree-select">
                              <Tree
                                checkable
                                defaultExpandAll={true}
                                defaultCheckedKeys={currentEmployees.carAuditDepartments || []}
                                treeData={treeData}
                                onSelect={this.handleSelectDepartmentTreeNode}
                                onCheck={this.onCheckDepartmentTreeNode}
                              />
                          </div>
                      </div>
                  </div>
              </ModalInfo>
              {/*说明拒绝理由*/}
              <ModalInfo  title="说明拒绝理由" showTxt="noPassVisible"
                          className="noPassDrive"
                          visible={noPassVisible}
                          footer={this.renderOperateRoleFooter("noPassVisible")}
                          cancel={this.handleCancelModal('noPassVisible')}
                          width={400}
              >
                  <TextArea ref={ref => this.noPassTextarea = ref} placeholder="请输入" maxLength={200} className="no-pass-textarea"/>
              </ModalInfo>
              {/*确定解除*/}
              <ModalInfo width={400}
                         className="delete-modal"
                         title="确定解除？"
                         showTxt="removeAuthVisible"
                         visible={removeAuthVisible}
                // content="解除管理员/用车审批员/驾驶人角色后，员工将不再具备角色所具备的相关权限。"
                         content={`解除${RoleSwitchType([currentRole.value])}角色后，员工将不再具备角色所具备的相关权限。`}
                         okText="确定解除"
                         cancel={this.handleCancelModal('removeAuthVisible')}
                         confirm={this.handleConfirmRemoveEmployeesAuth}
                         closable={false}
              />
              {/*查看驾照*/}
              {viewDriverLicensesVisible ? <ModalImg visible="viewDriverLicensesVisible" cancel={this.handleCancelModal('viewDriverLicensesVisible')}>
                  <img className="drive-card-img" src={currentEmployees.driverLicenses ? currentEmployees.driverLicenses.licenseFront : ""} alt="驾照"  />
                  <div style={{width: '4%'}} />
                  <img className="drive-card-img" src={currentEmployees.driverLicenses ? currentEmployees.driverLicenses.licenseBack : ""} alt="驾照" />
              </ModalImg> : null}

          </React.Fragment>
        )
    }
}

export default RoleManage
