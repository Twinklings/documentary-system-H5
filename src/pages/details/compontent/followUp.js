
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

  const [note,setNote] = useState("");

    useEffect(() => {
      document.title = '跟进订单';
    }, [])

    const onSubmit = () =>{
      if(note === ""){
        Toast.fail("请输入跟进信息", toastTime);
        return false;
      }
      let param = {
        "openid":sessionStorage.openid,
        "out_order_no=":JSON.parse(sessionStorage.data).out_order_no,
        "user_name":JSON.parse(sessionStorage.data).user_name,
        "user_phone":JSON.parse(sessionStorage.data).user_phone,
        "user_address":JSON.parse(sessionStorage.data).user_address,
        "id":JSON.parse(sessionStorage.data).id,
        "follow_records":note,
        "operation_tag":2
      }
      update(param).then(response=>{
        history.push('/success');
      })
    }

    return (
      <div className={"followUp"}>
        <div className={"detailsBoxs"}>
        <List className="date-picker-list">
        {/* <DatePicker
          value={dateTime}
          onChange={date => {
            setDateTime(date)
            console.log(moment(date).format("YYYY-MM-DD HH:ss"))
          }}
        >
          <List.Item arrow="horizontal">计划提醒</List.Item>
        </DatePicker> */}
        <List.Item>跟进内容</List.Item>
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
          >确定</Button><WhiteSpace />
           <Button 
            // type="primary" 
            size="large"
            // onClick={onSubmit}
          >取消</Button>
        </div>
      </div>
   );
}

export default createForm()(FollowUp)
            