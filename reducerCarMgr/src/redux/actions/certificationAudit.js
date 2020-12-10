import { createAjaxAction } from "@api/ajax"
import { certificationAudit } from "@api"
import { createAction } from "redux-actions";

const certificationAuditListStart = createAction('get certification audit start');
const certificationAuditListEnd = createAction('get certification audit end');
export const certificationAuditListAction = createAjaxAction(
	certificationAudit.certificationAuditListApi,
	certificationAuditListStart,
	certificationAuditListEnd
);
