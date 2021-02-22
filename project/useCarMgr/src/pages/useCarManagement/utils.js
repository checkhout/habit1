//对应 当前状态，0-待审核,1-已同意,2-已拒绝,3-已撤销,4-已取消,5-行程进行中，6-行程结束
export const tripStatusSelect = [
	{
		value: '0',
		txt: '全部'
	},
	{
		value: '1',
		txt: '未开始'
	},
	{
		value: '4',
		txt: '已取消'
	},
	{
		value: '5',
		txt: '进行中'
	},
	{
		value: '6',
		txt: '已结束'
	},
];

//用车类型：申请使用公车、申请司机接送、直接派车、申请私车公用（暂未做）
export const useCarMode = [
	{
		value: '0',
		txt: '全部'
	},
	{
		value: '2',
		txt: '申请使用公车'
	},
	{
		value: '5',
		txt: '申请司机接送'
	},
	{
		value: '4',
		txt: '直接派车'
	},
];

// 当前状态，0-待审核,1-已同意,2-已拒绝,3-已撤销,4-已取消,5-行程进行中，6-行程结束
export const UseCarTripStatusType = (value) => {
	switch (+value) {
		case 1:
			return '未开始';
		case 4:
			return '已取消';
		case 5:
			return '进行中';
		case 6:
			return '已结束';
		default:
			return '-';
	}
};
