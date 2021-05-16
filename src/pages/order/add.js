
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由
import VConsole from 'vconsole';
import $ from 'jquery'

import { getUrlParam, randomCode, validationEmpty, getUrlCode } from '../../utils/utils'
import { CITY } from '../../utils/city'
import {getWeChatConfig,getProductTree,machinesaveOrder,smAddress} from '../../servers/order'

import './index.css'
import {getOrderDetails} from "../../servers/api";
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
    const user_product = useRef();

    const [visible,setVisible] = useState(true);

    const [initParam,setInitParam] = useState({});

    const divRef = useRef();

    const [cityData , setCityData] = useState([]);

    const [cityName , setCityName] = useState([]);

    const [addressParameters , setAddressParameters] = useState(false);

    const [radioValue,setRadioValue] = useState(0);

    const [products,setProducts] = useState([]);

    const [product,setProduct] = useState([]);

    const [defaultParam,setDefaultParam] = useState({});

    const [autoContent,setAutoContent] = useState(null);

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
        document.title = '新增订单';
        // let code = getUrlParam('code');// 这是获取请求路径中带code字段参数的方法
        // let belongs = getUrlParam('belongs');// 这是获取请求路径中带code字段参数的方法
        // let payAmount = getUrlParam('payAmount');// 这是获取请求路径中带code字段参数的方法
        // var local = window.location.href;//获取当前页面路径，即回调地址

        return false;
        if(getUrlCode('code') === 'false'){
            setVisible(false);
            getWeChatConfig().then(response=>{
                const {appid,STATE,redirect_uri} = response;
                let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${STATE}#wechat_redirect`
                window.location.href = url
            })
        }else{
            if(validationEmpty(getUrlCode('code'))){
                alert("请关闭窗口从新进入")
            }else{
                // http://h1.genleme.com/?code=081JQIkl2nWkQ54aqAll2CbqBq1JQIk9&state=mf20201022231202164794#/details
                let param = window.location.href.split("?")[1];

                let _paramCode = param.split("&")[0];//code=081JQIkl2nWkQ54aqAll2CbqBq1JQIk9

                let _param1 = param.split("&")[1];

                let _param2 = _param1.split("=")[1];

                let _param3 = _param2.split("#")[0];

                getProductTree(_param3,_paramCode.split("=")[1]);
            }
        }

    }, [])

    //获取产品树
    const getProductTree = (_param3,_paramCode) => {
        getProductTree({
            code:_paramCode
        }).then(response=>{
            if(!response.data){
                alert("未查询到数据")
                return false;
            }
            setVisible(true);
            let _data = response.data;
            setProducts(_data)
        })
    }
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
    const autoSmAddress =(v) =>{
        setAutoContent(v);
        if(v.length<10){
            return false;
        }
        smAddress({
            'address':v
        }).then(res=>{
            setDefaultParam(res);
        })
    }

    const onSubmit = () =>{

        props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                // 生成 exID
                let exID = Date.parse(new Date());
                let form = props.form.getFieldsValue()
                console.log(form,cityName,"formformform")
                let cityPark = cityName.split("_");
                let param = {
                    "user_name": form.user_name,
                    "user_phone": form.phone.replace(/\s/g,""),
                    // "radioValue":radioValue,
                    "user_address": `${cityPark[0] || ""}${cityPark[1] || ""}${cityPark[2] || ""}${form.address}`,
                    "product_id":form.product,
                    // "pay_amount": addressParameters.pay_amount,
                    "salesman": addressParameters.salesman,
                    "province": cityPark[0],
                    "city": cityPark[1],
                    "area": cityPark[2],
                    "pay_amount": form.money,
                    "tenant_id": addressParameters.tenant_id,
                    "dept_id": addressParameters.dept_id,
                    exID:exID
                }


                machinesaveOrder(param).then(response=>{
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
                            initialValue: defaultParam.name,
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
                            initialValue: defaultParam.phone,
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
                    <Picker extra="请选择(可选)"
                            data={CITY}
                            title="选择收货地区"
                            {...getFieldProps('city', {
                                initialValue: [defaultParam.provinceCode+'0000',defaultParam.cityCode+'00',defaultParam.countyCode],
                                rules: [
                                    { required: true, message: '请选择收货地区' },
                                ],
                            })}
                            // value={cityData}
                            format={(labels) => { return labels.join('/');}}
                            onPickerChange={(e) => setCityData(e)}
                            onOk={(e) => setCityData(e)}
                            ref={user_city}
                            onClick={()=>{
                                user_city.current.focus();
                            }}
                    >
                        <List.Item>收货地区</List.Item>
                    </Picker>
                    <InputItem
                        {...getFieldProps('address', {
                            initialValue: defaultParam.address,
                            rules: [
                                { required: true, message: '请输入详细地址' },
                            ],
                        })}
                        error={!!getFieldError('address')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('address').join(';'));
                        }}
                        placeholder="请输入详细地址"
                        moneyKeyboardAlign={"left"}
                        ref={user_address}
                        onClick={()=>{
                            user_address.current.focus();
                        }}
                    >详细地址</InputItem>

                </List>

            </div>
            <div className={"group"}>
                <Picker extra="请选择(可选)"
                        data={products}
                        title="选择发货产品"
                        {...getFieldProps('product', {
                            rules: [
                                { required: true, message: '请选择发货产品' },
                            ],
                        })}
                        value={product}
                        format={(labels) => { return labels.join('/');}}
                        onPickerChange={(e) => setProduct(e)}
                        onOk={(e) => setProduct(e)}
                        ref={user_product}
                        onClick={()=>{
                            user_product.current.focus();
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
                    placeholder="请输入下单金额"
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
            <div className={"group"}>
                <List>
                    <TextareaItem
                        {...getFieldProps('count', {
                            initialValue: autoContent,
                        })}
                        placeholder="粘贴地址信息，自动拆分姓名、电话和地址"
                        rows={2}
                        onChange={(v)=>{
                            autoSmAddress(v);
                        }}
                    />
                </List>
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