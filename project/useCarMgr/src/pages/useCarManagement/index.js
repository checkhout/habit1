import React, {Component} from 'react';
import {
	Tabs
} from 'antd';

import UseCarRecord from './useCarRecord'
import './index.less'

const { TabPane } = Tabs;

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
							<div className="data-table-wrapper">
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