
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

function Modify(props) {
    
    const [details,setDetails] = useState([]);

    // const [date,setDate] = useState(JSON.parse(sessionStorage.data).authorization_time);

    const [_date,set_date] = useState({
      user_address: JSON.parse(sessionStorage.data).user_address,
      user_name: JSON.parse(sessionStorage.data).user_name,
      user_phone: JSON.parse(sessionStorage.data).user_phone,
      // authorization_time:JSON.parse(sessionStorage.data).authorization_time
    });

    useEffect(() => {
      document.title = '订单修改';
      // debugger
      // if(sessionStorage.data){
      //   console.log(JSON.parse(sessionStorage.data).user_name)
      //   set_date({
      //     name:JSON.parse(sessionStorage.data).user_name,
      //     phone:JSON.parse(sessionStorage.data).user_phone,
      //     address:JSON.parse(sessionStorage.data).user_address,
      //     date:JSON.parse(sessionStorage.data).authorization_time,
      //   })
      // }
    }, [])

    const onSubmit = () =>{
      props.form.validateFields({ force: true }, (error) => {
        if (!error) {
          console.log();
          let form = props.form.getFieldsValue()
          // let param = "out_order_no="+JSON.parse(sessionStorage.data).out_order_no+"&"+
          // "user_name="+form.user_name+"&"+
          // "user_phone="+form.user_phone+"&"+
          // "user_address="+form.user_address+"&"+
          // // "authorization_time="+date+"&"+
          // "openid="+sessionStorage.openid

          let param = {
            "out_order_no":JSON.parse(sessionStorage.data).out_order_no,
            "user_name":form.user_name,
            "user_phone":form.user_phone,
            "user_address":form.user_address,
            "openid":sessionStorage.openid,
            "operation_tag":1,
            "id":JSON.parse(sessionStorage.data).id,
          };
          
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
    // console.log(minDate, maxDate);
    if (minDate.getDate() !== maxDate.getDate()) {
    // set the minDate to the 0 of maxDate
        minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    }

    const validatePhone = (rule, value, callback) => {
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号格式'));
      }else{
        callback();
      }
    }

    const { getFieldProps, getFieldError } = props.form;

    return (
      <div>
        <div className={"detailsBoxs"}>
         
        <List className="date-picker-list">
        <InputItem
          {...getFieldProps('user_name', {
            initialValue: _date.user_name,
            rules: [
              { required: true, message: '请输入姓名' },
            ],
          })}
          clear
          error={!!getFieldError('user_name')}
          onErrorClick={() => {
            alert(getFieldError('user_name').join(';'));
          }}
          placeholder="请输入姓名"
        >姓名</InputItem>

        <InputItem
          {...getFieldProps('user_phone', {
            initialValue: _date.user_phone,
            rules: [
              { required: true, message: '请输入手机' },
              { validator: validatePhone },
            ],
          })}
          clear
          error={!!getFieldError('user_phone')}
          onErrorClick={() => {
            alert(getFieldError('user_phone').join(';'));
          }}
          placeholder="请输入手机"
        >手机</InputItem>
        <InputItem
          {...getFieldProps('user_address', {
            initialValue: _date.user_address,
            rules: [
              { required: true, message: '请输入地址' },
            ],
          })}
          clear
          error={!!getFieldError('user_address')}
          onErrorClick={() => {
            alert(getFieldError('user_address').join(';'));
          }}
          placeholder="请输入地址"
        >地址</InputItem>
            
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

export default createForm()(Modify)


{/* <DatePicker
                value={date}
                onChange={date => setDate(date)}
                maxDate={maxDate}
                // minDate={minDate}
            >
                <Item extra={date} arrow="horizontal" onClick={() => {}}>时间</Item>
            </DatePicker> */}
            