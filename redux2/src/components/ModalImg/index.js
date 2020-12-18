import React from 'react'
import BaseComponent from '@/components/BaseComponent'
import "./index.less"

export default class ModalImg extends BaseComponent {
	cancelPopup = () => { //取消编辑
		this.props.cancel(this.props.visible);
	};

	handleSubmit = (e) => {
		this.props.cancel && this.props.cancel(this.props.visible);
		this.props.confirm();
	};

	render() {

		const { content, children} = this.props;
		return (<div className="custom-img-model-wrap">
				<div className="model-close-btn"><div className="custom-img-model-close" onClick={this.cancelPopup}/></div>
				{
					children ? children : <p>{content}</p>
				}
		</div>
		)
	}
}
