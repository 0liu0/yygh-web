import request from '@/utils/request'

const api_name = '/admin/hosp/hospital-set'
export default {
  //医院设置列表
  getHospitalPage(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  save(hospset) {
    return request({
      url: `${api_name}/saveHospSet`,
      method: 'post',
      data: hospset
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/getHospSet/${id}`,
      method: 'get'
    })
  },
  updateById(hospset) {
    return request({
      url: `${api_name}/updateHospSet`,
      method: 'post',
      data: hospset
    })
  },
  removeRows(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  },
  //锁定和取消锁定
  lockHospSet(id, status) {
    return request({
      url: `${api_name}/lockHospitalSet/${id}/${status}`,
      method: 'put'
    })
  }
}