
export const  genderSelect = [
	{ value: '1', txt: '男' },
	{ value: '2', txt: '女' },
];

export const addrBookRoleMgr = [
	{
		value: 'ROLE_ddp2b_admin',
		txt: '管理员'
	},
	{
		value: 'ROLE_ddp2b_car_auditor',
		txt: '用车审批员'
	},
	{
		value: 'ROLE_ddp2b_platform_operator',
		txt: '企业审核员'
	},
	// {
	//     value: 'expensesApproval',
	//     txt: '报销审批员'
	// },
	// {
	//     value: 'financialAuditor',
	//     txt: '财务审核员'
	// },
	{
		value: 'ROLE_ddp2b_driver',
		txt: '驾驶人'
	},
];

export const addrBookOrganization = [
	{
		value: 'nickname',
		txt: '员工姓名'
	},
	{
		value: 'username',
		txt: '手机号'
	},

];

export const RoleSwitchSex = (value) => {
	switch (+value) {
		case 1:
			return '男';
		case 2:
			return '女';
		default:
			return '-';
	}
};

export const RoleSwitchType = (roles) => {
	let str = "";

	if (!roles.length) return "普通员工";

	if (+roles.length === 1) {

		if (roles.indexOf("ROLE_ddp2b_superadmin") !== -1) {
			str = '超级管理员';
		} else if (roles.indexOf("ROLE_ddp2b_admin") !== -1) {
			str = '管理员';
		} else if (roles.indexOf("ROLE_ddp2b_car_auditor") !== -1) {
			str = '用车审批员';
		} else if (roles.indexOf("ROLE_ddp2b_driver") !== -1) {
			str = '驾驶人';
		} else if (roles.indexOf("ROLE_common") !== -1) {
			str = '普通员工';
		} else if (roles.indexOf("ROLE_ddp2b_platform_operator") !== -1) {
			str = '企业审核员';
		}
		return str;

	} else {//多重身份的员工

		roles = roles.filter(item => item !== "ROLE_common");

		if (roles.indexOf("ROLE_ddp2b_superadmin") >= 0 ) {
			str = "超级管理员；"
		}
		if (roles.indexOf("ROLE_ddp2b_admin") >= 0 ) {
			str += "管理员；"
		}
		if (roles.indexOf("ROLE_ddp2b_car_auditor") >= 0 ) {
			str += "用车审批员；"
		}
		if (roles.indexOf("ROLE_ddp2b_driver") >= 0 ) {
			str += "驾驶人；"
		}

		str = str.split("");
		if (str[str.length - 1] === "；") {
			str[str.length - 1] = "";
			str = str.join("");
		}

		return str;
	}
};