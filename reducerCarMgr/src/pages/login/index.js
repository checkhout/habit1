import React, { Component } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import qs from 'qs'
import { connect } from 'react-redux'

import { regExpConfig } from "@/utils/index";
import {
	reset_store_action,
	login_action,
	query_user_info_action,
	query_company_info_action,
} from '@actions/common'
import {
	captchaHttp,
} from '@api/common'
import ModalInfo from '@components/modalInfo'

import cx from 'classnames'

import './index.less'

const FormItem = Form.Item;

@connect((state) => ({
	loginResult: state.loginResult,
	companyInfoResult: state.companyInfoResult,
}))

class Login extends Component {
	// 初始化页面常量 绑定事件方法
	constructor(props) {
		super(props);
		this.state = {
			btnStatusFlag: false,
			codeUrl: `${captchaHttp}?t=${new Date().getTime()}`,
			warningVisible: false, //无登录权限提示框
			loginFlag: false,//点击提交马上显示loading
		};
		//清除遗留登录数据
		sessionStorage.clear();
		this.props.dispatch(reset_store_action());
		this.formRef = React.createRef();
	}

	resetCode = (e) => {
		this.setState({
			codeUrl: `${captchaHttp}?t=${Math.random()}`
		})
	};
	onFinish = (values) => {
		const _that = this;
		Object.keys(values).map(key => values[key] = (values[key] && values[key].trim()));

		let param = {
			"username": values.loginName,
			"password": values.loginPassword,
			'pcode': '0x2003',
			"client": 'web',
			"from": 1,
			"rememberMe": true,
			"code": values.loginCode,
		};
		param = qs.stringify(param);

		_that.setState({loginFlag: true}, () => {
			//1. 登录
			_that.props.dispatch(login_action(param, () => {

				// 2. 获取用户信息
				_that.props.dispatch(query_user_info_action(param, res2 => {
					const userInfo = res2;
					// userInfo.isSuperAdmin = res2.roles.filter(item => item === "ROLE_ddp2b_superadmin").length > 0;
					userInfo.isAdmin = res2.roles.filter(item => item === "ROLE_ddp2b_admin").length > 0;
					userInfo.isCertificationAudit = res2.roles.filter(item => item === "ROLE_ddp2b_platform_operator").length > 0;

					//3. 获取用户所在公司信息
					_that.props.dispatch(query_company_info_action(param, data => {
						// data.id = 0;//默认公司id为0 **未保证数据单向性，禁止直接修改回调参数，会影响到reducer数据**

						if (userInfo.isAdmin) {
							this.props.history.replace('/')
						} else if (userInfo.isCertificationAudit) { //只是认证审核员时
							this.props.history.replace('/app/certificationAudit')
						}
					}, err => {
						message.error("公司数据获取失败")
					}));

				}, err => {
					message.error("用户数据获取失败")
				}));

			}, err => {
				console.log(err);
				const switchErr = () => {
					switch (+err.error_code) {
						case 1:
							return "验证码不正确";
						case 2:
							return "验证码过期";
						case 3:
							return "账号或密码输入不正确";
						case 4:
							return "账号不存在";
						case 5:
							return "用户锁定";
						case 6:
							return "账号禁用";
						case 7:
							return "账号过期";
						case 8:
							return "账号未激活";
						case 9:
							return "参数异常";
						case 10:
							return "用户条款政策未许可";
						case 11:
							return "";
						case 99:
							return "用户认证错误";
						default:
							break;
					}
				};

				_that.setState({
					codeUrl: `${captchaHttp}?t=${new Date().getTime()}`,
					loginFlag: false,
				});
				_that.formRef.current.setFields([{
					errors: [switchErr()],
					name: 'loginCode'
				}])
			}));
		});

	};

	handleCancelModal = (visible) => {
		return () => {
			this.setState({
				[visible]: false,
			})
		}
	};


	onValuesChang = () => {
		const loginName = this.formRef.current.getFieldValue("loginName");
		const loginPassword = this.formRef.current.getFieldValue("loginPassword");
		const loginCode = this.formRef.current.getFieldValue("loginCode");

		const btnStatusFlag = Boolean(regExpConfig.phone.test(loginName) && regExpConfig.pwd.test(loginPassword) && loginCode);
		this.setState({btnStatusFlag})
	};

	render() {
		const { warningVisible, btnStatusFlag, loginFlag } = this.state;
		const { companyInfoResult: {loadingCompanyInfo} } = this.props;

		const springFlag = loginFlag || loadingCompanyInfo;
		return (
			<Spin spinning={springFlag} delay={500} wrapperClassName="login-spin">
				<div className="login">
					<div className="login-content-wrap">
						<div className='login-content-left'>

							<p className='content-txt-big'>欢迎使用盯盯拍企业版</p>
							<p className='content-txt-middle'>
								<span>用车更安全</span>
								<span>管车更高效</span>
								<span>报销更简单</span>
							</p>
							{/*部分样式在layout里面*/}
							<i className='app-code'>
							</i>
							<p className='content-txt-small '>
								扫码下载
							</p>
							<p className='content-txt-small '>
								盯盯拍企业版APP <i className="app-type-icon"/>
							</p>
							<p className="content-txt-tip">（iOS用户请直接在AppStore下载）</p>

						</div>
						<div className="login-form">
							<div className="login-content">
								<p className='login-text'>管理员登录</p>

								<Form onFinish={this.onFinish} ref={this.formRef}
											onFieldsChange={this.onValuesChang}
								>
									<FormItem name="loginName" rules={[
										{
											required: true, message: '请输入手机号',
										},
										{ pattern: regExpConfig.phone, message: '请输入正确的手机号' },

									]}>
										<Input prefix={<span>账号</span>} className="login-input" placeholder="请输入手机号" />
									</FormItem>

									<FormItem name="loginPassword" rules={[
										{
											required: true, message: '请输入密码',
										},
										{ pattern: regExpConfig.pwd, message: '密码由6-18位数字和字母组成' },
									]}>
										<Input.Password prefix={<span>密码</span>} className="login-input"  placeholder="请输入密码"  />
									</FormItem>

									<div className="login-code-box pr">
										<FormItem className="flex-auto" name="loginCode" rules={[
											{
												required: true, message: '请输入验证码',
											},
										]}>
											<Input placeholder="请输入验证码" autoComplete="off" />
										</FormItem>
										<img className="login-code-img" src={this.state.codeUrl} onClick={this.resetCode} alt="验证码" />
									</div>

									<FormItem>
										<Button type="primary" htmlType="submit"
														className={cx({"login-btn": !btnStatusFlag})}
										>登录</Button>
									</FormItem>
								</Form>
							</div>
						</div>
					</div>

					{/*账号无权限*/}
					<ModalInfo width={400} className="delete-modal"
										 title="温馨提示"
										 showTxt="warningVisible"
										 visible={warningVisible}
										 content="该账号无登录权限，请确定号码是否正确，或联系管理员授权。"
										 okText="确定"
										 cancel={this.handleCancelModal("warningVisible")}
										 confirm={this.handleCancelModal("warningVisible")}
										 closable={false}
					/>
				</div>
			</Spin>
		);
	}
}
export default Login

