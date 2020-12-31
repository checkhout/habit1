import moment from 'moment'
import 'moment/locale/zh-cn'
export const rangeDate = {
    '今天': [moment(), moment()],
    '近三天': [moment().subtract(2, 'days'), moment()],
    '近一周': [moment().subtract(6, 'days'), moment()],
};
export const transformTime = (time, format) => {
    if (time) {
        return moment(time).format(format)
    }
    return '-'
};
export default moment