import request from '../utils/axios'
import { conversionFormat } from '../utils/utils'

let serverIP = "http://47.102.204.79:80";

// export function getWeChatConfig(id) {
//     return request({
//       url:serverIP+"/wechatsalesman/WeChatConfig/"+id,
//       method:'get',
//     })
//   }

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
