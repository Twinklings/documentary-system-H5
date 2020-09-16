import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'
// import {getCookie} from '@/utils/support';
// 创建axios实例
const service = axios.create({
  baseURL: 'http://h5.hemakf.com', // api的base_url
  timeout: 30000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  config.data = {
    // belonging_id:getCookie("username"),
    ...config.data
  }
  console.log(config)
  // if (store.getters.token) {
    // config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    // console.log(response)
    const res = response.data;

    return response.data

    // if(response.config.isShowTips && res.data === null){
    //   // Message({
    //   //   message: res.message,  //"当前数据异常 请点击刷新操作查看最新数据"
    //   //   type: 'error',
    //   //   duration: 3 * 1000
    //   // })
    //   return Promise.reject('error')
    // }else if (res.code !== 200) {
    //   // Message({
    //   //   message: res.message,
    //   //   type: 'error',
    //   //   duration: 3 * 1000
    //   // })

    //   // 401:未登录;
    //   if (res.code === 401) {
    //     // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //     //   confirmButtonText: '重新登录',
    //     //   cancelButtonText: '取消',
    //     //   type: 'warning'
    //     // }).then(() => {
    //     //   store.dispatch('FedLogOut').then(() => {
    //     //     location.reload()// 为了重新实例化vue-router对象 避免bug
    //     //   })
    //     // })
    //   }
    //   return Promise.reject('error')
    // } else {
    //   // Message({
    //   //   message: res.message,  //"当前数据异常 请点击刷新操作查看最新数据"
    //   //   type: 'error',
    //   //   duration: 3 * 1000
    //   // })
    //   return response.data
    // }
  },
  error => {
    console.log('err' + error)// for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 3 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
