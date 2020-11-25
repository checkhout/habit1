import React, {Component} from 'react';
import {connect} from "react-redux";
import cx from 'classnames'
import {
	Tabs, Button, DatePicker,
} from 'antd';

import DataTable from '@components/DataTable'
import SearchBar from '@components/searchBar'
import moment, { transformTime } from '@components/moment'
import { persistPageStatusByKey } from '@actions/common'
import { get_car_apply_list_action } from '@actions/useCarManagement'
import { formatType, isEmpty } from "@utils/index";
import {
	get_car_plates_action
} from "@actions/useCarManagement";
import {
	export_car_apply_list_api,
} from "@api/useCarManagement";

import {
	tripStatusSelect,
	useCarMode,
	UseCarTripStatusType
} from './utils'
import UseCarDetail from './useCarDetail'
import UseCarRecord from './useCarRecord'
import './index.less'


const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect((state) => ({
	carPlatesResult: state.carPlatesResult,//车牌列表
	useCarRecordResult: state.useCarRecordResult,
	persistPageStatusResult: state.persistPageStatusResult,
	companyInfoResult: state.companyInfoResult,
}))

class UseCarManagement extends Component {

	render() {
		return (
			<div className='use-car-warp'>
				<div className="use-car-content">
					<Tabs
						type="card"
						tabPosition='left'
						tabBarGutter={0}
					>
						<TabPane
							tab={
								<div>
									<i className="ues-car-record"/>
									<p>用车记录</p>
								</div>
							}
							key="1"
						>
							<div className="data-table-wrapper flex-auto">
								<UseCarRecord />
							</div>
						</TabPane>
						{/*<TabPane
							tab={
								<div>
									<i className="task-mgr"/>
									<p>排班管理</p>
								</div>
							}
							key="2">
						</TabPane>

						<TabPane
							tab={
								<div>
									<i className="direct-use-car"/>
									<p>直接派车</p>
								</div>
							}
							key="3">
						</TabPane>*/}
					</Tabs>
				</div>
			</div>
		)
	}
}

export default UseCarManagement ;