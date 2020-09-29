
import React, { useState, useEffect } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由

import {getUrlParam, validationEmpty, getLogisticsCompany} from '../../utils/utils'

// import {getWeChatConfig, getOrderDetails, confirm, viewLogistics} from '../../servers/api'


import axios from 'axios'
import './index.css'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;

function FakeAuthorization(props) {

    const [visible,setVisible] = useState(true);

    useEffect(() => {
      document.title = '订单详情';
      let code = getUrlParam('code');// 这是获取请求路径中带code字段参数的方法
      let belongs = getUrlParam('belongs');// 这是获取请求路径中带code字段参数的方法
      let payAmount = getUrlParam('payAmount');// 这是获取请求路径中带code字段参数的方法
      var local = window.location.href;//获取当前页面路径，即回调地址
      
    //   if(getUrlCode('code') === 'false'){
    //     setVisible(false);
    //     getWeChatConfig(getUrlParam('order')).then(response=>{
    //       console.log(response)
    //       const {appid,STATE,redirect_uri} = response;
    //       let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${STATE}#wechat_redirect`
    //       window.location.href = url
    //     })
    //   }else{
    //     if(validationEmpty(getUrlCode('code'))){
    //       alert("请关闭窗口从新进入")
    //     }else{
    //       let param = window.location.href.split("?")[1];
    //       console.log(param.split("#")[0]);
    //       getDetails(param.split("#")[0]);
    //     }
    //   }
    }, [])

    const onSubmit = () =>{
        props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            console.log();
            let form = props.form.getFieldsValue()
            let param = "out_order_no="+JSON.parse(sessionStorage.data).out_order_no+"&"+
            "user_name="+form.user_name+"&"+
            "user_phone="+form.user_phone+"&"+
            // "authorization_time="+date+"&"+
            "openid="+sessionStorage.openid
            
            // update(param).then(response=>{
            //   history.push('/success');
            // })
          } else {
            Toast.info('表单验证失败');
          }
        });
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
      
        <div className={"box"} style={visible?{display:"block"}:{}}>
            <img className={"bannerImg"} src='http://admin.huoke.wanqianlife.cn/storage/mpos_goods_info/20190625000833113010.jpg' />
            <img className={"bannerImg"} src='http://admin.huoke.wanqianlife.cn/storage/mpos_goods_info/20190625000907693451.jpg' />
            <div className={"boxContent"}>
                <p className={"form-title"}>在线申请中</p>
                <p>已有2048人申请</p>

                <List>
                    <InputItem
                        {...getFieldProps('user_name', {
                            rules: [
                                { required: true, message: '请输入您的姓名' },
                            ],
                        })}
                        clear
                        error={!!getFieldError('user_name')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('user_name').join(';'));
                        }}
                        placeholder="请输入您的姓名"
                    />
                    <InputItem
                        {...getFieldProps('user_phone', {
                            rules: [
                                { required: true, validator: validatePhone },
                            ],
                        })}
                        clear
                        error={!!getFieldError('user_phone')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('user_phone').join(';'));
                        }}
                        placeholder="请输入手机"
                    />
                </List>
                <WhiteSpace />
                <Button 
                    type="warning"
                    onClick={onSubmit}
                >立即申请</Button><WhiteSpace />
            </div>
        </div>
   );
}

export default createForm()(FakeAuthorization)