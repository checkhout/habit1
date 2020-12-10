import React, { Component } from 'react';
import cx from "classnames";
import { connect } from "react-redux";
import {
	Button,
} from 'antd';
import {
	IsEmpty,
	formatType,
	FormatUsername
} from "@utils/index";
import { transformTime } from "@/components/moment";
import DataTable from '@components/DataTable';
import SearchBar from '@components/searchBar';
import BaseComponent from '@/components/BaseComponent';
import { persistPageStatusByKey } from '@actions/common'

import {
	certificationAuditListAction,
} from '@actions/certificationAudit'
import {
	certificationAuditSearch,
	certificationAuditResSearch,
	certificateStatusSwitch,
} from "./utils";

import AuditModal from './auditModal'

@connect((state) => ({
	persistPageStatusResult: state.persistPageStatusResult,
	certificationAuditListResult: state.certificationAuditListResult,
}))

class CertificationAuditTab extends BaseComponent {
	state = {
		active: this.props.persistPageStatusResult.certificationAuditTabStatus.active >= 0 ? this.props.persistPageStatusResult.certificationAuditTabStatus.active : 0,
		certificationList: [],
		total: 0,
		page: 0,
		auditModalVisible: false,				// 审核、查看弹窗
		currentApplyObj: {},						// 当前 审核、查看的数据
	};
	searchFile = {
		pageNum: 1,
		pageSize: 10,
		startTime:0,
		endTime: 0,
		applicant: "",	  // 申请人账号
		authName: "",			// 企业名
		status: 1,				// 0-已审核，1-待审核，3-审核通过，4-审核拒绝
	};
	componentDidMount() {
		const { persistPageStatusResult: { certificationAuditTabStatus} } = this.props;

		this.searchFile = {...certificationAuditTabStatus};
		this.requestCertificationAuditList();
	}
	componentWillUnmount() {//页面销毁保存搜索状态
		this.props.dispatch(persistPageStatusByKey('certificationAuditTabStatus')({...this.searchFile, active: this.state.active}));
	}

	//查询用车任务列表
	requestCertificationAuditList = () => {
		this.props.dispatch(certificationAuditListAction(this.searchFile, () => {}, () => {}));
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
						return  IsEmpty(record.applicantInfo.nickname)
					}
				}
			},
			{
				title: '手机号',
				name: 'username',

				tableItem: {
					render: (text, record) => {
						let user = record.applicantInfo.username;
						return IsEmpty(FormatUsername(user))
					}
				}
			},
			{
				title: '认证企业名称',
				name: 'department',
				width: "49%",
				tableItem: {
					render: (text, record) => {
						return  IsEmpty(record.authName)
					}
				}
			},
			{
				title: '操作',
				tableItem: {
					render: (text, record) => {
						return <div className="operate">
							<Button ghost={true} title={'编辑'} className="normal_btn theme-font-blue379EEC" onClick={this.handleShowModal("auditModalVisible", record)} >审核</Button>
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
						return  IsEmpty(record.applicantInfo.nickname)
					}
				}
			},
			{
				title: '手机号',
				name: 'username',

				tableItem: {
					render: (text, record) => {
						let user = record.applicantInfo.username;
						return IsEmpty(FormatUsername(user))
					}
				}
			},
			{
				title: '认证企业名称',
				name: 'department',
				width: "20%",
				tableItem: {
					render: (text, record) => {
						return  IsEmpty(record.authName)
					}
				}
			},

			{
				title: '审核人',
				name: 'audit',
				tableItem: {
					render: (text, record) => {
						return  record.auditorInfo ? IsEmpty(record.auditorInfo.nickname) : "-"
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
							<Button ghost={true} title={'查看'} className="normal_btn theme-font-blue379EEC"
											onClick={this.handleShowModal("auditModalVisible", record)} >查看</Button>
						</div>
					}
				}
			},
		]
	};


	handleSwitchStatus = index => () => {

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
	handleShowModal = (visible, record) => () => {

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
				this.searchFile.authName = "";
				break;
			case 3:
				this.searchFile.authName = searchFields.inputSearch || "";
				this.searchFile.applicant = "";
				break;
		}
		this.requestCertificationAuditList();
	};
	handleResetSearch = () =>{
		this.searchFile.pageNum = 1;
		this.searchFile.pageSize = 10;
		this.searchFile.startTime = 0;
		this.searchFile.endTime = 0;
		this.searchFile.applicant = "";
		this.searchFile.authName = "";
	};
	certificationAuditSearchFields = () => {
		let columns = [
			{
				className: 'border-radius-custom select-and-input-s',
				key: 'inputType',
				type: 'select',
				defaultValue: '2',
				items: certificationAuditSearch || [],
				// width: 74,
			},
			{
				className: "border-custom select-and-input-i",
				key: 'inputSearch',
				type: 'input',
				width: 126,
				placeholder: '请输入',
			},
			{
				key: 'search_trip_status',
				type: 'rangePicker',
				width: 240,
				showTime: true,
				dropdownClassName: "use-car-record-range-picker",
				// ranges: rangeDate,
				onOk: (date, dateString) => {
					if (date && date[0] && date[1]) {
						this.searchFile.startTime = date[0].unix()*1000;
						this.searchFile.endTime = date[1].endOf("day").unix()*1000;
					}
				}
			},
		];

		const auditResult = {
			title: '审核结果',
			key: 'auditResult',
			type: 'select',
			width: 126,
			className: "box-field border-radius-custom",
			defaultValue: '-1',
			items: certificationAuditResSearch || [],
			onChange: (value) => {
				value = +value;
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
		this.searchFile.pageSize= pageSize;
		this.searchFile.pageNum = pageNum;

		this.requestCertificationAuditList();
	};


	render() {
		const { loading, certificationAuditListResult } = this.props;
		const {
			active, auditModalVisible, currentApplyObj
		} = this.state;
		const {
			pageNum, pageSize
		} = this.searchFile;

		const certificationDataTable = {
			loading,
			columns: this.columns(),
			rowKey: 'id',
			dataItems: { list: certificationAuditListResult.data, total: certificationAuditListResult.total, pageNum, pageSize },
			onChange: ({ pageNum, pageSize, }) => { pageNum && this.handleTurnTablePage(pageNum, pageSize) },
			locale: { emptyText: "暂无相关数据", }
		};

		const certificationResDataTable = {
			loading,
			columns: this.resColumns(),
			rowKey: 'id',
			dataItems: { list: certificationAuditListResult.data, total: certificationAuditListResult.total, pageNum, pageSize },
			onChange: ({ page, pageSize, }) => { page && this.handleTurnTablePage(page, pageSize) },
			locale: { emptyText: "暂无相关数据", }
		};

		return (
			<React.Fragment>
				<div className="data-table-wrapper flex-auto">
					<div className="primary-data">
						<Button className={cx({"active" : active === 0})} onClick={this.handleSwitchStatus(0)}>待审核</Button>
						<Button className={cx({"active" : active === 1})} onClick={this.handleSwitchStatus(1)}>已审核</Button>
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

				<AuditModal
					title={"审核单"}
					visible={auditModalVisible}
					cancel={() => { this.handleCancelModal('auditModalVisible') }}
					active={active}
					currentApplyObj={currentApplyObj}
					requestCertificationAuditList={this.requestCertificationAuditList}
				/>
			</React.Fragment>
		)


	}

}
export default CertificationAuditTab
