import React from 'react';
import {ReactSortable} from "react-sortablejs";
import cx from 'classnames'
import {connect} from "react-redux";
import {
	Popover,
	Checkbox,
	message,
} from 'antd'

import update from 'immutability-helper'

import {ICON_FONT_URL} from '@config'
import {createFromIconfontCN} from "@ant-design/icons";
import ModalForm from '@components/modalForm'
import ModalInfo from '@components/modalInfo'
import BaseComponent from '@components/BaseComponent'

import {
	addDashboardApi,
	deleteDashboardApi,
	updateDashboardApi,
} from '@api/dashboard'

import {
	dashboardListAction,
} from '@actions/dashboard'


import Detail from './detail'

import './index.less'

const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});

@connect((state) => ({
	dashboardListResult: state.dashboardListResult,
}))

class Dashboard extends BaseComponent {
	state = {
		groupList: [],//看板组
		createDashboardVisible: false,//创建看板弹窗
		createGroupVisible: false,
		updateGroupVisible: false,
		deleteGroupVisible: false,
		deleteDashboardVisible: false,
		operateGroupObj: {},
		operateDashboardObj: {},
		currentDashboardObj: {},//选中的看板
		deleteType: false, //删除看板分组 是否 同时删除看板及看板内图表
	};

	componentDidMount() {
		//todo 参考数据
		/*const groupData = {"code":0,"msg":"操作成功","times":null,"datas":[{"id":50088,"userId":1049888,"appId":null,"name":"默认分组","type":0,"orderNum":1,"createTime":1604644903000,"updateTime":1604644903000,"panelList":[{"id":1973,"userId":1049888,"groupId":50088,"panelId":1973,"name":"理财用户使用机型排名","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":10,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1965,"userId":1049888,"groupId":50088,"panelId":1965,"name":"资金到账-转账的转化率","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":9,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1966,"userId":1049888,"groupId":50088,"panelId":1966,"name":"活跃用户使用机型排名","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":8,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1963,"userId":1049888,"groupId":50088,"panelId":1963,"name":"各平台注册转化漏斗(1)","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":7,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1969,"userId":1049888,"groupId":50088,"panelId":1969,"name":"注册转化率","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":6,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1962,"userId":1049888,"groupId":50088,"panelId":1962,"name":"各平台注册转化漏斗","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":5,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1971,"userId":1049888,"groupId":50088,"panelId":1971,"name":"活跃用户时段分布","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":4,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1970,"userId":1049888,"groupId":50088,"panelId":1970,"name":"登录失败用户占比","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":3,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1968,"userId":1049888,"groupId":50088,"panelId":1968,"name":"动账使用率","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":2,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0}]},{"id":53863,"userId":1049888,"appId":null,"name":"22222","type":1,"orderNum":3,"createTime":1608256275000,"updateTime":1608256281000,"panelList":[{"id":1964,"userId":1049888,"groupId":53863,"panelId":1964,"name":"资金到账用户数","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":12,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1972,"userId":1049888,"groupId":53863,"panelId":1972,"name":"转账用户留存分析","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":11,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1974,"userId":1049888,"groupId":53863,"panelId":1974,"name":"转账用户留存分析(1)","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":10,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1940,"userId":1049888,"groupId":53863,"panelId":1940,"name":"核心流程转化（副本）","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":9,"status":1,"createTime":null,"userName":null,"bookNums":8,"open":true,"read":true,"platform":null,"tips":null,"isPre":0},{"id":1040,"userId":0,"groupId":53863,"panelId":1040,"name":"基金理财分析","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":8,"status":1,"createTime":null,"userName":null,"bookNums":8,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":1039,"userId":0,"groupId":53863,"panelId":1039,"name":"用户画像分析","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":7,"status":1,"createTime":null,"userName":null,"bookNums":8,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":875,"userId":0,"groupId":53863,"panelId":875,"name":"基础业务指标","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":6,"status":1,"createTime":null,"userName":null,"bookNums":8,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":877,"userId":0,"groupId":53863,"panelId":877,"name":"运营数据指标","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":5,"status":1,"createTime":null,"userName":null,"bookNums":10,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":1042,"userId":0,"groupId":53863,"panelId":1042,"name":"核心流程转化","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":4,"status":1,"createTime":null,"userName":null,"bookNums":10,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":1041,"userId":0,"groupId":53863,"panelId":1041,"name":"动账业务分析","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":3,"status":1,"createTime":null,"userName":null,"bookNums":11,"open":true,"read":true,"platform":null,"tips":null,"isPre":1},{"id":876,"userId":0,"groupId":53863,"panelId":876,"name":"产品体验指标","isShare":0,"sourceType":0,"source":0,"canOperated":0,"isFixed":1,"orderNum":2,"status":1,"createTime":null,"userName":null,"bookNums":7,"open":true,"read":true,"platform":null,"tips":null,"isPre":1}]},{"id":53922,"userId":1049888,"appId":null,"name":"222222222222222222222222222","type":1,"orderNum":4,"createTime":1608273206000,"updateTime":1608273446000,"panelList":[{"id":1967,"userId":1049888,"groupId":53922,"panelId":1967,"name":"理财产品购买分布","isShare":0,"sourceType":1,"source":1,"canOperated":1,"isFixed":1,"orderNum":2,"status":1,"createTime":null,"userName":null,"bookNums":1,"open":true,"read":true,"platform":null,"tips":null,"isPre":0}]},{"id":53901,"userId":1049888,"appId":null,"name":"3333","type":1,"orderNum":5,"createTime":1608265046000,"updateTime":1608265046000,"panelList":[]}],"exception":null,"uniqueId":"789508836468719616"};

		let groupList = groupData.datas.map(item => {
			//为组增加开关标识 增加空状态
			return {...item, open: 0, panelList: item.panelList.length ? item.panelList : [{ id: -1, name: '可将看板拖动到此处' }] }
		});


		this.setState({
			// groupList: groupList

			groupList: [{
				appId: null,
				createTime: 1604644903000,
				id: 0,
				name: "默认分组",
				orderNum: 1,
				panelList: [{ id: -1, name: '可将看板拖动到此处' }],
				type: 0,
				updateTime: 1604644903000,
				userId: 1049888,
			}]
		}, () => {

			//读取缓存Id，如果没有缓存id，则使用第一个看板组中的第一个看板ID
			//如果没有看板，默认当前看板id；-1 且不请求看板详情
			const getFirstId = (arr, index) => {
				if (index > arr.length) {
					return -1
				}

				if (arr[index].panelList.length > 0) {
					return arr[index].panelList[0].id
				}

				getFirstId(arr, index + 1)
			};
			const currentId = getFirstId(groupList, 0);
			this.props.history.push({pathname: `/dashboard`, state:{id: currentId}});
		});*/


		this.getDashboardList(() => {
			const id = sessionStorage.getItem('dashboardDefaultId');
			if (id) {
				let filterPanel = {};

				this.state.groupList.forEach(item => {
					item.board.length && item.board.forEach(j => {
						if (+j.id === +id) {
							filterPanel = {...j}
						}
					})
				});

				if (filterPanel.id) {
					this.setState({currentDashboardObj: {...filterPanel}});
					this.props.history.push({pathname: `/dashboard`, state:{id}});
				}
			}
			else {
				const getFirst = (arr, index) => {
					if (index > arr.length) {
						return -1
					}

					if (arr[index].board.length > 0) {
						return arr[index].board[0]
					}

					getFirst(arr, index + 1)
				};
				const firstItem = getFirst(this.state.groupList, 0);
				this.setState({currentDashboardObj: {...firstItem}});
				this.props.history.push({pathname: `/dashboard`, state:{id: firstItem.id}});
			}
		});
	}

	getDashboardList = (callback) => {
		this.props.dispatch(dashboardListAction({}, (res) => {
			// console.log( '获取看板列表 res：',res);

			let groups = res.group;
			groups = groups.map(item => {
				//为组增加开关标识 增加空状态
				return {...item, open: 0, board: item.board && item.board.length ? item.board : [{ id: -1, name: '可将看板拖动到此处' }] }
			});
			//后台把没有分组的看板放在了res.board中，在前面插入一个id为0的默认分组用来展示
			groups = update(groups, { $unshift: [{
					"id": 0,
					"name": "默认看板",
					"remark": "",
					"board": [...res.board]
				}] }
			);
			console.log('分组列表', groups);
			this.setState({
				groupList: groups
			}, callback)
		}, (err) => {
			console.log( '获取看板列表 err：',err);
		}));
	};



	handleOpenGroup = key => () => {
		const { groupList } = this.state;
		let dragIndex = 0;
		//获取目标看板分组下标
		groupList.forEach((i, index) => {
			if (i.id === key) {
				dragIndex = index;
			}
		});

		//更新目标分组的看板分组数据
		const endState = update(groupList, {
			[dragIndex]: {
				$merge: { open: groupList[dragIndex].open === 0 ? 1 : 0  }
			}
		});

		this.setState({groupList: endState})
	};

	//分组拖动
	dragGroup = (newState) => {
		let endIndex = -1, endGroupIndex = -1, endState = newState;

		newState.forEach((item, index) => {
			// 看板组为一级拖动列表，看板列表为二级拖动列表，当拖动二级列表到一级列表时，将它放到一级列表的二级列表后面
			if (!item.board) {
				endIndex = index
			}
		});

		//此时为看板拖动
		if (endIndex >= 0) {
			endState = update(newState, {
				$splice: [[endIndex, 1]],
				[endIndex - 1]: {
					board: { $push: [newState[endIndex]] }
				}
			});
			// console.log('分组拖动 ', newState);

		}

		//保持看板组在下，默认看板在上
		if (endState[0] && endState[0].type !== 0) {
			//查找默认看板当前位置，然后切割重新插入到首位
			endState.forEach((item, index) => {
				if (item.type === 0) {
					endGroupIndex = index
				}
			});

			if (endGroupIndex >= 0) {
				endState = update(endState, {
					$splice: [[endGroupIndex, 1]],
					$unshift: [endState[endGroupIndex]]
				});
			}
		}

		this.setState({
			groupList: endState
		})
	};
	//看板拖动
	dragItem = (newState, groupId) => {
		// console.log('看板拖动', newState, groupId);
		const { groupList } = this.state;
		let dragIndex = -1;
		//获取目标看板分组下标
		groupList.forEach((i, index) => {
			if (i.id === groupId) {
				dragIndex = index;
			}
		});

		let filterState = newState;
		//过滤掉 【可将看板拖动到此处】
		if (newState.length >= 2) {
			filterState = newState.filter(f => f.id !== -1)
		}
		else if (newState.length === 0) {
			filterState = [{ id: -1, name: '可将看板拖动到此处' }]
		}

		//更新目标分组的看板分组数据
		const endState = update(groupList, {
			[dragIndex]: {
				$merge: { board: filterState }
			}
		});

		this.setState({
			groupList: endState
		}, () => {
			const param = {
				type: 0,
				groupId: 0,
				lastId: 0, //后台排序，前面一个(看板/分组)的id，如果只有当一个就传0
			}
			// endState[dragIndex].board
		});
	};
	showDashboardDetail = (dashboard) => () => {
		if (dashboard.id === -1) { return }
		this.props.history.push({pathname: `/dashboard`, state:{id: dashboard.id}});

		sessionStorage.setItem('dashboardDefaultId', String(dashboard.id));
		this.setState({
			currentDashboardObj: {...dashboard}
		})
	};

	createDashboard = () => {
		this.handleShowModal('createDashboardVisible');
	};
	createGroup = () => {
		this.handleShowModal('createGroupVisible');
	};
	confirmCreateDashboard = (values, type) => {
		const { name, groupId } = values;
		this.createDashboardHttp({
			name, groupId: +groupId,
			type,
		});
	};
	confirmCreateGroup = (values) => {
		this.createDashboardHttp({
			name: values.name,
			type: 1,
		});
	};
	createDashboardHttp = (param) => {
		addDashboardApi(param).then(res => {
			const { groupList } = this.state;
			//创建看板分组
			if (param.type > 0) {
				this.setState({
					[this.state.operateGroupObj.id ? "updateGroupVisible": "createGroupVisible"] : false,
					groupList: [...groupList, {...res, open: 0, board: []}]
				})
			}
			//创建看板
			else {
				//a. 求新建看板分组的下标
				let groupIndex = -1;
				groupList.forEach((item, i) => {
					if (item.id === param.groupId) { groupIndex = i }
				});

				if (groupIndex >= 0) {
					this.setState({
						createDashboardVisible: false,
						groupList: update(groupList, {
							[groupIndex]: {
								board: { $push: [{...res}] }
							}
						})
					})
				}
			}

			message.success('创建成功！');
		}).catch(err => {
			console.log(err)
		});
	};

	//操作分组或看板
	operateGroup = ( record, visibleName ) => () => {
		console.log('操作看板', record.name, record.id);
		const newState = {[visibleName]: true};

		if (visibleName === 'deleteDashboardVisible') {
			newState.operateDashboardObj = {...record}
		}
		else {
			newState.operateGroupObj = {...record}
		}
		this.setState({...newState})
	};
	deleteGroupTypeChange = (e) => {
		this.setState({deleteType: e.target.checked})
	};
	confirmDeleteGroup = () => {
		this.deleteDashboardHttp(this.state.operateGroupObj.id, {type: 1, deleteChart: this.state.deleteType ? 1 : 0});
	};
	confirmDeleteDashboard = () => {
		this.deleteDashboardHttp(this.state.operateDashboardObj.id, {type: 0,});
	};
	//删除看板或分组
	deleteDashboardHttp = (id, param) => {
		deleteDashboardApi(id, param).then(res => {
			if (param.type) {//删除组
				message.success(`${param.deleteChart === 0 ? '分组删除成功，已保留看板' : '分组和看板删除成功'}`);
				//去掉删除的分组
				//todo 是否删除看板？
				this.setState({
					groupList: this.state.groupList.filter(item =>  item.id !== id),
					deleteGroupVisible: false,
				})
			}
			else {//删除看板
				message.success('看板删除成功');
				/*删除后跳第一个看板
				* 过滤掉删除的项*/
				let deleteIndex = -1, deleteGroupIndex = -1;

				//求看板所在分组下标
				this.state.groupList.forEach((item,i) => {
					item.board.length && item.board.forEach((j, k)=> {
						if (+j.id === +id) {
							deleteIndex = k;
							deleteGroupIndex = i;
						}
					})
				});

				//过滤掉列表中此项数据
				//todo 展示第一个看板的数据
				this.setState({
					groupList: update(this.state.groupList, {
						[deleteGroupIndex]: {
							board: {$splice: [[deleteIndex, 1]]}
						}
					}),
					deleteDashboardVisible: false,
				})

			}
			console.log(`${param.type === 1 ? '删除看板分组success' : '删除看板success'}：`, res);
		}).catch(err => {
			message.error('删除失败');
			console.log('deleteDashboardHttp', err);
		});
	};


	boardTitleOnChange = (e) => {
		this.setState({currentDashboardObj: {...this.state.currentDashboardObj, name: e.target.value}});
	};
	boardRemarkOnChange = (e) => {
		this.setState({currentDashboardObj: {...this.state.currentDashboardObj, remark: e.target.value}});
	};
	//失去焦点后编辑看板名称和备注
	updateDashboardOnBlur = () => {
		const { id,name,remark } = this.state.currentDashboardObj;
		this.updateDashboardHttp(id, {
			type: 0,name,remark
		})
	};
	updateDashboardHttp = (id, param) => {
		updateDashboardApi(id, param).then((res) => {
			message.success('编辑成功');

			const { groupList, currentDashboardObj } = this.state;
			let groupIndex = -1, panelIndex = -1;
			//1.获取被编辑的看板所在分组在groupList中的下标
			groupList.forEach((group, i) => {
				if (+group.id === +res.groupId) {
					groupIndex = i;
				}
			});
			if (groupIndex >= 0) {
				//2.获取被编辑的看板在board中的下标
				groupList[groupIndex].board.forEach((panel, j) => {
					if (+panel.id === +currentDashboardObj.id) {
						panelIndex = j
					}
				});

				if (panelIndex >= 0) {
					this.setState({
						//更新看板列表中被编辑的看板
						groupList: update(this.state.groupList, {
							[groupIndex]: {
								board: {
									[panelIndex]: {
										$merge: {...currentDashboardObj}
									}
								}
							}
						})
					})
				}
			}
		}).catch(() => {
			message.success('编辑失败，请检查网络')
		});
	};

	render () {
		const ReactSortableOptions = {
			group: "board",
			animation: 200,
		};
		const formItemLayout = {
			labelCol: {span: 7},
			wrapperCol: {span: 14},
			colon: false, // 隐藏冒号
		};

		const currentDashboardId = (this.props.location.state && this.props.location.state.id) || -1;
		return (
			<div className="dashboard-page">
				<div className="flex-left">
					<div className="left-head">
						<span>所有看板</span>
						<Popover
							placement="rightTop"
							overlayClassName={'dashboard-tooltip'}
							content={<div>
								<div className="dashboard-item" onClick={this.createDashboard}><IconFont type="iconlayer"/>创建看板</div>
								<div className="dashboard-item" onClick={this.createGroup}><IconFont type="iconfolder"/>创建看板分组</div>
							</div>}
							trigger="click"
							arrowPointAtCenter
						>
							<IconFont type="iconadd2"/>
						</Popover>
					</div>
					<div className="left-content">
						{/*容器*/}
						<ReactSortable
							group={{
								name: 'board',
								pull: false,
								put: true,
							}}
							animation={200}
							delayOnTouchStart={true}
							list={this.state.groupList}
							setList={this.dragGroup}
						>
							{
								//遍历看板组
								this.state.groupList.map((group) => (
									<div key={group.id} className="group-item">
										{/*看板分组标题*/}
										{ //group.id：0 无分组
											group.id > 0 ? <div className="group-title" onClick={this.handleOpenGroup(group.id)}>
													<IconFont type="iconright" className={cx('arrow', {'arrow-active': group.open})}/>
													<span className="name">{group.name}</span>
													<Popover
														placement="rightTop"
														overlayClassName={'dashboard-tooltip'}
														content={<div onClick={(e) => {e.stopPropagation()}}>
															<div className="dashboard-item" onClick={this.operateGroup(group, 'updateGroupVisible')}><IconFont type="iconedit"/>修改分组名称</div>
															<div className="dashboard-item error" onClick={this.operateGroup(group, 'deleteGroupVisible')}><IconFont type="icondelete2"/>删除分组</div>
														</div>}
														trigger="click"
														arrowPointAtCenter
													>
														<div className='more-box' onClick={(e) => {e.stopPropagation()}}>
															<IconFont type="iconmore" className='more'/>
														</div>
													</Popover>
												</div>
												//type：0为默认分组 不显示组名 且不可拖动
												: <div className="group-title" />
										}
										{/*看板列表*/}
										{
											group.id > 0
												? (
													<div>
														{
															group.open ? <ReactSortable
																	{...ReactSortableOptions}
																	key={group.id}
																	list={group.board}
																	className="dashboard-list"
																	setList={newState => this.dragItem(newState, group.id)}
																	delay={2}
																>
																	{
																		group.board.map(dashboard => {
																			return <div
																				key={dashboard.id}
																				className={cx('dashboard-item', {'dashboard-init': +dashboard.id === -1}, {'active': +currentDashboardId === +dashboard.id})}
																				onClick={this.showDashboardDetail(dashboard)}
																			>
																				<span>{dashboard.name}</span>
																				<Popover
																					placement="rightTop"
																					overlayClassName={'dashboard-tooltip'}
																					content={<div onClick={(e) => {e.stopPropagation()}}>
																						<div className="dashboard-item error" onClick={this.operateGroup(dashboard, 'deleteDashboardVisible')}><IconFont type="icondelete2"/>删除看板</div>
																					</div>}
																					trigger="click"
																					arrowPointAtCenter
																				>
																					<div className='more-box' onClick={(e) => {e.stopPropagation()}}>
																						<IconFont type="iconmore" className='more'/>
																					</div>
																				</Popover>
																			</div>
																		})
																	}
																</ReactSortable>
																: <div className="dashboard-item"/>
														}
													</div>
												)
												:	<ReactSortable
													className="dashboard-list"
													{...ReactSortableOptions}
													key={group.id}
													list={group.board}
													setList={newState => this.dragItem(newState, group.id)}
													delay={2}
												>
													{
														group.board.map(dashboard => {
															return <div key={dashboard.id} className={cx("dashboard-item", {'active': +currentDashboardId === +dashboard.id})}
																					onClick={this.showDashboardDetail(dashboard)}
															>
																<span>{dashboard.id === -1 ? '' : dashboard.name}</span>
																<Popover
																	placement="rightTop"
																	overlayClassName={'dashboard-tooltip'}
																	content={<div onClick={(e) => {e.stopPropagation()}}>
																		<div className="dashboard-item error" onClick={this.operateGroup(dashboard, 'deleteDashboardVisible')}><IconFont type="icondelete2"/>删除看板</div>
																	</div>}
																	trigger="click"
																	arrowPointAtCenter
																>
																	<div className='more-box' onClick={(e) => {e.stopPropagation()}}>
																		<IconFont type="iconmore" className='more'/>
																	</div>
																</Popover>
															</div>
														})
													}
												</ReactSortable>
										}
									</div>
								))
							}
						</ReactSortable>
					</div>

					{/*todo 当前版本没有*/}
					{/*<div className="left-footer">
						<span>
							<IconFont type="icontuichudenglu"/><span>公共图表库</span>
						</span>
						<IconFont type="icontuichudenglu"/>
					</div>*/}

					{
						!(this.state.groupList.length === 1 && this.state.groupList[0].type === 0) ? null : <div className='group-empty'>
							<div style={{marginBottom: '6px'}}>你还没有任何看板</div>
							<div className="active" onClick={this.createDashboard}><IconFont type="iconlayer"/>点击创建</div>
						</div>
					}
				</div>

				<div className="flex-right">

					{
						!(this.state.groupList.length === 1 && this.state.groupList[0].type === 0)
							? <Detail dashboardObj={this.state.currentDashboardObj}
												boardTitleOnChange={this.boardTitleOnChange}
												boardRemarkOnChange={this.boardRemarkOnChange}
												updateDashboardOnBlur={this.updateDashboardOnBlur}
							/>
							: <div className='group-empty'>请先创建一个看板</div>
					}
				</div>

				{/*创建看板*/}
				<ModalForm
					visibleName={"createDashboardVisible"}
					fields={[
						{
							label:"看板名称",
							name:"name",
							type: 'input',
							rules:[{ required: true }],
							itemProps: {
								autoComplete: 'off'
							},
							formItemProps: {
								required: false,
							}
						},
						{
							label:"看板说明",
							name:"remark",
							type: 'textarea',
						},
						{
							label:"选择分组",
							name:"groupId",
							type: 'select',
							// itemProps: {
							//
							// },
							items: () => {
								return this.state.groupList.map(item => {
									return {key: item.id, value: item.name}
								})
							},
						}
					]}
					cancel={this.handleCancelModal}
					confirm={this.confirmCreateDashboard}
					formProps={{
						...formItemLayout,
						initialValues: {
							groupId: '0'
						}
					}}
					modalProps={{
						width: 370,
						title: '创建看板',
						visible: this.state.createDashboardVisible,
					}}
				/>

				{/*编辑、创建看板分组*/}
				<ModalForm
					visibleName={this.state.operateGroupObj.id ? "updateGroupVisible": "createGroupVisible"}
					cancel={this.handleCancelModal}
					confirm={this.confirmCreateGroup}
					modalProps={{
						width: 370,
						title: this.state.operateGroupObj.id ? '修改分组名称' : '创建看板分组',
						visible: this.state.createGroupVisible || this.state.updateGroupVisible,
					}}
					formProps={{
						...formItemLayout,
					}}
					fields={
						[
							{
								label:"分组名称",
								name:"name",
								type: 'input',
								rules:[{ required: true }],
								itemProps: {
									autoComplete: 'off'
								},
								formItemProps: {
									required: false,
									initialValue: this.state.operateGroupObj.id ? this.state.operateGroupObj.name : undefined
								}
							},
						]
					}
				/>

				{/*删除看板分组*/}
				<ModalInfo
					cancel={this.handleCancelModal}
					confirm={this.confirmDeleteGroup}
					title={'确认删除看板分组吗？'}
					visibleName={'deleteGroupVisible'}
					visible={this.state.deleteGroupVisible}
					width={400}
					cancelButtonProps={{ghost: true}}
					children={<div>
						<p>删除看板分组默认不会删除组内看板</p>
						<Checkbox style={{marginTop: "10px"}} onChange={this.deleteGroupTypeChange}>同时删除看板及看板内图表</Checkbox>
					</div>}
				/>

				{/*删除看板*/}
				<ModalInfo
					cancel={this.handleCancelModal}
					confirm={this.confirmDeleteDashboard}
					title={'确认删除看板吗？'}
					visibleName={'deleteDashboardVisible'}
					visible={this.state.deleteDashboardVisible}
					width={400}
					cancelButtonProps={{ghost: true}}
					children={<div>
						<p>删除看板后会移除看板内所有图表</p>
					</div>}
				/>

			</div>
		)
	}
}


export default Dashboard
