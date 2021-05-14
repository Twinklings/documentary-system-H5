
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, DatePicker, InputItem, TextareaItem, Toast, ListView, Badge, Tag } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment'
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由
// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';

import {update} from '../../../servers/api'

import axios from 'axios'

// import './index.css'
// import ListItem from '../../components/list'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;

function FollowUp(props) {
  const toastTime = 1;

  const notes = useRef();
    
  const [dateTime,setDateTime] = useState("");

  const [loading,setLoading] = useState(false);

  const [note,setNote] = useState("");

    useEffect(() => {
      document.title = '跟进订单';
    }, [])

    const onSubmit = () =>{
      if(note === ""){
        Toast.fail("请输入跟进信息", toastTime);
        return false;
      }
      setLoading(true);
      console.log(note,"跟进信息");
      console.log(JSON.parse(sessionStorage.data).follow_records);
      console.log(dateTime,dateTime ? moment(dateTime).format("YYYY-MM-DD HH:ss"):null)

      let followRecords = [];

      if(!JSON.parse(sessionStorage.data).follow_records || JSON.parse(sessionStorage.data).follow_records === null || JSON.parse(sessionStorage.data).follow_records === '{}'){
        followRecords = [{
          "describe":note,
          "createTime":moment().format("YYYY-MM-DD HH:mm:ss"),
          "reminderTime":dateTime?`${moment(dateTime).format("YYYY-MM-DD HH:mm")}:00`:null
        }]
      }else{

        // moment(dateTime).format("YYYY-MM-DD HH:ss")
        
        let oldlist = JSON.parse(JSON.parse(sessionStorage.data).follow_records).list;

        console.log(oldlist,"followRecords");
        
        followRecords = [
          {
            "describe":note,
            "createTime":moment().format("YYYY-MM-DD HH:mm:ss"),
            "reminderTime":dateTime?`${moment(dateTime).format("YYYY-MM-DD HH:mm")}:00`:null
          },
          ...oldlist
        ]
      }
      console.log(followRecords,moment().format("YYYY-MM-DD HH:mm:ss"),"listlistlistlistlist");

      let param = {
        "openid":sessionStorage.openid,
        "out_order_no":JSON.parse(sessionStorage.data).out_order_no,
        "user_name":JSON.parse(sessionStorage.data).user_name,
        "user_phone":JSON.parse(sessionStorage.data).user_phone,
        "user_address":JSON.parse(sessionStorage.data).user_address,
        "id":JSON.parse(sessionStorage.data).id,
        "follow_records":JSON.stringify({list:followRecords}),
        "reminderTime":dateTime?`${moment(dateTime).format("YYYY-MM-DD HH:mm")}:00` :null,
        "operation_tag":2,
        "salesman":JSON.parse(sessionStorage.data).salesman,
        'tenant_id':JSON.parse(sessionStorage.data).tenant_id,
        'dept_id':JSON.parse(sessionStorage.data).dept_id,
      }
      update(param).then(response=>{
        // history.push('/success');
        Toast.info('跟进成功，窗口将会关闭，请重新打开详情查看跟进信息', 3);
        setLoading(false);
        setTimeout(()=>{
          if (/MicroMessenger/.test(window.navigator.userAgent)) {
            // 微信
            window.WeixinJSBridge.call('closeWindow');
          } else if (/AlipayClient/.test(window.navigator.userAgent)) {
            // 支付宝
            window.AlipayJSBridge.call('closeWebview');
          }
        },3000)
      })
    }

    return (
      <div className={"followUp"}>
        <div className={"detailsBoxs"}>
        <List className="date-picker-list">
        <DatePicker
          value={dateTime}
          onChange={date => {
            setDateTime(date)
            console.log(moment(date).format("YYYY-MM-DD HH:ss"))
          }}
          extra={"如需定时提醒，请选择"}
        >
          <List.Item style={{marginTop:10}} arrow="horizontal">下次联系时间</List.Item>
        </DatePicker>
        <List.Item style={{marginTop:10}}>跟进内容</List.Item>
       

        <TextareaItem
            rows={3}
            placeholder="请输入跟进信息"
            ref={notes}
            onClick={()=>{
              notes.current.focus();
            }}
            onChange={(value)=>{
              setNote(value)
            }}
        />
        
        </List>
        </div>
        <div className={"detailsFooter"}>
          <Button 
            type="primary" 
            size="large"
            onClick={onSubmit}
            loading={loading}
          >确定</Button>
          <WhiteSpace />
           {/* <Button 
            // type="primary" 
            size="large"
            ghost
            style={{
              background: 'transparent',
              color: '#1890FF',
              border: '1px solid #1890FF',
            }}
            // onClick={onSubmit}
          >取消</Button> */}
        </div>
      </div>
   );
}

export default createForm()(FollowUp)
            