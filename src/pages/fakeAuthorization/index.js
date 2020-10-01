
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由

import { getUrlParam, randomCode, validationEmpty, getUrlCode } from '../../utils/utils'
import { CITY } from '../../utils/city'
import { init, getvcode, sendcode } from '../../servers/authorizationApi'
import { getWeChatConfig } from '../../servers/api'

import './index.css'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;
let name = "";

let time = 60;

function FakeAuthorization(props) {

    const [visible,setVisible] = useState(true);

    const [initParam,setInitParam] = useState({});

    const [imgCode,setImgCode] = useState("");

    const [countDown,setCountDown] = useState(60);
    
    const [code,setCode] = useState(60);
    
    const divRef = useRef();

    const [randomkey , setRandomkey] = useState("");
    
    const [cityData , setCityData] = useState([]);

    const [cityName , setCityName] = useState([]);

    const getName = (data) => {
        
        for(let i=0; i<data.length; i++){
            if(cityData.indexOf(data[i].value) != -1){
                console.log(data[i].label)
                name+=data[i].label
                setCityName(name)
            }
            if(data[i].children){
                getName(data[i].children)
            }
        }
    }

    useEffect(()=>{
        if(cityData.length === 3){
            name = ""
            for(let i=0; i<CITY.length; i++){
                if(cityData.indexOf(CITY[i].value) != -1){
                    console.log(CITY[i].label)
                    name+=CITY[i].label
                    setCityName(name);
                }
                if(CITY[i].children){
                    getName(CITY[i].children)
                }
                
            }
        }
        
        
    },[cityData])

    

    useEffect(() => {
      document.title = '订单详情';
      let code = getUrlParam('code');// 这是获取请求路径中带code字段参数的方法
      let belongs = getUrlParam('belongs');// 这是获取请求路径中带code字段参数的方法
      let payAmount = getUrlParam('payAmount');// 这是获取请求路径中带code字段参数的方法
      var local = window.location.href;//获取当前页面路径，即回调地址
      setCode(code);
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
          // 初始化数据接口
            getInit();
            // 获取验证码图片
            getImgCode()
    //     }
    //   }

        
    }, [])

    const getImgCode = () => {
        let random_code = randomCode(6);
        setRandomkey(random_code)
        getvcode(random_code).then(res=>{
            setImgCode(res)
        })
    }

    const getInit = () => {
        init({parameter:"188612_1311240882671874049_wanggang_99"}).then(res=>{
            console.log(res.data,"res")
            setInitParam({
                ...res.data,
                isImgCode:true
            })
        })
    } 

    const onSubmit = () =>{
        props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            let form = props.form.getFieldsValue()
            console.log(form,cityName,"formformform")
            // update(param).then(response=>{
            //   history.push('/success');
            // })
          } else {
            Toast.info('表单验证失败');
            const scrollHeight = divRef.current.scrollHeight;//里面div的实际高度 
            const height = divRef.current.clientHeight;  //网页可见高度
            const maxScrollTop = scrollHeight - height;
            console.log(height,maxScrollTop)
            divRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
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

    const startTheCountdown = () => {
        if (!(/^1[3456789]\d{9}$/.test(props.form.getFieldsValue().phone))) {
            return Toast.info('请输入正确的手机号格式');
        }
        if (initParam.isImgCode && validationEmpty(props.form.getFieldsValue().imgCode)) {
            return Toast.info('请输入图片验证码');
        }
        
        sendVerificationCode(props.form.getFieldsValue().phone);
    }

    const sendVerificationCode = (phone) => {
        sendcode({
            "code": props.form.getFieldsValue().imgCode,
            "dept_id": initParam.dept_id,
            "phone": phone,
            "random_key": randomkey,
            "tenant_id": initParam.tenant_id,
        }).then(res=>{
            if(res.code === 200){
                updateCountdown();
            }else{
                Toast.info(res.message);
            }
        })
    }

    const updateCountdown = () =>{
        setTimeout(()=>{
            time --;
            console.log(time,"time")
            if(time != 0){
                updateCountdown();
            }else{
                time = 60
            }
            setCountDown(time)
        },1000)
    }

    const { getFieldProps, getFieldError } = props.form;

    return (
      
        <div className={"box"} style={visible?{display:"block"}:{}} ref={divRef}>
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
                        moneyKeyboardAlign={"left"}
                    />
                    <InputItem
                        {...getFieldProps('phone', {
                            rules: [
                                { required: true, validator: validatePhone },
                            ],
                        })}
                        clear
                        error={!!getFieldError('phone')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('phone').join(';'));
                        }}
                        placeholder="请输入手机"
                        moneyKeyboardAlign={"left"}
                    />
                    {
                        initParam.isImgCode?(
                            <div style={{"position":"relative"}}>
                                <InputItem
                                    {...getFieldProps('imgCode', {
                                        rules: [
                                            { required: true, message: '请输入图片验证码' },
                                        ],
                                    })}
                                    clear
                                    error={!!getFieldError('imgCode')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('imgCode').join(';'));
                                    }}
                                    placeholder="请输入图片验证码"
                                    moneyKeyboardAlign={"left"}
                                >
                                </InputItem>
                                <img 
                                    className={"codeImg"} 
                                    src={imgCode}
                                    onClick={getImgCode}
                                />
                            </div>
                        ):""
                    }
                    
                    <div style={{"position":"relative"}}>
                        <InputItem
                            {...getFieldProps('code', {
                                rules: [
                                    { required: true, message: '请输入验证码' },
                                ],
                            })}
                            clear
                            error={!!getFieldError('code')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('code').join(';'));
                            }}
                            placeholder="请输入验证码"
                            moneyKeyboardAlign={"left"}
                        >
                        </InputItem>
                        <Button 
                            className={"codeImg"}
                            disabled={countDown === 60 ? false : true}
                            onClick={countDown === 60 ? startTheCountdown : ""}
                        >
                            发送验证码{countDown === 60 ? "" : `${countDown}s`}</Button>
                        {/* <img className={"codeImg"} src={imgCode}/> */}
                    </div>
                    
                    <Picker extra="请选择(可选)"
                        data={CITY}
                        title="选择地区"
                            {...getFieldProps('city', {
                        })}
                        onOk={(e) => setCityData(e)}
                    >
                        <List.Item arrow="horizontal">请选择地区</List.Item>
                    </Picker>
                    <InputItem
                        {...getFieldProps('address', {
                            rules: [
                                { required: true, message: '请输入详细地址' },
                            ],
                        })}
                        clear
                        error={!!getFieldError('address')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('address').join(';'));
                        }}
                        placeholder="请输入详细地址"
                        moneyKeyboardAlign={"left"}
                    >
                    </InputItem>
                </List>
                
            </div>
            <div className={"footer"}>
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