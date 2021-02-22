import moment from '@components/moment'

/**
 * 今天 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const TodayMoment = () => {
	return [
		moment().startOf('day').subtract(0, 'days'),
		moment().endOf('day').subtract(0, 'days')
	];
};

/**
 * 昨天 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const YesterdayMoment = () => {
	return [
		moment().startOf('day').subtract(1, 'days'),
		moment().endOf('day').subtract(1, 'days')
	];
};

/**
 * 当周 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const ThisWeekMoment = () => {
	// 计算今天是这周第几天 周日为一周中的第一天
	const weekOfDay = parseInt(moment().format('d'));
	// 获取当前周的开始结束时间
	const start = moment().subtract(weekOfDay - 1, 'days');
	const end = moment().add(7 - weekOfDay, 'days');

	return [
		start,
		end
	];
};

/**
 * 上周 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const LastWeekMoment = () => {
	const start = moment().week(moment().week() - 1).startOf('week');
	const end = moment().week(moment().week() - 1).endOf('week');

	return [
		start,
		end
	];
};

/**
 * 当月 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const ThisMonthMoment = () => {
	const start = moment().month(moment().month()).startOf('month');
	const end = moment().month(moment().month()).endOf('month');

	return [
		start,
		end
	];
};

/**
 * 上月 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const LastMonthMoment = () => {
	const start = moment().month(moment().month() - 1).startOf('month');
	const end = moment().month(moment().month() - 1).endOf('month');

	return [
		start,
		end
	];
};

/**
 * 近7天 从今天开始过去的七天 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const NearWeekMoment = () => {
	const start = moment().subtract(6, 'days');
	const end = moment().add(0, 'days');

	return [
		start,
		end
	];
};

/**
 * 过去7天 从昨天开始算过去的七天 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const YesterdayNearWeekMoment = () => {
	const start = moment().subtract(7, 'days');
	const end = moment().add(-1, 'days');

	return [
		start,
		end
	];
};

/**
 * 近30天 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const NearMonthMoment = () => {
	const start = moment().subtract(29, 'days');
	const end = moment().add(0, 'days');

	return [
		start,
		end
	];
};

/**
 * 过去30天 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const YesterdayLastMonthMoment = () => {
	const start = moment().subtract(30, 'days');
	const end = moment().add(-1, 'days');

	return [
		start,
		end
	];
};

/**
 * todo 季度当前不做，如果要做，可以整合成一个函数
 * Q1季度 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const FirstQuarter = () => {
	const start = moment().quarter(1).startOf('quarter');
	const end = moment().quarter(1).endOf('quarter');

	return [
		start,
		end
	];
};

/**
 * Q2季度 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const SecondQuarter = () => {
	const start = moment().quarter(2).startOf('quarter');
	const end = moment().quarter(2).endOf('quarter');

	return [
		start,
		end
	];
};

/**
 * Q3季度 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const ThirdQuarter = () => {
	const start = moment().quarter(3).startOf('quarter');
	const end = moment().quarter(3).endOf('quarter');

	return [
		start,
		end
	];
};

/**
 * Q4季度 开始和结束
 * @returns {moment[]} start, end
 * @constructor
 */
export const FourthQuarter = () => {
	const start = moment().quarter(4).startOf('quarter');
	const end = moment().quarter(4).endOf('quarter');

	return [
		start,
		end
	];
};

