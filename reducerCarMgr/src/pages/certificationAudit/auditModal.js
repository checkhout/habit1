import React from 'react'
import BaseComponent from '@/components/BaseComponent'
import { Modal, Button, Input, message } from 'antd'
import cx from 'classnames'
import {
	formatType,
	FormatUsername,
} from "@/utils/index";
import { transformTime } from "@/components/moment";
import {
	auditApplyHttp,
} from '@/api/index'


import './auditModal.less'
const { TextArea } = Input;

export default class AuditModal extends BaseComponent {
	state = {
		auditType: 0,						// 0为选择 1通过认证 2拒绝认证
		reason: "",							// 拒绝理由
	};

	handleSubmit = (e) => {
		const { currentApplyObj } = this.props;
		const { auditType, reason } = this.state;

		const param = {
			id: currentApplyObj.id,
			pass: Boolean(auditType < 2),
		};

		if (reason) {
			param.reason = reason;
		}
		auditApplyHttp(param).then(res => {
			this.props.requestCertificationAuditList();
		}).catch(err => {
			switch (+err.error_code) {
				case 2:
					message.warning('申请不存在');
					break;
				case 629142:
					message.warning('参数错误');
					break;
				case 629143:
					message.warning('权限不足');
					break;
			}
		});

		this.cancelAudit(e);
	};
	cancelAudit = () => {
		this.props.cancel();
		this.setState({auditType: 0});
	};
	choiceAudit = auditType => () => {
		this.setState({auditType})
	};
	textAreaChange = (e) => {
		this.setState({reason: e.target.value})
	};

	renderModalFooter = () => {
		return <div className="footer">
			<Button className="cancel"
							onClick={this.cancelAudit}>取消</Button>
			<Button className="submit ant-btn-primary" disabled={this.state.auditType === 0}
							onClick={this.handleSubmit}>提交审核结果</Button>
		</div>
	};

	textBr = des => {
		let str = des;
		if (str.indexOf("\n") >= 0) {
			str = str.split("\n");

			return str.map((item, index) => {
				return <span key={index}>
					{item} <br/>
				</span>
			});
		} else {
			return  str;
		}
	};

	render() {
		const {
			auditType,
		} = this.state;

		const { title, content, visible, children, width,  showTxt, active, currentApplyObj, ...otherProps} = this.props;

		const hasData = Object.keys(currentApplyObj).length;
		const hasAudit = currentApplyObj.auditorInfo && Object.keys(currentApplyObj.auditorInfo).length;

		// console.log("modal", currentApplyObj, hasAudit && currentApplyObj.status === 2);


		return (
			<Modal title={title}
						 visible={visible}
						 width="52.7%"
						 centered
						 maskClosable={false}
						 wrapClassName="audit-modal"
						 {...otherProps}
						 onCancel={this.cancelAudit}
						 footer={active ? null : this.renderModalFooter()}
						 closeIcon={<span className="close-icon-2"/>}
			>
				<img src={hasData ? currentApplyObj.filePath : "-"} alt="" className="left"/>
				<div className="right">
					<ul>
						<li>
							<span>申请人</span>：<span>{hasData ? currentApplyObj.applicantInfo.nickname : "-"}（{hasData ? FormatUsername(currentApplyObj.applicantInfo.username) : "-"}）</span>
						</li>
						<li>
							<span>申请时间</span>：<span>{hasData ? transformTime(currentApplyObj.applyTime, formatType.xFormatNoSeconds) : "-"}</span>
						</li>
						<li>
							<span>申请类型</span>：<span>认证企业</span>
						</li>
						<li>
							<span>企业名称</span>：<span>{hasData ? currentApplyObj.authName : "-"}</span>
						</li>
					</ul>

					{
						active === 0 ? <div>
							<div className="operate-wrapper">
								<Button className={cx("pass", {"pass-active": auditType === 1})} onClick={this.choiceAudit(1)}>
									<i className=""/><span>通过认证</span>
								</Button>
								<Button className={cx("nopass", {"nopass-active": auditType === 2})} onClick={this.choiceAudit(2)}>
									<i className=""/><span>驳回认证</span>
								</Button>
							</div>
							<p className={cx("error_tip", {"none": auditType > 0})}>*请选择审核意见</p>
							{
								auditType === 2 ? <TextArea placeholder="请输入驳回理由" onChange={this.textAreaChange} /> : null
							}
						</div> : <div className="nopass-detail">
							<div className="item">
								<span className="label">审核人：</span>
								<span className="value">{hasAudit ? currentApplyObj.auditorInfo.nickname : "-"}（{hasAudit ? FormatUsername(currentApplyObj.auditorInfo.username) : "-"}）</span>
							</div>
							<div className="item">
								<span className="label">审核时间：</span>
								<span className="value">{hasAudit ? transformTime(currentApplyObj.auditTime, formatType.xFormatNoSeconds) : "-"}</span>
							</div>
							<div className="item">
								<span className="label">审核结果：</span>
								<span className="value">{hasAudit ? (currentApplyObj.status === 2 ? "驳回认证" : "通过认证") : "-"}</span>
							</div>
							{
								currentApplyObj.status === 2 ? <div className="item">
									<span className="label">驳回说明：</span>
									<span className="value">{hasAudit ? this.textBr(currentApplyObj.reason || '-') : '-'}</span>
								</div> : null
							}
						</div>
					}
				</div>
			</Modal>
		)
	}
}
