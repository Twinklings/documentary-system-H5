
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment'

import {submitFeedBack} from '../../servers/api'

import './index.css'
import {getUrlParam} from "../../utils/utils";

function FeedBack(props) {

    const user_name = useRef();
    const user_phone = useRef();
    const user_content = useRef();

    const [feedType,setFeedType] = useState('售前咨询');
    const [ID,setID] = useState(null)
    const divRef = useRef();


    const [isSubmit,setIsSubmit] = useState(false)


    useEffect(() => {
        document.title = '意见反馈';
        let id = getUrlParam('id');// 这是获取请求路径中带的参数
        if(!id){
            Toast.fail('请重新打开短信链接');
            setIsSubmit(true);
            return false;
        }
        setID(id);
    }, [])


    const changeLabel = (v) =>{
        setFeedType(v)
    }
    const onSubmit = () =>{
        props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                let form = props.form.getFieldsValue()
                const now = new Date();
                let param = {
                    "user_name": form.user_name,
                    "user_phone": form.phone.replace(/\s/g,""),
                    "complaints_type": feedType,
                    chat_records:{
                        context:form.content,
                        create_time:moment(now).format("YYYY-MM-DD HH:mm:ss")
                    },
                    id:ID
                }

                console.log(param)

                submitFeedBack(param).then(response=>{
                    if(response.code === 200){
                        Toast.success(response.message);
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

        <div className={"box feedback"} style={{display:"block"}} ref={divRef}>
            <div className={"group"} style={{padding:"0 0 10px"}}>
                <List renderHeader={
                    () => <span><label className={"list-label"}></label><span className={'list-name'}>反馈类型</span></span>
                }>
                    <div className={'my-tabs'}>
                        <div className={feedType == '售前咨询'?'my-tab active':'my-tab'} onClick={()=>changeLabel('售前咨询')}>售前咨询</div>
                        <div style={{width:'15px'}}></div>
                        <div className={feedType == '售后咨询'?'my-tab active':'my-tab'} onClick={()=>changeLabel('售后咨询')}>售后咨询</div>
                        <div style={{width:'15px'}}></div>
                        <div className={feedType == '我要投诉'?'my-tab active':'my-tab'} onClick={()=>changeLabel('我要投诉')}>我要投诉</div>
                    </div>
                </List>

                <List renderHeader={
                    () => <span><label className={"list-label"}></label><span className={'list-name'}>反馈内容</span></span>
                }>
                    <TextareaItem
                        {...getFieldProps('content', {
                            rules: [
                                { required: true, message: '请输入反馈内容' },
                            ],
                        })}
                        placeholder="这里输入内容，不超过100个字"
                        rows={3}
                        count={100}
                        error={!!getFieldError('content')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('content').join(';'));
                        }}
                        autoHeight
                        ref={user_content}
                        onClick={()=>{
                            user_content.current.focus();
                        }}
                    />
                </List>
            </div>
            <div className={"group"}>
                <List renderHeader={
                    () => <span><label className={"list-label"}></label><span className={'list-name'}>联系方式</span></span>
                }>
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

                </List>

            </div>

            <div className={"btns"}>
                <Button
                    type="primary"
                    disabled={isSubmit}
                    onClick={onSubmit}
                >提交</Button>
                <WhiteSpace />
            </div>

        </div>
    );
}

export default createForm()(FeedBack)