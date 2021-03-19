import {
  query_object,
  get_object,
  del_object,
  update_object,
  create_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA } from '@/config'
export async function queryUser(params) {
  return query_object('_User', params)
}

export async function getUser(ObjectId) {
  return get_object('_User', ObjectId)
}

export async function delUser(ObjectId) {
  return del_object('_User', ObjectId)
}

export async function putUser(ObjectId, pamams) {
  return update_object('_User', ObjectId, pamams)
}

export async function postUser(params) {
  return create_object('_User', params)
}

export function Sitepro(pro) {
  return request({
    url: '/classes/Site/' + pro,
    method: 'get',
    data: {},
  })
}

// export function login(username, password) {
//   return request({
//     url: 'auth/login',
//     method: 'post',
//     data: JSON.stringify({
//       username,
//       password,
//     }),
//   })
// }

export function logoutBtn() {
  return request({
    url: 'user/logout',
    method: 'post',
  })
}

export function Phonelogin(phone, nationcode) {
  return request({
    url: 'sendsms?account=' + phone + '&nationcode=' + nationcode,
    method: 'post',
    data: {},
  })
}

export function Verify(actions, phone, code) {
  return request({
    url: 'verify_code/' + actions + '?account=' + phone + '&code=' + code,
    method: 'post',
    data: {},
  })
}

export function passwordreset(account, code, password) {
  return request({
    url: 'verify_code/passwordreset',
    method: 'post',
    params: {
      account: account,
      code: code,
    },
    data: {
      password: password,
    },
  })
}

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    headers: {
      'Content-Type': 'text/plain',
    },
    url: '/login',
    method: 'post',
    data,
  })
}

export async function socialLogin(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}

// export function getUserInfo() {
//   return request({
//     url: '/userInfo',
//     method: 'get',
//   })
// }
export function getUserInfo(params) {
  return request({
    headers: { accept: 'application/json' },
    url: '/classes/Navigation',
    method: 'get',
    params: params,
  })
}
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}
export function getRouterList(params) {
  return request({
    headers: { accept: 'application/json' },
    url: '/classes/Navigation',
    method: 'get',
    params: params,
  })
}
