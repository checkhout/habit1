import React, { Component, Fragment } from 'react';
import { Form, Input, Button,
	// message,
	Spin } from 'antd';
import qs from 'qs'
import { connect } from 'react-redux'
import {
	createFromIconfontCN,
} from '@ant-design/icons';


import { regExpConfig } from "@/utils/index";
import {
	reset_store_action,
	login_action,
	// query_user_info_action,
	// query_company_info_action,
} from '@actions/common'
import {
	captchaHttp,
} from '@api/common'
import ModalInfo from '@components/modalInfo'
import { ICON_FONT_URL } from '@config'

// import cx from 'classnames'

import './index.less'

const FormItem = Form.Item;

const IconFont = createFromIconfontCN({
	scriptUrl: ICON_FONT_URL,
});


@connect((state) => ({
	loginResult: state.loginResult,
	companyInfoResult: state.companyInfoResult,
}))

class Login extends Component {
	// 初始化页面常量 绑定事件方法
	constructor(props) {
		super(props);
		this.state = {
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
				//todo 暂时没有用户信息
				sessionStorage.setItem('factoryLoginTime', Date.now());//登录时间
				this.props.history.replace({pathname: '/'})

				// 2. 获取用户信息
				/*_that.props.dispatch(query_user_info_action(param, () => {
					//3. 获取用户所在公司信息
					_that.props.dispatch(query_company_info_action(param, () => {
						// data.id = 0;//默认公司id为0 **未保证数据单向性，禁止直接修改回调参数，会影响到reducer数据**
						sessionStorage.setItem('factoryLoginTime', Date.now());

						this.props.history.replace({pathname: '/'})

					}, err => {
						message.error("公司数据获取失败")
					}));

				}, err => {
					message.error("用户数据获取失败")
				}));*/

			}, err => {
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
							return "用户无权限";
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




	render() {
		const { warningVisible, loginFlag } = this.state;
		const { companyInfoResult: {loadingCompanyInfo} } = this.props;

		const springFlag = loginFlag || loadingCompanyInfo;
		return (
			<Fragment>
				<Spin spinning={springFlag} delay={500} wrapperClassName="login-spin">
					<div className="login">
						<div className='login-bg'>
							<div className='logo-wrap'>
								<i className='logo' />
								<i className='name' />
							</div>
						</div>

						<div className="login-form">
							<p className='login-title'>登录平台</p>

							<Form
								onFinish={this.onFinish}
								ref={this.formRef}
							>
								<FormItem name="loginName" rules={[
									{
										required: true, message: '请输入手机号',
									},
									{ pattern: regExpConfig.phone, message: '请输入正确的手机号' },

								]}>
									<div className='fieldset'>
										<div className='legend'>
											<IconFont type="iconaccount" className='username' />
											<span style={{marginLeft: '3px'}}>账号</span>
										</div>
										<Input placeholder="请输入手机号" />
									</div>
								</FormItem>

								<FormItem name="loginPassword" rules={[
									{
										required: true, message: '请输入密码',
									},
									{ pattern: regExpConfig.pwd, message: '密码由6-18位数字和字母组成' },
								]}>
									<div className='fieldset'>
										<div className='legend'>
											<IconFont type="iconpassword" className='password' />
											<span style={{marginLeft: '3px'}}>密码</span>

										</div>
										<Input.Password
											placeholder="请输入密码"
											suffix={<i className="eye-show"/>}
											visibilityToggle={true}
											iconRender={(visible) => {
												return (visible ? <IconFont type="iconsee" /> : <IconFont type="iconhide" />)
											}}
										/>										</div>
								</FormItem>

								<div className="login-code-box">
									<FormItem className="flex-auto" name="loginCode" rules={[
										{
											required: true, message: '请输入验证码',
										},
									]}>
										<div className='fieldset'>
											<div className='legend'>
												<IconFont type="iconcode" className='code' />
												<span style={{marginLeft: '3px'}}>验证码</span>
											</div>
											<Input placeholder="请输入验证码" autoComplete="off" />
										</div>
									</FormItem>
									<img className="login-code-img" src={this.state.codeUrl} onClick={this.resetCode} alt="验证码" />
								</div>

								<FormItem><Button type="primary" htmlType="submit" className='login-btn'>登录</Button></FormItem>
							</Form>
						</div>
					</div>
				</Spin>

				{/*账号无权限*/}
				<ModalInfo
					width={400} className="delete-modal"
					title="温馨提示"
					showTxt="warningVisible"
					visible={warningVisible}
					content="该账号无登录权限，请确定号码是否正确，或联系管理员授权。"
					okText="确定"
					cancel={this.handleCancelModal("warningVisible")}
					confirm={this.handleCancelModal("warningVisible")}
					closable={false}
				/>
			</Fragment>
		);
	}
}
export default Login

