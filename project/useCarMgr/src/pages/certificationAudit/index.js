import React from 'react';
import {
	Tabs
} from 'antd';


import BaseComponent from '@/components/BaseComponent';

import CertificationAuditTab from './certificationAudit'
import '../useCarManagement/index.less'

const { TabPane } = Tabs;

export default class CertificationAudit extends BaseComponent {
	render() {
		return (
			<div className='use-car-warp certification-audit-warp'>
				<div className="use-car-content">
					<Tabs
						type="card"
						tabPosition='left'
						tabBarGutter={0}
					>
						<TabPane
							tab={
								<div className="custom-tab-item">
									<i className="certification-icon"/>
									<p>认证审核</p>
								</div>
							}
							key="1"
						>
							<CertificationAuditTab />
						</TabPane>
					</Tabs>
				</div>
			</div>
		)
	}
};
