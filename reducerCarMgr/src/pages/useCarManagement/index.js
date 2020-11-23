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

import { formatType, isEmpty } from "@utils/index";
import {
	getCarApplyListHttp,
} from "@api/index";
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
import './index.less'


const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect((state) => ({
	carPlatesResult: state.carPlatesResult,//车牌列表
	persistPageStatusResult: state.persistPageStatusResult,
	companyInfoResult: state.companyInfoResult,
}))

class UseCarManagement extends Component {

	state = {
		handleLogoutVisible: false,
		useCarDetailVisible: false,		//用车详情弹窗

		selectedKey: '',
		user: '',
		useCarRecordList: [], 				//用车记录
		useCarRecordTotal: 0, 				//用车记录
		active: this.props.persistPageStatusResult.useCarManagementStatus.active >= 0 || 1, //默认选中今天 1
		cars: [{txt: "全部", value: -1}],//当前列表中的车
		currentUseCarRecord: {},			//当前用车记录
	};

	searchFile = {
		startTime: moment().startOf("day").unix()*1000 + 1000, //初始显示为今天
		endTime: moment().endOf("day").unix()*1000,
		applicant: "",	//申请人账号
		type: 0,				//用车类型
		status: "",			//行程状态，1-未开始，5-进行中，6-已结束
		carPlate: "",
		pageSize: 10,
		pageNum: 1
	};

	componentDidMount() {
		//1. 初始搜索状态
		const { persistPageStatusResult: { useCarManagementStatus} } = this.props;
		const { startTime, endTime } = useCarManagementStatus;

		this.searchFile = {...useCarManagementStatus};
		if (startTime === 0 || endTime === 0) {
			this.searchFile.startTime = moment().startOf("day").unix()*1000 + 1000; //初始显示为今天
			this.searchFile.endTime = moment().endOf("day").unix()*1000
		}

		this.setState({
			active: useCarManagementStatus.active
		}, () => {
			//2. 获取车牌列表
			this.requestGetCarPlates();

			//3. 获取用车记录列表
			this.requestCarApplyList(this.searchFile);
		});
	};
	componentWillUnmount() {//页面销毁保存搜索状态
		this.props.dispatch(persistPageStatusByKey('useCarManagementStatus')({...this.searchFile, active: this.state.active}));
	}

	requestGetCarPlates = () => {
		this.props.dispatch(get_car_plates_action());
	};
	//查询用车任务列表
	requestCarApplyList = (search) => {

		const {pageSize, pageNum} = this.searchFile;
		let param = {
			pageNum,
			pageSize,
			startTime: 0,
			endTime: 0,
			type: 0,
			applicant: "",
		};

		if (search && Object.keys(search).length) {

			const {startTime, endTime, applicant, type, status, carPlate} = search;
			//保存搜索状态，换页时判断是否为搜索后的换页
			if (startTime) {
				this.searchFile.startTime = startTime;
				param.startTime = startTime;
			}
			if (endTime) {
				this.searchFile.endTime = endTime;
				param.endTime = endTime;
			}
			if (applicant) {
				this.searchFile.applicant = applicant;
				param.applicant = applicant;
			}
			if (type) {
				this.searchFile.type = type;
				param.type = +type;
			}
			if (status) {
				this.searchFile.status = status ;
				param.status = +status;
			}
			if (carPlate && +carPlate !== -1) {
				this.searchFile.carPlate = carPlate;
				param.carPlate = carPlate;
			}

		}

		// let carPlates = [];

		getCarApplyListHttp(param).then(res => {
			this.setState({
				useCarRecordList: res.data,
				useCarRecordTotal: res.total,	//总数量
				page: res.page,								//总页数
				// cars: carPlates,
			})
		}).catch(err => {});

	};
	onDatePickerChange = (date, dateString) => {
		// 清空后date为null, 重置为全部
		if (!date.length) {
			this.searchFile.startTime = 0;
			this.searchFile.endTime = 0;
			this.requestCarApplyList(this.searchFile);
			this.setState({active: 1});
		}
	};
	onDatePickerConfirm = (date) => {
		this.barRef.handleReset ();
		this.searchFile.pageNum = 1;

		this.setState({active: 99});

		//点击清空按钮× 之后，date为null，
		if (date && date.length) {
			this.searchFile.startTime = date[0].unix()*1000;
			this.searchFile.endTime = date[1].endOf("day").unix()*1000;

			this.requestCarApplyList(this.searchFile);
		}

	};
	useCarRecordSearchFields = () => {
		const {cars} = this.state;

		return [
			{
				key: 'inputSearch',
				type: 'input',
				width: 196,
				placeholder: '请输入',
				className: "border-custom"
			},
			{
				title: '选择车辆',
				key: 'search_car',
				type: 'select',
				className: 'box-field border-radius-custom',
				defaultValue: "-1",
				items: cars,
				width: 110,
			},

			{
				title: '行程状态',
				key: 'search_trip_status',
				type: 'select',
				className: 'box-field border-radius-custom',
				defaultValue: '0',
				items: tripStatusSelect,
			},
			{
				title: '用车类型',
				key: 'type',
				type: 'select',
				className: 'box-field border-radius-custom use-car-type',
				defaultValue: '0',
				items: useCarMode,
				width: 120,
			},
		]
	};
	/**
	 * 0：全部 1：今天 2：近三天 3：近一周
	 * @param index
	 */
	handlePickData = index => () => {

		const start = moment().startOf("day");
		const end = moment().endOf("day").unix()*1000;

		this.searchFile.pageNum = 1;

		switch (index) {
			case 0:
				this.searchFile.startTime = 0;
				this.searchFile.endTime = 0;
				this.barRef.handleReset ();//reset 会提交搜索
				break;
			case 1:
				this.searchFile.startTime = start.unix()*1000; //当天00:00:01
				this.searchFile.endTime = end;//当天23:59:59
				this.barRef.handleReset ();
				break;
			case 2:
				this.searchFile.startTime = start.subtract(2, 'days').unix()*1000;
				this.searchFile.endTime = end;
				this.barRef.handleReset ();
				break;
			case 3:
				this.searchFile.startTime = start.subtract(6, 'days').unix()*1000;
				this.searchFile.endTime = end;
				this.barRef.handleReset ();
				break;
			case 4:
				this.searchFile.startTime = start.subtract(365, 'days').unix()*1000;
				this.searchFile.endTime = end;
				this.barRef.handleReset ();
				break;
			default:
				break;
		}

		this.setState({active: index})
	};
	useCarColumns = () => {
		return [
			{
				title: '开始时间',
				name: 'startTime',
				tableItem: {
					render: (text, record) => {
						return record.application.startTime ? transformTime(record.application.startTime, formatType.usuallyFormat) : '-'
					}
				},
			},
			{
				title: '出行车辆',
				name: 'tripModel',
				tableItem: {
					render: (text, record) => {
						return  record.application.car.plate ?
							<div className="custom-td">
								{/*<i className="common-car"/> */}
								<span>{record.application.car.plate}</span>
							</div>
							: isEmpty(record.application.car.plate)
					}
				}
			},
			{
				title: '申请人',
				name: 'applicant',
				tableItem: {
					render: (text, record) => {
						return  isEmpty(record.application.applicant.nickname)
					}
				}
			},
			{
				title: '手机号',
				name: 'username',

				tableItem: {
					render: (text, record) => {
						let user = record.application.applicant.username;
						if (user.indexOf("+86-") !== -1) user = user.replace("+86-", "");
						return user ? <span>{user}</span> : isEmpty(user)
					}
				}
			},
			{
				title: '所属部门',
				name: 'department',

				tableItem: {
					render: (text, record) => {
						return  record.application.department && record.application.department.name ? record.application.department.name : this.props.companyInfoResult.data.name
					}
				}
			},
			{
				title: '预约时间',
				name: 'orderTime',

				tableItem: {
					render: (text, record) => {
						return <span>
							<span className="order-time">
								<i className="point0DA736"/><span className="order-time-str">{record.application.startTime ? transformTime(record.application.startTime, formatType.noSeconds) : '-'}</span>
							</span>
							<br/>
							<span className="order-time">
								<i className="pointE80000"/><span className="order-time-str">{record.application.endTime ? transformTime(record.application.endTime, formatType.noSeconds) : '-'}</span>
							</span>
						</span>
					}
				}
			},
			{
				title: '用车方式',
				name: 'useCarType',
				tableItem: {
					render: (text, record) => {
						switch (record.type) {
							case 2:
								return '申请使用公车';
							case 4:
								return '直接派车';
							case 5:
								return '申请司机接送';
							default:
								return '-';
						}
					}
				}
			},
			{
				title: '行程状态',
				name: 'tripStatus',

				tableItem: {
					render: (text, record) => {
						// console.log(record.application.status);
						return UseCarTripStatusType(record.application.status)
					}
				}
			},
			// {
			// 	title: '任务时长',
			// 	name: 'missionTime',
			// 	tableItem: {
			// 		render: (text, record) => {
			// 			const missionTime = record.application.endTime - record.application.startTime;
			// 			let h = missionTime / 3600000;
			// 			let m = 0;
			// 			if (h >= 1) {
			// 				h = `${h}`.split(".")[0];
			// 				m = (missionTime - h * 3600000) / 60000;
			// 			} else {
			// 				h = 0;
			// 				m = missionTime / 60000;
			// 			}
			//
			// 			return <span>
			// 				<span>{`${h}时${m}分`}</span>
			// 			</span>
			// 		}
			// 	}
			// },
			{
				title: '操作',
				tableItem: {
					// fixed: 'right',
					render: (text, record) => {
						return <div className="operate">
							<Button title={'编辑'} className="theme-font-blue379EEC" onClick={this.handleShowTripDetail(record)}>详情</Button>
						</div>
					}
				}
			},
		]
	};
	handleChangeUseCarTablePage = (pageNum, pageSize) => {
		//表格换页
		this.searchFile.pageSize= pageSize || this.searchFile.pageSize;
		this.searchFile.pageNum = pageNum;

		const {startTime, endTime, applicant, type, status, carPlate} = this.searchFile;
		//判断是否为筛选状态
		if (startTime || endTime || applicant || type || status || carPlate) {
			this.requestCarApplyList(this.searchFile);
		} else {
			this.requestCarApplyList();
		}
	};
	handleSearch = searchFields => {

		const {inputType, inputSearch, search_car, search_trip_status, type} = searchFields;

		if (+inputType === 2 && !inputSearch && !search_car && !+search_trip_status) {
			//重置操作
			this.handleResetSearch();
			// this.setState({active: 0}); //不重置上面一行的搜索条件
			this.requestCarApplyList(this.searchFile);

		} else {

			if (inputSearch) {
				this.searchFile.applicant = inputSearch; //当前只有手机号，后面再关联 inputType
			} else {
				this.searchFile.applicant = "";
			}
			// if (type) this.searchFile.type = type;
			if (search_trip_status) this.searchFile.status = search_trip_status;
			if (search_car) this.searchFile.carPlate = search_car;
			if (Number(type) !== 'NaN' && type >= 0) this.searchFile.type = type;

			//查询重置页码
			this.searchFile.pageNum = 1;
			this.requestCarApplyList(this.searchFile);

		}

	};
	handleResetSearch = () =>{
		//第二排在第一排选中的范围内进行查询，需点击查询按钮才可对筛选结果进行搜索;搜索时重置页码
		const { startTime, endTime } = this.searchFile;
		this.searchFile = {
			startTime: startTime,
			endTime: endTime,
			applicant: "",
			type: 0,
			status: "",
			carPlate: "",
			pageNum: 1,
			pageSize: 10,
		};
	};
	//查看用车记录详情
	handleShowTripDetail = record => () => {
		this.setState({
			useCarDetailVisible: true,
			currentUseCarRecord: {...record}
		})
	};
	handleCancelModal = (visible) => () => {
		const _that = this;
		if (visible === 'useCarDetailVisible') {
			//销毁详情弹窗中的地图组件
			if (this.UseCarDetail.goOutDetailMap) this.UseCarDetail.goOutDetailMap.destroy();
			if (this.UseCarDetail.returnCarMap) this.UseCarDetail.returnCarMap.destroy();

			//下次查看详情默认显示外出详情-当前只有公车模式
			this.UseCarDetail.handleSwitchTripDetail("goOutDetail");

			this.setState({currentUseCarRecord: {}}, () => {
				_that.requestCarApplyList(_that.searchFile);
			});
		}

		this.setState({
			[visible]: false
		})

	};
	exportTableList = () => {
		window.open(export_car_apply_list_api({...this.searchFile}), "_self")
	};
	searchBarRef = barRef => {
		this.barRef = barRef;
	};


	render() {
		const { loading, } = this.props;
		const {
			useCarRecordList, useCarRecordTotal, active, useCarDetailVisible, currentUseCarRecord
		} = this.state;
		const {
			pageNum, pageSize
		} = this.searchFile;

		const useCarRecordDataTable = {
			classname: 'useCarRecordDataTable',
			loading,
			columns: this.useCarColumns(),
			rowKey: 'id',
			dataItems: {list: useCarRecordList, total: useCarRecordTotal, pageNum, pageSize},
			onChange: ({ pageNum, pageSize, }) => { this.handleChangeUseCarTablePage(pageNum, pageSize) },
		};

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
								<div className="primary-data">
									<Button className={cx({"active" : active === 0})} onClick={this.handlePickData(0)}>全部</Button>
									<Button className={cx({"active" : active === 1})} onClick={this.handlePickData(1)}>今天</Button>
									<Button className={cx({"active" : active === 2})} onClick={this.handlePickData(2)}>近三天</Button>
									<Button className={cx({"active" : active === 3})} onClick={this.handlePickData(3)}>近一周</Button>
									<Button className={cx({"active" : active === 4})} onClick={this.handlePickData(4)}>近一年</Button>
									<RangePicker
										onOk={this.onDatePickerConfirm}
										onChange={this.onDatePickerChange}
										dropdownClassName={"use-car-record-range-picker"}
										disabledDate={(current) => {
											// Can not select days before today and today
											return current && current > moment().endOf('day');
										}}
										// disabledTime={disabledRangeTime}
										showTime={{
											hideDisabledOptions: true,
											defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
										}}
										format="YYYY-MM-DD"
									/>

									<div className="export-car-apply">
										<Button onClick={this.exportTableList}><i className="export-excel-icon"/>导出至Excel</Button>
									</div>
								</div>
								<SearchBar onSubmit={this.handleSearch}
													 onRef={this.searchBarRef}
													 onReset={this.handleResetSearch}
													 fields={this.useCarRecordSearchFields()}/>
								<DataTable { ...useCarRecordDataTable }/>
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


				<UseCarDetail
					onRef={(ref) => {this.UseCarDetail = ref}}
					visible={useCarDetailVisible}
					customCancel={this.handleCancelModal("useCarDetailVisible")}
					useCarRecord={currentUseCarRecord}
				/>
			</div>
		)
	}
}

export default UseCarManagement ;