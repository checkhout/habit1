import React, { Component }  from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {  message } from "antd";

export default class ToCopy extends Component {
    onCopyContent = () => {
        message.success('复制成功！')
    };
    render() {
        const { text } = this.props;
        return (
            <div style={{cursor: 'pointer'}}>
                <CopyToClipboard text={text} onCopy={this.onCopyContent} ><span className="pointer span-copy">{text}</span></CopyToClipboard>
            </div>

        )
    }
}


