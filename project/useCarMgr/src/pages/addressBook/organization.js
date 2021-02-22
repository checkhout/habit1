import React from 'react'
import {connect} from "react-redux";
import {
    Button, message
} from "antd";

import BaseComponent from '@/components/BaseComponent'
import ToCopy from '@/components/toCopy'
import DataTable from '@/components/DataTable'
import SearchBar from '@/components/searchBar'
import ModalInfo from '@/components/modalInfo'
import ModalImg from '@/components/ModalImg'
import {
    IsEmpty,
    FormatUsername
} from "@utils/index";
import {
    send_invitation_api,
    send_invitation_again_api,
    delete_employee_api,
} from "@api/addressBook";

import OperateEmployeesModal from "./operateEmployeesModal";
import {
    RoleSwitchSex,
    RoleSwitchType,
    addrBookOrganization,
} from "./utils";


@connect((state) => ({
    orgEmployeesListResult: state.orgEmployeesListResult,
    userInfoResult: state.userInfoResult,
    companyInfoResult: state.companyInfoResult,
}))

class Organization extends BaseComponent {
    state = {
        currentViewUrl: "",                 //预览图片地址
        viewImgVisible: "",                 //预览图片弹窗

        operateEmployeesVisible: false,     //邀请、编辑员工弹窗
        currentEmployees: { id: 0, },               //当前所操作的员工
        deleteEmployeesVisible: false,      //删除员工
    };

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    //组织结构 部门员工列表
    organizationColumns = () => {
        return [
            {
                title: '员工姓名',
                name: 'nickname',
                dataIndex: "id",
                // width: '15%',
                tableItem: {
                    // width: '90px',
                    render: (text, record) => {
                        return <ToCopy text={text} />
                    }
                },
            },
            {
                title: '性别',
                name: 'sex',
                dataIndex: "id",
                tableItem: {
                    render: (text, record) => RoleSwitchSex(IsEmpty(text))
                }
            },
            {
                title: '手机号',
                name: 'username',
                tableItem: {
                    render: (text, record) => {
                        return IsEmpty(FormatUsername(text));
                    }
                }
            },
            {
                title: '所属部门',
                name: 'department',
                // width: '15%',
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
                title: '角色',
                width: '40%',
                tableItem: {
                    // width: '240px',
                    render: (text, record) => {

                        let roles = record.roles || [];
                        let inviteStatus = record.inviteState ? record.inviteState : "";

                        if (inviteStatus) {

                            switch (inviteStatus) {
                                case 1:
                                    return <div className="custom-column"><span className="send-status theme-font-red0DA736">已发送邀请</span>
                                        <Button onClick={this.sendInviteAgain(record)} className="theme-btn-opacity-blue">重新邀请</Button>
                                    </div>;
                                case 3:
                                    return <div className="custom-column"><span className="send-status theme-font-redE80000">对方已拒绝</span>
                                        <Button onClick={this.sendInviteAgain(record)} className="theme-btn-opacity-blue">重新邀请</Button>
                                    </div>;
                                default:
                                    break;
                            }

                        } else {
                            return RoleSwitchType(roles, inviteStatus)
                        }

                    }
                }
            },
            {
                title: '操作',
                tableItem: {
                    // fixed: 'right',
                    render: (text, record) => {
                        const { isSuperAdmin } = this.props.userInfoResult.data;
                        const recordIsSuperAdmin = record.roles && record.roles.indexOf("ROLE_ddp2b_superadmin") >= 0;
                        const recordIsAdmin = record.roles && record.roles.indexOf("ROLE_ddp2b_admin") >= 0;

                        //超级管理员除了超级管理员都可以解除
                        if (isSuperAdmin) {
                            if (recordIsSuperAdmin) {
                                return <div className="operate custom-column">
                                    <Button ghost={true} title={'编辑'} className="margin_r12 normal_btn theme-font-blue379EEC margin-right9"
                                            onClick={this.handleOperateEmployees(record, 'operateEmployeesVisible')}
                                    >编辑</Button>
                                    <Button ghost={true}/>
                                </div>
                            }
                            else {
                                return <div className="operate custom-column">
                                    <Button ghost={true} title={'编辑'} className="margin_r12 normal_btn theme-font-blue379EEC margin-right9"
                                            onClick={this.handleOperateEmployees(record, 'operateEmployeesVisible')}
                                    >编辑</Button>
                                    <Button ghost={true} title='删除' className=" normal_btn theme-font-redE80000"
                                            onClick={this.handleOperateEmployees(record, 'deleteEmployeesVisible')}
                                    >删除</Button>
                                </div>
                            }

                        }
                        else {
                            //管理员可以删除非管理员；管理员不可编辑超级管理员
                            if (recordIsAdmin) {
                                return <div className="operate custom-column">
                                    {
                                        recordIsSuperAdmin
                                          ? <Button ghost={true}/> :
                                          <Button ghost={true} title={'编辑'} className="normal_btn theme-font-blue379EEC margin-right9"
                                                  onClick={this.handleOperateEmployees(record, 'operateEmployeesVisible')}
                                          >编辑</Button>
                                    }
                                    <Button ghost={true}/>
                                </div>
                            }
                            else {
                                return <div className="operate custom-column">
                                    <Button ghost={true} title={'编辑'} className="margin_r12 normal_btn theme-font-blue379EEC margin-right9"
                                            onClick={this.handleOperateEmployees(record, 'operateEmployeesVisible')}
                                    >编辑</Button>
                                    <Button ghost={true} title='删除' className="normal_btn theme-font-redE80000"
                                            onClick={this.handleOperateEmployees(record, 'deleteEmployeesVisible')}
                                    >删除</Button>
                                </div>
                            }
                        }
                    }
                }
            },
        ]
    };
    //发送邀请
    sendInvite = record => {

        //inviteState 1:已发送邀请 3：拒绝了邀请
        if (+record.inviteState === 1) {
            const {username, avatar, nickname, sex, department } = record;
            record = {
                username,
                avatar,
                nickname,
                sex,
                departmentId: department && (department.id !== this.props.companyInfoResult.data.id) ? department.id : 0,	//如果没有部门，传0代表公司
            };
        }
        send_invitation_api(record).then(res => {

            this.props.getDepartmentStaffBySelectedKey();
            message.success("已成功发送邀请")

        }).catch(err => {

            switch (+err.error_code) {
                case -1:
                    message.warning("员工已被邀请");
                    break;
                case 589828:
                    message.warning("员工已加入");
                    break;
                case 589825:
                    message.warning("员工没有加入企业");
                    break;
                case 589826:
                    message.warning("员工非公司管理员");
                    break;
                default:
                    break;
            }

        })

    };
    //重新发送邀请
    sendInviteAgain = record => () => {

        const { username, avatar, nickname, sex, department } = record;
        let param = {
            username,
            avatar,
            nickname,
            sex,
            departmentId: department && (department.id !== this.props.companyInfoResult.data.id) ? department.id : 0,
        };

        send_invitation_again_api(record.inviteId, param).then(res => {

            this.props.getDepartmentStaffBySelectedKey();
            message.success("已成功发送邀请")

        }).catch(err => {

            switch (+err.error_code) {
                case -1:
                    message.warning("员工已被邀请");
                    break;
                case 589828:
                    message.warning("员工已加入");
                    break;
                default:
                    break;
            }

        })

    };
    //邀请/编辑员工
    handleOperateEmployees = (employees, visible) => () => {
        if (!visible) {
            visible = "operateEmployeesVisible";
        }
        this.setState({
            [visible]: true,
            currentEmployees: (employees.id || employees.inviteId) ? employees : {},
        })
    };
    searchFields = () => {
        return [
            {
                key: 'type',
                type: 'select',
                defaultValue: 'nickname',
                className: 'border-radius-custom select-and-input-s',
                items: addrBookOrganization,
            },
            {
                key: 'inputSearch',
                type: 'input',
                className: "border-custom select-and-input-i",
                width: 160,
                placeholder: '搜索'
            }
        ]
    };
    //预览图片
    handlePreview = (url) => {
        if (url) {
            this.setState({
                currentViewUrl: url,
                viewImgVisible: true,
            })
        } else {
            message.warning("该照片暂不能预览")
        }

    };
    handleCancelPreview = () => {
        this.setState({
            viewImgVisible: false
        })
    };
    operateEmployeeRef = (Employee) => {
        this.employee = Employee
    };
    handleCancelModal = (visible) => () => {
        const editing = this.state.currentEmployees.id || this.state.currentEmployees.inviteId;
        const state = {
            [visible]: false,
            currentEmployees: { id: 0 },
            willAddRoleEmployeesId: "",
            warningMsg: "",
        };
        if (editing) {
            delete state.currentEmployees
        }

        this.setState({...state})
    };
    //确认删除员工
    handleConfirmDeleteEmployees = () => {
        const {id , inviteId} = this.state.currentEmployees;
        let deleteId = id || inviteId;
        let type = inviteId ? 2 : 1;

        delete_employee_api(deleteId, type).then(res => {
            this.props.getDepartmentTreeData();
            this.props.getDepartmentStaffBySelectedKey();
            message.success("删除成功")
        }).catch(err => {})
    };

    render() {
        const {
            operateEmployeesVisible,
            currentEmployees,
            deleteEmployeesVisible,
            currentViewUrl,
            viewImgVisible,
        } = this.state;

        const {
            orgEmployeesListResult,
            companyInfoResult,
            pageNum,
            pageSize,
            currentDepartmentObj,
            onOrganizationPageChange,
            requestOperateDepartment,
            getDepartmentStaffBySelectedKey,
            getDepartmentTreeData,
            onSearchEmployees,
        } = this.props;

        const organizationDataTable = {
            loading: {
                spinning: orgEmployeesListResult.loading,
                delay: 500
            },
            columns: this.organizationColumns(),
            rowKey: 'username', //测试数据最后一条没有id报错
            dataItems: {
                list: orgEmployeesListResult.data,
                total: orgEmployeesListResult.total,
                pageNum,
                pageSize
            },
            onChange: ({ page, pageSize }) => { page && onOrganizationPageChange(page, pageSize)  }
        };


        return (
          <React.Fragment>
              <div className="data-table-wrapper">
                  <div className="custom-table-header">
                      <span>
                          <span className="detail-employees-bold">
                              {currentDepartmentObj.department ? currentDepartmentObj.department.name : "-"}<span>
                              （{currentDepartmentObj.department ? currentDepartmentObj.department.userCount : 0}）</span>
                          </span>
                          {
                              currentDepartmentObj.department && +currentDepartmentObj.department.id !== 0
                                ? <Button onClick={requestOperateDepartment(true)} className="config-btn">设置</Button> : null
                          }
                      </span>
                      <Button onClick={this.handleOperateEmployees({}, 'operateEmployeesVisible')} className="invite-btn" type="primary">邀请员工</Button>
                  </div>
                  <div className="parting-line" />

                  <SearchBar
                    onSubmit={onSearchEmployees}
                    fields={this.searchFields()}
                  />

                  <DataTable { ...organizationDataTable }/>
              </div>

              {/*邀请、编辑员工*/}
              <OperateEmployeesModal
                visible={operateEmployeesVisible}
                requestDriverListData={this.requestDriverListData}
                handleCancelModal={this.handleCancelModal('operateEmployeesVisible')}
                handlePreview={this.handlePreview}
                currentEmployees={currentEmployees}
                getDepartmentStaffBySelectedKey={getDepartmentStaffBySelectedKey}
                getDepartmentTreeData={getDepartmentTreeData}
                onRef={this.operateEmployeeRef}
                sendInvite={this.sendInvite}
                refreshOrganizationTree={this.getDepartmentTreeData}
                companyId={companyInfoResult.data.id}
              />

              {/*确定删除员工*/}
              <ModalInfo width={400} className="delete-modal"
                         title="确定删除员工？"
                         showTxt="deleteEmployeesVisible"
                         visible={deleteEmployeesVisible}
                         content="删除员工仅删除员工基本信息，员工产生的用车数据等会保留。"
                         okText="确定删除"
                         cancel={this.handleCancelModal('deleteEmployeesVisible')}
                         confirm={this.handleConfirmDeleteEmployees}
                         closable={false}
              />

              {
                  viewImgVisible? <ModalImg visible="viewImgVisible" cancel={this.handleCancelPreview}>
                      <img src={currentViewUrl} alt="头像" />
                  </ModalImg> : null
              }

          </React.Fragment>
        )
    }
}

export default Organization
