import React, { Component } from 'react';
import { Modal } from 'antd';

import './index.less';

class ModalInfo extends Component {
    cancelPopup = () => { //取消编辑
        this.props.cancel(this.props.visibleName);
    };
    handleSubmit = () => {
        // this.props.cancel && this.props.cancel(this.props.visibleName);
        this.props.confirm();
    };

    render() {
        const { title, content, visible, children, width, ...otherProps} = this.props;

        return (
          <Modal
            centered
            maskClosable={false}
            wrapClassName="modal-info"
            onCancel={this.cancelPopup}
            onOk={this.handleSubmit}
            title={title}
            visible={visible}
            width={width || 480}
            {...otherProps}
          >
              {
                  children ? children : <p>{content}</p>
              }
          </Modal>
        )
    }
}
export default ModalInfo
