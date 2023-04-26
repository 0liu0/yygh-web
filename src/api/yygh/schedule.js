import request from '@/utils/request'

export default {
    getScheduleRule(page, limit, hoscode, depcode) {
        return request({
            url: `/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`,
            method: 'get'
        })
    }
}
