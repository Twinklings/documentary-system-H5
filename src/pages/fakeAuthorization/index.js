
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由
import VConsole from 'vconsole';
import $ from 'jquery'

import DocumentTitle from 'react-document-title'

import assetsTips from '../../assets/tips.svg'
import closeModal from '../../assets/close.svg'

import { getUrlParam, randomCode, validationEmpty, getUrlCode } from '../../utils/utils'
import { CITY } from '../../utils/city'
import { init, getvcode, sendcode, machinesaveOrder, placeAnOrder, smsCertification,verifyWeb } from '../../servers/authorizationApi'

import './index.css'
import afterSale from './img/afterSale.svg'
import complaint from './img/complaint.svg'
// import bannerImg from './img/20190625000833113010.jpg'
// import bannerImg1 from './img/20190625000907693451.jpg'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;
const modalAlert = Modal.alert;
const prompt = Modal.prompt;
let name = "";

let time = 60;

function FakeAuthorization(props) {
    const user_name = useRef();
    const user_phone = useRef();
    const user_imgCode = useRef();
    const user_code = useRef();
    const user_city = useRef();
    const user_address = useRef();

    const toastTime = 1;
    
    const [visible,setVisible] = useState(true);

    const [loading,setLoading] = useState(false);

    const [sendSMS,setSendSMS] = useState(false);

    const [initParam,setInitParam] = useState({});

    // 2 = 本机+短信   1 = 短信   0 = 无
    const [orderVerification,setOrderVerification] = useState(0);

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

    const [tipsCount,setTipsCount] = useState(0);

    const [tipsColor,setTipsColor] = useState('#828282');

    const [tipsText ,setTipsText] = useState('请开启数据流量，关闭WiFi后使用');

    const [SMSvisibleModal,setSMSvisibleModal] = useState(false);

    const [exID,setEXID] = useState("");

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
        if(cityData.length >= 2){
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
        getImgCode();

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
                    isImgCode:true,
                })

                setOrderVerification(res.data.authentication_status)
                // setOrderVerification(1)
                // if(res.data.orderVerification === 0){

                window.JVerificationInterface.init({
                    appkey: "b724ac6a699f0ef0f1d07501",
                    debugMode: true,
                    success: function(data) { 
                        //TODO 初始化成功回调
                        console.log(data,"初始化成功回调")
                    }, 
                    fail: function(data) { 
                        //TODO 初始化失败回调
                        console.log(data,"初始化失败回调")
                    }
                });

                // 判断网络环境是否支持
                // if(!window.JVerificationInterface.checkVerifyEnable()){
                //     Toast.info("请开启数据流量，关闭WiFi后使用");
                // }
                // }

                // 处理IOS浏览器下修改title不生效的问题，修改后刷新一次当前页面，url添加title字段区分是否是第一次进入才刷新不然会导致死循环
                if(!getUrlParam('title')){
                    let title = document.getElementsByTagName('title')[0];
                    title.innerHTML = res.data.h5_title;
                    let herf = window.location.href+"&title=R";
                    window.location.href = herf;
                }

            }else{
                Toast.fail(res.message,toastTime);
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
                props.form.setFieldsValue(
                    {
                        phone:data.mobilePhone,
                        user_name:data.fullname,
                        address:data.address,
                    }
                );
                getProv(data.addressCode,"1")
            })
        }
    }

    let datas = []

    // 设置地址
    const getProv = (addressCode,time) => {
        console.log(addressCode)
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

    const authenticationNumber = (data,form) => {
        let time = Date.parse(new Date());
        setEXID(time)
        
        verifyWeb({
            token: data.content,
            phone: form.phone,
            exID: time
        }).then(res=>{
            console.log(res,"验证结果");
            setLoading(false);
            if(res.code === 200){
                saveParam(form,time);
            }else{
                setTipsColor('red');
                if(tipsCount+1 === 2){
                    setTipsText("请再次确认是否已开启数据流量并关闭WiFi")
                }
                if(tipsCount+1 >2){
                    setSMSvisibleModal(true);
                    setOrderVerification(1);
                }

                setTipsCount(tipsCount+1);
            }
        })
    }

    const switchVerificationMode = () => {
        modalAlert('提示', '请开启数据流量，关闭WiFi后再次尝试，或切换为短信验证', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '短信验证', onPress: () => {
                setOrderVerification(1);
            } },
        ])
    }


    const authentication = () =>{
        if(loading){
            return false;
        }
        setLoading(true);
        props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            let form = props.form.getFieldsValue();

            // 是否需要短信验证
            if(orderVerification === 1){
                setSMSvisibleModal(true);
                setLoading(false);
            }else{
                // 判断初始化是否成功
                if(!window.JVerificationInterface.isInitSuccess()){
                    window.JVerificationInterface.init({
                        appkey: "b724ac6a699f0ef0f1d07501",
                        debugMode: true,
                        success: function(data) { 
                            //TODO 初始化成功回调
                            console.log(data,"初始化成功回调")
                            // SDK 获取号码认证 token
                            window.JVerificationInterface.getToken({
                                operater:"CM",
                                success: function(data)  { 
                                    console.log(data,"获取token成功回调")
                                    //TODO 获取token成功回调
                                    var operater =data.operater;
                                    var token =data.content;
                                    authenticationNumber(data,form);
                                }, fail: function(data)  { 
                                    //TODO 获取token失败回调
                                    console.log(data,"获取token失败回调");
                                    setLoading(false);
                                    setTipsColor('red');
                                    if(tipsCount+1 === 2){
                                        setTipsText("请再次确认是否已开启数据流量并关闭WiFi")
                                    }
                                    if(tipsCount+1 >2){
                                        setSMSvisibleModal(true);
                                        setOrderVerification(1);
                                    }
                                    setTipsCount(tipsCount+1);
                                } 
                            })
                        }, 
                        fail: function(data) { 
                            //TODO 初始化失败回调
                            console.log(data,"初始化失败回调")
                            setLoading(false);
                            setTipsColor('red');
                            setTipsCount(tipsCount+1);
                            return false;
                        }
                    });
                }else{
                    // SDK 获取号码认证 token
                    window.JVerificationInterface.getToken({
                        operater:"CM",
                        success: function(data)  { 
                            console.log(data,"获取token成功回调")
                            //TODO 获取token成功回调
                            var operater =data.operater;
                            var token =data.content;
                            authenticationNumber(data,form);
                        }, fail: function(data)  { 
                            //TODO 获取token失败回调
                            console.log(data,"获取token失败回调");
                            setLoading(false);
                            setTipsColor('red');
                            if(tipsCount+1 === 2){
                                setTipsText("请再次确认是否已开启数据流量并关闭WiFi")
                            }
                            if(tipsCount+1 >2){
                                setSMSvisibleModal(true);
                                setOrderVerification(1);
                            }
                            setTipsCount(tipsCount+1);
                        } 
                    })
                }
            }

          } else {
            setLoading(false);
            if(error.user_name || error.address){
                return Toast.fail('表单验证失败',toastTime);
            }

            if(error.code){
                return Toast.info(error.code.errors[0].message,toastTime);
            }
            if(error.city){
                return Toast.info(error.city.errors[0].message,toastTime);
            }
          }
        });
    }

    const onSubmit = () =>{

        if(!sendSMS){
            setVerificationCodeValue("");
            props.form.setFieldsValue({code:""});
            return Toast.fail("请先发送短信验证码！");
        }

        if(loading){
            return false;
        }
        setLoading(true);
        props.form.validateFields({ force: true }, (error) => {
          if (!error) {

            let form = props.form.getFieldsValue();

            saveParam(form);

          } else {
            setLoading(false);
            if(error.user_name || error.phone || error.address){
                return Toast.fail('表单验证失败',toastTime);
            }

            if(initParam.image_captcha_status === 1 && error.imgCode){
                return Toast.info(error.imgCode.errors[0].message,toastTime);
            }
            if(error.code){
                return Toast.info(error.code.errors[0].message,toastTime);
            }
            if(error.city){
                return Toast.info(error.city.errors[0].message,toastTime);
            }

          }
        });
    }

    const saveParam = (form,time) => {

        console.log(form,cityName,"formformform")
        let cityPark = cityName.split("_");
        console.log(cityPark)
        
        let param = {
            "user_name": form.user_name,
            "user_phone": form.phone,
            "user_address": `${cityPark[0] || ""}${cityPark[1] || ""}${cityPark[2] || ""}${form.address}`,
            "pay_amount": addressParameters.pay_amount,
            "salesman": addressParameters.salesman,
            "province": cityPark[0] || "",
            "city": cityPark[1] || "",
            "area": cityPark[2] || "",
            "county": "",
            "openid": "",
            "wechat_id": "",
            "code": form.code,
            "tenant_id": addressParameters.tenant_id,
            "dept_id": addressParameters.dept_id,
            "product_type": `${initParam.pay_pany_name}/${initParam.product_type_name}`,
            "product_name":initParam.product_name,
            'product_id':initParam.product_id,
            'product_type_id':initParam.product_type_id,
            'pay_pany_id':initParam.pay_pany_id,
        }
        console.log(param,"formformform")

        // authorization_type 免费2 伪授权 1
        if(initParam.authorization_type === 2){
            if(orderVerification === 1){
                placeAnOrder(param).then(response=>{
                    setLoading(false);
                    if(response.code === 200){
                        Toast.success(response.message,toastTime);
                        history.push('/fakeAuthorization/success');
                    }else{
                        Toast.fail(response.message,toastTime);
                    }
                }).catch(res=>{
                    setLoading(false);
                })
            }else{
                machinesaveOrder({
                    ...param,
                    exID:time
                }).then(response=>{
                    setLoading(false);
                    if(response.code === 200){
                        Toast.success(response.message,toastTime);
                        history.push('/fakeAuthorization/success');
                    }else{
                        Toast.fail(response.message,toastTime);
                    }
                })
            }
            
        }else{
            if(orderVerification === 1){
                smsCertification(param).then(res=>{
                    setLoading(false);
                    if(res.code === 200){
                        sessionStorage.saveParam = JSON.stringify(param);
    
                        if (/MicroMessenger/.test(window.navigator.userAgent)) {
                            // 微信
                            history.push('/fakeAuthorization/weixin');
                        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
                            // 支付宝
                            history.push('/fakeAuthorization/alipay');
                        }
                    }else{
                        Toast.fail(res.message,toastTime);
                    }
                })
            }else{
                setLoading(false);
                sessionStorage.saveParam = JSON.stringify({
                    ...param,
                    exID:time
                });

                if (/MicroMessenger/.test(window.navigator.userAgent)) {
                    // 微信
                    history.push('/fakeAuthorization/weixin');
                } else if (/AlipayClient/.test(window.navigator.userAgent)) {
                    // 支付宝
                    history.push('/fakeAuthorization/alipay');
                }
            }
        }
    }

    const validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('请输入11位手机号手机'));
        }else{
          callback();
        }
    }

    const validateCode = (rule, value, callback) => {
        if (value.length != 6 || !(/(^[1-9]\d*$)/.test(value))) {
          callback(new Error('请输入6位数字短信验证码'));
        }else{
          callback();
        }
    }

    const startTheCountdown = () => {
        if (!(/^1[3456789]\d{9}$/.test(props.form.getFieldsValue().phone))) {
            return Toast.info('请输入11位手机号手机',toastTime);
        }
        if (initParam.image_captcha_status === 1 && validationEmpty(props.form.getFieldsValue().imgCode)) {
            return Toast.info('请输入图形验证码',toastTime);
        }

        setSendSMS(true);
        
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
                Toast.fail(res.message,toastTime);
                getImgCode();
                props.form.setFieldsValue({imgCode:"",code:""});
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

    useEffect(()=>{
        var BMap = window.BMap;
        var geoc = new BMap.Geocoder();
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            console.log(r,"7876786")
            geoc.getLocation(r.point, function (rs) {
                $.ajax({
                    type: "get",
                    url: 'http://api.map.baidu.com/reverse_geocoding/v3/',
                    data:{
                        ak:'1IZOnhUdOCvHXy6vKuz0gGcq1T25CAf4',
                        output:'json',
                        coordtype:'bd0911',
                        location:rs.point.lat+","+rs.point.lng
                    },
                    dataType: "jsonp",
                    jsonpCallback: "success_jsonpCallback",
                    success: (res) => {
                        console.log(res)
                        getProv(res.result.addressComponent.adcode,"1")
                    },
                });
                props.form.setFieldsValue(
                    {
                        address:rs.addressComponents.street+""+rs.addressComponents.streetNumber,
                    }
                );
            });
        });
    },[])



    // 悬浮图标拖动
    window.onload = function () {
        var oDiv = document.getElementById('touchMove');

        let disX, moveX, L, T, starX, starY, starXEnd, starYEnd,disY,moveY;

        oDiv.addEventListener('touchstart', function (e) {
            //e.preventDefault();

            disX = e.touches[0].clientX - this.offsetLeft;
            disY = e.touches[0].clientY - this.offsetTop;
            starX = e.touches[0].clientX;
            starY = e.touches[0].clientY;
        });
        oDiv.addEventListener('touchmove', function (e) {
            L = e.touches[0].clientX - disX;
            T = e.touches[0].clientY - disY;
            starXEnd = e.touches[0].clientX - starX;
            starYEnd = e.touches[0].clientY - starY;
            //console.log(L);
            if (L < 0) {
                L = 0;
            } else if (L > document.documentElement.clientWidth - this.offsetWidth) {
                L = document.documentElement.clientWidth - this.offsetWidth;
            }

            if (T < 0) {
                T = 0;
            } else if (T > document.documentElement.clientHeight - this.offsetHeight) {
                T = document.documentElement.clientHeight - this.offsetHeight;
            }
            moveX = L + 'px';
            moveY = T + 'px';
            //console.log(moveX);
            this.style.left = moveX;
            this.style.top = moveY;
        });
        window.addEventListener('touchend', function (e) {
            //alert(parseInt(moveX))
            //判断滑动方向

        });
    }

    return (
        <>
        {/* {initParam.tenant_id? ( */}
        {/* <DocumentTitle title={initParam.h5_title} style={{color:"#000000"}}> */}
        <div className={"box fakeAuthorizationBox"} style={visible?{display:"block"}:{}} ref={divRef}>
            {/* <div className={"prompt_content"}>
                {initParam.prompt_content}
            </div> */}
            <img className={"bannerImg"} src={initParam.h5_background} />
            <div className={"boxContent"}>
                {/* <p className={"form-title"}>在线申请中</p> */}
                {/* <p style={{color:"#a2a2a2"}}>已有2048人申请</p> */}
                <List>
                    <InputItem
                        {...getFieldProps('user_name', {
                            // initialValue:"谢文欣",
                            rules: [
                                { required: true, message: '请输入收货人姓名' },
                            ],
                        })}
                        clear
                        error={!!getFieldError('user_name')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('user_name').join(';'),toastTime);
                        }}
                        placeholder="请输入收货人姓名"
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
                            Toast.info(getFieldError('phone').join(';'),toastTime);
                        }}
                        placeholder="请输入11位手机号"
                        moneyKeyboardAlign={"left"}
                        labelNumber={4}
                        ref={user_phone}
                        onClick={()=>{
                            user_phone.current.focus();
                        }}
                    >联系方式</InputItem>

                    <Picker extra="请选择所在地区"
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
                        <List.Item arrow="horizontal">所在地区</List.Item>
                    </Picker>
                    <TextareaItem
                        {...getFieldProps('address', {
                            // initialValue:"",
                            rules: [
                                { required: true, message: '请输入详细地址' },
                            ],
                        })}
                        title="详细地址"
                        placeholder="请输入详细地址"
                        error={!!getFieldError('address')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('address').join(';'),toastTime);
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
                        className={"selectAddress"}
                    >{browserType === 1 ? "":"获取淘宝地址"}</Button>
                    ):""
                }
                <WhiteSpace />
                
                <Button 
                    type="warning"
                    onClick={authentication}
                    className={"submitApplication"}
                    loading={loading}
                >提交申请</Button><WhiteSpace />

                {
                    // 是否是短信验证
                    orderVerification != 1?(
                    <span
                        style={{
                            display: 'inline-block',
                            color: tipsColor,
                            fontSize: '14px',
                            marginBottom: '10px',
                            textAlign: 'left',
                            width: '295px',
                            lineHeight: '30px',
                        }}
                    >
                        {tipsColor==='red'?(
                            <img 
                            style={{
                                width: '15px',
                                marginRight: '5px',
                                marginTop: '8px',
                                float: 'left',
                            }}
                            src={assetsTips} />
                        ):""}
                        
                        {tipsText}</span>
                    ):""
                }

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

            <div className={"rightCall"} id={'touchMove'}>
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
            {SMSvisibleModal?(

            
            <Modal
                visible={SMSvisibleModal}
                transparent
                maskClosable={false}
                onClose={()=>{
                    setSMSvisibleModal(false)
                }}
                // title="Title"
            >
                <img 
                    src={closeModal}
                    style={{
                        width: '30px',
                        height: '30px',
                        position: 'absolute',
                        bottom: '-50px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                    onClick={()=>{
                        setSMSvisibleModal(false)
                    }}
                />
                <div className={"boxContent"}>
                {/* <p className={"form-title"}>在线申请中</p> */}
                <p style={{color:"#000000", textAlign: 'left',}}>{props.form.getFieldsValue().phone}</p>
                
                <List>
                {
                    (
                        // 是否是短信验证
                        orderVerification === 1  &&
                        // 是否显示图形验证码
                        initParam.image_captcha_status === 1 
                    )?(
                        <div style={{"position":"relative"}}>
                            <InputItem
                                title="图形验证码"
                                {...getFieldProps('imgCode', {
                                    rules: [
                                        { required: true, message: '请输入图形验证码' },
                                    ],
                                })}
                                clear
                                error={!!getFieldError('imgCode')}
                                onErrorClick={() => {
                                    Toast.info(getFieldError('imgCode').join(';'),toastTime);
                                }}
                                placeholder="请输入图形验证码"
                                moneyKeyboardAlign={"left"}
                                labelNumber={3}
                                ref={user_imgCode}
                                onClick={()=>{
                                    user_imgCode.current.focus();
                                }}
                            >
                            </InputItem>
                            <img 
                                className={"codeImg"} 
                                src={imgCode}
                                onClick={getImgCode}
                                style={{height:35,width:118}}
                            />
                        </div>
                    ):""
                }
                {
                // 是否是短信验证
                orderVerification === 1?(
                <div style={{"position":"relative"}}>
                    <InputItem
                        title="验证码"
                        // type={"money"}
                        {...getFieldProps('code', {
                            rules: [
                                // { required: true, max: 6, min: 6, message: '请输入6位短信验证码' },
                                { required: true, validator: validateCode },
                            ],
                        })}
                        clear
                        error={!!getFieldError('code')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('code').join(';'),toastTime);
                        }}
                        placeholder="请输入短信验证码"
                        moneyKeyboardAlign={"left"}
                        labelNumber={3}
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
                    </InputItem>
                    <Button 
                        className={"codeImg"}
                        disabled={countDown === 60 ? false : true}
                        onClick={countDown === 60 ? startTheCountdown : ""}
                    >
                        发送验证码{countDown === 60 ? "" : `${countDown}s`}</Button>
                </div>
                ):""
                }
                </List>
                <WhiteSpace />
                <Button 
                    type="warning"
                    onClick={onSubmit}
                    className={"submitApplication"}
                    loading={loading}
                >提交申请</Button>
                </div>
            </Modal>
            ):""}
        </div>
   
        {/* </DocumentTitle>) : ""} */}
        </>
   );
}

export default createForm()(FakeAuthorization)
