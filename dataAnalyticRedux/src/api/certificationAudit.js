import {
	createQuery,
	// Service,
} from './ajax'

//查询企业认证列表
export const certificationAuditListApi = createQuery('/account/api/v1/company/auth/list', "post");
