
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由
import VConsole from 'vconsole';

import { getUrlParam, randomCode, validationEmpty, getUrlCode } from '../../utils/utils'
import { CITY } from '../../utils/city'
import { init, getvcode, sendcode, getWeChatConfig } from '../../servers/authorizationApi'

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
    
    const divRef = useRef();

    const [randomkey , setRandomkey] = useState("");
    
    const [cityData , setCityData] = useState([]);

    const [cityName , setCityName] = useState([]);

    const [browserType , setBrowserType] = useState(false);

    

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
        new VConsole();

        document.title = '订单详情';
        let dept_id = getUrlParam('dept_id');// 这是获取请求路径中带code字段参数的方法
        let payAmount = getUrlParam('payAmount');// 这是获取请求路径中带code字段参数的方法
        let orderNo = getUrlParam('orderNo');// 这是获取请求路径中带code字段参数的方法
        let userName = getUrlParam('userName');// 这是获取请求路径中带code字段参数的方法

    //   "188612_1311240882671874049_wanggang_99"
        if (/MicroMessenger/.test(window.navigator.userAgent)) {
            // 微信
            setBrowserType(1)
        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
            // 支付宝
            setBrowserType(2)
        }else{
            
        }
      
        let param = window.location.href.split("?")[1];
        console.log(param.split("#")[0]);
          // 初始化数据接口
        getInit(dept_id,orderNo,userName,payAmount);
        // 获取验证码图片
        getImgCode()
        
    }, [])

    const getImgCode = () => {
        let random_code = randomCode(6);
        setRandomkey(random_code)
        getvcode(random_code).then(res=>{
            setImgCode(res)
        })
    }

    const getInit = (dept_id,orderNo,userName,payAmount) => {
        let param = [dept_id,orderNo,userName,payAmount];
        param = param.join("_");
        console.log(param,"param")
        init({parameter:param}).then(res=>{
            console.log(res.data,"res")
            setInitParam({
                ...res.data,
                isImgCode:true
            })
        })
    } 

    const selectAddress = () => {
        if (/MicroMessenger/.test(window.navigator.userAgent)) {
            var signUrl = window.location.href.split('#')[0];
            var channel_id = "";
            var datas = { channel_id: channel_id, signUrl: signUrl };
            getWeChatConfig(datas).then(data_suscee=>{
                var dataJson = JSON.parse(JSON.stringify(data_suscee));
                console.log(data_suscee,"data_suscee")
                let appidG = dataJson.appid;
                let timestampG = dataJson.timestamp;
                let nonceStrG = dataJson.nonceStr;
                let signatureG = dataJson.signature;
                let channel_id = dataJson.channel_id;
                window.wx.config({
                    debug: true,
                    appId: dataJson.appid,
                    timestamp: dataJson.timestamp,
                    nonceStr: dataJson.nonceStr,
                    signature: dataJson.signature,
                    jsApiList: ["getNetworkType","openLocation","getLocation","openBusinessView","openAddress","getBrandWCPayRequest","closeWindow"]
                })
                getShippingaddress();
            })
            // $.ajax({
            //     url: "/wechat/config",
            //     async : false,
            //     type : "POST",
            //     contentType : 'application/json',
            //     dataType : 'json',
            //     data :JSON.stringify(datas),
            //     success: function (data_suscee) {
            //         globalStatus = true;
            //         var dataJson = JSON.parse(JSON.stringify(data_suscee));
            //         var signUrls = window.location.href.split('#')[0];
            //         appidG = dataJson.appid;
            //         timestampG = dataJson.timestamp;
            //         nonceStrG = dataJson.nonceStr;
            //         signatureG = dataJson.signature;
            //         channel_id = dataJson.channel_id;
            //         wx.config({
            //             debug: true,
            //             appId: dataJson.appid,
            //             timestamp: dataJson.timestamp,
            //             nonceStr: dataJson.nonceStr,
            //             signature: dataJson.signature,
            //             jsApiList: ["getNetworkType","openLocation","getLocation","openBusinessView","openAddress","getBrandWCPayRequest","closeWindow"]
            //         })
            //         getShippingaddress();
            //     },
            //     fail:function(){
            //         ZENG.msgbox.show("请退出从新扫码", 1, 2000);
            //     }
            // });
        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
            window.am.selectAddress(function (data) {
                console.log(data,"data")
            })
        }
    }

    const getShippingaddress = () => {
        console.log(window.wx)
        window.wx.ready(function(){
            console.log("---")
            window.wx.openAddress({
                success: function (res) {
                    // userName = res.userName; // 收货人姓名
                    // postalCode = res.postalCode; // 邮编
                    // provinceName = res.provinceName; // 国标收货地址第一级地址（省）
                    // cityName = res.cityName; // 国标收货地址第二级地址（市）
                    // countryName = res.countryName; // 国标收货地址第三级地址（国家）
                    // detailInfo = res.detailInfo; // 详细收货地址信息
                    // nationalCode = res.nationalCode; // 收货地址国家码
                    // telNumber = res.telNumber; // 收货人手机号码
                    // addWechatAddress(res);
                    console.log(res,"微信地址")
                    
                },
                fail: function(res){
                    console.log(res,res.errMsg);
                }
            });
        });
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
            <div className={"prompt_content"}>
                {initParam.prompt_content}
            </div>
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
                        value={cityData}
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
                {
                    browserType?(
                    <Button 
                        type="primary"
                        onClick={selectAddress}
                    >{browserType === 1 ? "获取微信地址":"获取淘宝地址"}</Button>
                    ):""
                }
                <WhiteSpace />
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