import React from 'react';
import {
	Tabs, Button,
} from 'antd';
import cx from 'classnames';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { connect } from "react-redux";

import BaseComponent from '@components/BaseComponent';
import { transformTime } from '@components/moment';
import { formatType, UseCarTime } from '@utils';
import ModalImg from '@components/ModalImg';
import AMapLoader from '@amap/amap-jsapi-loader';
import { AMAM_AK } from '@config';

import './useCarDetail.less';
import startImg from '../../assets/imgs/useCarManagement/map_start@2x.png';
import endImg from '../../assets/imgs/useCarManagement/map_end@2x.png';
import passImg from '../../assets/imgs/useCarManagement/map_pass@2x.png';
import locateImg from '../../assets/imgs/useCarManagement/locate@2x.png';
import driverAvatarImg from '../../assets/imgs/useCarManagement/driverAvatar@2x.png';


const { TabPane } = Tabs;

@connect((state) => ({
	companyInfoResult: state.companyInfoResult,
}))

class UseCarDetail extends BaseComponent {

	state = {
		activeKey: "goOutDetail", //默认key, 由于详情中地图容器不可销毁，则tab未销毁，所以 activeKey 须手动初始化
		viewImgVisible: false,//查看图片弹窗
		currentViewImgUrl: '',//查看图片地址
	};

	goOutDetailMap = null;//外出详情地图实例
	returnCarMap = null;//还车位置地图实例
	companyObj = {};

	componentDidMount() {
		this.props.onRef(this);
		this.companyObj = this.props.companyInfoResult.data;
	};

	//当前用车详情中的数据均来自用车记录列表
	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.visible) {
			console.log('UseCarDetail componentWillReceiveProps ======', Date.now());
			const _that = this;
			const {
				useCarRecord: { id, application },
			} = nextProps;

			let viaLocation = [], departure = [], destination = [];
			if (application) {
				viaLocation = application.viaLocation;
				departure = application.departure;
				destination = application.destination;
			}

			const hasStartPoint = Object.keys(departure).length > 0;
			const hasPassPoint = viaLocation.length > 0;
			const hasEndPoint = Object.keys(destination).length > 0;

			//关闭弹窗时已经销毁了地图，所以即使Id相同时也要重新加载地图, 如果没有位置就不加载地图
			if (id && (hasStartPoint || hasPassPoint || hasEndPoint)) {
				//AMap使用使用 JSAPI Loader加载 允许多次执行加载操作，网络资源不会重复请求
				AMapLoader.load({
					"key": AMAM_AK,   // 申请好的Web端开发者Key，首次调用 load 时必填
					"version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
					"plugins": []  			//插件列表
				}).then((AMap)=>{
					let mapCenterLong = 0, mapCenterLat = 0;
					//地图初始中心默认为中心点，如果没有就途径，如果再没有就起点，避免报错默认给个坐标
					if (hasEndPoint && destination.longitude && destination.latitude) {
						mapCenterLong = destination.longitude; mapCenterLat = destination.latitude;
					} else if	(hasPassPoint && viaLocation[0].longitude && viaLocation[0].latitude) {
						mapCenterLong = viaLocation[0].longitude; mapCenterLat = viaLocation[0].latitude;
					} else if (hasStartPoint && departure.longitude && departure.latitude) {
						mapCenterLong = departure.longitude; mapCenterLat = departure.latitude;
					} else {
						mapCenterLong = 113.93575061772154; mapCenterLat = 22.52444699573078;
					}

					_that.goOutDetailMap = new AMap.Map('goOutDetailMap', {
						zoom: 11,//级别
						center: [mapCenterLong, mapCenterLat],//中心点坐标
						scrollWheel: true, // 鼠标滚轮缩放
					});
					// 同时引入工具条插件，比例尺插件和鹰眼插件
					AMap.plugin([
						'AMap.ToolBar',
					], function(){
						// 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
						_that.goOutDetailMap.addControl(new AMap.ToolBar({
							position: {
								right: "10px",
								bottom: "10px",
							},
						}));

					});

					if (hasStartPoint) {
						// 构造起点标记
						const startMarket = new AMap.Marker({
							position: [+departure.longitude, +departure.latitude],
							anchor:'bottom-center',
						});
						const passIcon = new AMap.Icon({
							size: new AMap.Size(50, 56), // 图标尺寸
							image: startImg, // Icon的图像
							imageSize: [50, 56], // 根据所设置的大小拉伸或压缩图片
						});
						startMarket.setIcon(passIcon);
						_that.goOutDetailMap.add(startMarket);
					}

					if (hasPassPoint) {
						const markerList = [];
						viaLocation.forEach(item => {
							// 构造途径点标记
							let passMarket = new AMap.Marker({
								position: [+item.longitude, +item.latitude],
								anchor:'bottom-center',
							});
							const passIcon = new AMap.Icon({
								size: new AMap.Size(50, 56), // 图标尺寸
								image: passImg, // Icon的图像
								imageSize: [50, 56], // 根据所设置的大小拉伸或压缩图片
							});
							passMarket.setIcon(passIcon);
							markerList.push(passMarket);
							passMarket = null;
						});
						_that.goOutDetailMap.add(markerList);
					}

					if (hasEndPoint) {
						// 构造终点标记
						const endMarket = new AMap.Marker({
							position: [+destination.longitude, +destination.latitude],
							anchor:'bottom-center',
						});
						const passIcon = new AMap.Icon({
							size: new AMap.Size(50, 56), // 图标尺寸
							image: endImg, // Icon的图像
							imageSize: [50, 56], // 根据所设置的大小拉伸或压缩图片
						});
						endMarket.setIcon(passIcon);
						_that.goOutDetailMap.add(endMarket);
					}


				}).catch(e => {
					console.log(e);
				})
			}
		}
	}

	//行程详情 - 切换具体内容
	handleSwitchTripDetail = (activeKey) => {
		const _that = this;
		let {latitude, longitude} = this.props.useCarRecord.application.returnTripInfo.addressInfo || {};

		//切换到还车位置再挂载还车位置de地图，如果没有经纬度，就不加载地图; 如果地图已加载，不重复加载
		if (activeKey === "returnCar" && latitude && longitude) {
			if ((activeKey !== this.state.activeKey  && !this.returnCarMapEl) || !this.returnCarMapEl.childNodes.length) {
				//AMap使用使用 JSAPI Loader加载 允许多次执行加载操作，网络资源不会重复请求
				AMapLoader.load({
					"key": AMAM_AK,     // 申请好的Web端开发者Key，首次调用 load 时必填
					"version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
					"plugins": []  			//插件列表
				}).then((AMap)=>{

					let zoomNum = 17;

					if (!latitude || !longitude) {
						// latitude = 113.93575061772154;
						// longitude = 22.52444699573078;
						longitude = 116.39636993;
						latitude = 39.9173729;
					}

					_that.returnCarMap = new AMap.Map('returnCarMap', {
						zoom:zoomNum,//级别
						// center: [+latitude, +longitude],//中心点坐标
						center: [+longitude, +latitude],//中心点坐标
						scrollWheel: true, // 鼠标滚轮缩放
					});

					// 同时引入工具条插件，比例尺插件和鹰眼插件
					AMap.plugin([
						'AMap.ToolBar',
					], function(){
						// 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
						_that.returnCarMap.addControl(new AMap.ToolBar({
							position: {
								right: "10px",
								bottom: "10px",
							},
						}));

					});

					// 构造点标记
					const marker = new AMap.Marker({
						position: [+longitude, +latitude],
						anchor:'bottom-center',
					});

					const newIcon = new AMap.Icon({
						size: new AMap.Size(44, 49), // 图标尺寸
						image: locateImg, // Icon的图像
						imageSize: [44, 49], // 根据所设置的大小拉伸或压缩图片
					});
					marker.setIcon(newIcon);

					// 单独将点标记添加到地图上
					_that.returnCarMap.add(marker);

				}).catch(e => {
					console.log(e);
				})
			}

		}

		this.setState({activeKey})
	};
	getUseCarTime = (start, end) => {

		const missionTime = end - start;
		let h = missionTime / 3600000;
		let m = 0;
		if (h >= 1) {
			h = `${h}`.split(".")[0];
			m = (missionTime - h * 3600000) / 60000;
		} else {
			h = 0;
			m = missionTime / 60000;
		}

		return `${h}时${m}分`
	};
	renderRiders = (riders) => {
		let str = '';
		if (riders.length) {
			riders.forEach(item => {
				if (str.length > 0) {
					str += `,${item.nickname}`
				} else {
					str = `${item.nickname}`
				}
			})
		}
		return str
	};

	// renderTripStep = (tripSteps) => {
	// 	return tripSteps.map((item, index) => {
	// 		return <div key={item.id} className={cx('trip-step-item', {'bg-gray': !(index % 2 === 0)})}>
	// 			<div className="trip-step-inner"><Button className="trip-step-start">起点</Button><span>{transformTime(item.startTime, formatType.xFormat)}</span><span>{item.displayaddress}</span></div>
	// 			<div className="trip-step-inner"><Button className="trip-step-end">终点</Button><span>{transformTime(item.startTime, formatType.xFormat)}</span><span>{item.displayaddress}</span></div>
	// 			<div><span>行驶时长：</span><span>3小时40分</span></div>
	// 			<div><span>行驶里程：</span><span>14.5公里</span></div>
	// 		</div>
	// 	});
	// };

	handleViewImg = url => () => {
		this.setState({
			viewImgVisible: true,
			currentViewImgUrl: url,
		})
	};
	/**
	 *
	 * @param files
	 * @param type	0-停车点照片，1-车身照片，2-里程表照片
	 * @returns {*}
	 */
	renderStopCarPointImg = (files, type) => {
		if (files && files.length) {
			const stopCarPointImg = files.filter(item => +item.type === +type);

			return stopCarPointImg.map(item => {
				return <img src={item.path} alt="车辆" key={item.id} onClick={this.handleViewImg(item.path)}/>
			})
		}
	};

	render() {
		const {
			visible,
			customCancel,
			useCarRecord,
			useCarRecord: {auditor, application, auditTime},
		} = this.props;
		const {
			activeKey, viewImgVisible, currentViewImgUrl,
		} = this.state;


		let useCarTimeText = "-";
		let tripStartTime = "-" , //行程开始时间
			tripEndTime = "-",			//行程结束时间
			outTime = 0,						//还车超时时长
			outTimeText = "",
			tripOutTime = 0, 				//用车超时时长
			tripOutText = "";

		if (application && application.beginTime && application.startTime) {
			let { beginTime, completedTime, startTime, endTime} = application;
			//行程真正开始的时间
			tripStartTime = transformTime(beginTime, formatType.noSeconds);
			tripEndTime =  transformTime(completedTime, formatType.noSeconds);
			//计算用车时长
			useCarTimeText = UseCarTime(beginTime, completedTime);
			//计算还车超时时长
			outTime = completedTime - endTime;
			if (outTime > 0) {
				outTimeText = UseCarTime(0, outTime);
			}
			//计算用车超时时长 (实际用车) - (预约用车)
			tripOutTime = (completedTime - beginTime) - (endTime - startTime);
			if (tripOutTime > 0) {
				tripOutText = UseCarTime(0, tripOutTime);
			}
		}

		const applicationStatus = application ? +application.status : 999;
		const tripStarted = applicationStatus === 5 || applicationStatus === 6;
		const tripEnded = applicationStatus === 6;


		let viaLocation = [];
		let startKm = 0, endKm = 0; //出发里程、结束里程
		if (application) {
			if (application.departTripInfo.kilometer && application.departTripInfo.kilometer >= 0) startKm = application.departTripInfo.kilometer;
			if (application.returnTripInfo.kilometer && application.returnTripInfo.kilometer >= 0) endKm = application.returnTripInfo.kilometer;

			viaLocation = application.viaLocation;
		}

		/*地图挂载的容器销毁后会捕捉到错误，暂时没找到更好的解决方案*/
		return (
			<div className={cx("use-car-detail-warp", {"none": !visible})}>

				<div className="use-car-detail-inner">

					{
						visible && application ? <div className="left-tab">

							<div className="left-card-head">
								<img src={application.applicant.avatar || driverAvatarImg} alt="头像"/>
								<div className="driver-detail">
									{/*申请详情*/}
									<div><span className="driver-nickname">{application.applicant.nickname}</span><Button className="theme-btn-opacity-blue">{application.department && application.department.name ? application.department.name : this.companyObj.name}</Button></div>
									<p className="driver-username">{(() => {
										let username = application.applicant.username;
										if (username && username.indexOf("+86-") !== -1) username = username.replace("+86-", "");

										return username
									})()}</p>
								</div>
							</div>

							<div className="trip-detail">

								<div className="trip-detail-item">
									<div className="trip-detail-label">申请车辆</div>
									<div className="trip-detail-value" style={{display: "flex"}}>
										{
											// 车标暂时不要了
											// application.car.carbrand && application.car.carbrand.logo ? <img src={application.car.carbrand && application.car.carbrand.logo || ""} alt="" className="trip-use-car-logo flex"/> : null
										}

										{/*<img src={[require("./carLogo@2x.png")]} alt="车标" className="trip-use-car-logo flex"/>*/}
										<p>{`${application.car.plate}（${application.car.carBrand.brandName} ${application.car.carBrand.seriesName}）`}</p>
									</div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">申请时间</div>
									<div className="trip-detail-value"><p>{transformTime(application.applicationTime, formatType.xFormat)}</p></div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">驾驶人</div>
									<div className="trip-detail-value"><p>{`${application.driver.nickname}（${application.driver.username}）`}</p></div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">用车时间</div>
									<div className="trip-detail-value"><p>{transformTime(application.startTime, formatType.noSeconds)}</p></div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">还车时间</div>
									<div className="trip-detail-value"><p>{transformTime(application.endTime, formatType.noSeconds)}</p></div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">用车时长</div>
									<div className="trip-detail-value"><p>{this.getUseCarTime(application.startTime, application.endTime)}</p></div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">出发地点</div>
									<div className="trip-detail-value"><p>{application.departure.displayaddress || '-'}</p></div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">目的地点</div>
									<div className="trip-detail-value"><p>{application.destination.displayaddress || '-'}</p></div>
								</div>

								<div className="trip-detail-item">
									<div className="trip-detail-label">途经地点</div>
									<div className="trip-detail-value">
										<p>
											{
												viaLocation.length ?	viaLocation.map((item, viaIndex) => {

													return <span key={item.id}>
															{item.displayaddress}{viaIndex === viaLocation.length - 1 ? "" : "、"}
													</span>
													// return <p key={item.id}>{item.displayaddress}</p>
												}) : "-"
											}
										</p>
									</div>
								</div>


								<div className="trip-detail-item">
									<div className="trip-detail-label">出行事由</div>
									<div className="trip-detail-value">
										<p>{application.reason}</p>
									</div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">乘车人</div>
									<div className="trip-detail-value"><p>{this.renderRiders(application.riders)}</p></div>
								</div>
								<div className="trip-detail-item">
									<div className="trip-detail-label">审批人</div>
									<div className="trip-detail-value">
										<p className="wrap-bottom">{auditor.nickname ? auditor.nickname : "系统自动处理"}</p>
										<p className="theme-font-gray555763">{auditTime ? transformTime(auditTime, formatType.noSeconds) : "-"}</p>
									</div>
								</div>

							</div>
						</div> : null
					}

					<div className="right-tab">

						<i className="mask-close-btn" onClick={customCancel}/>
						<Tabs defaultActiveKey="goOutDetail"
									activeKey={activeKey}
									tabPosition="top"
									tabBarGutter={14}
									onChange={this.handleSwitchTripDetail}>

							<TabPane tab="外出详情" key="goOutDetail">
								<div className="custom-tab-item-wrap">

									{
										visible && application ? <div>
											<div className="trip-detail-item">
												<span className="theme-font-gray555763 trip-detail-label">实际用车时间</span><span className="trip-detail-value">{tripStartTime}</span>
											</div>
											<div className="trip-detail-item">
												<span className="theme-font-gray555763 trip-detail-label">实际还车时间</span><span className="trip-detail-value">{tripEndTime}</span>
												{
													outTime && outTimeText ? <Button icon={<ExclamationCircleOutlined />} className="theme-btn-opacity-red">超时{outTimeText}</Button> : null
												}
											</div>
											<div className="trip-detail-item">
												<span className="theme-font-gray555763 trip-detail-label">实际用车时长</span><span className="trip-detail-value">{useCarTimeText}</span>
												{
													tripOutTime && tripOutText ? <Button icon={<ExclamationCircleOutlined />} className="theme-btn-opacity-red">超时{tripOutText}</Button> : null
												}
											</div>
											<div className="trip-detail-item">
												<span className="theme-font-gray555763 trip-detail-label">总计行驶里程</span><span className="trip-detail-value">
												{
													endKm - startKm !== 0 ? `${endKm - startKm}公里` : "-"
												}
											</span>
											</div>
										</div> : null
									}
									{/*地图容器不销毁*/}
									<div className="goOutDetail-map-window"  id="goOutDetailMap"  ref={(ref)=>{this.goOutDetailMapEl = ref}}/>

									{/*todo 当前没有这个*/}
									{
										// visible && activeKey === "goOutDetail" ? <div>
										// 	{this.renderTripStep(this.mockData)}
										// </div> : null
									}

								</div>

								{/*<div className="content-empty">暂无数据</div>*/}
							</TabPane>

							{
								useCarRecord.type && useCarRecord.type !== 5 ? <TabPane tab="还车位置" key="returnCar">

									<div className="custom-tab-item-wrap">

										{
											visible && application ? <div className="returnCar-detail-item">
												<span className="theme-font-gray555763 trip-detail-label">停车地点</span>
												<span className="trip-detail-value">{(application.returnTripInfo.addressInfo && application.returnTripInfo.addressInfo.displayaddress) || "-"}</span>
											</div> : null
										}
										<div className="returnCar-map-window" id="returnCarMap" ref={(ref)=>{this.returnCarMapEl = ref}}/>
										{
											visible && application ? <div>
												<div className="returnCar-detail-item">
													<span className="theme-font-gray555763 trip-detail-label">具体车位</span>
													<span className="trip-detail-value">{(application.returnTripInfo && application.returnTripInfo.parking) || '-'}</span>
												</div>
												<div className="returnCar-detail-item">
													<span className="theme-font-gray555763 trip-detail-label">停车点照片</span>
												</div>
												<div className="trip-detail-img-item">
													{this.renderStopCarPointImg(application.returnTripInfo.files,0) || "-"}
												</div>
											</div> : null
										}

									</div>

									{/*<div className="content-empty">暂无数据</div>*/}

								</TabPane> : null
							}
							{
								useCarRecord.type && useCarRecord.type !== 5 ? <TabPane tab="车况上报" key="carDetail">

									{
										visible ? <div>
											<div className="custom-tab-item-wrap">

												<div className="trip-detail-item">
													<span className="theme-font-gray555763 trip-detail-label">出发上报</span>
													{tripStarted ? (application.departTripInfo.damaged ? <span className="trip-detail-value theme-font-redE80000">有损伤</span> : <span className="trip-detail-value">无损伤</span>) : "-"}
												</div>
												{
													tripStarted && application.departTripInfo.damaged ? <div>
														<div className="trip-detail-item">
															<span className="theme-font-gray555763 trip-detail-label">车损照片</span>
														</div>
														<div className="trip-detail-img-item">
															{this.renderStopCarPointImg(application.departTripInfo.files,1) || "-"}
														</div>
														<div className="trip-detail-item">
															<span className="theme-font-gray555763 trip-detail-label">情况说明</span>
															<span className="trip-detail-value">{application.departTripInfo.des || "-"}</span>
														</div>

														<div className="trip-detail-item">
															<span className="theme-font-gray555763 trip-detail-label">出发里程</span><span className="trip-detail-value">
														{application.departTripInfo && application.departTripInfo.kilometer && +application.departTripInfo.kilometer >= 0 ? `${application.departTripInfo.kilometer}公里` : "-"}
													</span>
														</div>
														<div className="trip-detail-item">
															<span className="theme-font-gray555763 trip-detail-label">里程照片</span>
														</div>
														<div className="trip-detail-img-item">
															{
																(application.departTripInfo.files && application.departTripInfo.files.length) || (application.returnTripInfo.files && application.returnTripInfo.files.length) ? <div>
																	{this.renderStopCarPointImg(application.departTripInfo.files,2) || "-"}
																</div> : "-"
															}
														</div>
													</div> : null
												}


												<div className="trip-detail-item">

													<span className="theme-font-gray555763 trip-detail-label">还车上报</span>
													{
														tripEnded ? (application.returnTripInfo.damaged ? <span className="trip-detail-value theme-font-redE80000">有损伤</span> : <span className="trip-detail-value">无损伤</span>) : "-"
													}
												</div>

												{
													tripEnded && application.returnTripInfo.damaged ? <div>
														<div className="trip-detail-item">
															<span className="theme-font-gray555763 trip-detail-label">车损照片</span>
														</div>
														<div className="trip-detail-img-item">
															{this.renderStopCarPointImg(application.returnTripInfo.files,1) || "-"}
														</div>
														<div className="trip-detail-item">
															<span className="theme-font-gray555763 trip-detail-label">情况说明</span><span className="trip-detail-value">{application.returnTripInfo.des || "-"}</span>
														</div>

														<div className="trip-detail-item">
															<span className="theme-font-gray555763 trip-detail-label">还车里程</span><span className="trip-detail-value">
														{application.returnTripInfo && application.returnTripInfo.kilometer +application.returnTripInfo.kilometer >= 0 ? `${application.returnTripInfo.kilometer}公里` : "-"}
													</span>
														</div>
														<div className="trip-detail-item">
															<span className="theme-font-gray555763 trip-detail-label">里程照片</span>
														</div>
														<div className="trip-detail-img-item">
															{
																(application.returnTripInfo.files && application.returnTripInfo.files.length) || (application.returnTripInfo.files && application.returnTripInfo.files.length) ? <div>
																	{this.renderStopCarPointImg(application.returnTripInfo.files,2) || "-"}
																</div> : "-"
															}
														</div>
													</div> : null
												}
											</div>

											{/*<div className="content-empty">暂无数据</div>*/}
										</div> : null
									}

								</TabPane> : null
							}



							{/*<TabPane tab="行程费用" key="tripCost">

								{
									visible ? <div>
										<div className="custom-tab-item-wrap">

											<div className="tripCost-detail-item theme-font-gray555763">
												<span className="trip-detail-label">报销审批状态</span><span className="trip-detail-value">-</span>
											</div>
											<div className="tripCost-detail-item detail-title">
												<span className="trip-detail-label">其他费用</span>
											</div>
											<div className="tripCost-detail-item">
												<span className="trip-detail-label">过路费</span><span className="trip-detail-value">-</span>
											</div>
											<div className="tripCost-detail-item">
												<span className="trip-detail-label">过桥费</span><span className="trip-detail-value">-</span>
											</div>
											<div className="tripCost-detail-item">
												<span className="trip-detail-label">停车费</span><span className="trip-detail-value">-</span>
											</div>
											<div className="tripCost-detail-item detail-title" style={{marginTop: "30px"}}>
												<span className="trip-detail-label">费用总计</span>
											</div>
											<div className="tripCost-detail-item label-big">
												<span className="trip-detail-label theme-font-gray555763">-</span>
											</div>

										</div>

										<div className="content-empty">暂无数据</div>
									</div> : null
								}

							</TabPane>*/}

						</Tabs>

					</div>

				</div>

				{
					viewImgVisible ? <ModalImg width={1070} visible="viewImgVisible" cancel={this.handleCancelModal}>
						<img src={currentViewImgUrl} alt="车辆状况" />
					</ModalImg> : null
				}

			</div>
		)
	}
}

export default UseCarDetail;