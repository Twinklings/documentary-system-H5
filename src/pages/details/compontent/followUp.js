
import React, { useState, useEffect } from 'react';
import { List, Button, WhiteSpace, DatePicker, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由
// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';

import {update} from '../../servers/api'

import axios from 'axios'

import './index.css'
import ListItem from '../../components/list'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;

function FollowUp(props) {
    
    const [details,setDetails] = useState([]);

    // const [_date,set_date] = useState({
    //   user_address: JSON.parse(sessionStorage.data).user_address,
    //   user_name: JSON.parse(sessionStorage.data).user_name,
    //   user_phone: JSON.parse(sessionStorage.data).user_phone,
    // });

    useEffect(() => {
      document.title = '跟进订单';
      
    }, [])

    const onSubmit = () =>{
      props.form.validateFields({ force: true }, (error) => {
        if (!error) {
          console.log();
          let form = props.form.getFieldsValue()
          let param = "out_order_no="+JSON.parse(sessionStorage.data).out_order_no+"&"+
          "user_name="+form.user_name+"&"+
          "user_phone="+form.user_phone+"&"+
          "user_address="+form.user_address+"&"+
          // "authorization_time="+date+"&"+
          "openid="+sessionStorage.openid
          update(param).then(response=>{
            history.push('/success');
          })
        } else {
          alert('表单验证失败');
        }
      });
    }

    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let minDate = new Date(nowTimeStamp - 1e7);
    const maxDate = new Date(nowTimeStamp + 1e7);
    if (minDate.getDate() !== maxDate.getDate()) {
        minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    }

    const { getFieldProps, getFieldError } = props.form;

    return (
      <div>
        <div className={"detailsBoxs"}>
         
        <List className="date-picker-list">
        
        <TextareaItem
            {...getFieldProps('note', {
                // initialValue: _date.user_phone,
                rules: [
                  { required: true, message: '请输入跟进信息' },
                ],
              })}
            rows={3}
            placeholder="请输入跟进信息"
        />
        
        <InputItem
          placeholder="must be the format of YYYY-MM-DD"
          error={!!getFieldError('idp')}
          {...getFieldProps('idp', {
            initialValue: this.state.idt,
            rules: [
              { validator: this.validateIdp },
            ],
          })}
        >Input date</InputItem>
            
        </List>
        </div>
        <div className={"detailsFooter"}>
          <Button 
            type="primary" 
            size="large"
            onClick={onSubmit}
          >确定</Button><WhiteSpace />
        </div>
      </div>
   );
}

export default createForm()(FollowUp)


{/* <DatePicker
                value={date}
                onChange={date => setDate(date)}
                maxDate={maxDate}
                // minDate={minDate}
            >
                <Item extra={date} arrow="horizontal" onClick={() => {}}>时间</Item>
            </DatePicker> */}
            