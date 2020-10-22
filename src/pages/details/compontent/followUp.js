
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

    // const [_date,set_date] = useState({
    //   user_address: JSON.parse(sessionStorage.data).user_address,
    //   user_name: JSON.parse(sessionStorage.data).user_name,
    //   user_phone: JSON.parse(sessionStorage.data).user_phone,
    // });

    useEffect(() => {
      document.title = '跟进订单';
      
    }, [])

    const onSubmit = () =>{
      if(note === ""){
        Toast.fail("请输入跟进信息", toastTime);
        return false;
      }

      // update(param).then(response=>{
        // history.push('/success');
      // })
    }

    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let minDate = new Date(nowTimeStamp - 1e7);
    const maxDate = new Date(nowTimeStamp + 1e7);
    if (minDate.getDate() !== maxDate.getDate()) {
        minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    }

    const data = [
      {
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        title: 'Meet hotel',
        des: '不是所有的兼职汪都需要风吹日晒',
      },
      {
        img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
        title: 'McDonald\'s invites you',
        des: '不是所有的兼职汪都需要风吹日晒',
      },
      {
        img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
        title: 'Eat the week',
        des: '不是所有的兼职汪都需要风吹日晒',
      },
    ]

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    const { getFieldProps, getFieldError } = props.form;

    return (
      <div className={"followUp"}>
        <div className={"detailsBoxs"}>
        <Tag data-seed="logId">Basic</Tag>
        <List className="date-picker-list">
        
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
        <DatePicker
          value={dateTime}
          onChange={date => {
            setDateTime(date)
            console.log(moment(date).format("YYYY-MM-DD HH:ss"))
          }}
        >
          <List.Item arrow="horizontal">计划提醒</List.Item>
        </DatePicker>
            
        </List>
        </div>
        <div className={"detailsFooter"}>
          <Button 
            type="primary" 
            size="large"
            onClick={onSubmit}
          >确定</Button><WhiteSpace />
        </div>
        <div className={"ListView"}>
          <p>XXX跟进了改客户<Badge text={'已退'} style={{ marginLeft: 10 }} /></p>
          <p>内容</p>  
          <p>时间</p>       
        </div>
        <div className={"ListView"}>
          <p>XXX跟进了改客户<Badge text={'已退'} style={{ marginLeft: 10 }} /></p>
          <p>内容</p>  
          <p>时间</p>       
        </div>
        <div className={"ListView"}>
          <p>XXX跟进了改客户<Badge text={'已退'} style={{ marginLeft: 10 }} /></p>
          <p>内容</p>  
          <p>时间</p>       
        </div>
        <div className={"ListView"}>
          <p>XXX跟进了改客户<Badge text={'已退'} style={{ marginLeft: 10 }} /></p>
          <p>内容</p>  
          <p>时间</p>       
        </div>
      </div>
   );
}

export default createForm()(FollowUp)
            