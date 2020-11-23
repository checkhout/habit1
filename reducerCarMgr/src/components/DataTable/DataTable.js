import React from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination, Tooltip } from 'antd';
import objectAssign from 'object-assign';
import { is } from 'immutable';
import $$ from 'cmn-utils';
import cx from 'classnames';
import BaseComponent from '@/components/BaseComponent'
import './index.less';

/**
 * 数据表格
 */
class DataTable extends BaseComponent {
	static propTypes = {
		prefixCls: PropTypes.string,
		className: PropTypes.string,
		rowKey: PropTypes.string,
		/**
		 * 详见帮助文档 column.js 用法
		 */
		columns: PropTypes.array.isRequired,
		/**
		 * 数据对像list为必需,如需表格自带分页需要在此提供分页信息 {pageNum:1, list:[], filters:{}, pageSize:10, total:12}
		 */
		dataItems: PropTypes.object.isRequired,
		/**
		 * 是否显示行序号
		 */
		showNum: PropTypes.bool,
		/**
		 * 是否奇偶行不同颜色
		 */
		alternateColor: PropTypes.bool,
		/**
		 * 多选/单选，checkbox 或 radio
		 */
		selectType: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
		/**
		 * 选择功能的配置 参考antd的rowSelection配置项
		 */
		rowSelection: PropTypes.object,
		/**
		 * 指定选中项的 key 数组
		 */
		selectedRowKeys: PropTypes.array,
		/**
		 * 是否带滚动条
		 */
		isScroll: PropTypes.bool,
		noPagination: PropTypes.bool,
		scroll: PropTypes.object,
		/**
		 * 是否增加表格内分页
		 */
		pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
		/**
		 * 选中表格行回调 function(selectedRowKeys, selectedRows)
		 */
		onSelect: PropTypes.func,
		/**
		 * 外部获取数据接口 {pageNum:1, filters:{}, pageSize:10}
		 */
		onChange: PropTypes.func
	};

	static defaultProps = {
		prefixCls: 'antui-datatable',
		alternateColor: true,
		noPagination: false
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedRowKeys: props.selectedRowKeys,
			selectedRows: this.getSelectedRows(props.selectedRowKeys),
			tableHeight: null
		};
	}

	// 将值转成对像数组
	getSelectedRows(value, oldValue = []) {
		const { rowKey } = this.props;
		if (value) {
			return value.map(item => {
				const oldv = oldValue.filter(jtem => jtem[rowKey] === item)[0];
				return typeof item === 'object' ? item : oldv || { [rowKey]: item };
			});
		}
		return [];
	}

	componentWillReceiveProps(nextProps) {
		const { selectedRows } = this.state;
		const newState = {};
		if (!is(this.props.selectedRowKeys, nextProps.selectedRowKeys)) {
			newState.selectedRowKeys = nextProps.selectedRowKeys;
			newState.selectedRows = this.getSelectedRows(
				nextProps.selectedRowKeys,
				selectedRows
			);
			this.setState(newState);
		}
	}

	tableOnRow = (record, index) => {
		// console.log(record, index , "tableOnRow")
		const { selectType } = this.props;

		let keys = selectType === 'radio' ? [] : this.state.selectedRowKeys || [];
		let rows = selectType === 'radio' ? [] : this.state.selectedRows || [];

		let i = keys.indexOf(record[this._rowKey]);
		if (i !== -1) {
			keys.splice(i, 1);
			rows.splice(i, 1);
		} else {
			keys.push(record[this._rowKey]);
			rows.push(record);
		}
		this.onSelectChange(keys, rows);
	};
	tableClickOnRow = (record, index) => {
		// console.log(record.rowKey, "点击行");
		//判断是否选中
		// console.log(this.state.selectedRows);
		// this.onSelectChange(record.rowKey, record)
		// let selectedRowKeys = [record.rowKey], selectedRows = [record]//叶
		const { selectType } = this.props;
		let keys = null,rows = null
		if (selectType === "radio") {
			 keys = [record.rowKey]
			 rows = [record]
		} else { //多选列表
			 keys = this.state.selectedRowKeys
			 rows = this.state.selectedRows
			let isSelected = keys.indexOf(record.rowKey)
			if (isSelected === -1) {//state中的selectedRowKeys里去查找是否有当前点击的行，没有就添加
				keys.push(record.rowKey)
				rows.push(record)
			} else {
				keys.splice(isSelected, 1)
				rows.splice(isSelected, 1)
			}
		}
		// console.log(keys, rows, isSelected);
		/*this.setState({
			selectedRowKeys: keys,
			selectedRows: rows
		}, () => {
			// this.onSelectChange(keys, rows);
			if (this.props.onClickRow) {
				this.props.onClickRow(keys, rows);
				// this.props.onClickRow(selectedRowKeys, selectedRows);//叶
			} else {
				this.props.onSelect && this.props.onSelect(keys, rows);
				// this.props.onSelect && this.props.onSelect(selectedRowKeys, selectedRows);//叶
			}
		});*/
		if (this.props.onClickRow) {
			this.props.onClickRow(keys, rows);
			// this.props.onClickRow(selectedRowKeys, selectedRows);//叶
		} else {
			// this.props.onSelect && this.props.onSelect(keys, rows);
			this.onSelectChange(keys, rows)
			// this.props.onSelect && this.props.onSelect(selectedRowKeys, selectedRows);//叶
		}
	}
	onSelectChange = (selectedRowKeys, selectedRows) => {//点击行和勾选框事件只触发其中一个
		// console.log(selectedRowKeys, selectedRows, "333")
		// 使用keys重新过滤一遍rows以key为准，解决keys与rows不同步问题
		// 并在每一行加一个rowKey字段
		selectedRows = selectedRows.filter(
			item => selectedRowKeys.indexOf(item[this._rowKey]) !== -1
		);

		//解绑设备操作
		// if (this.props.chooseType !== 'radio') {
		//     selectedRows = selectedRows.filter(
		//         item => selectedRowKeys.indexOf(item[this._rowKey]) !== -1
		//     );
		// }
		// if (this.props.chooseType === 'radio') {
		//     selectedRowKeys = selectedRowKeys.length ? [selectedRowKeys[selectedRowKeys.length - 1]] : []
		//     selectedRows = selectedRows.length ? [selectedRows[selectedRows.length - 1]] : []
		// }
		this.setState({//更新选中
			selectedRowKeys: selectedRowKeys,
			selectedRows: selectedRows
		});
		this.props.onSelect && this.props.onSelect(selectedRowKeys, selectedRows);
	};

	handleTableChange = (pagination, filters, sorter) => {
		let pageNum = pagination.current || pagination;

		let sortMap = sorter.field
			? {
				[sorter.field]: sorter.order === 'ascend' ? 'asc' : 'desc'
			}
			: sorter;
		this.props.onChange &&
		this.props.onChange({ pageNum, filters, sorter: sortMap });
	};

	onShowSizeChange = (pageNum, pageSize) => {
		this.props.onChange && this.props.onChange({ pageNum, pageSize });
	};


	render() {
		const {
			prefixCls,
			className,
			columns,
			dataItems,
			showNum,
			alternateColor,
			onChange,
			selectType,
			rowSelection,
			isScroll,
			scroll,
			pagination,
			rowKey,
			noPagination,
			...otherProps
		} = this.props;
		const { selectedRowKeys } = this.state
		let classname = cx(prefixCls, className, {
			'table-row-alternate-color': alternateColor
		});

		let colRowKey = '';
		// 默认宽度
		let cols = columns
			.filter(col => {
				if (col.primary) colRowKey = col.name;
				if (col.tableItem) {
					return true;
				} else {
					return false;
				}
			})
			.map(col => {
				let item = col.tableItem;
				// select 字典加强
				if (col.dict && !item.render) {
					item.render = (text, record) => {
						return (
							col.dict &&
							col.dict
								.filter(dic => dic.code === text)
								.map(dic => dic.codeName)[0]
						);
					};
				}
				// 如果指定了type字段，则使用指定类型渲染这个列
				const myRender = item.render;
				if (item.type) {
					item.render = (text, record, index) => {
						return $$.isFunction(myRender)
							? myRender(text, record, index)
							: text;
					}
				}
				return {
					title: col.title,
					dataIndex: col.name,
					width: col.width,
					...item
				};
			})
			// 保存rowkey在record
			.concat({
				dataIndex: '_rowkey',
				width: 0,
				render(text, record, index) {
					record.rowKey = record[rowKey || colRowKey];
					return <div style={{ display: 'none' }}>{record.rowKey}</div>;
				}
			});

		// 显示行号
		if (showNum) {
			cols.unshift({
				title: '序号',
				width: 50,
				dataIndex: '_num',
				render(text, record, index) {
					const { pageNum, pageSize } = dataItems;
					if (pageNum && pageSize) {
						return (pageNum - 1) * pageSize + index + 1;
					} else {
						// 没有分页
						return index + 1;
					}
				}
			});
		}
		// 分页
		const paging = objectAssign(
			{
				showSizeChanger: true,
				showQuickJumper: true,
				showTotal: total => `${selectedRowKeys.length ? `已选择${selectedRowKeys.length}条数据` :`共 ${total} 条数据`}`,
				onShowSizeChange: this.onShowSizeChange
			},
			dataItems.pageSize && { pageSize: dataItems.pageSize },
			dataItems.pageNum && { current: dataItems.pageNum },
			dataItems.total && { total: dataItems.total },
			pagination,
		);

		const _rowSelection = {
			type: selectType === 'radio' ? 'radio' : 'checkbox',
			selectedRowKeys: selectedRowKeys,
			onChange: this.onSelectChange, //选中项发生变化
			...rowSelection
		};
		this._rowKey = rowKey || colRowKey;

		return (
			<div className={classname}>
				<Table
					size="small"
					rowSelection={selectType ? _rowSelection : null}
					onRow={(record, index) => {
						const rowConfig = {};
						if (selectType) {
							rowConfig.onClick = this.tableClickOnRow(record, index)//点击行, // 点击行
						}
						return rowConfig
					}}
					// scroll={isScroll ? objectAssign({ x: true }) : {}}
					scroll={scroll || {}}
					// scroll={{ y: 'calc(100% - 30px)' }}
					bodyStyle={{ overflowX: 'auto' }}
					columns={cols}
					pagination={pagination && !noPagination ? paging : false}
					dataSource={dataItems.list}
					onChange={this.handleTableChange}
					rowKey={this._rowKey}
					locale={{emptyText: "暂无相关数据",}}	/*主题定制，修改了默认empty状态，在index.less中有样式覆盖哦*/
					{...otherProps}
				/>
				{
					dataItems.list.length && !pagination && !noPagination ? <div className="pagination-data-table-antd">
						<Paging dataItems={dataItems} onChange={onChange} {...otherProps} selectedRowKeys={selectedRowKeys}/>
					</div> : null
				}

			</div>
		);
	}
}

/**
 * 操作区 阻止向上冒泡
 */
export const Oper = prop => (
	<div className="table-row-button" onClick={e => e.stopPropagation()}>
		{prop.children}
	</div>
);

export const Tip = prop => (
	<Tooltip placement="topLeft" title={prop.children}>
		<div className="nobr" style={prop.style}>
			{prop.children}
		</div>
	</Tooltip>
);

export const Paging = ({ dataItems, onChange, ...otherProps }) => {
	const { total, pageSize, pageNum } = dataItems;
	const { selectedRowKeys } = otherProps
	const paging = {
		total: total,
		pageSize: pageSize,
		current: pageNum,
		showSizeChanger: true,
		showQuickJumper: false,
		showTotal: total => `${selectedRowKeys&&selectedRowKeys.length ? `已选择 ${selectedRowKeys.length} 条数据` :`共 ${total} 条数据`}`,
		// showTotal: total => `共 ${total} 条数据 / 已选择${selectedRowKeys.length}条数据`,
		onChange: pageNum => onChange({ pageNum, pageSize }),
		onShowSizeChange: (pageNum, pageSize) => onChange({ pageNum, pageSize }),
		...otherProps
	};
	return <Pagination {...paging}/>;
};

DataTable.Oper = Oper;
DataTable.Pagination = Paging;
DataTable.Tip = Tip;

export default DataTable;
