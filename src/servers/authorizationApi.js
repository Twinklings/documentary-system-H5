import request from '../utils/axios'
import { conversionFormat } from '../utils/utils'

// let serverIP = "http://47.102.204.79:9081";
let serverIP = "http://h5.genleme.com";

export function getWeChatConfig(params) {
    return request({
      url:"/wechat/config",
      method:'POST',
      data:params
    })
}

//重定向地址
export function redirect(params) {
    return request({
        url:serverIP+"/placeorder/redirect?"+conversionFormat(params),
        method:'get',
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

// 本机认证下单接口
export function machinesaveOrder(params) {
  return request({
    url:serverIP+"/placeorder/machinesaveOrder",
    method:'post',
    data:params
  })
}

// 短信验证码确认接口
export function smsCertification(params) {
  return request({
    url:serverIP+"/placeorder/smsCertification",
    method:'post',
    data:params
  })
}


// 认证号码接口
export function verifyWeb(params) {
  console.log(params,"params")
  return request({
    url: serverIP+"/validation/machinecertified",
    method:'post',
    data:{
      ...params,
    }
  })
}

// 认证记录
export function certificationRecord(params) {
  console.log(params,"params")
  // return request({
  //   url: serverIP+"/validation/machinecertified",
  //   method:'post',
  //   data:{
  //     ...params,
  //   }
  // })
}

//日志收集
export function pageLogSave(json) {
    return request({
        url: serverIP+"/pushlog/save",
        method:'post',
        data:json
    })
}
