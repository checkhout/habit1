


/**
 * 用于get方法后面参数的拼接，传入data是对象
 * @param {*} name
 */
export const getUrlConcat = function (data) {
	let dataStr = ''; //数据拼接字符串
	if (data) {
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})
	}
	if (dataStr !== '') {
		dataStr = '?' + dataStr.substr(0, dataStr.lastIndexOf('&')); // 去除掉最后一个"&"字符
	}
	return dataStr
};


//常用的正则规则
export const regExpConfig = {
	IDcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, // 身份证
	mobile: /^1\d{10}$/, // 手机号码
	phone: /^1[3456789]\d{9}$/, // 手机号码
	email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,//邮箱
	mobileOrEmail: /^((([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))|(1\d{10})$/,
	telephone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, // 固定电话
	num: /^[0-9]*$/, // 数字
	phoneNo: /(^1\d{10}$)|(^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$)/, // 电话或者手机
	policeNo: /^[0-9A-Za-z]{4,10}$/, // 账号4-10位数字或字母组成
	pwd: /^[0-9A-Za-z]{6,16}$/, // 密码由6-16位数字或者字母组成
	sim: /^[0-9A-Za-z]{20}$/, //sim卡号由20个字母与数字
	txtPwd: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,20}$/, //密码由8-20必须包含数字和字母
	regPwd: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/, // //密码必须包含数字和字母至少8位
	isNumAlpha: /^[0-9A-Za-z]*$/, // 字母或数字
	isAlpha: /^[a-zA-Z]*$/, // 是否字母
	isNumAlphaCn: /^[0-9a-zA-Z\u4E00-\uFA29]*$/, // 是否数字或字母或汉字
	isPostCode: /^[\d-]*$/i, // 是否邮编
	isNumAlphaUline: /^[0-9a-zA-Z_]*$/, // 是否数字、字母或下划线
	isNumAndThanZero: /^([1-9]\d*(\.\d+)?|0)$/, // 是否为整数且大于0/^[1-9]\d*(\.\d+)?$/
	isNormalEncode: /^(\w||[\u4e00-\u9fa5]){0,}$/, // 是否为非特殊字符（包括数字字母下划线中文）
	isTableName: /^[a-zA-Z][A-Za-z0-9#$_-]{0,29}$/, // 表名
	isInt: /^-?\d+$/, // 整数
	isTableOtherName: /^[\u4e00-\u9fa5]{0,20}$/, // 别名
	regUsername: /^(\W|\w{1}){0,30}$/, // 匹配30个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符 -- 用来校验用户姓名
	regUsername_20: /^(\W|\w{1}){0,20}$/, // 匹配20个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符 -- 用来校验用户姓名
	isText_50: /^(\W|\w{1}){0,50}$/, // 匹配50个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
	isText_20: /^(\W|\w{1}){0,20}$/, // 匹配20个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
	isText_100: /^(\W|\w{1}){0,100}$/, // 匹配100个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
	isText_250: /^(\W|\w{1}){0,250}$/, // 匹配250个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
	isNotChina: /^[^\u4e00-\u9fa5]{0,}$/, // 不为中文  IDcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, // 身份证
	IDcardAndAdmin: /^(([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))|(admin))$/, // 身份证或者是admin账号
	IDcardTrim: /^\s*(([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))|(admin))\s*$/, // 身份证
	num1: /^[1-9]*$/, // 数字
	companyNO: /^ddpai_[0-9a-zA-Z_]{1,}$/, // 公司人员账号
	imgType: /image\/(png|jpg|jpeg|gif)$/, // 上传图片类型
	isChina: /^[\u4e00-\u9fa5]{2,8}$/,
	isNozeroNumber: /^\+?[1-9]\d*$/, // 大于零的正整数
	float: /^\d+(\.?|(\.\d+)?)$/, // 匹配正整数或者小数 或者0.这个特殊值
	regularNickname: /^[A-Za-z0-9\u4E00-\u9FA5]{1,10}$/,//用户昵称
	voiceName: /\S+\.[m4a|zip]/, //语音文件
	isVin: /^[A-Za-z0-9]{17}$/, // 17位车架号
};
export const  firstAndEndTrim = (str) => {// 匹配开头空格 匹配结尾空格
	return str.replace(/(^\s*)|(\s*$)/g, "");
};

export const formatType = {
	normal: 'YYYY年MM月DD日 HH:mm:ss',
	normalNoH: 'YYYY年MM月DD日',
	normalNoDay: 'HH时mm分ss秒',
	xFormat: 'YYYY-MM-DD HH:mm:ss',
	xFormatNoSeconds: 'YYYY-MM-DD HH:mm',
	xFormatNoDay: 'HH:mm:ss',
	xFormatNoH: 'YYYY-MM-DD',
	fileFormat: 'YYYYMMDDHHmmss',
	urlFormat: 'YYYY/MM/DD',
	usuallyFormat: 'MM-DD HH:mm:ss',
	noSeconds: 'YYYY-MM-DD HH:mm',
	pointCutYMD: 'YYYY.MM.DD',
};


export const isEmpty = (value) => {
	if (value === "" || value === undefined || value === null) {
		return '-'
	}else{
		return value
	}
};


//传入毫秒单位时间，根据时长返回 xx天xx小时xx分钟
export const useCarTime = (start, end) => {
	if (end > start) {

		const differD = end - start;
		let differH = 0;
		let differM = 0;
		let d = 0, h = 0, m = 0;

		if (differD >= 86400000) {
			//计算天
			d = parseInt(differD / 86400000);
			differH = differD - (d * 86400000);
			if (differH > 0) {
				//计算小时
				h = parseInt(differH / 3600000);
				differM = differH - (h * 3600000);
				if (differM > 0) {
					m = parseInt(differM / 60000);
				}
			}
		} else if (differD >= 3600000) {
			//计算小时
			h = parseInt(differD / 3600000);
			differM = differD - (h * 3600000);
			if (differM > 0) {
				m = parseInt(differM / 60000);
			}
		} else if (differD >= 60000) {
			m = parseInt(differD / 60000);
		}

		// console.log("=============", differD, d, h, m );
		if (d > 0) {
			return `${d}天${h}时${m}分`
		}
		if (h > 0) {
			return `${h}时${m}分`
		}
		if (m > 0) {
			return `${m}分`
		}
		if (d <= 0 && h <= 0 && m <= 0) return 0
	} else {
		console.log("开始时间小于结束时间！");
		return "-";
	}
};

