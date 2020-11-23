import {createQuery, Service} from './ajax'
import { SERVER_IP } from "@config/index"


//登录时的验证码
export const captchaHttp = `${SERVER_IP}/captcha`;
//登录
export const login_api = createQuery('/login','post', {'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest'});
//获取用户信息
export const query_user_info_api = createQuery('/account/api/v1/account/etr/queryUserInfo', "get");
//获取员工所在企业信息
export const query_company_info_api = createQuery('/account/api/v1/account/etr/getCompanyByUser', "get");
//登出
export const logoutHttp = () => Service('/logout', "get");
