const TIME_OUT = 10000; //接口超时时长
const ICON_FONT_URL = '//at.alicdn.com/t/font_2293416_3kw624viad.js';
let basename = "";//

// const SERVER_IP = 'https://carmgrgw.ddpai.com:8081';
const SERVER_IP = 'http://192.168.3.12:80';//220地址


if (SERVER_IP === 'http://192.168.3.12:80') {
	// basename = "/data";/*220生产环境, 正式环境没有二级目录*/
}

export {
	SERVER_IP,
	TIME_OUT,
	basename,
	ICON_FONT_URL,
}
