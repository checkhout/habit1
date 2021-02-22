import React from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import {
	Dropdown, Button
} from 'antd';
import routes from '@config/config';

import BaseComponent from '@/components/BaseComponent'
import SiderMenu from './menu'

import { logoutHttp } from '@api/common'
import avatarImg from '../../../assets/imgs/header/avatar@2x.png'
import './index.less'

@connect((state) => ({
	userInfoResult: state.userInfoResult,
	companyInfoResult: state.companyInfoResult,
}))

class HeaderCustom extends BaseComponent {

	state = {
		user: '',
		handleLogoutVisible: false,
		selectedKey: '',
		menuSource: [],
	};

	componentDidMount() {
		const {pathname} = this.props.history.location;

		this.setState({
			selectedKey: pathname,
		}, () => {
			this.filterMenu(this.props.userInfoResult.data);
		});

	};

	//根据roles获取一级路由
	filterMenu = userInfo => {
		/*
		* 认证审核需要有 ROLE_ddp2b_platform_operator（企业版平台运维员）角色，运维员登录就只有认证审核
		* */
		const menuSource = [];
		let uiFrame = [], {selectedKey} = this.state;

		if (userInfo.isAdmin) {
			uiFrame = uiFrame.concat([
				{
					"title":"通讯录",
				},
				{
					"title":"用车管理",
				},
				/*{
					"title":"设置",
				},*/
			]);
		}
		if (userInfo.isCertificationAudit) {//企业版平台运维员
			uiFrame.push({
				"title":"认证审核",
			})
		}

		routes.menu.forEach(firstMenu => { // 根据权限过滤出一级菜单
			let itemMenu = uiFrame.filter(menu => menu.title === firstMenu.title)[0];
			if (itemMenu) {
				menuSource.push(firstMenu)
			}
		});

		if (selectedKey === '/') {
			selectedKey = menuSource[0].path
		}
		// console.log(selectedKey, menuSource);

		this.setState({
			menuSource,
			selectedKey
		})
	};

	handleConfirmLogout = () => {
		logoutHttp().then(() => {
			this.props.history.replace('/login')
		})
	};


	menuClick = e => {
		this.setState({
			selectedKey: e.key
		});
	};

	render() {
		const {
			selectedKey,
			menuSource,
		} = this.state;
		const {
			userInfoResult,
			companyInfoResult,
		} = this.props;

		const userInfo = userInfoResult.data;
		const companyObj = companyInfoResult.data;
		const haveCompanyData = Object.keys(companyObj).length > 0;

		return (
			<div className=" header" >
				<div className="head-left">
					<img className='logo-small' src={haveCompanyData ? companyObj.logo : ""} alt=""/>
					<span style={{'marginLeft':'10px'}}>{haveCompanyData ? companyObj.name : "-"}</span>
				</div>

				<div className='head-center'>
					<SiderMenu
						menus={menuSource}
						onClick={this.menuClick}
						selectedKeys={[selectedKey]}
						mode="horizontal"
					/>

				</div>

				<div className="head-right">
					<Dropdown
						placement={'bottomRight'}
						overlay={
							<div className="head-drop-menu">
								<ul>
									<li className='user'>
										<span>账号：{`${userInfo.username}`}</span>
										<span>角色：{userInfo.isSuperAdmin ? "超级管理员"  : userInfo.isAdmin ? "管理员" : "运维员"}</span>
									</li>
									{/*<li className='edit-user'>编辑个人信息</li>*/}
									<li className='logout-btn'>
										<Button onClick={this.handleConfirmLogout}>退出登录</Button>
									</li>
								</ul>
							</div>
						}
						// trigger={['click']}
					>
						<span className="user-about"><img src={userInfo.avatar || avatarImg} alt=""/>{userInfo.nickname || '-'} <i className="anticon-icon_caret_down"/></span>
					</Dropdown>
				</div>

			</div>
		)
	}
}

export default withRouter(HeaderCustom) ;
