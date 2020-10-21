
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由
import VConsole from 'vconsole';
import $ from 'jquery'

import { getUrlParam, randomCode, validationEmpty, getUrlCode } from '../../utils/utils'
import { CITY } from '../../utils/city'
import { init, getvcode, sendcode, getWeChatConfig, placeAnOrder, smsCertification } from '../../servers/authorizationApi'

import './index.css'
import afterSale from './img/afterSale.svg'
import complaint from './img/complaint.svg'
import bannerImg from './img/20190625000833113010.jpg'
import bannerImg1 from './img/20190625000907693451.jpg'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;
let name = "";

let time = 60;

function FakeAuthorization(props) {

    const user_name = useRef();
    const user_phone = useRef();
    const user_imgCode = useRef();
    const user_code = useRef();
    const user_city = useRef();
    const user_address = useRef();
    
    const [visible,setVisible] = useState(true);

    const [sendSMS,setSendSMS] = useState(false);

    const [initParam,setInitParam] = useState({});

    const [imgCode,setImgCode] = useState("");
    const [verificationCodeValue,setVerificationCodeValue] = useState("");
    

    const [countDown,setCountDown] = useState(60);
    
    const divRef = useRef();

    const [randomkey , setRandomkey] = useState("");
    
    const [cityData , setCityData] = useState([]);

    const [cityName , setCityName] = useState([]);

    const [browserType , setBrowserType] = useState(false);

    const [addressParameters , setAddressParameters] = useState(false);

    const [visibleModal,setVisibleModal] = useState(false);

    const getName = (data) => {
        
        for(let i=0; i<data.length; i++){
            if(cityData.indexOf(data[i].value) != -1){
                console.log(data[i].label)
                name+=`_${data[i].label}`
                setCityName(name)
            }
            if(data[i].children){
                getName(data[i].children)
            }
        }
    }

    useEffect(()=>{
        console.log(cityData,cityData.length,"cityDatacityData")
        if(cityData.length === 3){
            name = ""
            for(let i=0; i<CITY.length; i++){
                if(cityData.indexOf(CITY[i].value) != -1){
                    console.log(CITY[i].label)
                    name+= `${CITY[i].label}`
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

        
        let parameter = getUrlParam('parameter');// 这是获取请求路径中带的参数
        console.log(parameter,"parameter")
        // let addressParam = parameter.split("_")
        // setAddressParameters({
        //     tenant_id:addressParam[0],
        //     dept_id:addressParam[1],
        //     salesman:addressParam[2],
        //     pay_amount:addressParam[3],
        // })


        if (/MicroMessenger/.test(window.navigator.userAgent)) {
            // 微信
            // setBrowserType(1)
        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
            // 支付宝
            setBrowserType(2)
        }

        // 初始化数据接口
        getInit(parameter);
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

    const getInit = (parameter) => {
        console.log(parameter,"parameter")
        init({parameter}).then(res=>{
            if(res.code === 200){
                console.log(res.data,"res")
                setAddressParameters({
                    tenant_id:res.data.tenant_id,
                    dept_id:res.data.dept_id,
                    salesman:res.data.salesman,
                    pay_amount:res.data.pay_amout,
                })
                setInitParam({
                    ...res.data,
                    isImgCode:true
                })
                document.title = res.data.prompt_content;
            }else{
                Toast.fail(res.message);
            }
        })
    } 

    const selectAddress = () => {
        if (/MicroMessenger/.test(window.navigator.userAgent)) {
            // var signUrl = window.location.href.split('#')[0];
            // var channel_id = "";
            // var _datas = { channel_id: channel_id, signUrl: signUrl };
            // getWeChatConfig(_datas).then(data_suscee=>{
            //     var dataJson = JSON.parse(JSON.stringify(data_suscee));
            //     console.log(data_suscee,"data_suscee")
            //     let appidG = dataJson.appid;
            //     let timestampG = dataJson.timestamp;
            //     let nonceStrG = dataJson.nonceStr;
            //     let signatureG = dataJson.signature;
            //     let channel_id = dataJson.channel_id;
            //     window.wx.config({
            //         debug: true,
            //         appId: dataJson.appid,
            //         timestamp: dataJson.timestamp,
            //         nonceStr: dataJson.nonceStr,
            //         signature: dataJson.signature,
            //         jsApiList: ["getNetworkType","openLocation","getLocation","openBusinessView","openAddress","getBrandWCPayRequest","closeWindow"]
            //     })
            //     getShippingaddress();
            // })
            // $.ajax({
            //     url: "http://47.102.204.79:80/wechat/config",
            //     async : false,
            //     type : "POST",
            //     contentType : 'application/json',
            //     dataType : 'json',
            //     data :JSON.stringify(_datas),
            //     success: function (data_suscee) {
            //         var dataJson = JSON.parse(JSON.stringify(data_suscee));
            //         console.log(dataJson,data_suscee,"dataJson")
            // //         var signUrls = window.location.href.split('#')[0];
            //         // appidG = dataJson.appid;
            //         // timestampG = dataJson.timestamp;
            //         // nonceStrG = dataJson.nonceStr;
            //         // signatureG = dataJson.signature;
            //         // channel_id = dataJson.channel_id;
            //         window.wx.config({
            //             debug: true,
            //             appId: dataJson.appid,
            //             timestamp: dataJson.timestamp,
            //             nonceStr: dataJson.nonceStr,
            //             signature: dataJson.signature,
            //             jsApiList: ["openAddress"]
            //         })
                    // getShippingaddress();
                // },
                // fail:function(){
                //     // ZENG.msgbox.show("请退出从新扫码", 1, 2000);
                // }
            // });
        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
            window.am.selectAddress(function (data) {
                console.log(data,"data")
                let _data = data.address.split("-")
                props.form.setFieldsValue(
                    {
                        phone:data.mobilePhone,
                        user_name:data.fullname,
                        address:_data[_data.length-1],
                    }
                );
                getProv(data.addressCode,"1")
            })
        }
    }

    let datas = []

    // 设置地址
    const getProv = (addressCode,time) => {
        for(let i=0; i<CITY.length; i++){
            if(CITY[i].children){
                getCity(CITY[i],CITY[i].children,addressCode,time)
            }
        }
    }

    const getCity = (nextData,data,addressCode,time) => {
        for(let i=0; i<data.length; i++){
            if(data[i].value === addressCode){
                if(time === "1"){
                    datas[2] = data[i].value.toString()
                }
                if(time === "2"){
                    datas[0] = nextData.value.toString()
                    datas[1] = data[i].value.toString();
                    setCityData(datas)
                    props.form.setFieldsValue(
                        {
                            city:datas,
                        }
                    );
                }
                getProv(nextData.value,"2")
            }else if(data[i].children){
                getCity(data[i],data[i].children,addressCode,time)
            }
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

    const jumpToPoint = () => {
        const scrollHeight = divRef.current.scrollHeight;//里面div的实际高度 
        const height = divRef.current.clientHeight;  //网页可见高度
        const maxScrollTop = scrollHeight - height;
        divRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    const onSubmit = () =>{
        // if(!sendSMS){
        //     return Toast.fail("请先发送短信验证码！");
        // }
        props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            let form = props.form.getFieldsValue()
            console.log(form,cityName,"formformform")
            let cityPark = cityName.split("_");
            console.log(cityPark)
            let param = {
                "user_name": form.user_name,
                "user_phone": form.phone,
                "user_address": form.address,
                "pay_amount": addressParameters.pay_amount,
                "salesman": addressParameters.salesman,
                "province": cityPark[0],
                "city": cityPark[1],
                "area": cityPark[2],
                "county": "",
                "openid": "",
                "wechat_id": "",
                "code": form.code,
                "tenant_id": addressParameters.tenant_id,
                "dept_id": addressParameters.dept_id,
            }
            console.log(param,"formformform")

            // authorization_type 免费2 伪授权 1
            if(initParam.authorization_type === 2){
                placeAnOrder(param).then(response=>{
                    if(response.code === 200){
                        Toast.success(response.message);
                        history.push('/fakeAuthorization/success');
                    }else{
                        Toast.fail(response.message);
                    }
                })
            }else{
                smsCertification(param).then(res=>{
                    if(res.code === 200){
                        sessionStorage.saveParam = JSON.stringify(param)
                        if (/MicroMessenger/.test(window.navigator.userAgent)) {
                            // 微信
                            history.push('/fakeAuthorization/weixin');
                        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
                            // 支付宝
                            history.push('/fakeAuthorization/alipay');
                        }
                    }else{
                        Toast.fail(res.message);
                    }
                })
            }
          } else {
            if(error.user_name || error.phone || error.address){
                return Toast.fail('表单验证失败');
            }

            if(initParam.image_captcha_status === 1 && error.imgCode){
                return Toast.info(error.imgCode.errors[0].message);
            }
            if(error.code){
                return Toast.info(error.code.errors[0].message);
            }
            if(error.city){
                return Toast.info(error.city.errors[0].message);
            }
            
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
        if (initParam.image_captcha_status === 1 && validationEmpty(props.form.getFieldsValue().imgCode)) {
            return Toast.info('请输入图片验证码');
        }

        setSendSMS(true)
        
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
                // Toast.info(res.data);
            }else{
                Toast.fail(res.message);
            }
        })
    }

    const updateCountdown = () =>{
        setTimeout(()=>{
            time --;
            if(time != 0){
                updateCountdown();
            }else{
                time = 60
            }
            setCountDown(time)
        },1000)
    }

    const myCall = (type) => {
        if(type === 1){
            //投诉
            window.location.href = `tel://${initParam.after_phone}`;  
        }else{
            //客服
            window.location.href = `tel://${initParam.phone}`; 
        }
    }

    const openModal = () => {
        setVisibleModal(true)
    }

    const onClose = () => {
        setVisibleModal(false)
    }

    const { getFieldProps, getFieldError } = props.form;

    return (
      
        <div className={"box fakeAuthorizationBox"} style={visible?{display:"block"}:{}} ref={divRef}>
            {/* <div className={"prompt_content"}>
                {initParam.prompt_content}
            </div> */}
            <img className={"bannerImg"} src={bannerImg} />
            <img className={"bannerImg"} src={bannerImg1} />
            <div className={"boxContent"}>
                {/* <p className={"form-title"}>在线申请中</p> */}
                {/* <p style={{color:"#a2a2a2"}}>已有2048人申请</p> */}
                <List>
                    <InputItem
                        {...getFieldProps('user_name', {
                            // initialValue:"谢文欣",
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
                        labelNumber={4}
                        ref={user_name}
                        onClick={()=>{
                            user_name.current.focus();
                        }}
                    >姓名</InputItem>

                    <InputItem
                        {...getFieldProps('phone', {
                            // initialValue:"17353134887",
                            rules: [
                                { required: true, validator: validatePhone },
                            ],
                        })}
                        title="手机"
                        clear
                        error={!!getFieldError('phone')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('phone').join(';'));
                        }}
                        placeholder="请输入手机"
                        moneyKeyboardAlign={"left"}
                        labelNumber={4}
                        ref={user_phone}
                        onClick={()=>{
                            user_phone.current.focus();
                        }}
                    >手机</InputItem>
                    {
                        initParam.image_captcha_status === 1?(
                            <div style={{"position":"relative"}}>
                                <InputItem
                                    title="图片验证码"
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
                                    labelNumber={4}
                                    ref={user_imgCode}
                                    onClick={()=>{
                                        user_imgCode.current.focus();
                                    }}
                                >
                                验证码
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
                            title="验证码"
                            {...getFieldProps('code', {
                                rules: [
                                    { required: true, max: 6, min: 6, message: '请输入6位验证码' },
                                ],
                            })}
                            clear
                            error={!!getFieldError('code')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('code').join(';'));
                            }}
                            placeholder="请输入验证码"
                            moneyKeyboardAlign={"left"}
                            labelNumber={4}
                            ref={user_code}
                            onClick={()=>{
                                user_code.current.focus();
                            }}
                            value={verificationCodeValue}
                            onChange={(val)=>{
                                if(val.length>6)val=val.slice(0,6)
                                setVerificationCodeValue(val);
                                props.form.setFieldsValue({ code:val})
                            }}
                        >
                            验证码
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
                            rules: [
                                { required: true, message: '请选择地区' },
                            ],
                        })}
                        value={cityData}
                        onPickerChange={(e) => setCityData(e)}
                        onOk={(e) => setCityData(e)}
                        labelNumber={4}
                        ref={user_city}
                        onClick={()=>{
                            user_city.current.focus();
                        }}
                    >
                        <List.Item arrow="horizontal">地区</List.Item>
                    </Picker>
                    <TextareaItem
                        {...getFieldProps('address', {
                            // initialValue:"涉外商务区",
                            rules: [
                                { required: true, message: '请输入详细地址' },
                            ],
                        })}
                        title="地址"
                        placeholder="请输入详细地址"
                        error={!!getFieldError('address')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('address').join(';'));
                        }}
                        // data-seed="logId"
                        rows={2}
                        autoHeight
                        labelNumber={4}
                        ref={user_address}
                        onClick={()=>{
                            user_address.current.focus();
                        }}
                        // ref={el => this.customFocusInst = el}
                    />
                </List>
                {
                    browserType?(
                    <Button 
                        type="primary"
                        onClick={selectAddress}
                    >{browserType === 1 ? "":"获取淘宝地址"}</Button>
                    ):""
                }
                <WhiteSpace />
                <Button 
                    type="warning"
                    onClick={onSubmit}
                >提交申请</Button><WhiteSpace />
            </div>
            {/* <div className={"footer"}>
                <WhiteSpace />
                <Flex>
                    <Flex.Item><Button 
                        type="primary"
                        onClick={openModal}
                    >微信联系</Button></Flex.Item>
                    <Flex.Item><Button 
                        type="warning"
                        onClick={jumpToPoint}
                    >立即申请</Button></Flex.Item>
                </Flex>
                <WhiteSpace />
            </div> */}

            <div className={"rightCall"}>
                <div className={"complaint"} onClick={()=>myCall(1)}>
                    <img src={complaint}/>
                        {/* 投诉 */}
                </div>

                <div className={"afterSale"} onClick={()=>myCall(2)}>
                    <img src={afterSale}/>
                        {/* 客服 */}
                </div>
            </div>

            <Modal
                visible={visibleModal}
                transparent
                maskClosable={false}
                onClose={onClose}
                title=""
                footer={[{ text: '关闭', onPress: () => { onClose(); } }]}
                style={{ width:350,}}
                >
                二维码
            </Modal>
        </div>
   );
}

export default createForm()(FakeAuthorization)