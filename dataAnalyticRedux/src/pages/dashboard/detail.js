import React, {Component} from 'react';
import { WidthProvider, Responsive } from "react-grid-layout";
import ReactEcharts from 'echarts-for-react';
import cx from 'classnames'
import { getBarChart, getLineChart, getPieChart } from "./chart";
import _ from "lodash";
import {Button, DatePicker, Input, message, Spin, Tooltip} from "antd";
import {ICON_FONT_URL} from '@config'
import {createFromIconfontCN} from "@ant-design/icons";
import {
	analysisListApi,
	deleteChartApi,
} from '@api/dashboard'
import {
	analysisSubmitApi,
} from '@api/analytics'
import moment from '@components/moment'
import './detail.less'
import update from "immutability-helper";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});
const { RangePicker } = DatePicker;

class Detail extends Component {
	static defaultProps = {
		cols: { lg: 12, md: 12, sm: 6, xs: 6, xxs: 6 },
		rowHeight: 100,

		dashboardObj: {},

	};

	constructor(props) {
		super(props);

		this.state = {
			layouts: this.getFromLS("layouts") || {lg: [], md: [], sm: [], xs: []}, //图标布局
			widgets:[], //图标列表

			//switchCommonFilter 为 true 时使用该条件
			timeFrame: {
				start: 0,
				end: 0,
			},
			switchCommonFilter: false,//关闭后，所有图表的日期恢复默认
		};
		this.panelList = [];
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.dashboardObj.id && this.props.dashboardObj.id !== nextProps.dashboardObj.id) {
			this.getBoardDetail(nextProps.dashboardObj.id)
		}
	}
	//用来初始化看板
	getBoardDetail = (id) => {
		const _that = this;

		analysisListApi(id).then(res => {
			//更新图表列表
			const panelList = res.data;
			const widgets = _.map(panelList, (item, i) => {
				const { x, y, width, height, id, type } = item;

				return {
					x,
					y,//Infinity, // puts it at the bottom
					w: width,
					h: height,
					i: id + '',
					type,
					chartData: {}
				}
			});

			this.panelList = panelList;//缓存看板的图表列表
			this.setState({widgets}, () => {
				panelList.forEach((param, pIndex) => {
					this.refreshPlane(param, (refreshRes) => {
						_that.updateChartData(param.id, refreshRes, param);
					})
				});
			})
		}).catch(err => {
			console.log('panel detail:',err)
		});
	};

	//更新对应id的图标数据
	updateChartData = (id, data, param) => {
		let panelIndex = -1;
		const { widgets } = this.state;

		widgets.forEach((panel, index) => {
			if (+panel.i === +id) {
				panelIndex = index
			}
		});
		if (panelIndex >= 0) {
			this.setState({
				widgets: update(widgets, {
					[panelIndex]: {
						$merge: {
							chartData: {data},
							param, //刷新单个看板时的参数
						}
					}
				})
			})
		}
	};
	getFromLS = (key) => {
		let ls = {};
		if (global.localStorage) {
			try {
				ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
			} catch (e) {
				/*Ignore*/
			}
		}
		return ls[key];
	};
	//保存到本地
	saveToLS = (key, value) => {
		if (global.localStorage) {
			global.localStorage.setItem(
				"rgl-8",
				JSON.stringify({
					[key]: value
				})
			);
		}
	};
	//刷新单个看板
	refreshPlane = (param, callback) => {
		analysisSubmitApi(param)
			.then(refreshRes => {
				Object.keys(refreshRes).length && callback && callback(refreshRes)
			})
			.catch(err => {
				console.log('刷新单个看板：',err)
			});
	};


	//生成图表
	generateDOM = (widgets) => {
		return _.map(widgets, (l, i) => {
			const {
				type,
				param,
			} = l;
			// const timeFrame = param ? param.timeFrame : {};
			const chartData = l.chartData.data;
			const getOptions = (chart) => {
				//type:  //0-表格，1-折线图，2-柱状图，3-饼图，数值
				switch (+type) {
					case 0:
						return getBarChart(chartData); //todo 没有先用柱状图顶一下
					case 1:
						return getLineChart(chartData);
					case 2:
						return getBarChart(chartData);
					case 3:
						return getPieChart(chartData, chart);
					case 4:
						return getBarChart(chartData); //todo 没有先用柱状图顶一下
					default:
						return getBarChart(chartData);//todo 没有先用柱状图顶一下
				}
			};
			const dateFormat = 'YYYY/MM/DD';

			return (
				<div style={{width: '100%',height:'100%'}} key={l.i} data-grid={l} className={'panel-item'}>
					<div>
						<div className={'panel-top'}>
							<div className='panel-title-wrap'>
								<div>
									<span className="panel-title">{param ? param.name : ''}</span>
									<Tooltip
										placement="rightTop" title={param ? param.remark : '空'}
									>
										<IconFont type="iconinfo"/>
									</Tooltip>
								</div>
								<div>
									<IconFont type="iconrefresh" style={{marginRight: '10px'}}
														onClick={
															this.refreshPlane.bind(this, param, (refreshRes) => {
																this.updateChartData(param.id, refreshRes.data, param);
															})
														}
									/>
									<IconFont type="icondelete" onClick={this.onRemoveItem.bind(this, i, l)}/>
								</div>
							</div>
							<div className={'panel-time-filter'}>
								<IconFont type="iconnumber" style={{marginRight: '5px'}}/>
								{/*修改单个chart时间*/}
								<RangePicker
									bordered={false}
									className={'chart-date'}
									allowClear={false}
									suffixIcon={null}
									// defaultValue={[moment(timeFrame.start), moment(timeFrame.end)]}
									format={dateFormat}
									ranges={{
										'今天': [moment(), moment()],
										'昨天': [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
										'当月': [moment().startOf('month'), moment().endOf('month')],
									}}
									onChange={this.switchChartTimeFrame.bind(this, {...param})}
								/>
							</div>
						</div>
					</div>
					<div className={'panel-charts'}>
						<div className={'panel-inner'}>
							{
								chartData ? chartData.eventList.map(chart => {
									return <ReactEcharts
										className={cx('chart-pie-item', {'multi-chart-pie-item': chartData.eventList.length > 1})}
										key={chart.event}
										option={getOptions(chart)}
										notMerge={true}
										lazyUpdate={true}
										theme={"theme_name"}
									/>
								}) : <Spin spinning={!chartData} className="chart-loading" tip={'加载中...'} delay={2000}/>
							}
						</div>
					</div>
				</div>
			)

		});
	};

	//删除图表
	onRemoveItem(i, l) {
		// console.log('将被移除的；', i, l);
		deleteChartApi(l.i).then(res => {
			message.success('删除成功')
		}).catch(() => {
			message.error('删除失败，请检查网络');
		});

		this.setState({
			widgets: this.state.widgets.filter((item,index) => index !== i)
		});
	}
	onLayoutChange(layout, layouts) {
		this.saveToLS("layouts", layouts);
		this.setState({ layouts });
	}
	//单个图表切换时间
	switchChartTimeFrame = (param, dates, dateStrings) => {
		if (dates) {
			const _that = this;

			const timeFrame = {//注意传递的Param参数要是一个新对象
				start: dates[0].unix() * 1000,
				end: dates[1].unix() * 1000,
			};

			//刷新看板
			this.refreshPlane({
				...param,
				timeFrame
			}, (refreshRes) => {
				console.log('图表参数：', param);
				//更新图表数据
				_that.updateChartData(param.id, refreshRes.data, param);
			})
		}
	};
	//切换所有看板分析时间
	switchAnalyticsTimeFrame = (dates, dateStrings) => {
		if (dates) {
			const _that = this;

			this.timeFrame = {//缓存统一时间，用来
				start: dates[0].unix() * 1000,
				end: dates[1].unix() * 1000,
			};

			if (this.panelList.length) {
				this.panelList.forEach((param) => {
					//刷新看板
					this.refreshPlane({
						...param,
						timeFrame: {
							...this.timeFrame
						}
					}, (refreshRes) => {
						console.log('图表参数：', param);
						//更新图表数据
						_that.updateChartData(param.id, refreshRes.data, param);
					})
				});
			}
		}
	};
	//统一看板时间
	unifyBoardTime = () => {
		this.setState({switchCommonFilter: !this.state.switchCommonFilter}, () => {
			//取消时间统一
			if (!this.state.switchCommonFilter) {
				this.getBoardDetail(this.props.dashboardObj.id)
			}
		})
	};
	//统一刷新看板数据
	unifyRefresh = () => {
		const _that = this;
		if (this.panelList.length) {
			this.panelList.forEach((param) => {
				let queryParam = {
					...param
				};
				if (this.state.switchCommonFilter && this.timeFrame.start) {
					queryParam.timeFrame = this.timeFrame;
				}

				//刷新看板
				this.refreshPlane(queryParam, (refreshRes) => {
					console.log('图表参数：', param);
					//更新图表数据
					_that.updateChartData(param.id, refreshRes.data, param);
				})
			});
		}
	};

	render () {
		const {
			dashboardObj,
			boardTitleOnChange,
			boardRemarkOnChange,
			updateDashboardOnBlur,
		} = this.props;
		const { switchCommonFilter, widgets } = this.state;

		return (
			<div>
				{
					dashboardObj.name ? <div className="dashboard-top">
						<div className="panel-t-left">
							<Input title={'点击编辑'} className={'title'} value={dashboardObj.name}
										 onChange={boardTitleOnChange}
										 onBlur={updateDashboardOnBlur}
							/>
							<Input title={'点击编辑'} className={'des'} value={dashboardObj.remark ? dashboardObj.remark : '' }
										 onChange={boardRemarkOnChange}
										 onBlur={updateDashboardOnBlur}
							/>
						</div>
						<div className="panel-t-right">
							<div>
								{
									switchCommonFilter ? <RangePicker
										style={{marginRight: '10px'}}
										// renderExtraFooter={() => 'extra footer'}
										format="YYYY-MM-DD"
										ranges={{
											'今天': [moment(), moment()],
											'昨天': [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
											'当月': [moment().startOf('month'), moment().endOf('month')],
										}}
										onChange={this.switchAnalyticsTimeFrame}
									/> : null
								}

								<Button className={cx({'active': switchCommonFilter})} icon={<IconFont type="icondate" />}
												onClick={this.unifyBoardTime}
								/>
								<Button icon={<IconFont type="iconrefresh" className='password' />}
												onClick={this.unifyRefresh}
								/>
								<Button icon={<IconFont type="iconcreate" className='password' />}
												onClick={() => {this.props.history.push('/analytics/product')}}
								>新建图表</Button>

								{/*<Button icon={<IconFont type="iconline" className='password' />}*/}
								{/*				onClick={this.addChart.bind(this,'line')}*/}
								{/*>折线</Button>*/}
								{/*<Button icon={<IconFont type="iconcolume" className='password' />}*/}
								{/*				onClick={this.addChart.bind(this,'bar')}*/}
								{/*>柱状图</Button>*/}
								{/*<Button icon={<IconFont type="iconcirclechart" className='password' />}*/}
								{/*				onClick={this.addChart.bind(this,'pie')}*/}
								{/*>饼图</Button>*/}
							</div>
							<div style={{marginTop: '5px'}}>
								最后计算时间：2020-12-09 12:19:27
							</div>
						</div>
					</div> : null

				}
				{
					widgets.length ?
						<div style={{minHeight: '500px', padding: '20px'}}>
							<ResponsiveReactGridLayout
								className="panel-content"
								breakpoints={{ lg: 768, md: 768, sm: 768, xs: 768, xxs: 0 }}
								cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
								isResizable={true}
								// margin={[50, 50]}
								isDraggable={true}
								measureBeforeMount={false}
								useCSSTransforms={true}
								layouts={this.state.layouts}
								onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
								draggableHandle={".panel-top"} /*拖动有效区域*/
							>
								{this.generateDOM(widgets)}
							</ResponsiveReactGridLayout>
						</div>
						: <div className={'panel-list-empty'}>
							<span className={'remark'}>看板内还没有图表</span>
							<Button ghost={true} icon={<IconFont type="iconcreate"/>}
											onClick={() => {this.props.history.push('/analytics/product')}}
							>点击新建</Button>
						</div>
				}

			</div>
		)
	}
}


export default Detail
