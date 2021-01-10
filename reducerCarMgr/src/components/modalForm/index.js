import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  Input,
  Select,
  Form,

} from 'antd'

import './index.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;


/**
 * props 参数：
 * fields Form 驱动数据 [{
 *   type: 'input',
 *   label: '姓名',
 *   name: 'nickname',
 *   rules: [{}],
 *   itemProps: {},
 *   formItemProps: {},
 * }]
 * visibleName 定义的 visible
 * cancel 取消 func(visible)
 * confirm 提交 func(values)
 * formProps 同 Form
 * modalProps 同 Modal
 */
class ModalForm extends Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    visibleName: PropTypes.string.isRequired,
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    formProps: PropTypes.object.isRequired,
    modalProps: PropTypes.object.isRequired,
  };

  formRef = React.createRef();

  cancelPopup = () => {//取消
    this.props.cancel(this.props.visibleName);
  };
  handleSubmit = () => {//提交
    // this.props.cancel && this.props.cancel(this.props.visibleName);
    // this.props.confirm();

    return this.formRef.current
      .validateFields()
      .then(values => {
        // console.log('ModalForm校验成功:', values);
        this.props.confirm(values);
      })
      .catch(info => {
        // console.log('ModalForm校验失败:', info);
      });
  };

  getTextField = field => (<span className="ant-form-text">{field.itemProps && field.itemProps.initialValue}</span>);
  getInputField = props => (
    <Input {...props}/>
  );
  getTextAreaField = props => (
    <Input.TextArea {...props} />
  );
  getSelectField = field => (
    <Select {...field.itemProps}>
      {field.items && field.items().map(({ key, value }) => <SelectOption key={key.toString()} value={key.toString()}>{value}</SelectOption>)}
    </Select>
  );

  generateFormFields(fields) {
    const components = [];

    for (const field of fields) {
      let component = null;

      const {
        type,
        label,
        name,
        rules,
        formItemProps,
        itemProps,
      } = field;

      switch (type) {
        case 'input':
          component = this.getInputField(itemProps);
          break;
        case 'select':
          component = this.getSelectField(field);
          break;
        case 'textarea':
          component = this.getTextAreaField(itemProps);
          break;
        case 'customRadio':
          component = itemProps.radio;
          break;
        default:
          component = this.getTextField(field);
          break
      }
      component = this.generateFormItem({
        label,
        name,
        rules,
        formItemProps,
        component,
      });
      components.push(component)
    }

    return components
  };

  generateFormItem = ({ label, rules=[], name, formItemProps={}, component }) => {
    return (<FormItem
      key={name}
      name={name}
      label={label}
      rules={rules}
      {...formItemProps}
    >
      {component}
    </FormItem>)
  };

  render() {
    const {
      visibleName,
      fields,
      modalProps,
      formProps,
    } = this.props;
    return (
      <Modal
        key={visibleName}
        centered
        wrapClassName="modal-form"
        maskClosable={false}
        onCancel={this.cancelPopup}
        onOk={this.handleSubmit}
        destroyOnClose={true}
        {...modalProps}
      >
        <Form
          {...formProps}
          ref={this.formRef}
        >
          {this.generateFormFields(fields)}
        </Form>
      </Modal>
    )
  }
}

export default ModalForm
