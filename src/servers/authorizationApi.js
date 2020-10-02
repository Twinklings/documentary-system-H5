import request from '../utils/axios'
import { conversionFormat } from '../utils/utils'

let serverIP = "http://47.102.204.79:80";

export function getWeChatConfig(params) {
    return request({
      url:"/wechat/config",
      method:'POST',
      data:params
    })
}

// 初始化接口
export function init(params) {
    console.log(conversionFormat(params))
    return request({
      url:serverIP+"/placeorder/init?"+conversionFormat(params),
      method:'get',
    })
}
// 发送到短信接口
export function sendcode(params) {
    return request({
      url:serverIP+"/validation/sendcode",
      method:'post',
      data:params
    })
}
// 获取验证码接口
export function getvcode(key) {
    return request({
      url:serverIP+"/validation/getvcode/"+key,
      method:'get',
    })
}
// 下单接口
export function placeAnOrder(params) {
  return request({
    url:serverIP+"/placeorder/saveOrder",
    method:'post',
    data:params
  })
}
