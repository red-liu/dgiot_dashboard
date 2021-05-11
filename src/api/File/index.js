import {
  query_object,
  get_object,
  del_object,
  update_object,
  create_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'

export function Upload({ file }) {
  return request({
    url: 'upload',
    method: 'post',
    params: {
      file,
    },
  })
}

export function UploadImg(param) {
  return request({
    url: 'group1/upload',
    method: 'post',
    headers: {
      proxy: 'group1',
      'Content-Type': 'multipart/form-data',
    },
    data: param,
  })
}
