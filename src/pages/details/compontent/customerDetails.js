
import React, { useState, useEffect, useRef } from 'react';
// import { List, Button, WhiteSpace, DatePicker, InputItem, TextareaItem, Toast, ListView, Badge, Tag } from 'antd-mobile';
import { Tabs, WhiteSpace, Badge, Icon, Toast, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment'
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由
import VConsole from 'vconsole';

import axios from 'axios'
import {getUrlParam, validationEmpty, getLogisticsCompany} from '../../../utils/utils'
import {getWeChatConfig, getOrderDetails, confirm, viewLogistics} from '../../../servers/api'
import '../index.css';
import alarmClock from '../img/alarmClock.svg'
import phone from '../img/phone.svg'
import followUp from '../img/followUp.svg'

const history = createHashHistory();

function CustomerDetails(props) {
  
    const toastTime = 1;
      
    const [details,setDetails] = useState([]);

    const [urls,setUrl] = useState([]);

  // 为0是可以修改 为1 是不允许修改的
    const [confirm_tag,setConfirm_tag] = useState(0);

    const [initializationData,setInitializationData] = useState({
      // user_name:"姓名",
      // pay_amount:99.00,
      // channel_type:1,
      // user_phone:"17353134887",
      // user_address:"这是地址这是地址这是地址这是地址这是地址这是地址这是地址这是地址这是地址这是地址这是地址",
      // follow_records: {list:[{'describe': '111111111', 'createTime': '2020-10-25 00:00:45'}]}
    });


    const [visible,setVisible] = useState(false);

    const [logistics_url,setLogistics_url] = useState("");
    
    const [visibleModal,setVisibleModal] = useState(false);

    const [logisticsList,setLogisticsList] = useState({
      datalist:[]
    });

    useEffect(() => {
      // new VConsole();

      document.title = '客户详情';

      let code = getUrlParam('code');// 这是获取请求路径中带code字段参数的方法
      let belongs = getUrlParam('belongs');// 这是获取请求路径中带code字段参数的方法
      let payAmount = getUrlParam('payAmount');// 这是获取请求路径中带code字段参数的方法
      var local = window.location.href;//获取当前页面路径，即回调地址
      console.log(code,getUrlParam('order'),belongs,payAmount)
      // setVisible(true);
      if(getUrlCode('code') === 'false'){
        setVisible(false);
        getWeChatConfig(getUrlParam('order'),2).then(response=>{
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
        console.log(_data,"详情数据")
        setInitializationData(_data)
        
        setConfirm_tag(_data.confirm_tag);
        sessionStorage.openid = _data.openid;
        sessionStorage.data = JSON.stringify(_data);
        setLogistics_url(_data.logistics_url)
      })
    }

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

    const tabs = [
      { title: "跟进记录" },
      { title: "基本信息" },
      { title: "其他信息" },
    ];

    const myCall = (tel) => {
      window.location.href = `tel://${tel}`;  
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
        res.data.datalist = JSON.parse(res.data.list)
        
        let _datas = res.data;
        
        _datas.name = getLogisticsCompany().result[_datas.type];
  
        console.log(_datas.datalist)
        setLogisticsList(_datas);
      })
    }

    const onClose = () => {
      setVisibleModal(false)
    }
    // {name:"新增",key:1},
    // {name:"导入",key:2},
    // {name:"H5扫码",key:3},
    // {name:"销售",key:4},
    // {name:"电销",key:5},
    // {name:"网销",key:6},
    // {name:"地推",key:7},
    // {name:"免押宝",key:8},
    return (
      <div className={"customerDetails"} style={visible ? {display:"block"} : {display:"none"}}>
        <div className={"top"}>
          <div className={"details"}>
            <div className={"detailsTop"}>
              <span className={"detailsName"}>{initializationData.user_name}</span>
              <span className={"moneyIcon"}>￥</span>
              <span className={"money"}>{initializationData.pay_amount}</span>
              <span className={"label"}>{
                (initializationData.confirm_tag === "0" || initializationData.confirm_tag === 0) ? "待审核":
                (initializationData.confirm_tag === "1" || initializationData.confirm_tag === 1) ? "已审核":
                (initializationData.confirm_tag === "2" || initializationData.confirm_tag === 2) ? "已发货":
                (initializationData.confirm_tag === "3" || initializationData.confirm_tag === 3) ? "在途中":
                (initializationData.confirm_tag === "4" || initializationData.confirm_tag === 4) ? "已签收":
                (initializationData.confirm_tag === "5" || initializationData.confirm_tag === 5) ? "跟进中":
                (initializationData.confirm_tag === "6" || initializationData.confirm_tag === 6) ? "已激活":
                (initializationData.confirm_tag === "7" || initializationData.confirm_tag === 7) ? "已退回":
                (initializationData.confirm_tag === "8" || initializationData.confirm_tag === 8) ? "已取消":
                (initializationData.confirm_tag === "9" || initializationData.confirm_tag === 9) ? "已过期": ""
              }</span>
            </div>
            <div className={"listItem"}><span className={"title"}>负责来源：</span><span style={{color:"#333333"}}>{initializationData.user_name}/{
              (initializationData.order_source === 1 || initializationData.order_source === '1') ? "新增" : 
              (initializationData.order_source === 2 || initializationData.order_source === '2') ? "导入": 
              (initializationData.order_source === 3 || initializationData.order_source === '3') ? "H5扫码": 
              (initializationData.order_source === 4 || initializationData.order_source === '4') ? "销售" :
              (initializationData.order_source === 5 || initializationData.order_source === '5') ? "电销" :
              (initializationData.order_source === 6 || initializationData.order_source === '6') ? "网销" :
              (initializationData.order_source === 7 || initializationData.order_source === '7') ? "地推" :
              (initializationData.order_source === 8 || initializationData.order_source === '8') ? "免押宝" :""
            }</span></div>
            <div className={"listItem"}><span className={"title"}>物流信息：</span><span onClick={getLogistics} className={"defultColor"}>查看物流</span></div>
            <div className={"listItem"}><span className={"title"}>收货地址：</span><span className={"ellipsis"}>{initializationData.user_address}</span></div>
            <div className={"detailsBottom"} onClick={()=>{myCall(initializationData.user_phone)}}>
              <img className={"phone"} src={phone}/>
              <span>{initializationData.user_phone}</span>
              <span style={{float:"right",marginTop:6}}><Icon type={"right"} /></span>
            </div>
          </div>
        </div>
        <div className={"tabs"}>
          <Tabs tabs={tabs}
            initialPage={0}
            onChange={(tab, index) => { console.log('onChange', index, tab); }}
            onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
          >
          </Tabs>
        </div>
        <img 
          className={"customerFollowUp"} 
          src={followUp}
          onClick={()=>{
            history.push('/details/followUp')
          }}
        />

        <div className={"customerContent"}>
          {
            (initializationData.follow_records && 
              initializationData.follow_records != "" && 
              initializationData.follow_records != "{}" && 
              initializationData.follow_records != null) ? 
              JSON.parse(initializationData.follow_records).list.map(item=>{
              return (
                <div className={"listView"}>
                  <div style={{width:"45px",marginTop:"8px"}}>
                    <div className={"headPortrait"}>{initializationData.salesman_name ? initializationData.salesman_name.substr(-2, 2) : "暂无"}</div>
                  </div>
                  <div className={"listViewRight"}>
                    <div className={"listItem"}>
                      <span style={{marginRight:5,color:"#333333"}}>{initializationData.salesman_name ? initializationData.salesman_name.substr(-2, 2) : "暂无"}</span>
                      {
                        initializationData.reminder_time?(<>
                          &nbsp;<span className={"fl defultColor"}>{initializationData.reminder_time}</span> 
                          <img className={"alarmClock"} src={alarmClock}/>
                        </>):""
                      }
                    </div>
                    <div className={"listItem"}><span className={"title"}>跟进时间：</span><span style={{color:"#333333"}}>{item.createTime}</span></div>
                    <div className={"listItem"}><span className={"title"}>跟进内容：</span><span style={{color:"#333333"}}>{item.describe}</span></div>
                  </div>  
                </div>
              )
            }) : ""
          }
        </div>
        <Modal
          visible={visibleModal}
          transparent
          maskClosable={false}
          onClose={onClose}
          title="物流信息"
          footer={[{ text: '关闭', onPress: () => { onClose(); } }]}
          style={{ width:350,}}
        >
          <div className={"logisticsList"} style={{ height: 400, overflow: 'scroll' }}>
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

export default createForm()(CustomerDetails)
            