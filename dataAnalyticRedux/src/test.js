
import React, { Component } from 'react';
import { connect } from 'dva';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from "lodash";
//单个面板，我这有8个面板
import PortfolioTable from './component/portfolioTable'
import NoticeTable from './component/noticeTable'

import TrendChart from './component/trendChart'
import RedemptionChart from './component/redemptionChart'
import KeyChart from './component/keyChart'
import TradeTodayChart from './component/tradeTodayChart'
import AssetsChart from './component/assetsChart'

import MainCard from './component/mainCard'

import { Row, Col, Form, Button, Input, message, Select, Popconfirm, Checkbox } from 'antd';

import styles from './index.less'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const { Option } = Select;

const ResponsiveGridLayout = WidthProvider(Responsive);

@connect(({ user }) => ({ user }))
@Form.create()
class DragShow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEUorCP: 'CP',
			newConters: 0,
			compactType: "vertical",
			// layouts: { lg: props.initialLayout },
			// layouts: this.getFromLS('layouts'),
			widgets: [],
			obj: {
				"portfolioTable": <PortfolioTable />,
				"noticeTable": <NoticeTable />,
				"trendChart": <TrendChart />,
				"redemptionChart": <RedemptionChart />,
				"keyChart": <KeyChart />,
				"mainCard": <MainCard />,
				"tradeTodayChart": <TradeTodayChart />,
				"assetsChart": <AssetsChart />
			},
			isShowArr: [],
			modeList: [],
			editLayoutId: "",
		}
	}

	UNSAFE_componentWillMount() {

	};

	componentWillUnmount() {
		// componentWillMount进行异步操作时且在callback中进行了setState操作时，需要在组件卸载时清除state
		this.setState = () => {
			return;
		};
	}

	componentDidMount() {
		const { user: userMc } = this.props;
		//获取方案模板列表
		if (userMc) {
			this.getFromLS()
		}
	}

	componentDidUpdate(prevProps) {
		const { user: userMc } = this.props;
		const { user } = prevProps;
		if (user !== userMc) {
			this.getFromLS()
		}
	}

	//从服务器获取所有面板列表
	getFromService = () => {
		const { dispatch, user } = this.props;
		const { widgets } = this.state;
		if (user.currentUser.username)
			dispatch({
				type: "dragShow/findPritOverViewLayoutByPublic",
				payload: {
					"pageNum": 1,//页码  必填
					"pageSize": 20,//数量  必填
					// "name":"string",//面板名称    非必填
					"owner": user.currentUser.username//所属人（新建入）  非必填
				},
				callback: res => {
					if (res && res.resultCode === 200 && res.data) {
						this.setState({ modeList: res.data.list }, () => {
							this.setDefaultModel();
						});

					}
				}
			})
	}

	//存储拖拽移动的位置到缓存
	onLayoutChange = (current, layouts) => {
		// console.log(current);
		let EUlayoutArr = [];
		var index = -1;
		current.forEach(({ i, x, y, w, h }) => {
			index++;
			EUlayoutArr[index] = { i, x, y, w, h };
		})
		this.setState({ widgets: EUlayoutArr });
	}

	//获取默认模板，并渲染
	setDefaultModel = () => {
		const { modeList } = this.state;
		if (modeList.length === 1) {
			//只有一条数据，是默认公共模板，公共模板不可删除
			this.changeModeList(modeList[0].layoutId);
			// setFieldsValue({modellist:modeList[0].layoutId})
		} else if (modeList.length > 1) {
			const defaultModel = modeList.find(item => item.isDefault === 1);
			defaultModel ?
				this.changeModeList(defaultModel.layoutId) :
				this.changeModeList(modeList[0].layoutId);
		}
	}

	// 删除项目
	onRemoveItem(i) {
		//i  项目-面板
		const { widgets, isShowArr } = this.state;
		this.setState({
			//面板过滤掉 删除项目，以及左侧内容过滤
			widgets: widgets.filter(item => item.i !== i), isShowArr: isShowArr.filter(item => { return item !== i.split('-')[1] })
		})
		localStorage.setItem('layouts', JSON.stringify(widgets))
	}


	//添加单个面板
	addMoudle = (mode, type) => {
		const { newConters, widgets, isShowArr } = this.state;
		const addItem = {
			i: `${mode}-${type}`,
			x: 0,
			y: 0,
			w: 6,
			h: 8,
		}
		isShowArr.push(type)
		widgets.push(addItem)
		this.setState({
			widgets, newConters: newConters + 1, isShowArr: [...new Set(isShowArr)]
		})
	}

	//初始化时，加载左侧面板
	setPanelShow = () => {
		const { widgets, obj } = this.state;
		return _.map(widgets, (l, i) => {
			let component = obj[l.i.split("-")[1]];
			return (
				<div className='drag' key={l.i} data-grid={l} style={{ background: '#222A39' }}>
					<div className="deleteTag" onClick={() => this.onRemoveItem(l.i)}>×</div>
					<div className="dragcontent">
						{component}
					</div>
				</div>
			)
		})
	}

	//左侧显示面板
	isShowComponent = (mode, type) => {
		const { isShowArr, obj } = this.state;
		return (isShowArr.find(item => item === type) ? "" : <div className="leftItem" onClick={() => this.addMoudle(mode, type)}>{obj[type]}</div>)
	}

	// 输入方案模型名称
	onChangeModelName = (value) => {
	}

	//保存方案模板
	onSave = () => {
		const { dispatch, user, form: { getFieldValue } } = this.props;
		const { widgets, editLayoutId, modeList,isdefalutCheck } = this.state;
		if (!getFieldValue("modelName")) {
			message.error("请先输入面板名称");
			return false;
		}
		if (modeList.find(item => item.name === getFieldValue("modelName")) && editLayoutId === "") {
			message.error("该面板已存在，请修改面板名称");
			return false;
		}
		const currentModel = modeList.find(item => item.layoutId === editLayoutId);
		if (currentModel && currentModel.layoutShortCode === "public") {
			message.error('不能修改公共默认模板，请知悉')
			return false;
		}
		const contentJson = [];
		widgets.map(item => {
			const obj = {};
			obj.widgetId = item.i;
			obj.height = item.h;
			obj.width = item.w;
			obj.xaxis = item.x;
			obj.yaxis = item.y;
			contentJson.push(obj);
		})
		let payload = {
			"contentJson": contentJson,
			"owner": user.currentUser.username,
			"name": getFieldValue("modelName"),
			"layoutId": editLayoutId,
			"isDefault":isdefalutCheck?1:0
		}
		const typeurl = editLayoutId ? "dragShow/editPritOverViewLayout" : "dragShow/addPritOverViewLayout";
		dispatch({
			type: typeurl,
			payload: payload,
			callback: res => {
				if (res && res.resultCode === 200) {
					message.success(res.resultMsg)
				} else {
					message.error(res.resultMsg)
				}
			}
		})
	}

	//重置
	onReset = () => {
		const { form: { setFieldsValue } } = this.props;
		setFieldsValue({ modelName: "",modellist:"" });
		this.setState({ editLayoutId: "",isdefalutCheck:false });
	}

	//选择方案模型列表中的一个，渲染
	changeModeList = (value) => {
		const { modeList } = this.state;
		const {
			form: { setFieldsValue }
		} = this.props;
		const current = modeList.find(item => item.layoutId === value);
		// 面板
		const currentArr = [];
		const iscurShowArr = [];
		if (current && current.contentJson) {
			current.contentJson.map(item => {
				let obj = {};
				obj.i = item.widgetId;
				obj.h = Number(item.height);
				obj.w = Number(item.width);
				obj.x = Number(item.xaxis);
				obj.y = Number(item.yaxis);
				iscurShowArr.push(item.widgetId.split('-')[1]);
				currentArr.push(obj);
			})
			setFieldsValue({ modelName: current.name })
			setFieldsValue({ modellist: current.layoutId })
			this.setState({ widgets: currentArr, isShowArr: iscurShowArr, editLayoutId: current.layoutId })
		}
	}

	//删除一个模板
	delPritOverViewLayout = () => {
		const { dispatch, user } = this.props;
		const { editLayoutId, modeList } = this.state;
		const currentModel = modeList.find(item => item.layoutId === editLayoutId);
		if (currentModel && currentModel.layoutShortCode === "public") {
			message.error('不能删除公共默认模板，请知悉')
			return false;
		}
		if (user.currentUser.username) {
			dispatch({
				type: "dragShow/delPritOverViewLayout",
				payload: {
					"layoutId": editLayoutId,
					"owner": user.currentUser.username//所属人（新建入）  非必填
				},
				callback: res => {
					if (res && res.resultCode === 200) {
						message.success(res.resultMsg)
						this.setDefaultModel();
					} else {
						message.error(res.resultMsg)
					}
				}
			})
		}
	}

	//选中或者不选中是否为默认
	onChangeCheck = (e) => {
		this.setState({isdefalutCheck:e.target.checked})
	}

	render() {
		const { widgets, modeList, editLayoutId ,isdefalutCheck} = this.state;
		const {
			form: { getFieldDecorator }
		} = this.props;
		const options = modeList.map(item => <Option key={item.layoutId}>{item.name}</Option>)
		return (
			<div style={{ margin: 20 }} className={styles.dragShow}>
				<div className="tablebg" style={{ padding: 10, marginBottom: 10 }}>
					<div className="search-box">
						<Form layout="inline">
							<Form.Item label='面板列表'>
								{getFieldDecorator(`modellist`)(<Select style={{ width: '120px' }} onChange={this.changeModeList} >{options}</Select>)}
							</Form.Item>
							<Form.Item label='面板名称'>
								{getFieldDecorator(`modelName`)(<Input disabled={editLayoutId !== ""} style={{ width: '120px' }} onChange={this.onChangeModelName} />)}
							</Form.Item>
							<Checkbox checked = {isdefalutCheck} onChange={this.onChangeCheck}>设为默认面板</Checkbox>
							<Button style={{ marginTop: '3px', marginRight: 10 }} type='dashed' onClick={this.onSave}>保存</Button>
							<Button style={{ marginTop: '3px', marginRight: 10 }} className="greyButton" onClick={this.onReset}>重置</Button>
							{/* <Button style={{ marginTop: '3px', marginRight: 10 }} className='buleButton' onClick={this.onSave}>设为默认</Button> */}
							<Popconfirm title="确定删除该项吗？" onConfirm={() => this.delPritOverViewLayout()}>
								<Button style={{ marginTop: '3px', marginRight: 10 }} className="greyButton" >删除</Button>
							</Popconfirm>
						</Form>
					</div>
				</div>
				<Row>
					<Col span={4} style={{ paddingRight: 10 }}>
						<div className="leftbox" >
							{this.isShowComponent('tz', 'portfolioTable')}
							{this.isShowComponent('tz', 'trendChart')}
							{this.isShowComponent('tz', 'redemptionChart')}
							{this.isShowComponent('tz', 'keyChart')}
							{this.isShowComponent('tz', 'mainCard')}
							{this.isShowComponent('tz', 'tradeTodayChart')}
							{this.isShowComponent('tz', 'noticeTable')}
							{this.isShowComponent('tz', 'assetsChart')}
						</div>
					</Col>
					<Col span={20} style={{ paddingLeft: 10 }}>
						<div className="rightbox" >
							{/* 交易员和基金经理区分模块显示 */}
							<ResponsiveGridLayout className="layout" layouts={{ lg: widgets }} rowHeight={30}
																		breakpoints={{ lg: 768, md: 768, sm: 768, xs: 768, xxs: 0 }}
																		cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
																		isResizable={true}
																		onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
																		margin={[10, 10]}
																		isDraggable={true}
																		measureBeforeMount={false}
																		useCSSTransforms={true}
								// onBreakpointChange={this.onBreakpointChange}
																		preventCollision={!this.state.compactType}
							>
								{this.setPanelShow()}
							</ResponsiveGridLayout>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export default DragShow;

