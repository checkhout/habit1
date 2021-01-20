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
import './index.less'
import Logo from './app_logo@2x.png'
import { ICON_FONT_URL } from '@config'
import {createFromIconfontCN} from "@ant-design/icons";


const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});
@connect((state) => ({
	userInfoResult: state.userInfoResult,
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
		let uiFrame = [], { selectedKey } = this.state;

		uiFrame = uiFrame.concat([
			{
				"title":"看板",
			},
			{
				"title":"产品分析",
			},
		]);
		/*if (userInfo.isAdmin) {
			uiFrame = uiFrame.concat([
				{
					"title":"看板",
				},
				{
					"title":"产品分析",
				},
			]);
		}
		if (userInfo.isCertificationAudit) {//企业版平台运维员
			uiFrame.push({
				"title":"认证审核",
			})
		}*/

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
		}).catch(() => {
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
		} = this.props;

		const userInfo = userInfoResult.data;


		return (
			<div className="header">
				<div className="head-left">
					<img className='logo-small' src={Logo} alt=""/>
					{/*<div className={'app-name'}>数据分析平台</div>*/}
				</div>

				<div className='head-center'>
					<SiderMenu
						menus={menuSource}
						onClick={this.menuClick}
						selectedKeys={[selectedKey || (menuSource.length && menuSource[0].path)]}
						mode="horizontal"
					/>

				</div>

				<div className="head-right">
					<Dropdown
						placement={'bottomRight'}
						overlay={
							<div className="head-drop-menu">
								<ul>
									<li>
										用户：{`${userInfo.nickname}`}
									</li>
									<li>
										账号：{userInfo.username}
									</li>
								</ul>
								<div className="logout-btn">
									<Button icon={<IconFont type="iconexit" style={{fontSize: '18px'}}/>} onClick={this.handleConfirmLogout}>退出登录</Button>
								</div>
							</div>
						}
						trigger={['click']}
					>
						<span className="user-about">
							{/*<img src={userInfo.avatar || avatarImg} alt=""/>*/}
							{userInfo.nickname || '-'}
							<i className="anticon-icon_caret_down"/>
						</span>
					</Dropdown>
				</div>

			</div>
		)
	}
}

export default withRouter(HeaderCustom) ;
