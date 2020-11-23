const config = {
	menu: [ // 菜单
		{ path: '/homePage', title: '首页', icon: 'icon_statistics', component: 'HomePage', promise: true},
		{ path: '/vehicleManager', title: '车辆管理', icon: 'icon_statistics',  component: 'VehicleManager', promise: true },
		{ path: '/useCarManager', title: '用车管理', icon: 'icon_statistics', component: 'UseCarManager', promise: true },
		{ path: '/reimbursedManager', title: '报销管理', icon: 'icon_statistics',  component: 'ReimbursedManager', promise: true },
		{ path: '/addressBook', title: '通讯录', icon: 'icon_	statistics',  component: 'AddressBook', promise: true },
		{ path: '/setting', title: '设置', icon: 'icon_statistics', component: 'Setting', promise: true },
		{ path: '/certificationAudit', title: '认证审核', icon: 'icon_statistics',  component: 'CertificationAudit', promise: true },
	]
}

export default config