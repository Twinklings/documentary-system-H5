
//获取微信url中  的code
export function getUrlParam(name) {
    // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    // var r = window.location.hash.substr(1).match(reg);
    // console.log(window.location.hash.substr(1))
    // if(r != null)
    //     return unescape(r[2]);
    // return null;

    // var query = window.location.hash.substring(1);
    let url = window.location.href.split("?")[1];
    console.log(url,"url")
    if(url){
        var vars = url.split("&");
        for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == name){return pair[1];}
        }
        return null;
    }
    return null;
}

//验证为空
export function validationEmpty(value) {
    if(value === 'null'){
        return true;
    }else if(value === ""){
        return true;
    }else if(value === null){
        return true;
    }else if(value === undefined){
        return true;
    }else if(value === 'undefined'){
        return true;
    }
    return false
}

// 物流公司
export function getLogisticsCompany() {
    return {
      "status": "200",
      "msg": "success",
      "result": {
          "SF": "顺丰速运",
          "HTKY": "百世快递",
          "ZTO": "中通快递",
          "STO": "申通快递",
          "YTO": "圆通速递",
          "YD": "韵达速递",
          "YZPY": "邮政快递包裹",
          "EMS": "EMS",
          "HHTT": "天天快递",
          "JD": "京东物流",
          "QFKD": "全峰快递",
          "GTO": "国通快递",
          "DBL": "德邦",
          "ZJS": "宅急送",
          "AXD": "安信达快递",
          "BTWL": "百世快运",
          "SUNING": "苏宁"
      }
  }
}

// josn转url

export function conversionFormat(param) {
    param = JSON.stringify(param)
    console.log(param)
    return param.replace("{","").replace("}","").replace(/\",\"/g,"&").replace(/,\"/g,"&").replace(/:/g,"=").replace(/\":\"/g,"=").replace(/\"/g,"");
}

// 生成随机码
export function randomCode(length) {
    var arr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
							"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
                            0,1,2,3,4,5,6,7,8,9];
    let key = "";
    for(let i=0; i<length; i++){
        key += arr[Math.floor((Math.random()*62))]
    }
    return key;
}
export function getUrlCode(name) {
    let url = window.location.href.split("?")[1]
    
    if(url){
      var vars = url.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == name){
          return pair[1];
        }
      }
      return "false";
    }
    return "false";
  }