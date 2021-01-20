/*
import React, {Component} from 'react';
import { WidthProvider, Responsive } from "react-grid-layout";
import ReactEcharts from 'echarts-for-react';
import { getBarChart, getLineChart, getPieChart } from "./chart";
import _ from "lodash";
import { Button } from "antd";
import {ICON_FONT_URL} from '@config'
import {createFromIconfontCN} from "@ant-design/icons";

import './detail.less'

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});

class Detail extends Component {
	state = {
		layouts: {},
		widgets: [],
		resourceList: [], //图表数据
	};

	componentDidMount() {
		// todo
		const res1 = {"code":0,"msg":"操作成功","times":null,"datas":{"id":1969,"userId":1049888,"userName":null,"appId":null,"name":"注册转化率","sourceType":1,"source":1,"canOperated":1,"status":1,"createTime":1608264418000,"updateTime":1608797389000,"content":"{\"position\":{\"783_book\":{\"x\":0,\"y\":0,\"width\":6,\"height\":5,\"minheight\":\"5\",\"minwidth\":\"6\"},\"1194_book\":{\"x\":6,\"y\":0,\"width\":6,\"height\":5,\"minheight\":3,\"minwidth\":3},\"766_book\":{\"x\":0,\"y\":5,\"width\":6,\"height\":5,\"minheight\":\"5\",\"minwidth\":\"6\"}}}","isFixed":null,"isShare":null,"groupId":null,"read":false,"platform":null,"open":false,"tips":null,"shareName":null,"resourceList":[{"id":783,"name":"资金转账的次数分布","content":"{\"chartsType\":\"bar\",\"measures\":[{\"eventCode\":\"fundtransfer\",\"aggregator\":\"general\",\"eventAttr\":{\"eventCode\":\"fundtransfer\",\"code\":\"general\",\"hasDict\":0,\"type\":\"default\",\"params\":[],\"dataType\":\"number\",\"name\":\"触发次数\"},\"filter\":{\"conditions\":[],\"relation\":\"and\"}}],\"byFields\":[],\"filter\":{\"conditions\":[],\"relation\":\"and\"},\"crowd\":[\"$ALL\"],\"samplingFactor\":1,\"fromDate\":\"\",\"toDate\":\"\",\"dateValue\":\"过去7日\",\"relativeTimeRange\":\"7,1,day\",\"unit\":\"all\",\"total\":\"total\"}","sourceCode":"book","type":"distribution","status":1,"tips":"","userId":0},{"id":1194,"name":"饼图1","content":"{\"measures\":[{\"eventCode\":\"$startup\",\"aggregator\":\"general\",\"$uid\":\"7dn\",\"filter\":{\"conditions\":[],\"relation\":\"and\"}}],\"byFields\":[{\"field\":\"event.$Anything.$app_version\",\"$field\":\"event.$Anything.$app_version\",\"params\":\"\",\"type\":\"noSum\",\"name\":\"应用版本\",\"hasDict\":0,\"dataType\":\"string\"}],\"filter\":{\"conditions\":[],\"relation\":\"and\"},\"crowd\":[\"$ALL\"],\"samplingFactor\":1,\"fromDate\":\"\",\"toDate\":\"\",\"dateValue\":\"过去7日\",\"relativeTimeRange\":\"7,1,day\",\"compareFromDate\":\"\",\"compareToDate\":\"\",\"compareDateValue\":\"\",\"compareRelativeTimeRange\":\"\",\"dateValueMerge\":\"过去7日\",\"unit\":\"day\",\"chartsType\":\"pie\",\"filterHolidayData\":false,\"compareType\":\"lastPeriod\",\"displayType\":\"default\"}","sourceCode":"book","type":"event","status":1,"tips":"饼图1饼图1饼图1","userId":1049888},{"id":766,"name":"登录用户后续留存分析","content":"{\"firstEvent\":{\"eventCode\":\"signinclick\",\"alias\":\"\",\"filter\":{\"conditions\":[],\"relation\":\"and\"}},\"secondEvent\":{\"eventCode\":\"$startup\",\"alias\":\"\",\"filter\":{\"conditions\":[],\"relation\":\"and\"}},\"measures\":[],\"rangeText\":\"上月\",\"dateValue\":\"过去7日\",\"relativeTimeRange\":\"7,1,day\",\"fromDate\":\"\",\"toDate\":\"\",\"extendOverEndDate\":false,\"duration\":7,\"unit\":\"day\",\"crowds\":[\"$ALL\"],\"chartsType\":\"area\",\"numberType\":0,\"samplingFactor\":1,\"wastage\":false,\"byEvent\":\"default\",\"byFields\":[{\"field\":\"\",\"hasDict\":0,\"type\":\"\",\"params\":null,\"dataType\":\"string\"}]}","sourceCode":"book","type":"retention","status":1,"tips":"","userId":0}],"shareType":0,"shareNum":0},"exception":null,"uniqueId":"791706639827730432"};
		const resData = res1.datas;
		// 图表数据

		//UI
		const positionData = JSON.parse(resData.content).position;
		//panel 信息
		const resourceListParseFy = _.map(resData.resourceList, (item) => {
			return {...item, content: JSON.parse(item.content)}
		});

		//格式化 panel 数据
		const layouts = _.map(positionData, (item, key) => {
			const { width, height, minheight, minwidth, x, y } = item, i = String(key.split('_')[0]);
			const filter =  resourceListParseFy.filter(item => +item.id === +i);

			return {
				minH: +minheight,
				minW: +minwidth,
				w: +width,
				h: +height,
				x: +x,
				y: +y,
				i,
				type: filter.length ? filter[0].type : undefined //图表类型
			}
		});
		const widgets = _.map(layouts, i => {
			return {...i, h: Infinity}
		});

		console.log('1. all data:', resData); //看板信息wrap
		console.log('2. position:', positionData); //图表UI信息
		console.log('3. resourceList:', resourceListParseFy); //图表状态
		console.log('4 layouts: ', layouts);
		console.log('5 widgets: ', widgets);

		this.setState({
			layouts: { lg: layouts, md: layouts, sm: layouts, xs: layouts},
			widgets,
			resourceList: resourceListParseFy,
		})
	}

	generateDOM = () => {
		const { layouts, widgets } = this.state;

		return _.map(widgets, (l, i) => {
			const { type } = l;
			let option = {};

			if (type === 'distribution') {// 柱状图
				console.log('柱状图');
				option = getBarChart();
			}
			else if (type === 'retention') {// 折线图
				console.log('折线图');
				option = getLineChart();
			}
			else if (type === 'event') {// 饼图
				console.log('饼图');
				option = getPieChart();
			}

			console.log('option ', option);
			let component = (
				<ReactEcharts
					option={option}
					notMerge={true}
					lazyUpdate={true}
					style={{width: '100%',height:'100%'}}
				/>
			);
			return (
				<div key={i} data-grid={l}>
					<span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>
					{component}
				</div>
			);
		});
	};

	onRemoveItem = (i) => {
		this.setState({
			widgets: this.state.widgets.filter((item,index) => {
				console.log('onRemoveItem==', item, index);
				return item !== i
			})
		});
	};
	onLayoutChange = (layout, layouts) => {
		this.setState({ layouts });
	};

	render () {

		return (
			<div>
				<div className="panel-top">
					<div className="panel-t-left">
						<div><span className={'title'}>基础业务指标</span><IconFont type="icontest3" className='password' /></div>
						<div><span className={'des'}>盯盯拍App、h5和设备相关指标数据查看</span><IconFont type="icontest3" className='password' /></div>
					</div>
					<div className="panel-t-right">
						<div>
							<Button icon={<IconFont type="icontest3" className='password' />}/>
							<Button icon={<IconFont type="icontest3" className='password' />}/>
							<Button icon={<IconFont type="icontest3" className='password' />}>新建图表</Button>
						</div>
						<div style={{marginTop: '5px'}}>
							最后计算时间：2020-12-09 12:19:27
						</div>
					</div>
				</div>
				<ResponsiveReactGridLayout
					className="panel-content"
					cols={ { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 } }
					rowHeight={100}
					layouts={this.state.layouts}
					onLayoutChange={(layout, layouts) =>
						this.onLayoutChange(layout, layouts)
					}
				>
					{this.generateDOM()}
				</ResponsiveReactGridLayout>
			</div>
		)
	}
}


export default Detail
*/
