
import React, { useState, useEffect } from 'react';
import { List, Result, Icon, Button, Toast } from 'antd-mobile';
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由
import { viewLogistics} from '../../servers/api'
import { getUrlParam, getLogisticsCompany} from '../../utils/utils'
import './index.css'


function LogisticsList() {

    const [logisticsList,setLogisticsList] = useState({
        datalist:[]
      });
 
    useEffect(() => {
      document.title = '物流信息';
      getList();
    }, [])

    const getList = () => {
        viewLogistics(getUrlParam("out_order_no")).then(res=>{
            console.log(res)
            if(res.data){
              let _datas = res.data;

              if(_datas.list){
                _datas.datalist = JSON.parse(_datas.list)
              }else{
                _datas.datalist = []
              }
              
              _datas.name = getLogisticsCompany().result[_datas.type];
              
              if(_datas.datalist && _datas.datalist.length <= 0){
                Toast.info('订单正在准备，请耐心等待发货。', 1);
              }
              console.log(_datas.datalist)
              setLogisticsList(_datas);
            }else{
              Toast.info('订单正在准备，请耐心等待发货。', 3);
            }
            
          })
    }

    return (
      <div className={"logisticsList"}>
        <div className={"title"}>{logisticsList.name}{logisticsList.no ? `(${logisticsList.no})` : ""}</div>
            {
              logisticsList.datalist.map((item,index)=>{
                return(
                  <div key={index} className={"listItem"}>
                    <div className={"content"} style={{textAlign:"left"}}>{item.content}</div>
                    <div style={{textAlign:"left"}}>{item.time}</div>
                  </div>
                )
              })
            }
      </div>
   );
}

export default LogisticsList