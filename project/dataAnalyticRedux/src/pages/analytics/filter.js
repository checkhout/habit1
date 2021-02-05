export const formatMetrics = (metrics) => {
	switch (metrics) {
		case 'count':
			return '总数';
		case 'dis':
			return '去重总数';
		case 'max':
			return '最大值';
		case 'min':
			return '最小值';
		case 'sum':
			return '求和';
		case 'avg':
			return '求平均数';
		default:
			return '';
	}
};

export const formatTypeids = (metrics) => {
	switch (metrics) {
		case '>':
			return '大于';
		case '>=':
			return '大于等于';
		case '=':
			return '等于';
		case '<':
			return '小于';
		case '<=':
			return '小于等于';
		case 'in':
			return '在枚举(列表)范围内';
		case 'between':
			return '在两者范围内';
		case 'null':
			return '为空';
		case 'notNull':
			return '不为空';
		case 'like':
			return '包含';
		case 'likePrefix':
			return '前缀包含';
		case 'notLike':
			return '不包含';
		case 'notLikePrefix':
			return '前缀不包含';
		default:
			return '';
	}
};




export const formatFormColumns = (chartData) => {
	console.log('formatFormColumns', chartData);
	const {
		dimensionList,
		// seriesList, eventList
	} = chartData;
	//明细数据
	const columns = [
		{
			title: '日期',
			dataIndex: 'time',
			width: 100,
			fixed: 'left',
		},

	];
	//非时间维度
	dimensionList.forEach(dimension => {
		columns.push({
			title: dimension.name,
			dataIndex: [dimension.code],
			width: 100,
		})
	});
	chartData.eventList.forEach(item => {
		//事件
		columns.push({
			title: item.name,
			dataIndex: item.event,
			width: 100,
		})
	});

	return columns
};
export const formatFormDataSource = (chartData) => {
	const { dimensionList, seriesList, eventList } = chartData;
	let dataSource = [];

	//时间维度
	seriesList.forEach((time, t) => {
		//非时间维度
		if (dimensionList.length) {
			dimensionList.forEach((dimension, e) => {
				//事件
				eventList.forEach((events, d) => {
					dataSource.push({
						key: `${t}-${e}-${d}`,
						time,//时间
						[dimension.code]: '',
					})
				});
			});
		}
		else {
			//事件
			eventList.forEach((events, d) => {
				dataSource.push({
					key: `${t}-${d}`,
					time,//时间
					[events.event]: chartData[events.event][0].amount[t],
				})
			});
		}
	});

	return dataSource
};
