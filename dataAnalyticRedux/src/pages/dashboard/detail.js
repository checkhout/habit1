import React, {Component} from 'react';
import { WidthProvider, Responsive } from "react-grid-layout";
import ReactEcharts from 'echarts-for-react';
import { getBarChart, getLineChart, getPieChart } from "./chart";
import _ from "lodash";
import { Button, Input } from "antd";
import {ICON_FONT_URL} from '@config'
import {createFromIconfontCN} from "@ant-design/icons";

import {
	analysisListApi,
} from '@api/dashboard'

import './detail.less'

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});

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
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.dashboardObj.id && this.props.id !== nextProps.dashboardObj.id) {
			analysisListApi(nextProps.dashboardObj.id).then(res => {
				console.log('panel detail:', res);

				//更新图表列表
				const panelList = res.data;
				const widgets = _.map(panelList, (item, i) => {
					const { x, y, width, height, id, type } = item;
					return {
						x,
						// y: Infinity, // puts it at the bottom
						y,
						w: width,
						h: height,
						i: id + '',
						type,
					}
				});

				console.log('图标列表', widgets);

				this.setState({widgets})
			}).catch(err => {
			    console.log('panel detail:',err)
			});

		}
	}

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
	generateDOM = () => {
		return _.map(this.state.widgets, (l, i) => {
			let option;
			//type:  //0-表格，1-折线图，2-柱状图，3-饼图，数值
			switch (l.type) {
				case 0:
					option = getBarChart(); //todo 没有先用柱状图顶一下
					break;
				case 1:
					option = getLineChart();
					break;
				case 2:
					option = getBarChart();
					break;
				case 3:
					option = getPieChart();
					break;
				case 4:
					option = getBarChart(); //todo 没有先用柱状图顶一下
					break;
				default:
					option = getBarChart(); //todo 没有先用柱状图顶一下
					break;
			}
			// if (l.type === 'bar') {
			// 	option = getBarChart();
			// } else if (l.type === 'line') {
			// 	option = getLineChart();
			// } else if (l.type === 'pie') {
			// 	option = getPieChart();
			// } else {
			// 	option = getPieChart();
			// }
			// option.backgroundColor = 'rgba(255,255,255, 0.6)';

			let component = (
				<ReactEcharts
					option={option}
					notMerge={true}
					lazyUpdate={true}
					theme={"theme_name"}
				/>
			);
			return (
				<div style={{width: '100%',height:'100%'}} key={l.i} data-grid={l} className={'panel-item'}>
					<div>
						<div className={'panel-top'}>
							<div className='panel-title-wrap'>
								<div>
									<span className="panel-title">新增用户数</span><IconFont type="iconinfo"/>
								</div>
								<div>
									<IconFont type="iconrefresh" style={{marginRight: '10px'}}/>
									<IconFont type="icondelete" onClick={this.onRemoveItem.bind(this, i)}/>
								</div>
							</div>
							<div>
								<IconFont type="iconnumber" style={{marginRight: '5px'}}/><span>近7天</span>
							</div>
						</div>

					</div>
					{component}
				</div>
			);
		});
	};

	addChart(type) {
		const addItem = {
			x: (this.state.widgets.length * 3) % (this.state.cols || 12),
			y: Infinity, // puts it at the bottom
			w: 3,
			h: 2,
			i: new Date().getTime().toString(),
		};
		this.setState(
			{
				widgets: this.state.widgets.concat({
					...addItem,
					type,
				}),
			},
		);
	};

	onRemoveItem(i) {
		this.setState({
			widgets: this.state.widgets.filter((item,index) => index !== i)
		});
	}

	onLayoutChange(layout, layouts) {
		console.log('onLayoutChange:', layout, layouts);
		this.saveToLS("layouts", layouts);
		this.setState({ layouts });
	}

	render () {
		const {
			dashboardObj,
			boardTitleOnChange,
			boardRemarkOnChange,
			updateDashboardOnBlur,
		} = this.props;

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
								<Button icon={<IconFont type="icondate" className='password' />}/>
								<Button icon={<IconFont type="icondate" className='password' />}/>
								<Button icon={<IconFont type="iconrefresh" className='password' />}/>
								<Button icon={<IconFont type="iconcreate" className='password' />}>新建图表</Button>

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
						{this.generateDOM()}
					</ResponsiveReactGridLayout>
				</div>
			</div>
		)
	}
}


export default Detail
