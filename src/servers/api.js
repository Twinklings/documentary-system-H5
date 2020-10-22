import request from '../utils/axios'

let serverIP = "http://push.gendanbao.com.cn";


export function getWeChatConfig(id) {
  return request({
    url:serverIP+"/wechatsalesman/WeChatConfig/"+id,
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
    url:serverIP+"/wechatsalesman/update/status?"+params,
    method:'post',
  })
}
// 修改
export function update(params) {
  return request({
    url:serverIP+"/wechatsalesman/update/order?"+params,
    method:'post',
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

