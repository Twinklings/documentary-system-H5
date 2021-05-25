
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

let payamounts = {};
let productNames = [];
let defaultData = {};

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

    const [defaultPayamount,setDefaultPayamount] = useState(0);

    const [isSubmit,setIsSubmit] = useState(false)

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

                getProductTrees(_param3,_paramCode.split("=")[1]);
            }
        }

    }, [])

    const treeData = (datas)=>{
        let arr=[],j = {};
        datas.map((item)=>{
            if(item.payamount)payamounts[item.id] = item.payamount;
            productNames[item.id] = item.value;
            j={
                "label":item.value,
                "value": item.id+'',
                'tenant_id':item.tenant_id,
                "dept_id":item.dept_id,
                'salesman':item.salesman,
                "children": item.children ? treeData(item.children):[]
            }
            arr.push(j)
        })
        return arr;
    }
    //获取产品树
    const getProductTrees = (_param3,_paramCode) => {
        getProductTree({
            code:_paramCode
        }).then(response=>{
            if(response.code != 200){
                alert(response.message);
                setIsSubmit(true);
                return false;
            }
            // if(!response.data){
            //     alert("未查询到数据")
            //     return false;
            // }
            let datas = treeData(response.data);
            setProducts(datas)
            setVisible(true);
        })
    }

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

    const autoPayamount = (v)=>{
        setProduct(v);
        v[2] && setDefaultPayamount(payamounts[v[2]]);
        defaultData = {};
        products.map(item=>{
            if(item.value == v[0]){
                defaultData = item;
            }
        })
    }

    const onSubmit = () =>{

        props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                // 生成 exID
                let exID = new Date().getTime();
                let form = props.form.getFieldsValue()
                console.log(form,cityName,"formformform")
                let cityPark = cityName.split("_");
                let param = {
                    "user_name": form.user_name,
                    "user_phone": form.phone.replace(/\s/g,""),
                    // "radioValue":radioValue,
                    "user_address": `${cityPark[0] || ""}${cityPark[1] || ""}${cityPark[2] || ""}${form.address}`,
                    "product_type": `${productNames[form.product[0]]}/${productNames[form.product[1]]}`,
                    "product_name":productNames[form.product[2]],
                    "product_id":form.product[2],
                    'product_type_id':form.product[1],
                    'pay_pany_id':form.product[0],
                    // "pay_amount": addressParameters.pay_amount,
                    "salesman": defaultData.salesman,
                    "province": form.city[0],
                    "city": form.city[1],
                    "area": form.city[2],
                    "pay_amount": form.money,
                    "tenant_id": defaultData.tenant_id,
                    "dept_id": defaultData.dept_id,
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
                let k = null;
                for(let key in error){
                    k = key;
                    break;
                }
                return Toast.info(error[k].errors[0].message);
            }
        });
    }

    const validatePhone = (rule, value, callback) => {
        if(value){
            if (!(/^1[3456789]\d{9}$/.test(value.replace(/\s/g,"")))) {
                callback(new Error('请输入正确的手机号格式'));
            }else{
                callback();
            }
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
                                { required: true, message:'请输入手机号' },
                                {validator:validatePhone}
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
                                initialValue:defaultParam.countyCode ? [defaultParam.provinceCode && defaultParam.provinceCode+'0000',defaultParam.cityCode && defaultParam.cityCode+'00',defaultParam.countyCode]:[],
                                rules: [
                                    { required: true, message: '请选择收货地区' },
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
                        <List.Item>收货地区</List.Item>
                    </Picker>
                    <div className={'borderBottom'}></div>
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
                        onOk={(e) => autoPayamount(e)}
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
                        initialValue:defaultPayamount,
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
                {/*<div className={'borderBottom'}></div>*/}
                {/*<div className={'am-list-item am-input-item am-list-item-middle'}>*/}
                {/*    <div className={'am-list-line'}>*/}
                {/*        <label className={"am-input-label"}>下单提醒</label>*/}
                {/*        <div className={"am-input-control"}>*/}
                {/*            <Radio name={'a'} checked={radioValue === 1} className="my-radio-01" onChange={e => setRadioValue(1)}>是</Radio>*/}
                {/*            <Radio name={'b'} checked={radioValue === 0} className="my-radio" onChange={e => setRadioValue(0)}>否</Radio>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
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
                    disabled={isSubmit}
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