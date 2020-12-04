import React from 'react';
import {Form, Button, Input, TreeSelect} from 'antd'
import cx from 'classnames'
import { connect } from "react-redux"

import BaseComponent from '@/components/BaseComponent'
import ModalInfo from '@/components/modalInfo'

import './operateOrganization.less'

const FormItem = Form.Item;

@connect((state) => ({
	departmentListResult: state.departmentListResult,
}))
class OperateEmployeesModal extends BaseComponent {
	state = {
		submitBtnFlag: false, //默认提交按钮为禁用状态 true: 可用
	};
	countFlag = 0;
	formRef = React.createRef();

	componentDidMount() {
		this.props.onRef(this)
	};

	handleCancelModal = () => {
		this.countFlag = 0;
		this.formRef.current.resetFields();
		this.props.handleCancelModal('operateDepartmentVisible');
		this.setState({ submitBtnFlag: false })
	};

	onFinish = (values) => {
		Object.keys(values).map(key => values[key] = (values[key] && String(values[key]).trim()));

		this.props.handleConfirm(values);
		this.handleCancelModal();
	};
	onFormValuesChange = (changedValues, allValues) => {
		//有部门名称点亮提交按钮
		if ( allValues.departmentName.trim() && !this.state.submitBtnFlag ) {
			this.setState({submitBtnFlag: true})
		}
		//置灰按钮
		else if	(!allValues.departmentName.trim() && this.state.submitBtnFlag) {
			this.setState({submitBtnFlag: false})
		}
	};

	render() {
		const {
			currentDepartment,
			visible,
			editDepartmentFlag,
			handleDissolveDepartment,
			departmentListResult: { treeData },
		} = this.props;
		const { submitBtnFlag } = this.state;
		const formItemLayout = {
			labelCol: {span: 7},
			wrapperCol: {span: 14},
			colon: false, // 隐藏冒号
		};


		return (
			<ModalInfo
				title={editDepartmentFlag ? "部门设置" : '新建部门'}
				className="form-modal operateDepartmentModal"
				showTxt="operateDepartmentVisible"
				visible={visible}
				footer={null}
				cancel={this.handleCancelModal}
				closable={false}
				width={400}
			>
				<div className="operateDepartmentFormWrapper" key={visible + ''}>
					<Form
						ref={this.formRef}
						className="operate-department-form"
						onFinish={this.onFinish}
						onValuesChange={this.onFormValuesChange}
						requiredMark={false} /* hideRequiredMark={true} 将被替换*/
						initialValues={{
							"departmentName": editDepartmentFlag ? currentDepartment.department.name : undefined,
							"parentDepartment": editDepartmentFlag
								? Number(currentDepartment.department.parentId)
								: Number(currentDepartment.department.id),
						}}
						{...formItemLayout}
					>
						<FormItem label="部门名称"
											name="departmentName"
											rules={[
												{ required: true, message: '请输入部门名称' },
												{ max: 20, message: '最大长度20字符' },
											]}
						>
							<Input autoComplete="off" placeholder="请输入" />
						</FormItem>
						<FormItem label="上级部门"
											name="parentDepartment"
						>
							<TreeSelect
								placeholder="请选择"
								style={{
									width: '100%',
								}}
								treeData={treeData}
								treeDefaultExpandAll={true}
							/>
						</FormItem>
						{
							editDepartmentFlag ? <FormItem
								label=""
							>
								<div className="btn-form-item" style={{paddingLeft: "67px"}}>
									<Button type="primary" className="theme-btn-opacity-red" onClick={handleDissolveDepartment} >解散该部门</Button>
								</div>
							</FormItem> : null
						}
						<div className="buttons form-modal-buttons">
							<Button type="sub-normal" className="cancel" onClick={this.handleCancelModal} >取消</Button>
							<Button type="primary" className={cx("confirm-btn", {"action": submitBtnFlag})} htmlType="submit">{editDepartmentFlag? "确定保存" : '确定新建'}</Button>
						</div>
					</Form>
				</div>
			</ModalInfo>
		)
	}
}
export default OperateEmployeesModal;