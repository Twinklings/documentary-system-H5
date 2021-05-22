import request from '../utils/axios'

let serverIP = "http://push.gendanbao.com.cn";


export function getWeChatConfig(id,type) {
  // type 修改1 跟进2
  return request({
    url:serverIP+"/wechatsalesman/WeChatConfig/"+type+"/"+id,
    method:'get',
  })
}


// 获取订单详情
export function getOrderDetails(params) {
  return request({
    url:serverIP+"/wechatsalesman/salesman",
    method:'post',
    data:params
  })
}
// 确认
export function confirm(params) {
  return request({
    url:serverIP+"/wechatsalesman/update/status",
    method:'post',
    data:params
  })
}
// 修改
export function update(params) {
  return request({
    url:serverIP+"/wechatsalesman/update/order",
    method:'post',
    data:params
  })
}

// 跟进
export function setFollowUp(params) {
  return request({
    url:serverIP+"/wechatsalesman/update/order",
    method:'post',
    data:params
  })
}

// 查看物流信息
export function viewLogistics(params) {
  return request({
    // url:"http://wuliu.mianyabao.cn/wechatsalesman/getLogistics?out_order_no=mf20200814112948277845",

    url:serverIP+"/wechatsalesman/getLogistics?out_order_no="+params,
    method:'post',
  })
}

//意见反馈
export function submitFeedBack(params) {
    return request({
        url:serverIP+"portal/complaintsSave",
        method:'post',
        data:params
    })
}