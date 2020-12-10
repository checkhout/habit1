export const certificationAuditSearch = [
	// {
	//     value: '1',
	//     txt: '申请人'
	// },
	{
		value: '2',
		txt: '手机号'
	},
	{
		value: '3',
		txt: '认证企业'
	},
];

export const certificationAuditResSearch = [
	{
		value: '-1',
		txt: '全部'
	},
	{
		value: '2',
		txt: '驳回认证'
	},
	{
		value: '3',
		txt: '通过认证'
	},
];
export const certificateStatusSwitch = (value) => {
	//1-认证中(待审核)，2-拒绝，3-通过
	switch (+value) {
		case 1:
			return '待审核';
		case 2:
			return '驳回认证';
		case 3:
			return '通过认证';
		default:
			return '-';
	}
};
