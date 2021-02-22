import React, {Component} from 'react';
import {
	Input,
	Button,
	Tooltip,
	Popover,//和 Tooltip 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。
	Select,
	DatePicker,
	Tabs ,
} from 'antd'
import {ICON_FONT_URL} from '@config'
import {createFromIconfontCN} from "@ant-design/icons";
import ReactEcharts from 'echarts-for-react';
import { getBarChart, getLineChart, getPieChart } from "./chart";
import cx from 'classnames'


import './productAnalytics.less'

const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});
const SelectOption = Select.Option;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

class ProductAnalytics extends Component {
	state = {
		chartType: 'pie',
		allIndicatorsList: [
			{ name: '启动方式', id: 1 },
		], //todo 请求来的事件指标列表
		indicatorsList: [{name: 'test2', id: 989999}], //todo 已选事件指标列表
	};

	indicatorsTypeChange = (key) => {

	};

	switchChartType = (type) => {
		console.log('switchChartType: ', type);
		this.setState({ chartType: type })
	};

	addPropertyCondition = (key) => {
		const state = this.state.allIndicatorsList.filter(item => item.id === key);
		this.setState({indicatorsList: this.state.indicatorsList.concat(state)})
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

	render () {
		const {
			chartType,
			indicatorsList,
			allIndicatorsList,
		} = this.state;

		//todo 是否根据分析条件生成图表
		const chartEmptyFlag = false;
		//todo 给指标添加筛选条件
		const conditionList = [
			{name:'屏幕宽度', id: 99},
			{name:'屏幕宽度', id: 11},
			{name:'屏幕宽度', id: 22},
			{name:'屏幕宽度', id: 33},
			{name:'屏幕宽度', id: 44},
		];

		return (
			<div className="content-layout-1 product-analytics">
				<div className="layout-1-left">
					<div className="left-head">
						<IconFont type="icontuichudenglu"/> <span className={'title'}>事件分析</span>
					</div>

					<div className="left-body">
						<div className={'indicators-wrap'}>
							<div className={'indicators-title'}>
								<span style={{marginRight: '6px'}}>选择事件指标</span>
								<IconFont style={{color: '#D5D3DE'}} type="iconinfo"/>
							</div>
							{/*指标列表*/}
							{
								indicatorsList.length ? indicatorsList.map((item, index) => {
									return <div>
										<div className={'indicators-item'} key={item.id}>
											{this.generateIndicators(index)}
											<Popover placement="bottomLeft" title={''} trigger="focus"
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
																											 key={property.id}
																											 onClick={this.addPropertyCondition.bind(this, property.id)}
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
												<Button>{item.name}</Button>
											</Popover> 的 <Popover placement="bottomLeft" title={''} trigger="focus"
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
																																		key={property.id}
																																		onClick={this.addPropertyCondition.bind(this, property.id)}
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
											<Button>用户数</Button>
										</Popover>


										</div>
										{/*指标条件列表*/}
										<div className={cx('indicator-conditions', {'condition-after': true})}>
											{conditionList.map((condition, i) => {
												return <div className={'condition-item'}>
													<Popover placement="bottomLeft" trigger="focus"
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
																													 key={property.id}
																													 onClick={this.addPropertyCondition.bind(this, property.id)}
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
														<Button>{item.name}</Button>
													</Popover>
													<Popover placement="bottomLeft" trigger="focus"
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
																													 key={property.id}
																													 onClick={this.addPropertyCondition.bind(this, property.id)}
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
														<Button style={{margin: '0 4px'}}>{item.name}</Button>
													</Popover>
													<Popover placement="bottomLeft" trigger="focus"
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
																													 key={property.id}
																													 onClick={this.addPropertyCondition.bind(this, property.id)}
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
														<Button>{item.name}</Button>
													</Popover>

													<Button className={'relation'}>或</Button>
												</div>
											})}
										</div>

										<div className={'group-relation'}><Button className={'relation'}>或</Button> <span className={'line'}></span></div>

										<div className={cx('indicator-conditions', {'condition-after': true})}>
											{conditionList.map((condition, i) => {
												return <div className={'condition-item'}>
													<Popover placement="bottomLeft" trigger="focus"
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
																													 key={property.id}
																													 onClick={this.addPropertyCondition.bind(this, property.id)}
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
														<Button>{item.name}</Button>
													</Popover>
													<Popover placement="bottomLeft" trigger="focus"
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
																													 key={property.id}
																													 onClick={this.addPropertyCondition.bind(this, property.id)}
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
														<Button style={{margin: '0 4px'}}>{item.name}</Button>
													</Popover>
													<Popover placement="bottomLeft" trigger="focus"
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
																													 key={property.id}
																													 onClick={this.addPropertyCondition.bind(this, property.id)}
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
														<Button>{item.name}</Button>
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
								<Popover placement="bottomLeft" title={''} trigger="focus"
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
																								 key={property.id}
																								 onClick={this.addPropertyCondition.bind(this, property.id)}
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

						<div className={'indicators-wrap'}>
							<div className={'indicators-title'}>
								<span style={{marginRight: '6px'}}>展示维度</span>
								<IconFont style={{color: '#D5D3DE'}} type="iconinfo"/>
							</div>
							{/*维度列表*/}
							<div>

							</div>

							{/*增加维度按钮*/}
							<div className={'indicators-item'}>
								<Popover placement="bottomLeft" title={''} trigger="focus"
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
								<Button ghost={true} icon={<IconFont type="iconsave"/>}>保存</Button>
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
		)
	}
}


export default ProductAnalytics
