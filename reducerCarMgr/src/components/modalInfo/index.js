import React, { Component } from 'react';
import { Modal } from 'antd';


export default class ModalInfo extends Component {
    cancelPopup = () => { //取消编辑
        this.props.cancel(this.props.showTxt);
    };

    handleSubmit = (e) => {
        this.props.cancel && this.props.cancel(this.props.showTxt)
        this.props.confirm();
    };

    render() {

        const { title, content, visible, children, width,  showTxt,  ...otherProps} = this.props;
        return (
            <Modal title={title} visible={visible} width={width || 480} centered maskClosable={false} {...otherProps}
                   onCancel={this.cancelPopup} onOk={this.handleSubmit}>
                {
                    children ? children : <p>{content}</p>
                }
            </Modal>
        )
    }
}
