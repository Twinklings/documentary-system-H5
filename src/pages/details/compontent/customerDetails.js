
import React, { useState, useEffect, useRef } from 'react';
// import { List, Button, WhiteSpace, DatePicker, InputItem, TextareaItem, Toast, ListView, Badge, Tag } from 'antd-mobile';
import { Tabs, WhiteSpace, Badge } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment'
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由

import axios from 'axios'

import '../index.css';
import alarmClock from '../img/alarmClock.svg'
import phone from '../img/phone.svg'
import followUp from '../img/followUp.svg'

const history = createHashHistory();

function CustomerDetails(props) {


    useEffect(() => {
      document.title = '客户详情';
      
    }, [])

    const tabs = [
      { title: "跟进记录" },
      { title: "基本信息" },
      { title: "其他信息" },
    ];

    return (
      <div className={"customerDetails"}>
        <div className={"top"}>
          <div className={"details"}>
            <div className={"detailsTop"}>
              <span className={"detailsName"}>姓名呀</span>
              <span className={"money"}>99.00</span>
              <span className={"label"}>已签收</span>
            </div>
            <div className={"listItem"}><span className={"title"}>负责来源：</span><span>10-22 19:30</span></div>
            <div className={"listItem"}><span className={"title"}>物流信息：</span><span className={"defultColor"}>查看物流</span></div>
            <div className={"listItem"}><span className={"title"}>收获地址：</span><span>10-22 19:30</span></div>
            <div className={"detailsBottom"}>
              <img className={"phone"} src={phone}/><span>17353134887</span><span style={{float:"right"}}></span>
            </div>
          </div>
        </div>
        <div className={"tabs"}>
          <Tabs tabs={tabs}
            initialPage={1}
            onChange={(tab, index) => { console.log('onChange', index, tab); }}
            onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
          >
          </Tabs>
        </div>
        <img className={"customerFollowUp"} src={followUp}/>

        <div className={"customerContent"}>
          <div className={"listView"}>
            <div>

            </div>
            <div className={"listViewRight"}>
              <div className={"listItem"}><span className={"fl"} style={{marginRight:5}}>大猫</span>&nbsp;<span className={"fl defultColor"}>10-22 19:30</span> <img className={"alarmClock"} src={alarmClock}/></div>
              <div className={"listItem"}><span className={"title"}>跟进时间：</span><span>10-22 19:30</span></div>
              <div className={"listItem"}><span className={"title"}>跟进内容：</span><span>这都是些什么跟进信息啊这都是些什么跟进信息啊这都是些什么跟进信息啊这都是些什么跟进信息啊这都是些什么跟进信息啊这都是些什么跟进信息啊</span></div>
            </div>  
          </div>
          <div className={"listView"}>
            <div>

            </div>
            <div className={"listViewRight"}>
              <div className={"listItem"}><span>大猫</span> <span>10-22 19:30</span></div>
              <div className={"listItem"}><span className={"title"}>跟进时间：</span><span>10-22 19:30</span></div>
              <div className={"listItem"}><span className={"title"}>跟进内容：</span><span>这都是些什么跟进信息啊这都是些什么跟进信息啊这都是些什么跟进信息啊这都是些什么跟进信息啊这都是些什么跟进信息啊这都是些什么跟进信息啊</span></div>
            </div>  
          </div>
        </div>
      </div>
   );
}

export default createForm()(CustomerDetails)
            