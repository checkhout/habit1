import React from 'react'
import cx from 'classnames'
import moment from '@/components/moment'
import BaseComponent from '@/components/BaseComponent'
import ReactDOM from 'react-dom'
import {
	Form,
	Input,
	Button,
	Select,
	DatePicker,
	Cascader,
	Checkbox,
	TreeSelect,
} from 'antd'
import { firstAndEndTrim } from '@/utils/index'
import './index.less'

export default class SearchBar extends BaseComponent {
	constructor(props) {
		super(props);
		this.state = {
			fields: this.initField(),
			autoComplete: {},
			disabled: {},
			warnings: {},
			flag: false,
		};
		props.onRef && props.onRef(this)
	}
	initField = (flag) =>  { //flag -- 重置不需要初始值的标识
		const fieldsList = this.props.fields;
		let fields = {};
		fieldsList.forEach(item => {
			if (item.resetValue && flag) { //resetValue表示需要清空的标识
				if (typeof item.key !== 'string') {
					fields[item.key[0]] = null;
					fields[item.key[1]] = null
				} else {
					fields[item.key] = null
				}

			} else {
				fields[item.key] = item.defaultValue
			}

		});
		return fields
	};
	setField(field, value) {
		const {
			fields,
			warnings
		} = this.state
		let newValue = value, newFields ={}

		if (typeof field.key !== 'string') {
			newFields[field.key[0]] = newValue && newValue[0]
			newFields[field.key[1]] = newValue && newValue[1]
		} else {
			newFields[field.key] = typeof newValue === 'string' ? firstAndEndTrim(newValue) : newValue
		}

		this.setState({
			fields: { ...fields ,...newFields},
			warnings,
		})
	}

	clearThisFieldAndResearch = (field) => {
		const value = {};
		value[field.key] = '';
		const fields = { ...this.state.fields , ...value};
		this.setState({
			fields: fields,
			flag: !this.state.flag
		}, () => {
			this.state.fields[field.key] = '';
			this.handleSubmit()
		})

	};
	componentDidMount() {
		// eslint-disable-next-line no-restricted-syntax
		for (const component of this.needToEmptyStyleComponents) {
			// eslint-disable-next-line react/no-find-dom-node
			const dom = ReactDOM.findDOMNode(component);
			dom.setAttribute('style', '')
		}
	}
	generateInputs(fields) {
		const components = [];
		this.needToEmptyStyleComponents = [];
		let i = 0;

		for (const field of fields) {
			let items = [];
			if (field.items && field.items.length) {
				items = field.items
			}

			let component = null;
			switch (field.type) {
				case 'input':
				default:
					if ('autoComplete' in field) {  // 自动补全
						component = (<Select
							combobox
							value={this.state.fields[field.key]}
							showArrow={false}
							filterOption={false}
							disabled={this.state.disabled[field.key]}
							style={{
								width: '100%',
							}}
							notFoundContent="未找到"
							onChange={(value) => {
								this.setField(field, value);
								field
									.autoComplete(value)
									.then((result) => {
										const { autoComplete } = this.state;
										autoComplete[field.key] = result;
										this.setState({ autoComplete })
									})
							}}
						>
							{(this.state.autoComplete[field.key] || []).map((value, key) =>
								<Select.Option key={key} value={value}>{value}</Select.Option>)}
						</Select>)
					}
					else {
						if (field.clean) {
							component = (<div className="pr">
									<Input
									autoComplete="off"
									value={this.state.fields[field.key]}
									onChange={e => this.setField(field, e.target.value)}
									placeholder={field.placeholder}
									maxLength={50}
								/>
								<i className={cx("anticon-icon_clean_up"," clean_up_icon", {'none': !this.state.fields[field.key]})}
										 onClick={this.clearThisFieldAndResearch.b(field)}
								/>
							</div>
							)
						}
						else {
							component = (<Input
								autoComplete="off"
								value={this.state.fields[field.key]}
								onChange={e => this.setField(field, e.target.value)}
								placeholder={field.placeholder}
								addonBefore={field.addonBefore}
								maxLength={50}
								defaultValue={field.defaultValue || ""}
							/>)
						}
					}
					break;
				case 'cascader':  // 级联
					component = (<Cascader
						options={items}
						placeholder="请选择"
						value={this.state.fields[field.key]}
						disabled={this.state.disabled[field.key]}
						onChange={value => this.setField(field, value)}
						showSearch
					/>);
					break;
				case 'select':
					component = (<Select
						className={`full_width ${field.className ? field.className : ""}`}
						placeholder={field.placeholder || "请选择"}
						value={this.state.fields[field.key]}
						mode={field.mode || ''}
						disabled={this.state.disabled[field.key]}
						showArrow={true}
						onChange={(value) => {
							this.setField(field, value);
							field.onChange && field.onChange(value)
						}}
					>
						{
							items && items.map(({ txt, value }) =>
							<Select.Option key={value.toString()} value={value.toString()} title={txt}>{txt}</Select.Option>)
						}
					</Select>);
					break;
				case 'dropSelect':
					component = (<div className="full_width pr"><Select
						className="full_width"
						showArrow={true}
						dropdownRender={menu => (
							<div className="dropSelect-list" onMouseDown={(e) => { e.preventDefault(); return false; }}>
								<Checkbox.Group
									placeholder="请选择"
									value={this.state.fields[field.key]}
									name={field.key}
									onChange={(value, e) => {
										this.setField(field, value);
										field.onChange && field.onChange(value)
									}}>
									{items && items.map(({ txt, value }) =>
										<div className="dropSelect-item" key={txt}>
											<Checkbox key={value.toString()} value={value.toString()}>{txt}</Checkbox>
										</div>)}
								</Checkbox.Group>
							</div>
						)}
					>
					</Select><div className="dropSelect-txt">{this.getDropSelectTxt(field)}</div></div>);
					break;
				case 'treeSelect':
					// if (this.state.fields[field.key] === undefined && field.value ) this.state.fields[field.key] = field.value
					component = (<TreeSelect
						className="full_width"
						allowClear
						searchPlaceholder={field.placeholder || "请选择"}
						showCheckedStrategy="SHOW_PARENT"
						treeCheckable={true}
						value={this.state.fields[field.key]}
						disabled={this.state.disabled[field.key]}
						onChange={(value) => {
							this.setField(field, value);
							field.onChange && field.onChange(value)
						}}
						treeData={items}
					>
					</TreeSelect>);
					break;
				case 'date':
					component = (<DatePicker
						value={this.state.fields[field.key]}
						disabled={this.state.disabled[field.key]}
						onChange={value => this.setField(field, value)}
						placeholder="请选择日期"
						showToday={false}
					/>);
					break;
				case 'rangePicker':
					const { format, width, key, type, renderFooter, ...otherProps } = field
					component = (<DatePicker.RangePicker
						format={ format || 'YYYY/MM/DD' }
						value={this.state.fields[key]}
						// disabled={this.state.disabled[key]}
						onChange={(value) => {
							this.setField(field, value)
						}}
						disabledDate={this.disabledDate}
						renderExtraFooter={renderFooter}
						{...otherProps}
					/>);
					break;
				case 'datetime':
					component = (<DatePicker
						showTime={field.showTime || true}
						format="YYYY-MM-DD HH:mm"
						value={this.state.fields[field.key]}
						disabled={this.state.disabled[field.key]}
						onChange={value => this.setField(field, value)}
						placeholder="请选择时间"
						ref={item => this.needToEmptyStyleComponents.push(item)}
						showToday={false}
					/>);
					break
			}
			components.push(<div key={i++} className={`field ${field.className || ''}`}>
				<div className="input">
					{
						field.title ? <div className="title" style={{ width: field.labelWidth || 70 }}>{field.title}：</div> : null
					}
					<div style={{ width: field.width || 100 }} className="input">{component}</div>
				</div>
				<div className="warning">{this.state.warnings[field.key]}</div>
			</div>)
		}
		return components
	}
	disabledDate = (time) => {
		if(!time){
			return false
		}
		else {
			return time > moment().endOf('day')
		}
	}
	getDropSelectTxt = (field) => {
		const value = this.state.fields[field.key]
		if (!value || !value.length) {
			return '请选择'
		} else {
			let items = [], result = []
			if (field.items && field.items.length) {
				items = field.items
			}
			items.forEach((item) => {
				if (value.includes(item.value)) result.push(item.txt)
			})
			return result.join(',')
		}
	}
	handleReset = () => {
		if ('onReset' in this.props) {
			this.props.onReset()
		}
		this.setState({
			fields: this.initField(true)
		}, () => {
			this.handleSubmit()
		})

	}

	handleSubmit = () => {
		// let { warnings } = this.state
		// warnings = {}
		// for (const field of this.props.leftFields.concat(this.props.rightFields)) {
		//   if (field.validator) {
		//     try {
		//       field.validator(this.state.fields[field.key])
		//     } catch (e) {
		//       warnings[field.key] = e.message
		//     }
		//   }
		// }
		// if (Object.keys(warnings).length) {
		// 	this.setState({
		// 		warnings
		// 	})
		// 	return
		// }
		this.setState({ warnings: {} })
		if ('onSubmit' in this.props) {
			const fields = {}
			// eslint-disable-next-line
			// console.log(this.state.fields);
			for (const key in this.state.fields) {
				let value = this.state.fields[key]
				if (value === undefined || value === null) {
					// eslint-disable-next-line
					continue
				}
				if (Array.isArray(value)) {
					fields[key] = value
					// eslint-disable-next-line
					continue
				}
				if (typeof value === 'string') {
					value = value.trim()
				}
				if (value !== '') {
					fields[key] = value
				}
			}
			this.props.onSubmit(fields)
		}
	};

	render() {
		const { searchTxt, noReload, fields } = this.props;

		return (
			<Form className="search-bar" onFinish={this.handleSubmit}>
				<div className="search-fields">
					{fields && this.generateInputs(fields)}
					<Button type="primary"  htmlType="submit" className="search_bar_options icon-ant-btn search" icon="">{ searchTxt || '查询' }</Button>
					{
						!noReload ? <Button onClick={this.handleReset} type="normal" className="search_bar_options icon-ant-btn reset" icon="">重置</Button> : null
					}
				</div>
			</Form>
		)
	}
}

SearchBar.defaultProps = {
	hasReset: true,
}