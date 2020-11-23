/*
* 处理字符串的方法
* */


/**
 * @param data: object
 * @returns str ?key=value&key2=value2
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