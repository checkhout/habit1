import React from 'react';
import { is } from 'immutable';//is 和Object.is类似的相等比较方法，比较两个 Collection 是否有相同的值。

export default class BaseComponent extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        // 判断是否要更新render, return true 更新  return false不更新
        const thisProps = this.props || {};
        const thisState = this.state || {};
        nextState = nextState || {};
        nextProps = nextProps || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
            Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }
        for (const key in nextProps) {
            if (!is(thisProps[key], nextProps[key])) {
                return true;
            }
        }
        for (const key in nextState) {
            if (!is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    handleCancelModal = (visible) => {
        this.setState({
            [visible]: false
        })
    };
    handleShowModal = (visible) => {
        this.setState({
            [visible]: true
        })
    }
}
