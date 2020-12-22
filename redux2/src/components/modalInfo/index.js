import React, { Component } from 'react';
import { Modal } from 'antd';

import './index.less';

export default class ModalInfo extends Component {
    cancelPopup = () => { //取消编辑
        this.props.cancel(this.props.visibleName);
    };
    handleSubmit = () => {
        this.props.cancel && this.props.cancel(this.props.visibleName);
        this.props.confirm();
    };

    render() {
        const { title, content, visible, children, width, ...otherProps} = this.props;

        return (
          <Modal
            centered
            title={title}
            visible={visible}
            width={width || 480}
            wrapClassName="modal-info"
            maskClosable={false}
            onCancel={this.cancelPopup}
            onOk={this.handleSubmit}
            {...otherProps}
          >
              {
                  children ? children : <p>{content}</p>
              }
          </Modal>
        )
    }
}
