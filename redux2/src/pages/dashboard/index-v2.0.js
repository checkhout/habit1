import React, {Component} from 'react';
import { ReactSortable } from "react-sortablejs";
import cx from 'classnames'
import { Popover } from 'antd'

import update from 'immutability-helper'
import _ from 'lodash';

import { ICON_FONT_URL } from '@config'
import {createFromIconfontCN} from "@ant-design/icons";

import { indexToArray , getItem, setInfo, isPath, getCloneItem, itemRemove, itemAdd } from './utils';
import './index.less'

const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});



class Dashboard extends Component {
	state = {
		//看板列表
		groupList: []
	};
	componentDidMount() {
		//todo 参考数据
		const groupData = {"code":0,"msg":"操作成功","times":null,"datas":[{"id":50088,"userId":1049888,"appId":null,"name":"默认分组","type":0,"orderNum":1,"createTime":1604644903000,"updateTime":1604644903000,"panelList":[{"id":1973,"userId":1049888,"groupId":50088,"panelId":1973,"name":"理财用户使用机型排名","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":10,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1965,"userId":1049888,"groupId":50088,"panelId":1965,"name":"资金到账-转账的转化率","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":9,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1966,"userId":1049888,"groupId":50088,"panelId":1966,"name":"活跃用户使用机型排名","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":8,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1963,"userId":1049888,"groupId":50088,"panelId":1963,"name":"各平台注册转化漏斗(1)","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":7,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1969,"userId":1049888,"groupId":50088,"panelId":1969,"name":"注册转化率","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":6,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1962,"userId":1049888,"groupId":50088,"panelId":1962,"name":"各平台注册转化漏斗","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":5,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1971,"userId":1049888,"groupId":50088,"panelId":1971,"name":"活跃用户时段分布","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":4,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1970,"userId":1049888,"groupId":50088,"panelId":1970,"name":"登录失败用户占比","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":3,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1968,"userId":1049888,"groupId":50088,"panelId":1968,"name":"动账使用率","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":2,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0}]},{"id":53863,"userId":1049888,"appId":null,"name":"22222","type":1,"orderNum":3,"createTime":1608256275000,"updateTime":1608256281000,"panelList":[{"id":1964,"userId":1049888,"groupId":53863,"panelId":1964,"name":"资金到账用户数","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":12,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1972,"userId":1049888,"groupId":53863,"panelId":1972,"name":"转账用户留存分析","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":11,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1974,"userId":1049888,"groupId":53863,"panelId":1974,"name":"转账用户留存分析(1)","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":10,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1940,"userId":1049888,"groupId":53863,"panelId":1940,"name":"核心流程转化（副本）","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":9,"status":1,"createTime":null,"userName":null,"bookNums":8,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1040,"userId":0,"groupId":53863,"panelId":1040,"name":"基金理财分析","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":8,"status":1,"createTime":null,"userName":null,"bookNums":8,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":1039,"userId":0,"groupId":53863,"panelId":1039,"name":"用户画像分析","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":7,"status":1,"createTime":null,"userName":null,"bookNums":8,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":875,"userId":0,"groupId":53863,"panelId":875,"name":"基础业务指标","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":6,"status":1,"createTime":null,"userName":null,"bookNums":8,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":877,"userId":0,"groupId":53863,"panelId":877,"name":"运营数据指标","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":5,"status":1,"createTime":null,"userName":null,"bookNums":10,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":1042,"userId":0,"groupId":53863,"panelId":1042,"name":"核心流程转化","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":4,"status":1,"createTime":null,"userName":null,"bookNums":10,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":1041,"userId":0,"groupId":53863,"panelId":1041,"name":"动账业务分析","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":3,"status":1,"createTime":null,"userName":null,"bookNums":11,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":876,"userId":0,"groupId":53863,"panelId":876,"name":"产品体验指标","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":2,"status":1,"createTime":null,"userName":null,"bookNums":7,"open":true,"read":true,"platform":null,"tips":null,"isPre":1}]},{"id":53922,"userId":1049888,"appId":null,"name":"222222222222222222222222222","type":1,"orderNum":4,"createTime":1608273206000,"updateTime":1608273446000,"panelList":[{"id":1967,"userId":1049888,"groupId":53922,"panelId":1967,"name":"理财产品购买分布","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":2,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0}]},{"id":53901,"userId":1049888,"appId":null,"name":"3333","type":1,"orderNum":5,"createTime":1608265046000,"updateTime":1608265046000,"panelList":[]}],"exception":null,"uniqueId":"789508836468719616"};

		let groupList = groupData.datas.map(item => {
			//为组增加开关标识
			return {...item, open: 0}
		});
		this.setState({
			groupList: groupList
		})
	}

	handleOpenGroup = key => () => {
		let groupList =  this.state.groupList.map(item => {
			return { ...item, open: key === item.id && item.open === 0 ? 1 : 0 }
		});
		this.setState({groupList})
	};

	handleOpenMore = (e) => {
		console.log('click more');
		e.stopPropagation();
	};


	//分组拖动
	dragGroup = (newState) => {
		// console.log('dragGroup newState ===== ', newState);
		this.setState({
			groupList: [...newState]
		})
	};
	//看板拖动
	dragItem = (newState, groupId) => {
		const { groupList } = this.state;
		let dragIndex = -1;
		groupList.forEach((i, index) => {
			if (i.id === groupId) {
				dragIndex = index;
			}
		});

		// const currentGroup = groupList.filter(item => item.id === groupId);

		const endState = update(groupList, {
			[dragIndex]: {
				$merge: { panelList: newState }
			}
		});
		console.log('dragItem newState ===== ', newState, groupId, dragIndex);
		console.log('endState ===== ', endState);

		this.setState({
			groupList: endState
		})
	};
	render () {

		const ReactSortableOptions = {
			group: "panelList",
			animation: 200,
			delayOnTouchStart: true,
			delay: 2,
		};
		return (
			<div className="dashboard-page">
				<div className="flex-left">
					<div className="left-head">
						<span>所有看板</span><IconFont type="icontuichudenglu"/>
					</div>
					<div className="left-content">
						{/*容器*/}
						<ReactSortable
							{...ReactSortableOptions}
							list={this.state.groupList}
							setList={this.dragGroup}
							className='rongqi'
						>
							{
								//遍历看板组
								this.state.groupList.map((group) => (
									<div key={group.id}>
										<div key={group.id} className="group-item">
											{/*看板分组标题*/}
											{ //type：1用户分组
												group.type ? <div className="group-title" onClick={this.handleOpenGroup(group.id)}>
														<IconFont type="iconjiantou" className={cx('arrow', {'arrow-active': group.open})}/>
														<span className="name">{group.name}</span>
														<Popover
															placement="rightTop"
															title=''
															content={<div><p>hello</p><p>word</p></div>}
															trigger="click"
															arrowPointAtCenter
														>
															<div className='more-box' onClick={this.handleOpenMore}>
																<IconFont type="iconcaidan1" className='more'/>
															</div>
														</Popover>

													</div>
													//type：0为默认分组 不显示组名 且不可拖动
													: <div className="group-title" />
											}
											{/*看板列表*/}
											<div>
												{
													//用户分组需要点击展开
													group.type ? <div
															className="dashboard-list"
														>
															{
																//遍历看板
																group.open ? (
																	group.panelList.length
																		? <ReactSortable
																			{...ReactSortableOptions}
																			key={group.id}
																			list={group.panelList}
																			setList={newState => this.dragItem(newState, group.id)}
																			delay={2}
																		>
																			{
																				group.panelList.map(dashboard => {
																					return <div key={dashboard.id} className="dashboard-item">
																						{dashboard.name}
																					</div>
																				})
																			}
																		</ReactSortable>
																		: <div className="dashboard-item dashboard-init">可将看板拖动到此处</div>
																) : null
															}
														</div>
														: <ReactSortable
															{...ReactSortableOptions}
															key={group.id}
															className="dashboard-list"
															list={group.panelList}
															setList={newState => this.dragItem(newState, group.id)}
															delay={2}
														>
															{
																group.panelList.length && group.panelList.map(dashboard => {
																	return <div key={dashboard.id} className="dashboard-item">
																		{dashboard.name}
																	</div>
																})
															}
														</ReactSortable>
												}
											</div>
										</div>
									</div>
								))
							}
						</ReactSortable>
					</div>
					<div className="left-footer">
						<span>
							<IconFont type="icontuichudenglu"/><span>公共图表库</span>
						</span>
						<IconFont type="icontuichudenglu"/>
					</div>
				</div>

				<div className="flex-right">

				</div>
			</div>
		)
	}
}


export default Dashboard
