import React from 'react'
import cx from 'classnames'
import {connect} from "react-redux"
import Oss from 'ali-oss';

import {
	Form,
	Select,
	Button,
	Input,
	Upload,
	TreeSelect,
	message
} from 'antd'

import BaseComponent from '@/components/BaseComponent'
import ModalInfo from '@/components/modalInfo'
import moment from '@/components/moment'
import { regExpConfig, formatType } from "@/utils/index"
import {
	updateEmployeesHttp,
} from "@/api/index"
import {
	getUploadTokenHttp
} from '@api/common'
import {
	query_user_info_action,
} from '@actions/common'

import { genderSelect } from "./utils"
import './operateOrganization.less'

const Option = Select.Option;
const FormItem = Form.Item;

@connect((state) => ({
	userInfoResult: state.userInfoResult,
	companyInfoResult: state.companyInfoResult,
	departmentListResult: state.departmentListResult,
}))
class OperateEmployeesModal extends BaseComponent {
	state = {
		employeesAvatar: '',
		submitDisabledFlag: true, //默认禁止提交，需要编辑之后再校验是否可以提交
	};
	fileSize = 1024 *  100;
	formRef = React.createRef();

	componentDidMount() {
		this.props.onRef(this);
	};
	componentWillReceiveProps(nextProps) {
		const currentEmployees = nextProps.currentEmployees;
		if ((this.props.currentEmployees.id !== nextProps.currentEmployees.id) || (this.props.currentEmployees.inviteId !== nextProps.currentEmployees.inviteId)) {
			if (currentEmployees.id || currentEmployees.inviteId) {
				this.setState({
					employeesAvatar: currentEmployees.avatar,//
				})
			}
			else {
				this.setState({
					employeesAvatar: "",//上面用来模拟已上传,开发完要放开
				})
			}
		}
	};

	handleCancelModal = () => {
		this.formRef.current.resetFields();
		this.props.handleCancelModal();

		this.setState({
			employeesAvatar: "",//
		})
	};
	handlePreview = (url) => () => {
		this.props.handlePreview(url)
	};

	/*提交编辑*/
	onFinish = (values) => {
		const {
			currentEmployees: { avatar, id, inviteId },
			userInfoResult,
			getDepartmentStaffBySelectedKey,
			getDepartmentTreeData,
		} = this.props;
		const {  employeesAvatar, submitDisabledFlag } = this.state;
		const employeesId = id || inviteId;

		if (submitDisabledFlag) {
			return
		}

		Object.keys(values).map(key => values[key] = (values[key] && String(values[key]).trim()));

		const { username, nickname, sex, departmentId } = values;
		let param = {
			username,
			avatar: employeesAvatar || avatar,
			nickname,
			sex,
			departmentId: +departmentId === +this.props.companyId ? 0 : +departmentId,
		};

		//编辑
		if (employeesId) {
			let type = 0;//0-修改正式员工信息(未加入企业时,修改的是自己的信息,也传0),1-修改邀请员工的信息
			if (inviteId) type = 1;
			updateEmployeesHttp(employeesId, type, param).then(() => {
				//刷新table
				getDepartmentStaffBySelectedKey();
				//刷新组织结构树：(场景)迁移员工到其他部门
				getDepartmentTreeData();
				//编辑的是否为当前登录的账号
				console.log("编辑成功", userInfoResult);
				if (username === userInfoResult.data.username) {
					//更新登录账号信息 同login
					this.props.dispatch(query_user_info_action(param));
				}
				message.success("编辑成功");

			})
		}
		//邀请
		else {
			this.props.sendInvite(param);
		}
		this.handleCancelModal();
	};
	//自定义 antd Upload Props
	OSSData = {}; //OSSData 不可定义在 getUploadProps 函数中 在 customRequest 将无法获取
	getUploadProps = () => {
		const _that = this;
		let fileName = '';
		let fileDataName = '';

		return {
			name: '', 	 //使用了customRequest覆盖
			action: '',  //使用了customRequest覆盖
			showUploadList: false,
			multiple: false, //是否多选文件
			beforeUpload: async (file) => {
				console.log('beforeUpload start');

				fileDataName = `${file.name}`;
				const imgType = fileDataName.split('.').reverse()[0];

				if (file.size > this.fileSize) {
					message.warning("图片超过100K,请重新选择");
					return false
				}
				else if ( imgType !== 'jpg' && imgType !== "png" ) {
					message.warning("仅支持jpg和png格式的图片，请重新选择");
					return false
				}

				//token是暂存再我们的后台，是否超时后台有定时器判断，每次需要只管掉接口要
				this.OSSData = await getUploadTokenHttp({"cloudType": 3, "resType": 3});
				return true
			},
			customRequest: ({ file, onError, onSuccess }) => {
				// 上传的filename
				try {
					const {
						AccessKeyId,
						AccessKeySecret,
						SecurityToken,
					} = this.OSSData;
					const client = new Oss({
						accessKeyId: AccessKeyId,
						accessKeySecret: AccessKeySecret,
						stsToken: SecurityToken,
						region: 'oss-cn-hangzhou',// 'http://ddp-data.oss-cn-hangzhou.aliyuncs.com',
						bucket: 'ddp-imgs',
					});
					const reader = new FileReader();

					reader.readAsDataURL(file);
					reader.onloadend = () => {
						fileDataName = fileDataName.split(".").reverse()[0]; //只使用文件后缀，不使用文件名, 记得带上 .
						fileName = `ddpentr/${this.props.companyInfoResult.data.code}/employees/avatar/${moment().format(formatType.urlFormat)}/${moment().format(formatType.fileFormat)}.${fileDataName}`;

						client.multipartUpload(fileName, file).then(result => {
							onSuccess(result)
						}).catch(onError)
					};
				} catch (e) {

				}
			},
			onSuccess(result, file) {
				let downloadUrl = result.res.requestUrls[0];
				downloadUrl = downloadUrl.indexOf('?uploadId=') >= 0 ? downloadUrl.substring(0, downloadUrl.indexOf('?uploadId=')) : downloadUrl;

				_that.setState({
					employeesAvatar: downloadUrl,
					name: file.name
				});
			},
			onError(err) {
				message.error("上传出错")
			},
		}
	};
	onFormValuesChange = (changedValues, allValues) => {
		const {
			currentEmployees,
		} = this.props;
		const {
			nickname,
			username,
			departmentId,
		} = allValues;

		//编辑 nickname username
		if (currentEmployees.id || currentEmployees.inviteId) {
			if (nickname && username) {
				this.setState({
					submitDisabledFlag: !Boolean(nickname && username)
				})
			}
		}
		//邀请 nickname username departmentId
		else {
			this.setState({
				submitDisabledFlag: !Boolean(nickname && username && departmentId >= 0)
			});
		}
	};

	render() {
		const {
			currentEmployees,
			visible,
			departmentListResult: { treeData }
		} = this.props;
		const { employeesAvatar, submitDisabledFlag } = this.state;
		const form = this.formRef.current;
		const formItemLayout = {
			labelCol: {span: 7},
			wrapperCol: {span: 14},
			colon: false, // 隐藏冒号
		};

		let isEditFlag = currentEmployees.id || currentEmployees.inviteId;
		isEditFlag = isEditFlag >= 0;


		let treeDefaultExpandedKeys = ["0"];
		//是否有上传成功后的头像地址，优先使用上传后的地址
		const avatarUrl = employeesAvatar || (currentEmployees && currentEmployees.avatar);
		const staffId = currentEmployees ? (currentEmployees.id || currentEmployees.inviteId) : Date.now();

		return (
			<ModalInfo
				title={isEditFlag ? "编辑员工" : '邀请员工'}
				className="form-modal operateEmployeesFormModal"
				showTxt="operateEmployeesVisible"
				visible={visible}
				footer={null}
				cancel={this.handleCancelModal}
				closable={false}
				width={400}
			>
				<div className="operateEmployeesFormWrapper" key={staffId}>
					<Form
						{...formItemLayout}
						className="operate-employees-form"
						onFinish={this.onFinish}
						onValuesChange={this.onFormValuesChange}
						ref={this.formRef}
						initialValues={{//FormItem 也可以设置initialValue form上的权重更高
							'nickname': currentEmployees.nickname,
							'sex': currentEmployees.sex ? String(currentEmployees.sex) : undefined,
							'username': currentEmployees.username,
							'departmentId': currentEmployees.department ? (currentEmployees.department.id || 0) : 0,
						}}
					>
						<FormItem
							label="员工头像"
							name="avatar"
							rules={[]}
						>
							<div className="driver-img-wrapper">
								{
									avatarUrl
										? <img src={avatarUrl} alt="头像" className="avatar" onClick={this.handlePreview(avatarUrl)} />
										: <div className="avatar avatar-default" />
								}
								<div className="driver-img-item">
									<Upload
										name="avatar"
										className="employees-img-uploader"
										{...this.getUploadProps()}
									>
										<Button type="primary" className="upload-avatar-btn">上传头像</Button>
									</Upload>
								</div>
							</div>
						</FormItem>
						<FormItem
							label="员工姓名"
							name="nickname"
							rules={[
								{ required: true },
								{ max: 20, message: '最大长度20字符' }
							]}
						>
							<Input autoComplete="off" placeholder="请输入" />
						</FormItem>
						<FormItem
							label="员工性别"
							name="sex"
							{...formItemLayout}
						>
							<Select placeholder="请输入" >
								{
									genderSelect.map(item => {
										return <Option value={item.value} key={item.value}>{item.txt}</Option>
									})
								}
							</Select>
						</FormItem>
						<FormItem label="联系方式"
											name="username"
											validateTrigger="onBlur"
											rules={[
												{ required: true },
												{ pattern: regExpConfig.mobileOrEmail, message: '请输入正确的联系方式' },
											]}
						>
							<Input autoComplete="off" placeholder="请输入联系方式" disabled={isEditFlag} />
						</FormItem>
						<FormItem
							label={'所属部门'}
							name="departmentId"
							validateTrigger="onChange"
							rules={[
								{ required: true, message: '请选择所属部门' },
							]}
						>
							<TreeSelect
								placeholder="请选择"
								style={{
									width: '100%',
								}}
								treeData={treeData}
								treeDefaultExpandAll={false}
								treeDefaultExpandedKeys={treeDefaultExpandedKeys}
								dropdownStyle={{maxHeight: "260px"}}
							/>
						</FormItem>

						<div className="buttons form-modal-buttons text_r">
							<Button type="sub-message" className="cancel" onClick={this.handleCancelModal} >取消</Button>
							<Button type="primary" className={cx("confirm-btn", {"action": !submitDisabledFlag})} htmlType="submit">{currentEmployees.id || currentEmployees.inviteId ? "确定保存" : '发送邀请'}</Button>
						</div>
					</Form>
				</div>

			</ModalInfo>
		)
	}
}
export default OperateEmployeesModal;