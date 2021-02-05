import moment from 'moment'
import 'moment/locale/zh-cn'
export const rangeDate = {
    'today': [moment(), moment()],
    'lastThreeDays': [moment().subtract(2, 'days'), moment()],
    'aWeek': [moment().subtract(6, 'days'), moment()],
};
export const transformTime = (time, format) => {
    if (time) {
        return moment(time).format(format)
    }
    return '-'
};
export default moment
