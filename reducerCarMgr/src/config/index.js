const AMAM_AK = '9f846d89f771956c6ee76211b7ae8f36';	//todo 个人开发者账号，有并发限制，需要更换成企业开发者
const TIME_OUT = 10000; //接口超时时长

const SERVER_IP = 'http://192.168.3.12:8080';                //220测试&开发环境
// const SERVER_IP = 'https://carmgrgw.ddpai.com:8081';            //外网环境

let basename = ""; //220内网环境需要加一级目录，外网环境则不需要

//内网环境部署在二级目录
if (process.env.NODE_ENV === 'production' && SERVER_IP === "http://192.168.3.12:8080") {
	basename = "/carmgrs";
}

export {
	SERVER_IP,
	TIME_OUT,
	AMAM_AK,
	basename,
}