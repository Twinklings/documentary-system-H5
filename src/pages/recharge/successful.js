
import React, { useState, useEffect } from 'react';
import { List, Result, Icon, Button, WhiteSpace } from 'antd-mobile';
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由

import './index.css'
import ListItem from '../../components/list'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;

function Success() {
    // const setAddres = () => {
    //     history.push('/addres');
    // }
    useEffect(() => {
      document.title = '订单结果'
    }, [])

    const close = () => {
      if (/MicroMessenger/.test(window.navigator.userAgent)) {
        // 微信
        window.WeixinJSBridge.call('closeWindow');
      } else if (/AlipayClient/.test(window.navigator.userAgent)) {
        // 支付宝
        window.AlipayJSBridge.call('closeWebview');
      }
    }

    return (
      <div className={"rechargeSuccessful"}>
        <Result
            img={<Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />}
            title="支付成功"
            // message={<div>
            //     <div>客户订单信息，已确认</div>
            //     <div>等待后台进行发货</div>
            // </div>}
        />
        <div className={"detailsFooter"}>
          {/* <Button type="primary" size="large">确定</Button><WhiteSpace /> */}
          <Button onClick={close}>关闭</Button><WhiteSpace />
        </div>
      </div>
   );
}

export default Success