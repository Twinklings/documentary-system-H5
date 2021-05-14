
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由
import VConsole from 'vconsole';
import $ from 'jquery'

import { getUrlParam, randomCode, validationEmpty, getUrlCode } from '../../utils/utils'
import { CITY } from '../../utils/city'
import { init, getvcode, sendcode, getWeChatConfig, placeAnOrder, } from '../../servers/authorizationApi'

import './index.css'
// import afterSale from './img/afterSale.svg'
// import complaint from './img/complaint.svg'
// import bannerImg from './img/20190625000833113010.jpg'
// import bannerImg1 from './img/20190625000907693451.jpg'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;
let name = "";

let time = 60;

function OrderAdd(props) {

    const user_name = useRef();
    const user_phone = useRef();
    const user_money = useRef();
    const user_address = useRef();
    const user_city = useRef();

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

    const [radioValue,setRadioValue] = useState(0);

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
                    console.log(CITY[i].label+"/")
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
        // new VConsole();


        let parameter = getUrlParam('parameter');// 这是获取请求路径中带的参数
        console.log(parameter,"parameter")
        // let addressParam = parameter.split("_")
        // setAddressParameters({
        //     tenant_id:addressParam[0],
        //     dept_id:addressParam[1],
        //     salesman:addressParam[2],
        //     pay_amount:addressParam[3],
        // })


        // if (/MicroMessenger/.test(window.navigator.userAgent)) {
        //     // 微信
        //     // setBrowserType(1)
        // } else if (/AlipayClient/.test(window.navigator.userAgent)) {
        //     // 支付宝
        //     setBrowserType(2)
        // }

        // 初始化数据接口
        // getInit(parameter);
        // 获取验证码图片
        // getImgCode()

    }, [])

    // const getImgCode = () => {
    //     let random_code = randomCode(6);
    //     setRandomkey(random_code)
    //     getvcode(random_code).then(res=>{
    //         setImgCode(res)
    //     })
    // }

    // const getInit = (parameter) => {
    //     console.log(parameter,"parameter")
    //     init({parameter}).then(res=>{
    //         if(res.code === 200){
    //             console.log(res.data,"res")
    //             setInitParam({
    //                 ...res.data,
    //                 isImgCode:true
    //             })
    //             document.title = res.data.prompt_content;
    //         }else{
    //             Toast.fail(res.message);
    //         }
    //     })
    // }

    // const selectAddress = () => {
    //     if (/MicroMessenger/.test(window.navigator.userAgent)) {
    //
    //     } else if (/AlipayClient/.test(window.navigator.userAgent)) {
    //         window.am.selectAddress(function (data) {
    //             console.log(data,"data")
    //             let _data = data.address.split("-")
    //             props.form.setFieldsValue(
    //                 {
    //                     phone:data.mobilePhone,
    //                     user_name:data.fullname,
    //                     address:_data[_data.length-1],
    //                 }
    //             );
    //             getProv(data.addressCode,"1")
    //         })
    //     }
    // }
    //
    // let datas = []
    //
    // // 设置地址
    // const getProv = (addressCode,time) => {
    //     for(let i=0; i<CITY.length; i++){
    //         if(CITY[i].children){
    //             getCity(CITY[i],CITY[i].children,addressCode,time)
    //         }
    //     }
    // }
    //
    // const getCity = (nextData,data,addressCode,time) => {
    //     for(let i=0; i<data.length; i++){
    //         if(data[i].value === addressCode){
    //             if(time === "1"){
    //                 datas[2] = data[i].value.toString()
    //             }
    //             if(time === "2"){
    //                 datas[0] = nextData.value.toString()
    //                 datas[1] = data[i].value.toString();
    //                 setCityData(datas)
    //                 props.form.setFieldsValue(
    //                     {
    //                         city:datas,
    //                     }
    //                 );
    //             }
    //             getProv(nextData.value,"2")
    //         }else if(data[i].children){
    //             getCity(data[i],data[i].children,addressCode,time)
    //         }
    //     }
    // }

    const onSubmit = () =>{

        props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                let form = props.form.getFieldsValue()
                console.log(form,cityName,"formformform")
                let cityPark = cityName.split("_");
                let param = {
                    "user_name": form.user_name,
                    "user_phone": form.phone.replace(/\s/g,""),
                    "radioValue":radioValue,
                    "address": form.address,
                    "pay_amount": addressParameters.pay_amount,
                    "salesman": addressParameters.salesman,
                    "province": cityPark[0],
                    "city": cityPark[1],
                    "area": cityPark[2],
                    "money": form.money,
                    "tenant_id": addressParameters.tenant_id,
                    "dept_id": addressParameters.dept_id,
                }
                console.log(param,"formformform")

                return false;
                placeAnOrder(param).then(response=>{
                    if(response.code === 200){
                        Toast.success(response.message);
                        history.push('/fakeAuthorization/success');
                    }else{
                        Toast.fail(response.message);
                    }
                })

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
        if (!(/^1[3456789]\d{9}$/.test(value.replace(/\s/g,"")))) {
            callback(new Error('请输入正确的手机号格式'));
        }else{
            callback();
        }
    }

    const { getFieldProps, getFieldError } = props.form;

    return (

        <div className={"box orderAdd"} style={visible?{display:"block"}:{}} ref={divRef}>
            <div className={"group"}>
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
                        moneyKeyboardAlign={"right"}
                        labelNumber={4}
                        ref={user_name}
                        onClick={()=>{
                            user_name.current.focus();
                        }}
                    >姓名</InputItem>
                    <div className={'borderBottom'}></div>
                    <InputItem
                        {...getFieldProps('phone', {
                            rules: [
                                { required: true, validator: validatePhone },
                            ],
                        })}
                        type="phone"
                        error={!!getFieldError('phone')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('phone').join(';'));
                        }}
                        placeholder="请输入手机号"
                        moneyKeyboardAlign={"left"}
                        ref={user_phone}
                        onClick={()=>{
                            user_phone.current.focus();
                        }}
                    >手机号</InputItem>
                    <div className={'borderBottom'}></div>
                    <InputItem
                        {...getFieldProps('address', {
                            rules: [
                                { required: true, message: '请输入收货地址' },
                            ],
                        })}
                        error={!!getFieldError('address')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('address').join(';'));
                        }}
                        placeholder="请输入收货地址"
                        moneyKeyboardAlign={"left"}
                        ref={user_address}
                        onClick={()=>{
                            user_address.current.focus();
                        }}
                    >收货地址</InputItem>

                </List>

            </div>
            <div className={"group"}>
                <Picker extra="请选择(可选)"
                        data={CITY}
                        title="选择发货产品"
                        {...getFieldProps('city', {
                            rules: [
                                { required: true, message: '请选择发货产品' },
                            ],
                        })}
                        value={cityData}
                        format={(labels) => { return labels.join('/');}}
                        onPickerChange={(e) => setCityData(e)}
                        onOk={(e) => setCityData(e)}
                        ref={user_city}
                        onClick={()=>{
                            user_city.current.focus();
                        }}
                >
                    <List.Item>发货产品</List.Item>
                </Picker>
                <div className={'borderBottom'}></div>
                <InputItem
                    {...getFieldProps('money', {
                        rules: [
                            { required: true, message: '请输入下单金额' },
                        ],
                    })}
                    type="number"
                    error={!!getFieldError('money')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('money').join(';'));
                    }}
                    placeholder="0.00"
                    extra="元"
                    moneyKeyboardAlign={"left"}
                    ref={user_money}
                    onClick={()=>{
                        user_money.current.focus();
                    }}
                >下单金额</InputItem>
                <div className={'borderBottom'}></div>
                <div className={'am-list-item am-input-item am-list-item-middle'}>
                    <div className={'am-list-line'}>
                        <label className={"am-input-label"}>下单提醒</label>
                        <div className={"am-input-control"}>
                            <Radio name={'a'} checked={radioValue === 1} className="my-radio-01" onChange={e => setRadioValue(1)}>是</Radio>
                            <Radio name={'b'} checked={radioValue === 0} className="my-radio" onChange={e => setRadioValue(0)}>否</Radio>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"btns"}>
                <Button
                    type="primary"
                    onClick={onSubmit}
                >保存</Button>
                <Button
                    type="ghost" className="am-button-borderfix">
                    取消
                </Button>
                <WhiteSpace />
            </div>

        </div>
    );
}

export default createForm()(OrderAdd)