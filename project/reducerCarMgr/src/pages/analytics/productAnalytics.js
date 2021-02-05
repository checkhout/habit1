import React, { Fragment } from 'react';
import {
	Input,
	Button,
	Tooltip,
	Popover,
	Select,
	DatePicker,
	Tabs,
	Tag,
	Radio,
	message,
	Table,
} from 'antd'
import _ from 'lodash'
import moment from '@components/moment'
import {ICON_FONT_URL} from '@config'
import {createFromIconfontCN} from "@ant-design/icons";
import ReactEcharts from 'echarts-for-react';
import cx from 'classnames'
import {
	analysisPropertiesApi,
	dashboardListApi,
	addAnalysisChartApi,
} from '@api/dashboard'
import ModalForm from '@components/modalForm'
import { getBarChart, getLineChart, getPieChart } from "./chart";
import './productAnalytics.less'
import BaseComponent from '@components/BaseComponent'
import update from 'immutability-helper'
import {
	formatMetrics,
	formatTypeids,
	formatFormColumns,
	formatFormDataSource,
} from './filter'
import {
	analysisSubmitApi,
} from '@api/analytics'



const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});
const SelectOption = Select.Option;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

class ProductAnalytics extends BaseComponent {
	state = {
		chartType: 'line',
		// baseData: [], //元事件及其事件属性，及属性的值
		baseEvent: [], //元事件


		commonProperties: [], //展示维度 事件属性（common）
		allPanel: [], //全部看板

		saveChartVisible: false, //保存看板弹窗
		//分析条件UI控制
		analyticsFilter: {
			// "type": -1,
			// "name": "",
			// "remark": "",
			// "x": 0,
			// "y":0,
			// "width": 6,
			// "height": 6,
			"granularity": 4,//粒度：0-不分组，1-按秒分组，2-按分钟分组，3-按小时分组，4-按天分组，5-按周分组，6-按月分组，7-按季度分组，8-按年分组
			"timeFrame": {//默认为近七天
				start: moment().startOf("day").subtract(6, 'days').unix()*1000,
				end: moment().endOf("day").unix()*1000,
				name: '',//可不传, 显示的时间信息，如：近7天
			},//查询的时间范围
			"event":[],//图表关联的分析事件
			dimensions: [],//选中的维度
		}, //生成图表的查询条件

		chartData: [], //图表数据
	};
	//分析条件查询参数 等于 state中的analyticsFilter.event
	analyticsParam = [
		/*{
			"dataSrc": "",
			"eventId": "",//事件id
			"kind": {
					name: dimensions[0].name,
					code: dimensions[0].code,
					metric: dimensions[0].metric[0] || "",
			 },//事件指标
			"dimension": [],//维度
			"filter": [
				// 条件组
				{
					"condRelation": "or",  //该condition列表间的关系
					"filterRelation": "and",//condition与上个condition的关系
					"condition": [
						//条件
						{
							"code": "",//key
							"value": [],
							"typeids": ""//关系
						}
					]
				}
			],
		}*/
	];


	componentDidMount() {
		this.analysisPropertiesHttp();
		this.panelListHttp();
	}
	//获取看板列表
	panelListHttp = () => {
		dashboardListApi().then(res => {
			let allPanel = [];
			// console.log( '获取看板列表2 res：',res);
			allPanel = [...res.board];
			res.group.forEach(group => {
				if (group.board && group.board.length) {
					allPanel = allPanel.concat(group.board)
				}
			});
			allPanel = _.map(allPanel, item => {
				return {...item, key: item.id, value: item.name}
			});

			this.setState({allPanel})

		}).catch(err => {
			// console.log( '获取看板列表2 err：',err);
		});
	};
	//查询元事件数据
	analysisPropertiesHttp = () => {
		analysisPropertiesApi().then(res => {
			// console.log('查询元事件数据', res);
			this.setState({
				baseEvent: res,
			})
		}).catch(err => {
			// console.log('查询元事件数据', err)
		});

	};

	indicatorsTypeChange = (key) => {

	};

	switchChartType = (type) => {
		// console.log('switchChartType: ', type);
		this.setState({ chartType: type })
	};
	//更新维度可选列表
	updateAllDimensions = newDimensions => {
		// 更新维度可选列表，需将 this.state.analyticsFilter.dimensions 作为筛选条件之一
		let commonProperties = [...this.state.commonProperties];

		newDimensions.forEach((dimension) => {
			if (commonProperties.filter(filte => filte.code === dimension.code).length === 0
				&& this.state.analyticsFilter.dimensions.filter(item => item.code === dimension.code).length === 0) {
				commonProperties.push(dimension)
			}
		});

		this.setState({
			commonProperties,
		});
	};

	//添加指标
	addIndicators = (baseEvent) => {
		// console.log('添加的指标: ', baseEvent);
		const { id, name, dimensions, datasrc } = baseEvent;
		const newFilterParam = update(this.state.analyticsFilter, {
			event: {
				$push: [{
					id,
					name,
					dimensions,
					filter: [],
					kind: dimensions[0],
				}]
			}
		});
		this.setState({
			analyticsFilter: newFilterParam,
		});
		this.updateAllDimensions(dimensions);
		this.analyticsParam = update(this.analyticsParam, {
			$push: [{
				eventId: id,
				granularity: 4,//默认按天分组
				datasrc,
				kind: {
					name: dimensions[0].name,
					code: dimensions[0].code,
					metric: dimensions[0].metrics[0] || '',
				},//事件-指标value，默认为第一个
				dimension: [], //维度需要手动添加，没有默认值
				filter: [],
			}]
		});
	};
	//切换指标 (新指标， 在event中的下标，在元事件列表中的下标)
	switchIndicator = (indicator, index) => {
		const analyticsFilter = update(this.state.analyticsFilter, {
			event: {
				$splice: [[index, 1, {
					...indicator,
					filter: [],
					kind: indicator.dimensions[0],
				}]],
			}
		});
		this.setState({analyticsFilter});
		this.updateAllDimensions(indicator.dimensions);
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				$merge: {
					filter: [],
					kind: {
						name: indicator.dimensions[0].name,
						code: indicator.dimensions[0].code,
						metric: indicator.dimensions[0].metrics[0] || '',
					},
				}
			}
		});
	};
	//切换指标值
	indicatorSwitchValue = (dimension, index) => {
		// console.log("切换的指标值: ", dimension);
		const analyticsFilter = update(this.state.analyticsFilter, {
			event: {
				[index]: {
					$merge: {
						kind: dimension
					}
				}
			}
		});
		this.setState({analyticsFilter});
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				kind: {
					$merge: {
						name: dimension.name,
						code: dimension.code,
						metric: dimension.metrics[0] || '',
					}
				}
			}
		});
	};
	//指标修改聚合方式 analyticsFilter.event[index].metricsProperty
	switchMetricsProperty = (metrics, index) => {
		// console.log('修改的聚合方式', metrics);
		const state = this.state.analyticsFilter;
		const analyticsFilter = update(state, {
			event: {
				[index]: {
					kind: {
						$merge: {metric: metrics}
					}
				}
			}
		});
		this.setState({analyticsFilter});
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				$merge: {metricsProperty: metrics}
			}
		});
	};
	//删除指标
	deleteIndicator = (index) => {
		const analyticsFilter = update(this.state.analyticsFilter, {
			event: {
				$splice: [[index, 1]]
			}
		});
		this.setState({analyticsFilter}, () => {
			//清空已选指标的公共维度，重新求公共指标
			let commonProperties = [];
			this.state.analyticsFilter.event.forEach((selectEvent) => {
				selectEvent.dimensions.forEach(dimension => {
					if (commonProperties.filter(filte => filte.code === dimension.code).length === 0) {
						commonProperties.push(dimension)
					}
				})
			});

			this.setState({
				commonProperties
			})
		});

		this.analyticsParam = update(this.analyticsParam, {
			$splice: [[index, 1]]
		});
	};
	//给指标添加条件组
	addIndicatorCondition = (index) => {
		const defaultCondition = this.state.analyticsFilter.event[index].dimensions[0];
		// console.log('添加的默认条件：', defaultCondition);
		const analyticsFilter = update(this.state.analyticsFilter, {
			event: {
				[index]: {
					filter: {
						//去条件列表默认取第一条, 就是选中元事件的事假属性
						$push: [{
							uiid: Date.now(),//用来遍历的key
							condRelation: 'and',
							filterRelation: 'and',
							condition: [
								{
									...defaultCondition,
									currentTypeids: defaultCondition.typeids[0],//UI展示
								}
							],
						}]
					}
				}
			}
		});
		this.setState({analyticsFilter});
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				filter: {
					$push: [{
						condRelation: 'and',//默认值
						filterRelation: 'and',
						condition: [{
							code: defaultCondition.code,
							value: "",
							typeids: defaultCondition.typeids[0],
						}]
					}]
				}
			}
		});
	};
	//删除条件组中的条件
	deleteCondition = ( index, condindex, i ) => {
		const state = this.state.analyticsFilter;
		let analyticsFilter = update(state, {
			event: {
				[index]: {
					filter: {
						[i]: {
							condition: {
								$splice: [[condindex, 1]]
							}
						}
					}
				}
			}
		});
		//当条件组无条件时删除该条件组
		if (!analyticsFilter.event[index].filter[i].condition.length) {
			analyticsFilter = update(state, {
				event: {
					[index]: {
						filter: {
							$splice: [[i, 1]]
						}
					}
				}
			});

			this.analyticsParam = update(this.analyticsParam, {
				[index]: {
					filter: {
						$splice: [[i, 1]]
					}
				}
			});
		}
		else {
			this.analyticsParam = update(this.analyticsParam, {
				[index]: {
					filter: {
						[i]: {
							condition: {
								$splice: [[condindex, 1]]
							}
						}
					}
				}
			});
		}
		this.setState({analyticsFilter});

	};
	//在条件组添加条件 analyticsFilter.event[index].filte[i].condition[condindex]
	addCondition = (index, condindex, i ) => {
		const state = this.state.analyticsFilter;
		const analyticsFilter = update(state, {
			event: {
				[index]: {
					filter: {
						[i]: {
							condition: {
								$push: [{
									...state.event[index].dimensions[0],
									currentTypeids: state.event[index].dimensions[0].typeids[0],//UI展示
								}]
							},
						}
					}
				}
			}
		});
		this.setState({analyticsFilter});
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				filter: {
					[i]: {
						condition: {
							$push: [{
								code: state.event[index].dimensions[0].code,
								value: '',
								typeids: state.event[index].dimensions[0].typeids[0],
							}]
						},
					}
				}
			}
		});
	};
	//切换条件 analyticsFilter.event[index].metricsProperty
	switchCondition = (index, i, condindex, dimension) => {
		// console.log('切换的条件: ', dimension);
		const state = this.state.analyticsFilter;
		const analyticsFilter = update(state, {
			event: {
				[index]: {
					filter: {
						[i]: {
							condition: {
								[condindex]:{
									$set: {
										...dimension,
										currentTypeids: dimension.typeids[0],//UI展示
									}
								}
							}
						}
					}
				}
			}
		});
		this.setState({analyticsFilter});
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				filter: {
					[i]: {
						condition: {
							[condindex]:{
								$set: {
									code: dimension.code,
									value: "",
									typeids: dimension.typeids[0],
								}
							}
						}
					}
				}
			}
		});
	};
	//切换条件间的关系 analyticsFilter.event[index].filter[i].condRelation
	switchCondRelation = (typeids, index, i, condindex) => {
		const state = this.state.analyticsFilter;
		const analyticsFilter = update(state, {
			event: {
				[index]: {
					filter: {
						[i]: {
							condition: {
								[condindex]: {
									$merge: {
										currentTypeids: typeids,//UI展示
									}
								}
							}
						}
					}
				}
			}
		});
		this.setState({analyticsFilter});
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				filter: {
					[i]: {
						condition: {
							[condindex]: {
								$merge: {typeids: typeids}
							}
						}
					}
				}
			}
		});
	};
	//切换条件值
	onSearchConditionValue = (value, index, i, condindex) => {
		// console.log('条件的值', searchText);
		if (value.length) {
			const analyticsFilterState = update(this.state.analyticsFilter, {
				event: {
					[index]: {
						filter: {
							[i]: {
								condition: {
									[condindex]: {
										$merge: {value: value}
									}
								}
							}
						}
					}
				}
			});
			this.setState({analyticsFilter: analyticsFilterState});
			this.analyticsParam = update(this.analyticsParam, {
				[index]: {
					filter: {
						[i]: {
							condition: {
								[condindex]: {
									$merge: {value: value}
								}
							}
						}
					}
				}
			});
		}
	};
	//切换条件组内条件之间的关系
	switchConditionRelation = (index, i, relation) => {
		// console.log('切换前的关系', relation);
		const analyticsFilter = update(this.state.analyticsFilter, {
			event: {
				[index]: {
					filter: {
						[i]: {
							$merge: {
								condRelation: relation === 'or' ? 'and' : 'or'
							}
						}
					}
				}
			}
		});
		this.setState({analyticsFilter});
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				filter: {
					[i]: {
						$merge: {
							condRelation: relation === 'or' ? 'and' : 'or'
						}
					}
				}
			}
		});
	};
	//切换条件组之间的关系
	conditionGroupSwitchRelation = (index, i, relation) => {
		// console.log('切换前的关系', relation);
		const analyticsFilter = update(this.state.analyticsFilter, {
			event: {
				[index]: {
					filter: {
						[i]: {
							$merge: {
								filterRelation: relation === 'or' ? 'and' : 'or'
							}
						}
					}
				}
			}
		});
		this.setState({analyticsFilter});
		this.analyticsParam = update(this.analyticsParam, {
			[index]: {
				filter: {
					[i]: {
						$merge: {
							filterRelation: relation === 'or' ? 'and' : 'or'
						}
					}
				}
			}
		});
	};
	//增加分析维度
	addDimension = (dimension) => {
		// console.log('增加de分析维度', dimension);
		// 增加一个维度，commonProperties 中移去该维度
		const {
			code,
			// name
		} = dimension;
		const analyticsFilter = update(this.state.analyticsFilter, {
			dimensions: {
				$push: [dimension]
			}
		});
		this.setState({
			analyticsFilter,
			commonProperties: this.state.commonProperties.filter(item => item.code !== code)
		});
	};
	//删除分析维度
	deleteDimension = (dimension) => {
		// 删除一个维度，commonProperties 中插入该维度
		const { analyticsFilter, commonProperties  } = this.state;
		let commonEvent = [...commonProperties];
		if (commonEvent.filter(ev => ev.code === dimension.code).length === 0) {
			commonEvent.push(dimension);
		}

		const analytics = analyticsFilter.dimensions.filter(item => item.code !== dimension.code);
		const analyticsFilte = update(analyticsFilter, {
			dimensions: {
				$set: analytics
			}
		});

		this.setState({
			analyticsFilter: analyticsFilte,
			commonProperties: commonEvent,
		});
	};
	//切换分析维度
	switchDimension = (newDimension, dimension, dindex) => {
		// 切换分析维度，commonProperties 中移除将切换的维度，push被切换的维度
		const { analyticsFilter, commonProperties  } = this.state;
		let commonEvent = [...commonProperties];
		commonEvent = commonEvent.filter(ev => ev.code !== newDimension.code);
		commonEvent.push(dimension);

		const analyticsFilte = update(analyticsFilter, {
			dimensions: {
				$splice: [[dindex, 1, newDimension]]
			}
		});

		this.setState({
			analyticsFilter: analyticsFilte,
			commonProperties: commonEvent,
		});
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

	// analyticsAndSaveParam = {}; //todo 查询和保存公用参数
	//保存看板
	confirmSaveChart = (values) => {
		// console.log('保存看板', values);
		const {
			analyticsFilter:{ dimensions, timeFrame, granularity  },
			chartType,
		} = this.state;
		const { name, remark, panels, size } = values;
		let param = {
			name,
			remark,
			timeFrame,
			granularity,
		};
		param.dimension = _.map(dimensions, (dimension) => {
			return {name: dimension.name, code: dimension.code}
		});
		param.analysis = this.analyticsParam;

		let idStr = '';
		panels.forEach(id => {
			if (idStr) {
				idStr = `${idStr},${id}`
			}
			else {
				idStr = `${id}`
			}
		});
		const query = {
			ids: idStr
		};
		switch (size) {
			case '0':
				param.width = 3;
				param.height = 2;
				break;
			case '1':
				param.width = 6;
				param.height = 3;
				break;
			case '2':
				param.width = 12;
				param.height = 3;
				break;
			default:
				break;
		}
		//0-表格，1-折线图，2-柱状图，3-饼图，4-数值
		switch (chartType) {
			case 'line':
				param.type = 1;
				break;
			case 'bar':
				param.type = 2;
				break;
			case 'pie':
				param.type = 3;
				break;
			case 'form':
				param.type = 0;
				break;
			case 'num':
				param.type = 4;
				break;
			default:
				break;
		}
		// console.log('保存看板参数', query, param);
		addAnalysisChartApi(query, param).then(res => {
			// console.log( '查询结果',res);
		}).catch(err => {
			// console.log('查询错误',err)
		});
		this.setState({
			saveChartVisible: false
		});
		message.success("保存成功")
	};

	//提交分析
	analyticsSubmit = () => {
		const { analyticsFilter:{ dimensions, timeFrame, granularity  } } = this.state;
		let param = { timeFrame, granularity };

		param.dimension = _.map(dimensions, (dimension) => {
			return {name: dimension.name, code: dimension.code}
		});
		param.analysis = this.analyticsParam;

		analysisSubmitApi(param).then(res => {
			// console.log( '查询结果',res);
			console.log('图表数据', res.data);
			const states = {
				chartData: res.data
			};
			if (res.data.eventList.length > 1) {
				states.chartType = 'pie';
			}
			this.setState({...states})
		}).catch(err => {
		    // console.log('查询错误',err)
		});
	};

	//切换分析时间
	switchAnalyticsTimeFrame = (dates, dateStrings) => {
		// console.log('切换分析时间', dates, dateStrings);
		if (dates) {
			// console.log(dates[0].unix() * 1000);
			// console.log(dates[1].unix() * 1000);
			this.setState({
				analyticsFilter: update(this.state.analyticsFilter, {
					timeFrame: {
						$merge: {
							start: dates[0].unix() * 1000,
							end: dates[1].unix() * 1000,
						}
					}
				})
			}, () => {
				this.analyticsSubmit();
			})
		}
	};
	//切换粒度
	switchGranularity = (value) => {
		this.setState({
			analyticsFilter: update(this.state.analyticsFilter, {
				granularity: {$set: value}
			})
		}, () => {
			this.analyticsSubmit();
		})
	};

	render () {
		const {
			chartType,
			chartData,
			analyticsFilter,
			commonProperties,
			baseEvent,
		} = this.state;

		//todo 是否根据分析条件生成图表
		const chartEmptyFlag = Boolean(chartData.seriesList && chartData.seriesList.length);
		//
		const onlyPieAndForm = Boolean(chartData.eventList && chartData.eventList.length > 1);

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
							{/*选择事件指标*/}
							<div className={'indicators-wrap'}>
								<div className={'indicators-title'}>
									<span style={{marginRight: '6px'}}>选择事件指标</span>
									<Tooltip placement="rightTop" title={"需要分析的事件及事件的指标参数。例：需要分析启动App这个事件的不同指标，如启动App的次数、启动App的去重用户数、启动App的平均次数等"}>
										<IconFont style={{color: '#D5D3DE'}} type="iconinfo"/>
									</Tooltip>

								</div>
								{/*指标列表*/}
								{
									analyticsFilter.event.length ? analyticsFilter.event.map((indicator, index) => {
										return <div key={indicator.id}>
											<div className={'indicators-item'} key={indicator.id}>
												{this.generateIndicators(index)}
												{/*事件*/}
												<Popover placement="bottomLeft" title={''} trigger="click"
																 content={<div>
																	 <Input prefix={<IconFont type="iconsearch"/>}
																					placeholder="请输入"
																	 />
																	 <Tabs defaultActiveKey="1"
																		 // onChange={this.indicatorsTypeChange.bind(this, 'indicator')}
																	 >
																		 <TabPane tab="元事件" key="1">
																			 <div className={'indicators-type'}>
																				 {/*<div className={'indicators-title'}>元事件</div>*/}
																				 {
																					 baseEvent.length && baseEvent.map((indicator) => {
																						 return <div className={'indicators-value'}
																												 key={indicator.id}
																												 onClick={this.switchIndicator.bind(this, indicator, index)}
																						 >{indicator.name}</div>
																					 })
																				 }
																			 </div>
																		 </TabPane>
																	 </Tabs>
																 </div>}
												>
													<Button>{indicator.name}</Button>
												</Popover>
												&nbsp;&nbsp;的&nbsp;&nbsp;
												{/*指标*/}
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
																					 indicator.dimensions.length ? indicator.dimensions.map(dimension => {
																						 return <div className={'indicators-value'}
																												 key={dimension.code}
																												 onClick={this.indicatorSwitchValue.bind(this, dimension, index)}
																						 >{dimension.name}</div>
																					 }) : null
																				 }
																			 </div>
																		 </TabPane>
																	 </Tabs>
																 </div>}
												>
													<Button>{indicator.kind.name}</Button>
												</Popover>

												{//聚合方式
													indicator.kind.metrics.length ?
														<Popover placement="bottomLeft" title={''} trigger="click"
																		 content={<div>
																			 <Input prefix={<IconFont type="iconsearch"/>}
																							placeholder="请输入"
																			 />
																			 <Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'indicator')}>
																				 <TabPane tab="聚合方式" key="1">
																					 <div className={'indicators-type'}>
																						 {/*<div className={'indicators-title'}>聚合方式</div>*/}
																						 {
																							 indicator.kind.metrics.map((metrics, m) => {
																								 return <div className={'indicators-value'} key={`${metrics ? metrics : Date.now() + m}`}
																														 onClick={this.switchMetricsProperty.bind(this, metrics, index)}
																								 >{formatMetrics(metrics)}</div>
																							 })
																						 }
																					 </div>
																				 </TabPane>
																			 </Tabs>
																		 </div>}
														>
															<Button style={{marginLeft: '4px'}}>{formatMetrics(indicator.metricsProperty || indicator.kind.metrics[0])}</Button>
														</Popover> : null
												}

												<IconFont className={'del-icon'} type="icondelete2" onClick={this.deleteIndicator.bind(this, index)}/>
												{/*增加筛选条件组*/}
												<span style={{cursor: 'pointer', whiteSpace: 'nowrap'}} onClick={this.addIndicatorCondition.bind(this, index)}>
													<IconFont className={'condition-icon'} type="iconfilter"/>
													筛选条件
												</span>
											</div>
											{/*指标条件列表*/}
											<div className={cx('indicator-conditions')}>
												{/*条件组*/}
												{indicator.filter.length ? indicator.filter.map((filter, i) => {
													return <div key={filter.uiid}>
														<div className={cx('condition-item',{'condition-after': filter.condition.length > 1})}>
															{
																filter.condition.length ? filter.condition.map((condi, condindex) => {
																	//条件key value 之间的关系枚举
																	const { typeids, options  } = condi;
																	// console.log('condition[condi]:', condi);
																	return <div key={Date.now() + condindex} className={'condition-box'}>
																		{/*条件key*/}
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
																											 indicator.dimensions.length ? indicator.dimensions.map((dimension, d) => {
																												 return <div className={'indicators-value'}
																																		 key={Date.now() + d}
																																		 onClick={this.switchCondition.bind(this, index, i, condindex, dimension)}
																												 >{dimension.name}</div>
																											 }) : null
																										 }
																									 </div>
																								 </TabPane>
																							 </Tabs>
																						 </div>}
																		>
																			<Button>{condi.name}</Button>
																		</Popover>
																		{/*条件关系*/}
																		<Popover placement="bottomLeft" trigger="click"
																						 content={<div>
																							 <Input prefix={<IconFont type="iconsearch"/>}
																											placeholder="请输入"
																							 />
																							 <Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'indicator')}>
																								 <TabPane tab="事件属性" key="1">
																									 <div className={'indicators-type'}>
																										 {/*<div className={'indicators-title'}>事件属性</div>*/}
																										 {
																											 typeids && typeids.length ? typeids.map(typeids => {
																												 return <div className={'indicators-value'}
																																		 key={typeids}
																																		 onClick={this.switchCondRelation.bind(this, typeids, index, i, condindex)}
																												 >{formatTypeids(typeids)}</div>
																											 }) : null
																										 }
																									 </div>
																								 </TabPane>
																							 </Tabs>
																						 </div>}
																		>
																			<Button style={{margin: '0 4px'}}>{
																				formatTypeids(condi.currentTypeids)
																			}</Button>
																		</Popover>
																		{/*条件value*/}
																		<Select
																			mode="tags"
																			value={condi.value}
																			size={"small"}
																			style={{ minWidth: 100 }}
																			placeholder="请选择"
																			onChange={value => {
																				this.onSearchConditionValue(value, index, i, condindex)
																			}}
																			onSelect={value => {
																				// console.log('onSelect', value)
																			}}
																		>
																			{
																				options.length ? options.map((option) => {
																					return <SelectOption value={option.value} key={option.value}>{option.name}</SelectOption>
																				}) : null
																			}
																		</Select>

																		{/*删除条件*/}
																		<IconFont className={'del-icon'} type="icondelete2"
																							onClick={this.deleteCondition.bind(this, index, condindex, i)}
																		/>
																		{/*增加条件*/}
																		<IconFont className={'condition-icon'} type="iconfilter"
																							onClick={this.addCondition.bind(this, index, condindex, i)}
																		/>
																	</div>
																}) : null
															}
															{ //条件组内条件之间的关系
																(filter.condition.length > 1) ? <Button className={'relation'}
																																				onClick={this.switchConditionRelation.bind(this, index, i, filter.condRelation)}
																>{filter.condRelation === 'and' ? '且' : '或'}</Button>: null
															}

														</div>
														{ //条件组之间的关系 filter[0] 和 filter[1] 之间的关系 由 filter[1].filterRelation 决定，以此类推，filter[0].filterRelation 是无效的
															(indicator.filter.length > 1) && (i < indicator.filter.length - 1) ?
																<div className={'group-relation'}>
																	<Button className={'relation'}
																					onClick={this.conditionGroupSwitchRelation.bind(this, index, i+1, indicator.filter[i+1].filterRelation)}
																	>
																		{indicator.filter[i+1].filterRelation === 'and' ? '且' : '或'}
																	</Button>
																	<span className={'line'}/>
																</div>: null
														}
													</div>
												}) : null}
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
															baseEvent.length && baseEvent.map(baseEvent => {
																return <div className={'indicators-value'}
																						key={baseEvent.id}
																						onClick={this.addIndicators.bind(this, baseEvent)}
																>{baseEvent.name}</div>
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
							{/*展示维度*/}
							<div className={'indicators-wrap'}>
								<div className={'indicators-title'}>
									<span style={{marginRight: '6px'}}>展示维度</span>
									<Tooltip placement="rightTop" title={"将数据按照指定分类进行展示。例：按性别维度展示启动App的用户数，则会分别展示男、女、未知三个分类下的数据。"}>
										<IconFont style={{color: '#D5D3DE'}} type="iconinfo"/>
									</Tooltip>
								</div>
								{/*维度列表*/}
								{
									analyticsFilter.dimensions.length ? analyticsFilter.dimensions.map((dimension, dindex) => {
										return <div key={dimension.code}>
											<div className={'indicators-item dimensions'}>
												{/*维度*/}
												<Popover placement="bottomLeft" title={''} trigger="click"
																 content={<div>
																	 <Input prefix={<IconFont type="iconsearch"/>}
																					placeholder="请输入"
																	 />
																	 <Tabs defaultActiveKey="1"
																		 // onChange={this.indicatorsTypeChange.bind(this, 'indicator')}
																	 >
																		 <TabPane tab="事件属性" key="1">
																			 <div className={'indicators-type'}>
																				 {
																					 commonProperties.length ? commonProperties.map((newDimension, dim) => {
																						 return <div className={'indicators-value'}
																												 key={newDimension.code}
																												 onClick={this.switchDimension.bind(this, newDimension, dimension, dindex)}
																						 >{newDimension.name}</div>
																					 }) : null
																				 }
																			 </div>
																		 </TabPane>
																	 </Tabs>
																 </div>}
												>
													<Button>{dimension.name}</Button>
												</Popover>

												{/*删除维度*/}
												<IconFont className={'del-icon'} type="icondelete2" onClick={this.deleteDimension.bind(this, dimension)}/>
											</div>
										</div>
									}) : null
								}

								{/*增加维度按钮*/}
								<div className={'indicators-item dimensions'}>
									<Popover placement="bottomLeft" title={''} trigger="click"
													 content={<div>
														 <Input prefix={<IconFont type="iconsearch"/>}
																		placeholder="请输入"
														 />
														 <Tabs defaultActiveKey="1" onChange={this.indicatorsTypeChange.bind(this, 'dimension')}>
															 <TabPane tab="事件属性" key="1">
																 <div className={'indicators-type'}>
																	 {/*<div className={'indicators-title'}>事件属性</div>*/}
																	 {
																		 commonProperties.length ? commonProperties.map((dimension) => {
																			 return <div className={'indicators-value'}
																									 key={dimension.code}
																				 // onClick={this.switchIndicator.bind(this, dimension)}
																									 onClick={this.addDimension.bind(this, dimension)}
																			 >{dimension.name}</div>
																		 }) : null
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
						</div>

						<div className="left-foot">
							<Button icon={<IconFont type="iconclean"/>}
											onClick={() => {
												this.setState({
													analyticsFilter: {
														"type": -1,
														"name": "",
														"remark": "",
														"x": 0,
														"y":0,
														"width": 6,
														"height": 6,
														"event":[],
														"dimensions":[],
														"timeFrame": {
															start: moment().startOf("day").subtract(6, 'days').unix()*1000,
															end: moment().endOf("day").unix()*1000,
															name: '',
														},
													}
												});
												this.analyticsParam = []
											}}
							>清空</Button>
							<Button icon={<IconFont type="iconcaculate"/>} type={'primary'}
											onClick={this.analyticsSubmit}
							>查询</Button>
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
											// renderExtraFooter={() => 'extra footer'}
											format="YYYY-MM-DD"
											ranges={{
												'今天': [moment(), moment()],
												'昨天': [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
												'当月': [moment().startOf('month'), moment().endOf('month')],
											}}
											onChange={this.switchAnalyticsTimeFrame}
										/>
										<Select defaultValue="按日"
														onChange={this.switchGranularity}
										>
											<SelectOption key={0} value={0}>全部</SelectOption>
											<SelectOption key={1} value={1}>按秒</SelectOption>
											<SelectOption key={2} value={2}>分钟</SelectOption>
											<SelectOption key={3} value={3}>小时</SelectOption>
											<SelectOption key={4} value={4}>按日</SelectOption>
											<SelectOption key={5} value={5}>按周</SelectOption>
											<SelectOption key={6} value={6}>按月</SelectOption>
											<SelectOption key={7} value={7}>按季</SelectOption>
											<SelectOption key={8} value={8}>按年</SelectOption>
										</Select>
									</div>
									<div>
										<Tooltip placement="top" title={'线形图'}>
											<Button icon={<IconFont type="iconline"/>} onClick={this.switchChartType.bind(this, 'line')}
															className={cx({"ant-btn-active": chartType === "line"})}
															disabled={onlyPieAndForm}
											/>
										</Tooltip>
										<Tooltip placement="top" title={'柱状图'}>
											<Button icon={<IconFont type="iconcolume"/>} onClick={this.switchChartType.bind(this, 'bar')}
															className={cx({"ant-btn-active": chartType === "bar"})}
															disabled={onlyPieAndForm}
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
										{/*<Tooltip placement="top" title={'数值'}>*/}
										{/*	<Button icon={<IconFont type="iconnumber"/>} onClick={this.switchChartType.bind(this, 'num')}*/}
										{/*					className={cx({"ant-btn-active": chartType === "num"})}*/}
										{/*					disable={onlyPieAndForm}*/}
										{/*	/>*/}
										{/*</Tooltip>*/}
									</div>
								</div>

								<div className={'chart-box'}>

									<div className={'chart-scroll'}>
										{chartEmptyFlag && chartType === 'line' ? <ReactEcharts
											style={{minHeight: '100%'}}
											option={getLineChart(chartData)}
											notMerge={true}
											lazyUpdate={true}
											theme={"theme_name"}
										/> : null}
										{chartEmptyFlag && chartType === 'bar' ? <ReactEcharts
											style={{minHeight: '100%'}}
											option={getBarChart(chartData)}
											notMerge={true}
											lazyUpdate={true}
											theme={"theme_name"}
										/> : null}
										{chartEmptyFlag && chartType === 'pie' ? <div>
											{
												chartData.eventList.map((pie, pindex) => {
													return <ReactEcharts
														className={'chart-pie-item'}
														key={pindex}
														style={{minHeight: '100%'}}
														option={getPieChart(chartData, pie)}
														notMerge={true}
														lazyUpdate={true}
														theme={"theme_name"}
													/>
												})
											}
										</div> : null}
										{chartEmptyFlag && chartType === 'form'
											? <Table
												columns={formatFormColumns(chartData)}
												dataSource={formatFormDataSource(chartData)}
												scroll={{ x: 1500, y: 300 }}
											/>
										: null}
										{chartEmptyFlag && chartType === 'num' ? <ReactEcharts
											style={{minHeight: '100%'}}
											option={getLineChart(chartData)}
											notMerge={true}
											lazyUpdate={true}
											theme={"theme_name"}
										/> : null}

										{!chartEmptyFlag ? <div className={'chart-box-empty'}>
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
							size: '1'
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
								name:"panels",
								type: 'select',
								rules:[{ required: true }],
								items: () => {
									// console.log(this.state.allPanel);
									return this.state.allPanel
								},
								itemProps: {
									mode: "tags",
									tagRender: (props) => {
										const {
											label,
											// value,
											closable,
											onClose
										} = props;

										return (
											<Tag
												// color={"#5236C9"}
												closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
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
								name:"size",
								type: 'customRadio',
								// rules:[{ required: true }],
								itemProps: {
									radio: <Radio.Group>
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
