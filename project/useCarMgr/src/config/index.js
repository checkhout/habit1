const AMAM_AK = '9f846d89f771956c6ee76211b7ae8f36';	//todo 个人开发者账号，有并发限制，需要更换成企业开发者
const TIME_OUT = 10000; //接口超时时长

/*220测试环境*/
const SERVER_IP = 'http://192.168.3.12:8080';
const basename = "/carmgrs";

/*正式环境*/
// const SERVER_IP = 'https://carmgrgw.ddpai.com:8081';
// const basename = "";



export {
	SERVER_IP,
	TIME_OUT,
	AMAM_AK,
	basename,
}
