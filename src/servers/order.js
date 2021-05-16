import request from "../utils/axios";
let serverIP = "http://push.gendanbao.com.cn";

export function getWeChatConfig() {
    return request({
        url:serverIP+"/wechatsalesman/WeChatConfig/3/1",
        method:'get',
    })
}
// 获取产品树
export function getProductTree(params) {
    return request({
        url:serverIP+"/wechatsalesman/productTree",
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