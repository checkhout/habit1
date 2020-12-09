import React from 'react';
import cx from "classnames";
import BaseComponent from '@components/BaseComponent';
import DataTable from '@components/DataTable';
import SearchBar from '@components/searchBar';
import {
	Tabs, Button,
} from 'antd';
import {
	isEmpty,
	formatType,
	formatUsername
} from "@utils/index";

import { transformTime } from "@/components/moment";
import {
	certificateStatusSwitch,
} from "@/utils/status";
import {
	certificationAuditListHttp,
} from '@/api/index'
import {
	certificationAuditSearch,
	certificationAuditResSearch,
} from "@/utils/searchColumns";

import AuditModal from './auditModal'
import '../useCarManagement/index.less'


const { TabPane } = Tabs;


export default class CertificationAudit extends BaseComponent {
	state = {
		active: 0,
		certificationList: [],
		total: 0,
		page: 0,
		auditModalVisible: false,				// 审核、查看弹窗
		currentApplyObj: {},						// 当前 审核、查看的数据

	};
	tablePage = {
		commonPageNum: 1,
		commonPageSize: 10,
	};
	searchFile = {
		startTime:0,
		endTime: 0,
		applicant: "",	  // 申请人账号
		authName: "",			// 企业名
		status: 1,				// 0-已审核，1-待审核，3-审核通过，4-审核拒绝
	};
	componentDidMount() {
		this.requestCertificationAuditList();
	}

	//查询用车任务列表
	requestCertificationAuditList = () => {

		const { commonPageSize, commonPageNum } = this.tablePage;

		let param = {
			pageNum: commonPageNum,
			pageSize: commonPageSize,
			startTime: this.searchFile.startTime,
			endTime: this.searchFile.endTime,
			status: this.searchFile.status,
			applicant: this.searchFile.applicant,
			authName: this.searchFile.authName,
		};

		certificationAuditListHttp(param).then(res => {
			this.setState({
				certificationList: res.data,
				total: res.total,	//总数量
				page: res.page,		//总页数
			})
		}).catch(err => {});

	};

	columns = () => {
		return [
			{
				title: '申请时间',
				name: 'startTime',
				tableItem: {
					render: (text, record) => {
						return record.applyTime ? transformTime(record.applyTime, formatType.noSeconds) : "-"
					}
				},
			},
			{
				title: '申请人',
				name: 'applicant',
				tableItem: {
					render: (text, record) => {
						return  isEmpty(record.applicantInfo.nickname)
					}
				}
			},
			{
				title: '手机号',
				name: 'username',

				tableItem: {
					render: (text, record) => {
						let user = record.applicantInfo.username;
						return isEmpty(formatUsername(user))
					}
				}
			},
			{
				title: '认证企业名称',
				name: 'department',
				width: "49%",
				tableItem: {
					render: (text, record) => {
						return  isEmpty(record.authName)
					}
				}
			},
			{
				title: '操作',
				tableItem: {
					render: (text, record) => {
						return <div className="operate">
							<Button title={'编辑'} className="theme-font-blue379EEC" onClick={this.handleShowModal.b("auditModalVisible", record)} >审核</Button>
						</div>
					}
				}
			},
		]
	};
	resColumns = () => {
		return [
			{
				title: '申请时间',
				name: 'startTime',
				tableItem: {
					render: (text, record) => {
						return record.applyTime ? transformTime(record.applyTime, formatType.noSeconds) : "-"
					}
				},
			},
			{
				title: '申请人',
				name: 'applicant',
				tableItem: {
					render: (text, record) => {
						return  isEmpty(record.applicantInfo.nickname)
					}
				}
			},
			{
				title: '手机号',
				name: 'username',

				tableItem: {
					render: (text, record) => {
						let user = record.applicantInfo.username;
						return isEmpty(formatUsername(user))
					}
				}
			},
			{
				title: '认证企业名称',
				name: 'department',
				width: "20%",
				tableItem: {
					render: (text, record) => {
						return  isEmpty(record.authName)
					}
				}
			},

			{
				title: '审核人',
				name: 'audit',
				tableItem: {
					render: (text, record) => {
						return  record.auditorInfo ? isEmpty(record.auditorInfo.nickname) : "-"
					}
				}
			},
			{
				title: '审核时间',
				name: 'time',
				tableItem: {
					render: (text, record) => {
						return record.auditTime ? transformTime(record.auditTime, formatType.noSeconds) : "-"
					}
				},
			},
			{
				title: '审核结果',
				name: 'status',
				tableItem: {
					render: (text, record) => {
						const status = +record.status;
						return  <span className={cx({"theme-font-redE80000": status === 2, "theme-font-red0DA736": status === 3})}>{certificateStatusSwitch(status)}</span>
					}
				}
			},

			{
				title: '操作',
				tableItem: {
					render: (text, record) => {
						return <div className="operate">
							<Button title={'编辑'} className="theme-font-blue379EEC" onClick={this.handleShowModal.b("auditModalVisible", record)} >查看</Button>
						</div>
					}
				}
			},
		]
	};


	handleSwitchStatus = index => {

		this.setState({active: index, certificationList: []}, () => {
			switch (+this.state.active) {
				case 0:
					this.searchFile.status = 1;
					break;
				case 1:
					this.searchFile.status = 0;
					break;
			}
			this.barRef.handleReset();
		});
	};
	handleShowModal = (visible, record) => {

		if (visible === "auditModalVisible") {
			this.setState({
				[visible]: true,
				currentApplyObj: {...record},
			});

		} else {
			this.setState({[visible]: true});
		}
	};


	searchBarRef = barRef => {
		this.barRef = barRef;
	};
	handleSearch = searchFields => {
		const { inputType } = searchFields;
		switch (+inputType) {
			case 1:
				break;
			case 2:
				this.searchFile.applicant = searchFields.inputSearch || "";
				break;
			case 3:
				this.searchFile.authName = searchFields.inputSearch || "";
				break;
		}
		this.requestCertificationAuditList();

	};
	handleResetSearch = () =>{
		//搜索时重置页码
		this.tablePage = {
			commonPageNum: 1,
			commonPageSize: 10
		};
		this.searchFile.startTime = 0;
		this.searchFile.endTime = 0;
		this.searchFile.applicant = "";
		this.searchFile.authName = "";
	};
	certificationAuditSearchFields = () => {
		let columns = [
			{
				key: 'inputType',
				type: 'select',
				className: 'box-field marginR_none border_right_none bgCCC',
				defaultValue: '2',
				items: certificationAuditSearch || [],
				// width: 74,
			},
			{
				key: 'inputSearch',
				type: 'input',
				width: 126,
				placeholder: '请输入',
				className: "border-custom"
			},
			{
				key: 'search_trip_status',
				type: 'rangePicker',
				width: 240,
				showTime: true,
				dropdownClassName: "use-car-record-range-picker",
				// ranges: rangeDate,
				onOk: (date, dateString) => {
					this.searchFile.startTime = date[0].unix()*1000;
					this.searchFile.endTime = date[1].endOf("day").unix()*1000;

				}
			},
		];

		const auditResult = {
			title: '审核结果',
			key: 'auditResult',
			type: 'select',
			width: 126,
			className: "audit-result box-field border-radius-custom",
			defaultValue: '-1',
			items: certificationAuditResSearch || [],
			onChange: (value) => {
				value = +value;
				console.log("审核结果", value);
				switch (value) {
					case -1:
						this.searchFile.status = 0;
						break;
					case 2:
						this.searchFile.status = value;
						break;
					case 3:
						this.searchFile.status = value;
						break;
				}
			}
		};

		if (this.state.active > 0) {
			columns.splice(2, 0, auditResult)
		}

		return columns
	};
	handleTurnTablePage = (pageNum, pageSize) => {
		//表格换页
		this.tablePage.commonPageSize= pageSize || this.tablePage.commonPageSize;
		this.tablePage.commonPageNum = pageNum;

		/*const {startTime, endTime, applicant, type, status, carPlate} = this.searchFile;
		//判断是否为筛选状态
		if (startTime || endTime || applicant || type || status || carPlate) {
			this.requestCertificationAuditList(this.searchFile);
		} else {
			this.requestCertificationAuditList();
		}*/
		this.requestCertificationAuditList();
	};



	render() {
		const { loading, } = this.props;
		const {
			active, certificationList, total, auditModalVisible, currentApplyObj
		} = this.state;
		const {
			commonPageNum, commonPageSize
		} = this.tablePage;

		const certificationDataTable = {
			loading,
			columns: this.columns(),
			rowKey: 'id',
			dataItems: { list: certificationList, total: total, pageNum: commonPageNum, pageSize: commonPageSize },
			onChange: ({ pageNum, pageSize, }) => { this.handleTurnTablePage(pageNum, pageSize) },
			locale: { emptyText: "暂无相关数据", }
		};

		const certificationResDataTable = {
			loading,
			columns: this.resColumns(),
			rowKey: 'id',
			dataItems: { list: certificationList, total: total, pageNum: commonPageNum, pageSize: commonPageSize },
			onChange: ({ pageNum, pageSize, }) => { this.handleTurnTablePage(pageNum, pageSize) },
			locale: { emptyText: "暂无相关数据", }
		};

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
								<div>
									<i className="certification-icon"/>
									<p>认证审核</p>
								</div>
							}
							key="1"
						>
							<div className="data-table-wrapper flex-auto">
								<div className="primary-data">
									<Button className={cx({"active" : active === 0})} onClick={this.handleSwitchStatus.b(0)}>待审核</Button>
									<Button className={cx({"active" : active === 1})} onClick={this.handleSwitchStatus.b(1)}>已审核</Button>
								</div>
								<SearchBar onSubmit={this.handleSearch}
													 onRef={this.searchBarRef}
													 onReset={this.handleResetSearch}
													 fields={this.certificationAuditSearchFields()}
								/>
								{
									active ? <DataTable { ...certificationResDataTable }/> : <DataTable { ...certificationDataTable }/>
								}

							</div>
						</TabPane>

					</Tabs>
				</div>

				<AuditModal
					title={"审核单"}
					visible={auditModalVisible}
					cancel={this.handleCancelModal.b("auditModalVisible")}
					active={active}
					currentApplyObj={currentApplyObj}
					requestCertificationAuditList={this.requestCertificationAuditList}
				/>

			</div>
		)


	}

};
