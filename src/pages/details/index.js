
import React, { useState, useEffect } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, Flex } from 'antd-mobile';
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由
import QRCode  from 'qrcode.react';
import VConsole from 'vconsole';
import {getUrlParam, validationEmpty, getLogisticsCompany} from '../../utils/utils'
import {getWeChatConfig, getOrderDetails, confirm, viewLogistics} from '../../servers/api'


import axios from 'axios'

import './index.css'
import ListItem from '../../components/list'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;

function Details() {
    const toastTime = 1;
    
    const [details,setDetails] = useState([]);

    const [urls,setUrl] = useState([]);

// 为0是可以修改 为1 是不允许修改的
    const [confirm_tag,setConfirm_tag] = useState(0);

    const [initializationData,setInitializationData] = useState({});


    const [visible,setVisible] = useState(false);

    const [logistics_url,setLogistics_url] = useState("");
    
    const [visibleModal,setVisibleModal] = useState(false);

    const [logisticsList,setLogisticsList] = useState({
      datalist:[]
    });
    
    useEffect(() => {
      new VConsole();

      document.title = '订单详情';
      let code = getUrlParam('code');// 这是获取请求路径中带code字段参数的方法
      let belongs = getUrlParam('belongs');// 这是获取请求路径中带code字段参数的方法
      let payAmount = getUrlParam('payAmount');// 这是获取请求路径中带code字段参数的方法
      var local = window.location.href;//获取当前页面路径，即回调地址
      console.log(code,getUrlParam('order'),belongs,payAmount)
      
      if(getUrlCode('code') === 'false'){
        setVisible(false);
        getWeChatConfig(getUrlParam('order')).then(response=>{
          console.log(response)
          const {appid,STATE,redirect_uri} = response;
          let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${STATE}#wechat_redirect`
          window.location.href = url
        })
      }else{
        if(validationEmpty(getUrlCode('code'))){
          alert("请关闭窗口从新进入")
        }else{
          console.log(window.location.href,"地址栏order")
          console.log(getUrlParam('state'),getUrlCode('code'),"地址栏order1");
          // http://h1.genleme.com/?code=081JQIkl2nWkQ54aqAll2CbqBq1JQIk9&state=mf20201022231202164794#/details
          let param = window.location.href.split("?")[1];
          // code=081JQIkl2nWkQ54aqAll2CbqBq1JQIk9&state=mf20201022231202164794#/details
          console.log(param,"地址栏order")

          let _paramCode = param.split("&")[0];//code=081JQIkl2nWkQ54aqAll2CbqBq1JQIk9
          console.log(_paramCode.split("=")[1],"_paramCode")
          
          let _param1 = param.split("&")[1];
          // state=mf20201022231202164794#/details
          console.log(_param1)
          
          let _param2 = _param1.split("=")[1];
          // mf20201022231202164794#/details
          console.log(_param2)

          let _param3 = _param2.split("#")[0];
          console.log(_param3,"_param3")

          getDetails(_param3,_paramCode.split("=")[1]);
        }
      }
    }, [])

    const getUrlCode = (name) => {
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

    const getDetails = (_param3,_paramCode) => {
      getOrderDetails({
        code:_paramCode,
        order_id:_param3
      }).then(response=>{
        if(!response.data){
          alert("未查询到数据")
          return false;
        }
        setVisible(true);
        let _data = response.data;
        setInitializationData(_data)
        let data = [
          {
            title:"姓名",
            name:_data.user_name
          },
          {
            title:"手机",
            name:_data.user_phone
          },
          {
            title:"收货地址",
            name:_data.user_address
          },
          {
            title:"订单来源",
            // 1 支付宝 2 微信  3伪授权 4免费 
            name:_data.channel_type === 1 ? "支付宝" : _data.channel_type === 2 ? "微信": _data.channel_type === 3 ? "伪授权": _data.channel_type === 3 ? "免费" :""
          },
          {
            title:"免押金额",
            name:_data.pay_amount,
            type:"pay_amount"
          },
          {
            title:"交易单号",
            name:_data.out_order_no
          },
          {
            title:"申请时间",
            name:_data.authorization_time
          },
          // {
          //   title:"专属客服",
          //   name:_data.aftersales_phone
          // },
          // {
          //   title:"投诉电话",
          //   name:_data.complaints_phone
          // },
        ]
        setDetails(data);
        setConfirm_tag(_data.confirm_tag);
        sessionStorage.openid = _data.openid;
        sessionStorage.data = JSON.stringify(_data);
        setLogistics_url(_data.logistics_url)
      })
    }

    const determine = () =>{
      let param = "out_order_no="+initializationData.out_order_no+"&"+
          "openid="+initializationData.openid
      confirm(param).then(response=>{
        history.push('/success');
      })
    }

    const update = () =>{
      history.push('/modify');
    }


    function copyArticle(val) {

    var input = document.createElement('input');

    input.setAttribute('id','copyId');

    input.value= val

    document.querySelector('body').appendChild(input)

          const range = document.createRange();

          range.selectNode(document.getElementById('copyId'));

          const selection = window.getSelection();

          if(selection.rangeCount> 0)selection.removeAllRanges();

          selection.addRange(range);

          document.execCommand('copy');

          document.getElementById('copyId').remove()

          Toast.info('复制成功!', toastTime);

      }
  const getLogistics = () => {
    setVisibleModal(true)
    console.log(initializationData)
    viewLogistics(initializationData.out_order_no).then(res=>{
      console.log(res)
      if(res.data === null || res.data.list === null){
        Toast.info('订单正在准备，请耐心等待发货。', toastTime);
        return false;
      }
      // let datas = {"code":200,"message":"操作成功","total":0,"data":{"code":"OK","no":"8417735845","type":"DBL","list":"[{\"time\":\"2020-08-15 17:00:00\",\"content\":\"预计8月15日17:00前送达\"},{\"time\":\"2020-08-14 06:23:00\",\"content\":\"运输中，离开【郑州枢纽中心】，下一部门【温州转运中心】\"},{\"time\":\"2020-08-13 21:33:00\",\"content\":\"运输中，到达郑州枢纽中心\"},{\"time\":\"2020-08-13 20:19:00\",\"content\":\"运输中，离开【郑州管城区陇海路快递分部】，下一部门【郑州枢纽中心】\"},{\"time\":\"2020-08-13 19:21:00\",\"content\":\"您的订单已被收件员揽收,【郑州管城区陇海路快递分部】库存中\"}]","state":"2","msg":null,"name":"德邦","courier":"","courierPhone":"","id":"","out_order_no":"wx20200812155828556244","belonging_id":""}}
      res.data.datalist = JSON.parse(res.data.list)
      
      
      let _datas = res.data;
      
      _datas.name = getLogisticsCompany().result[_datas.type];

      console.log(_datas.datalist)
      setLogisticsList(_datas);


      // let param = getLogisticsCompany().result[_datas.type];
      // console.log(param)
    })
  }

  const onClose = () => {
    setVisibleModal(false)
  }

  const myCall = () => {
    window.location.href = `tel://${'15160078582'}`;  
  }
  
  const followUp = () => {
    history.push('/details/followUp');
  }

    return (
      
      <div className={"box"} style={visible?{display:"block"}:{}}>
        <div className={"detailsBox"} >
          <div className={"details_title"}>
            <div className={"details_title_content"}>
              订单详情
              <span 
                className={"tips"}
                style={confirm_tag === 0 ? {background:"#FF6010"} : {background:"#49CB15"}}
              >{confirm_tag === 0 ? "待确认" : "已确认"}</span>
            </div>
          </div>
          <ListItem
            data={details}
          />
          {/* <div className={"list-item"}>
              <div className={"list-left-title"}>物流地址</div>
              <div className={"list-right-content"}>
              <a style={{ color: '#108ee9' }}
                onClick={()=>{copyArticle(logistics_url)}}
              >复制</a>
              </div>
          </div> */}
          <div className={"list-item"}>
              <div className={"list-left-title"}>物流信息</div>
              <div className={"list-right-content"}>
              <a style={{ color: '#108ee9' }}
                onClick={getLogistics}
              >查看</a>
              </div>
          </div>
          <div className={"list-item"} style={{borderTop: '1px solid #e2e2e2',marginTop:10}}>
              <div className={"list-left-title"}>专属客服</div>
              <div className={"list-right-content"}>{initializationData.aftersales_phone}</div>
          </div>
          <div className={"list-item"}>
              <div className={"list-left-title"}>投诉电话</div>
              <div className={"list-right-content"}>{initializationData.complaints_phone}</div>
          </div>
        </div>
        <div className={"operation"}>
          <QRCode
                value={logistics_url}  //value参数为生成二维码的链接
                size={100} //二维码的宽高尺寸
                fgColor="#000000"  //二维码的颜色
          />
          <p style={{lineHeight:'6px',height:"6px"}}>扫码查看物流信息</p>
        </div>

        <div className={"detailsFooter"}>
          {
            confirm_tag === 0 ? (
              <div>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={determine}
                >确定</Button><WhiteSpace />
              </div>
            ) :""
          }
          {
            confirm_tag === 0 ? (
              <div>
                <Button onClick={update}>修改</Button><WhiteSpace />
              </div>
            ) :""
          }
          <Button 
          onClick={()=>{
            let text = initializationData.user_name+","+initializationData.user_phone+","+initializationData.user_address
            copyArticle(text)}}
          >复制发货信息</Button>
          <WhiteSpace />

          {/* <Flex>
            <Flex.Item>
              <Button 
                onClick={()=>myCall()}
              >电话</Button>
            </Flex.Item>
            <Flex.Item>
              <Button 
                onClick={()=>{
                  followUp();
                }}
              >跟进</Button>
            </Flex.Item>
          </Flex>
          <WhiteSpace /> */}
        </div>
        

        <Modal
          visible={visibleModal}
          transparent
          maskClosable={false}
          onClose={onClose}
          title="物流信息"
          footer={[{ text: '关闭', onPress: () => { onClose(); } }]}

          style={{ width:350,}}
          // wrapProps={{ onTouchStart: onWrapTouchStart }}
          // afterClose={() => { alert('afterClose'); }}
        >
          <div style={{ height: 400, overflow: 'scroll' }}>
            <div>{logisticsList.name}{logisticsList.no ? `(${logisticsList.no})` : ""}</div>
            {
              logisticsList.datalist.map((item,index)=>{
                return(
                  <div key={index} className={"listItem"}>
                    <div style={{textAlign:"left"}}>{item.content}</div>
                    <div style={{textAlign:"left"}}>{item.time}</div>
                  </div>
                )
              })
            }
          </div>
        </Modal>
      </div>
   );
}

export default Details