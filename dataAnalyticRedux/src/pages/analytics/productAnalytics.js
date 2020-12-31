import React, { Fragment } from 'react';
import {
	Input,
	Button,
	Tooltip,
	Popover,//和 Tooltip 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。
	Select,
	DatePicker,
	Tabs,
	Tag,
	Radio,
} from 'antd'
import {ICON_FONT_URL} from '@config'
import {createFromIconfontCN} from "@ant-design/icons";
import ReactEcharts from 'echarts-for-react';
import cx from 'classnames'
import {
	analysisPropertiesApi,
} from '@api/dashboard'
import ModalForm from '@components/modalForm'
import { getBarChart, getLineChart, getPieChart } from "./chart";
import './productAnalytics.less'
import BaseComponent from '@components/BaseComponent'
import {update} from "immutable";

const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});
const SelectOption = Select.Option;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

class ProductAnalytics extends BaseComponent {
	state = {
		chartType: 'pie',
		// baseData: [], //元事件及其事件属性，及属性的值
		allIndicatorsList: [], //指标列表（事件）

		commonProperties: [], //展示维度 事件属性（common）


		indicatorsList: [], // 已选事件指标列表
		saveChartVisible: false, //保存看板弹窗
		filterParam: {
			"type": -1, //0-表格，1-折线图，2-柱状图，3-饼图，数值
			"name": "",	//图表名称
			"remark": "",
			"x": 0,
			"y":0,
			"width": 6,
			"height": 6,
			"event":[],//图表关联的分析事件
			// "event":[
			// 	{ //指标1
			// 		"id": 1,
			// 		"dataSource": "table1",
			// 		"eventId": "login",
			// 		"property": "USER_NUM",
			// 		"filte": [  // 指标属性
			// 			{
			// 				"condition": [  //属性条件
			// 					{
			// 						"property": "A", // 事件属性
			// 						"value": "", // 属性取值
			// 						"typeids": "" // 运算符
			// 					},
			// 					{},
			// 					{}
			// 				],
			// 				"filteRelation": "and", //条件集合之间的关系
			// 				"condRelation": "and"   //条件内部条件关系
			// 			},
			// 			{},
			// 			{}
			// 		],
			// 		"dimension": ["age", "date"],
			// 		"granularity": 1,
			// 		"timeFrame": ""
			// 	},
			// 	{
			//
			// 	}
			// ]
		}, //生成图表的查询条件
	};

	componentDidMount() {
		this.analysisPropertiesHttp();
	}
	//查询元事件数据
	analysisPropertiesHttp = () => {
		analysisPropertiesApi().then(res => {
			console.log('查询元事件数据', res);
			this.setState({
				allIndicatorsList: res
			})
		}).catch(err => {
			console.log('查询元事件数据', err)
		});

	};

	indicatorsTypeChange = (key) => {

	};

	switchChartType = (type) => {
		// console.log('switchChartType: ', type);
		this.setState({ chartType: type })
	};

	addPropertyCondition = (key) => {
		const state = this.state.allIndicatorsList.filter(item => item.id === key);
		this.setState({indicatorsList: this.state.indicatorsList.concat(state)})
	};

	addIndicators = (indicator) => {
		//1添加指标: 在 filterParam 的event中push
		console.log('indicator: ', indicator);
		const { id, name, } = indicator;
		const newFilterParam = update(this.state.filterParam, {
			event: {
				$push: [{
					id, name,
					filte: [],

				}]
			}
		});
		this.setState({ filterParam: newFilterParam })

		//2添加条件: 在 filterParam 的event的item 的 filte 中push
		// const state = this.state.allIndicatorsList.filter(item => item.id === key);
		// this.setState({indicatorsList: this.state.indicatorsList.concat(state)});
	};
	generateIndicators = (index) => {
		switch (index) {
			case 0:
				return <IconFont className={'line-prefix'} type="icona"/>;
			case 1:
				return <IconFont className={'line-prefix'} type="iconb"/>;
			case 2:
				return <IconFont className={'line-prefix'} type="iconc"/>;
			case 3:
				return <IconFont className={'line-prefix'} type="icond"/>;
			case 4:
				return <IconFont className={'line-prefix'} type="icone"/>;
			case 5:
				return <IconFont className={'line-prefix'} type="iconf"/>;
			default:
				return;
		}
	};

	//保存看板
	confirmSaveChart = () => {
		// console.log('保存看板')
	};

	sizeRadioOnChange = () => {
		// console.log('sizeRadioOnChange')
	};


	render () {
		const {
			chartType,
			filterParam,
			indicatorsList,
			allIndicatorsList,
		} = this.state;

		//todo 是否根据分析条件生成图表
		const chartEmptyFlag = false;
		//todo 给指标添加筛选条件
		const conditionList = [
			// {name:'屏幕宽度', id: 99},
			// {name:'屏幕宽度', id: 11},
			// {name:'屏幕宽度', id: 22},
			// {name:'屏幕宽度', id: 33},
			// {name:'屏幕宽度', id: 44},
		];
		const formItemLayout = {
			labelCol: {span: 3},
			wrapperCol: {span: 21},
			colon: false, // 隐藏冒号
		};

		return (
			<Fragment>
				<div className="content-layout-1 product-analytics">
					<div className="layout-1-left">
						<div className="left-head">
							<IconFont type="icontuichudenglu"/> <span className={'title'}>事件分析</span>
						</div>

						<div className="left-body">
							<div className={'indicators-wrap'}>
								<div className={'indicators-title'}>
									<span style={{marginRight: '6px'}}>选择事件指标</span>
									<Tooltip placement="rightTop" title={"需要分析的事件及事件的指标参数。例：需要分析启动App这个事件的不同指标，如启动App的次数、启动App的去重用户数、启动App的平均次数等"}>
										<IconFont style={{color: '#D5D3DE'}} type="iconinfo"/>
									</Tooltip>

								</div>
								{/*指标列表*/}
								{
									filterParam.event.length ? filterParam.event.map((indicator, index) => {
										return <div>
											<div className={'indicators-item'} key={indicator.id}>
												{this.generateIndicators(index)}
												<Popover placement="bottomLeft" title={''} trigger="click"
																 content={<div>
																	 <Input prefix={<IconFont type="iconsearch"/>}
																					placeholder="请输入"
																	 />
																	 <Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'indicator')}>
																		 <TabPane tab="事件属性" key="1">
																			 <div className={'indicators-type'}>
																				 <div className={'indicators-title'}>事件属性</div>
																				 {
																					 indicator.dimensions.length && indicator.dimensions.map(property => {
																						 return <div className={'indicators-value'}
																												 key={property.id}
																												 onClick={this.addPropertyCondition.bind(this, property.id)}
																						 >{property.name}</div>
																					 })
																				 }
																			 </div>

																		 </TabPane>
																		 <TabPane tab="公共属性" key="2">

																		 </TabPane>
																		 <TabPane tab="用户属性" key="3">

																		 </TabPane>
																	 </Tabs>
																 </div>}
												>
													<Button>{indicator.name}</Button>
												</Popover>
												的
												<Popover placement="bottomLeft" title={''} trigger="click"
																							content={<div>
																								<Input prefix={<IconFont type="iconsearch"/>}
																											 placeholder="请输入"
																								/>
																								<Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'indicator')}>
																									<TabPane tab="事件属性" key="1">
																										<div className={'indicators-type'}>
																											<div className={'indicators-title'}>事件属性</div>
																											{
																												indicator.dimensions.length && indicator.dimensions.map(property => {
																													return <div className={'indicators-value'}
																																			key={property.value}
																																			onClick={this.addPropertyCondition.bind(this, property.value)}
																													>{property.name}</div>
																												})
																											}
																										</div>
																									</TabPane>
																								</Tabs>
																							</div>}
											>
												<Button>用户数</Button>
											</Popover>
												<IconFont className={'del-icon'} type="icondelete2"/>

												<span>
													<IconFont className={'condition-icon'} type="iconfilter"/>
													筛选条件
												</span>
											</div>
											{/*指标条件列表*/}
											<div className={cx('indicator-conditions', {'condition-after': true})}>
												{indicator.filte.length && indicator.filte.map((condition, i) => {
													return <div className={'condition-item'}>
														<Popover placement="bottomLeft" trigger="click"
																		 content={<div>
																			 <Input prefix={<IconFont type="iconsearch"/>}
																							placeholder="请输入"
																			 />
																			 <Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'indicator')}>
																				 <TabPane tab="事件属性" key="1">
																					 <div className={'indicators-type'}>
																						 <div className={'indicators-title'}>事件属性</div>
																						 {
																							 allIndicatorsList.length && allIndicatorsList.map(property => {
																								 return <div className={'indicators-value'}
																														 key={property.value}
																														 onClick={this.addPropertyCondition.bind(this, property.value)}
																								 >{property.name}</div>
																							 })
																						 }
																						 {/*<div className={'indicators-value'}  onClick={this.addPropertyCondition.bind(this, 1)}>启动方式</div>*/}
																					 </div>
																					 <div className={'indicators-type'}>
																						 <div className={'indicators-title'}>公共属性</div>
																						 <div className={'indicators-value'}>城市</div>
																					 </div>
																					 <div className={'indicators-type'}>
																						 <div className={'indicators-title'}>用户属性</div>
																						 <div className={'indicators-value'}>性别</div>
																					 </div>
																				 </TabPane>
																			 </Tabs>
																		 </div>}
														>
															<Button>{indicator.name}</Button>
														</Popover>
														<Popover placement="bottomLeft" trigger="click"
																		 content={<div>
																			 <Input prefix={<IconFont type="iconsearch"/>}
																							placeholder="请输入"
																			 />
																			 <Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'indicator')}>
																				 <TabPane tab="事件属性" key="1">
																					 <div className={'indicators-type'}>
																						 <div className={'indicators-title'}>事件属性</div>
																						 {
																							 allIndicatorsList.length && allIndicatorsList.map(property => {
																								 return <div className={'indicators-value'}
																														 key={property.value}
																														 onClick={this.addPropertyCondition.bind(this, property.value)}
																								 >{property.name}</div>
																							 })
																						 }
																					 </div>
																				 </TabPane>
																			 </Tabs>
																		 </div>}
														>
															<Button style={{margin: '0 4px'}}>{indicator.name}</Button>
														</Popover>
														<Popover placement="bottomLeft" trigger="click"
																		 content={<div>
																			 <Input prefix={<IconFont type="iconsearch"/>}
																							placeholder="请输入"
																			 />
																			 <Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'indicator')}>
																				 <TabPane tab="事件属性" key="1">
																					 <div className={'indicators-type'}>
																						 <div className={'indicators-title'}>事件属性</div>
																						 {
																							 allIndicatorsList.length && allIndicatorsList.map(property => {
																								 return <div className={'indicators-value'}
																														 key={property.value}
																														 onClick={this.addPropertyCondition.bind(this, property.value)}
																								 >{property.name}</div>
																							 })
																						 }
																					 </div>
																				 </TabPane>
																			 </Tabs>
																		 </div>}
														>
															<Button>{indicator.name}</Button>
														</Popover>

														<Button className={'relation'}>或</Button>
													</div>
												})}
											</div>
										</div>
									}) : null
								}

								{/*增加指标按钮*/}
								<div className={'indicators-item'}>
									<IconFont className={'line-prefix'} type="iconadd2"/>
									<Popover
										placement="bottomLeft" title={''} trigger="click"
										content={<div>
											<Input prefix={<IconFont type="iconsearch"/>}
														 placeholder="请输入"
											/>
											<Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'indicator')}>
												<TabPane tab="元事件" key="1">
													<div className={'indicators-type'}>
														{/*<div className={'indicators-title'}>元事件</div>*/}
														{
															allIndicatorsList.length && allIndicatorsList.map(indicator => {
																return <div className={'indicators-value'}
																						key={indicator.id}
																						onClick={this.addIndicators.bind(this, indicator)}
																>{indicator.name}</div>
															})
														}
													</div>
												</TabPane>
											</Tabs>
										</div>}
									>
										<Button className={'title'}>请选择</Button>
									</Popover>
								</div>
							</div>

							<div className={'indicators-wrap'}>
								<div className={'indicators-title'}>
									<span style={{marginRight: '6px'}}>展示维度</span>
									<Tooltip placement="rightTop" title={"将数据按照指定分类进行展示。例：按性别维度展示启动App的用户数，则会分别展示男、女、未知三个分类下的数据。"}>
										<IconFont style={{color: '#D5D3DE'}} type="iconinfo"/>
									</Tooltip>
								</div>
								{/*维度列表*/}
								<div>

								</div>

								{/*增加维度按钮*/}
								<div className={'indicators-item'}>
									<Popover placement="bottomLeft" title={''} trigger="click"
													 content={<div>
														 <Input prefix={<IconFont type="iconsearch"/>}
																		placeholder="请输入"
														 />
														 <Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'dimension')}>
															 <TabPane tab="事件属性" key="1">
																 <div className={'indicators-type'}>
																	 <div className={'indicators-title'}>事件属性</div>
																	 <div className={'indicators-value'}>启动方式</div>
																 </div>
																 <div className={'indicators-type'}>
																	 <div className={'indicators-title'}>公共属性</div>
																	 <div className={'indicators-value'}>城市</div>
																 </div>
																 <div className={'indicators-type'}>
																	 <div className={'indicators-title'}>用户属性</div>
																	 <div className={'indicators-value'}>性别</div>
																 </div>
															 </TabPane>
															 <TabPane tab="公共属性" key="2">
																 <div className={'indicators-type'}>
																	 <div className={'indicators-title'}>公共属性</div>
																	 <div className={'indicators-value'}>城市</div>
																 </div>
															 </TabPane>
															 <TabPane tab="用户属性" key="3">
																 <div className={'indicators-type'}>
																	 <div className={'indicators-title'}>用户属性</div>
																	 <div className={'indicators-value'}>性别</div>
																 </div>
															 </TabPane>
														 </Tabs>
													 </div>}
									>
										<Button className={'title'}>请选择</Button>
									</Popover>
								</div>
							</div>
						</div>

						<div className="left-foot">
							<Button icon={<IconFont type="iconclean"/>}>清空</Button>
							<Button icon={<IconFont type="iconcaculate"/>} type={'primary'}>查询</Button>
						</div>
					</div>

					<div className="layout-1-right">
						<div className="inner">
							<div className={'right-head'}>
								<div className={'totle'}>编辑“各型号设备启动次数”</div>
								<div>
									<Button ghost={true} icon={<IconFont type="iconsave"/>}
													onClick={() => {this.setState({saveChartVisible: true})}}
									>保存</Button>
									{/*<Button ghost={true} icon={<IconFont type="iconsave_as"/>}>另存为</Button>*/}
									{/*<Button ghost={true} icon={<IconFont type="iconxiazai"/>}>下载图表</Button>*/}
								</div>
							</div>

							<div className={'right-content'}>
								<div className={'controls-bar'}>
									<div>
										<RangePicker
											style={{marginRight: '10px'}}
											renderExtraFooter={() => 'extra footer'}
											format="YYYY-MM-DD"
										/>
										<Select defaultValue="按日">
											<SelectOption key={0} value={'全部'}>全部</SelectOption>
											<SelectOption key={1} value={'全部'}>按日</SelectOption>
											<SelectOption key={2} value={'全部'}>按周</SelectOption>
											<SelectOption key={3} value={'全部'}>按月</SelectOption>
										</Select>
									</div>
									<div>
										<Tooltip placement="top" title={'线形图'}>
											<Button icon={<IconFont type="iconline"/>} onClick={this.switchChartType.bind(this, 'line')}
															className={cx({"ant-btn-active": chartType === "line"})}
											/>
										</Tooltip>
										<Tooltip placement="top" title={'柱状图'}>
											<Button icon={<IconFont type="iconcolume"/>} onClick={this.switchChartType.bind(this, 'bar')}
															className={cx({"ant-btn-active": chartType === "bar"})}
											/>
										</Tooltip>
										<Tooltip placement="top" title={'饼图'}>
											<Button icon={<IconFont type="iconcirclechart"/>} onClick={this.switchChartType.bind(this, 'pie')}
															className={cx({"ant-btn-active": chartType === "pie"})}
											/>
										</Tooltip>
										<Tooltip placement="top" title={'表格'}>
											<Button icon={<IconFont type="iconchart"/>} onClick={this.switchChartType.bind(this, 'form')}
															className={cx({"ant-btn-active": chartType === "form"})}
											/>
										</Tooltip>
										<Tooltip placement="top" title={'数值'}>
											<Button icon={<IconFont type="iconnumber"/>} onClick={this.switchChartType.bind(this, 'num')}
															className={cx({"ant-btn-active": chartType === "num"})}
											/>
										</Tooltip>
									</div>
								</div>

								<div className={'chart-box'}>
									<div className={'chart-scroll'}>
										{chartType === 'line' ? <ReactEcharts
											style={{minHeight: '100%'}}
											option={getLineChart()}
											notMerge={true}
											lazyUpdate={true}
											theme={"theme_name"}
										/> : null}
										{chartType === 'bar' ? <ReactEcharts
											style={{minHeight: '100%'}}
											option={getBarChart()}
											notMerge={true}
											lazyUpdate={true}
											theme={"theme_name"}
										/> : null}
										{chartType === 'pie' ? <ReactEcharts
											style={{minHeight: '100%'}}
											option={getPieChart()}
											notMerge={true}
											lazyUpdate={true}
											theme={"theme_name"}
										/> : null}
										{chartType === 'form' ? <ReactEcharts
											style={{minHeight: '100%'}}
											option={getLineChart()}
											notMerge={true}
											lazyUpdate={true}
											theme={"theme_name"}
										/> : null}
										{chartType === 'num' ? <ReactEcharts
											style={{minHeight: '100%'}}
											option={getLineChart()}
											notMerge={true}
											lazyUpdate={true}
											theme={"theme_name"}
										/> : null}

										{chartEmptyFlag ? <div className={'chart-box-empty'}>
											<div><IconFont type="iconsearch" className={'empty-icon'}/></div>
											<div className={'empty-text'}>请选择查询条件</div>
										</div> : null}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/*保存至看板*/}
				<ModalForm
					visibleName={"saveChartVisible"}
					cancel={this.handleCancelModal}
					confirm={this.confirmSaveChart}
					modalProps={{
						width: 576,
						title: "保存至看板",
						visible: this.state.saveChartVisible,
					}}
					formProps={{
						...formItemLayout,
						initialValues: {
							name3: '1'
						}
					}}
					fields={
						[
							{
								label:"图表名称",
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
								label:"图表说明",
								name:"remark",
								type: 'input',
								// rules:[{ required: true }],
								itemProps: {
									autoComplete: 'off'
								},
								formItemProps: {

								}
							},
							{
								label:"选择看板",
								name:"name222",
								type: 'select',
								rules:[{ required: true }],
								itemProps: {
									mode: "tags",
									tagRender: (props) => {
										const { label, value, closable, onClose } = props;

										return (
											<Tag color={value} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
												{label}
											</Tag>
										);
									},
								},
								formItemProps: {
									required: false,
								}
							},
							{
								label:"窗口尺寸",
								name:"name3",
								type: 'customRadio',
								// rules:[{ required: true }],
								itemProps: {
									radio: <Radio.Group onChange={this.sizeRadioOnChange}>
										<Radio.Button className={'chartSize small'} value="0"/>
										<Radio.Button className={'chartSize middle'} value="1"/>
										<Radio.Button className={'chartSize large'} value="2"/>
									</Radio.Group>
								},
								formItemProps: {

								}
							},
						]
					}
				/>
			</Fragment>
		)
	}
}


export default ProductAnalytics
