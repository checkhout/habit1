import React from 'react'
import {
    // Select,
    Button,
    Tree,
    Spin,
    Tabs
} from 'antd'
import cx from 'classnames'
import { connect } from "react-redux"

import BaseComponent from '@/components/BaseComponent'
// import { normal } from '@/components/Notification'
// import { cloneDeep } from 'lodash'
// import { catalogueListHttp } from "@/api/index";
// import { compareBoolean } from "@/utils/index";
import { addrBookRoleMgr } from "./utils";
import './leftTab.less'

const { TabPane } = Tabs;

@connect((state) => ({
    departmentListResult: state.departmentListResult,
    userInfoResult: state.userInfoResult,
}))
class LeftTab extends BaseComponent {
    state = {
        openSide: true,
        allCatalogueList: [], //所有群
        publicCatalogueList: [], //公共群
        privateCatalogueList: [], //私有群
        currentGroupNode: [], //当前组
        currentSelectedGroupNode: ['0'],
        chooseAllVehicleVisible: true, //勾选全部车辆标识
        defaultSelectedDepartmentKey: -1, //默认选中部门
    };

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    renderRoleTabPane = () => {
        let roleType = addrBookRoleMgr;
        if (!this.props.userInfoResult.data.ddpSuperAdmin) {
            roleType = roleType.filter(item => item.value !== 'ROLE_ddp2b_platform_operator')
        }
        return roleType.map(item => {
            return <TabPane  tab={item.txt} key={item.value}/>
        });
    };
    render() {
        const {
            openSide,
        } = this.state;
        const {
            className,
            requestOperateDepartment, handleLeftTabSwitch, handleSwitchRole,
            departmentListResult: { treeDataHasNum, loading },
            selectedKeys,
            addressBookActiveKey,
            currentRole,
            onSelect,
        } = this.props;


        return (
          <div className={cx(`fullHeight address-book-left-wrapper card-container ${className}`, { 'close': !openSide })}>
              <Tabs type="card"
                    hideAdd={true}
                    activeKey={addressBookActiveKey}
                    onTabClick={handleLeftTabSwitch}
              >
                  <TabPane tab="组织结构" key="orgTree">
                      <div className="flex-columns organization-structure">
                          <div className="scroll-inner">
                              {
                                  treeDataHasNum.length ? <Spin spinning={loading} delay={500}>
                                      <Tree
                                        defaultExpandAll={true}
                                        defaultExpandedKeys={selectedKeys}
                                        defaultSelectedKeys={selectedKeys}
                                        selectedKeys={selectedKeys}
                                        treeData={treeDataHasNum}
                                        onSelect={onSelect}
                                        className="flex-auto"
                                      />
                                  </Spin> : null
                              }
                          </div>

                          <Button type="primary" className="add-new-btn" onClick={requestOperateDepartment(false)}>新建部门</Button>
                      </div>
                  </TabPane>
                  <TabPane tab="角色管理" key="roleMgr">
                      <div className="role-mgr-tab">
                          <Tabs tabPosition="left"
                                type="card"
                                activeKey={currentRole.value}
                                onTabClick={handleSwitchRole}>
                              {this.renderRoleTabPane()}
                          </Tabs>
                      </div>
                  </TabPane>
              </Tabs>
          </div>

        )
    }
}

export default LeftTab
