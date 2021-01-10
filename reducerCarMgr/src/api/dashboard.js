import {
	// createQuery,
	Service,
} from './ajax'
// import { SERVER_IP } from "@config/index"
import { getUrlConcat } from "@utils"



//编辑看板
export const updateDashboardApi = (id, param) => Service(`/bigdata/api/v1/board/${id}`,'put', param);
//删除看板
export const deleteDashboardApi = (id, param) => Service(`/bigdata/api/v1/board/del/${id}`,'put', param);
//新建看板
export const addDashboardApi = (param) => Service('/bigdata/api/v1/board/add','post', param);
//移动看板
export const positionDashboardApi = (id, param) => Service(`/bigdata/api/v1/board/${id}/position`,'put', param);
//看板列表
// export const dashboardListApi = createQuery('/bigdata/api/v1/board/list','get');
//看板列表
export const dashboardListApi = () => Service('/bigdata/api/v1/board/list','get');
//图表列表
export const analysisListApi = id => Service(`/bigdata/api/v1/analysis/${id}/list`,'get');
//查询元事件数据
export const analysisPropertiesApi = id => Service(`/bigdata/api/v1/analysis/kinds`,'get');
//新建分析图表
export const addAnalysisChartApi = (query, param) => Service(`/bigdata/api/v1/analysis/add${getUrlConcat(query)}`,'post', param);
//删除图表
export const deleteChartApi = (id, param) => Service(`/bigdata/api/v1/analysis/${id}`,'delete', param);


