/*
  封装发送ajax请求函数
  返回值是promise对象

  1. 统一处理成功和失败
  2. 返回值是promise对象，里面直接就是请求回来的数据
 */
import axios from 'axios';
import { message } from 'antd';
import {
	basename,
	TIME_OUT,
	SERVER_IP
} from "@config"

axios.interceptors.request.use(function (config) {
	const now = Date.now();
	const loginTime = sessionStorage.getItem('factoryLoginTime');

	if(loginTime){
		if(now - loginTime > 1800000){
			sessionStorage.clear();
			window.location.href = `${basename}/login`;
			message.error("登录超时，请重新登录！")
		}else{
			sessionStorage.setItem('factoryLoginTime', now)
		}
	}
	return config;
}, function (error) {
	return Promise.reject(error);
});

/**
 * 1. createAjaxAction 在创建action时调用 得到函数2
 * 2. 在page中 dispatch 函数2的返回值函数3 (因为引入了redux-trunk)
 * @param httpHandle    ajax请求
 * @param startAction		请求开始前的action
 * @param endAction			得到请求结果action
 * @returns {function(*=请求参数, *=成功回调, *=失败回调, *={token: "取消请求用的token"}): Function}
 */
export const createAjaxAction = (httpHandle, startAction, endAction) => (param, success, reject, handleCancel) => (dispatch) => {
	// requet start 例如：Spin组件开始loading
	startAction && dispatch(startAction());
	// 发起请求
	httpHandle(param, handleCancel).then((resp) => {//handle 就是下面定义的Server方法
		// console.log("httpHandle then === ", resp);
		//requet end 例如：Spin组件结束loading
		endAction && dispatch(endAction({req: param, res: resp}));
		success && success(resp)
	}).catch((error) => {
		// console.log("httpHandle error === ", error);
		if (reject) {
			reject(error);
		} else {
			message.error(error.message)
		}
	})
};

/**
 * 发出请求
 * @param url
 * @param method
 * @param params
 * @param header
 * @param handleCancel
 * @returns {Promise<any>}
 * @constructor
 *
 * POST请求的Content-Type并非application/x-www-form-urlencoded, multipart/form-data, 或text/plain 会产生预检请求
 */
export const Service = function (url, method = 'GET', params = {}, header={'Content-Type': 'application/json' }, handleCancel) {
	if (method === 'get') {
		const queryKeys = Object.keys(params);

		if (queryKeys.length) {
			let queryStr = '';

			queryKeys.forEach(key => {
				queryStr += key + '=' + params[key] + '&';
			});

			if (queryStr !== '') {
				queryStr = queryStr.substr(0, queryStr.lastIndexOf('&'));
				url = url + '?' + queryStr;
			}
		}
	}
	url = SERVER_IP + url;

	return new Promise((resolve, reject) => {
		const _option = {
			method: method,
			url: url,
			timeout: TIME_OUT,
			params: null,
			data: params,
			headers: header || {'Content-Type': 'application/json' },
			withCredentials: true,//是否携带cookie发起请求
			cancelToken: handleCancel ? handleCancel.token : undefined,
		};
		axios(_option)
			.then(res => {
				const { data } = res;

				if (data.error_code === 0 ) {
					resolve( data.error_info)
				} else {
					if (data.error_code === 629144) {
						window.location.href = `${basename}/login`
					}
					reject(data)
				}
			},error =>{
				reject(error.data)
			})
			.catch(err => {
				//统一处理请求失败的逻辑
				console.log(`${new Date().toLocaleTimeString()}_请求错误err:`, err);
				message.error("请求错误")
			})
	})

};

/**
 * @param url
 * @param method
 * @param header
 * @returns {function(*=, *=): Promise<any>}
 */
export const createQuery = (url, method, header) => (param, handleCancel) => {
	let str = url;

	//拦截、拼接对应数据 @query object
	// if (param && param.query) {
	// 	const { query } = param;
	//
	// 	switch (method) {
	// 		case 'get':
	// 			switch (str) {
	// 				case 'zhanwei1':
	// 					break;
	// 				case 'zhanwei2':
	// 					break;
	// 				default:
	// 					break;
	// 			}
	// 			break;
	// 		case 'delete':
	// 			break;
	// 		case 'post':
	// 			break;
	// 		case 'put':
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// 	delete param.query
	// }

	return Service(str, method, param, header, handleCancel)
};
