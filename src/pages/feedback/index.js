
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, ImagePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment'
import { createHashHistory } from 'history'; // 如果是hash路由

import {submitFeedBack} from '../../servers/api'

import './index.css'
import {getUrlParam} from "../../utils/utils";

const history = createHashHistory();
const qiniu = require('qiniu-js') // 需要加载qiniu模块的

// const client = OSS({
//     region: "oss-cn-shenzhen", //  OSS 的区域
//     accessKeyId: "mU7nOJGJJ5B_4LjpziI0sI-lsrUFFbUbogsOEhoR", // 认证的账号
//     accessKeySecret: "oU4DpeD0wW4BGIkrb56fZrervgEXCbEcXESesmIU", // 认证的密码
//     bucket: "cdngdb", // 请设置成你的
//     // secure: true, // 上传链接返回支持https
// });

let config = {
    useCdnDomain: true,         // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
    region: qiniu.region.z2     // 上传域名区域（z1为华北）,当为 null 或 undefined 时，自动分析上传域名区域
};
let putExtra = {
    fname: "",          // 文件原文件名
    params: {},         // 放置自定义变量： 'x:name': 'sex'
    mimeType: null      // 限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
};


function FeedBack(props) {

    const user_name = useRef();
    const user_phone = useRef();
    const user_content = useRef();

    const [feedType,setFeedType] = useState(1);
    const [ID,setID] = useState(null)
    const divRef = useRef();
    const [files,setFiles]= useState([])

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

    const uploadImg = (file)=>{
        const date = new Date().getTime(); // 当前时间
        const name = file.name || ".png";
        const extensionName = name.substr(name.indexOf(".")); // 文件扩展名
        const fileName ='h5/feedback/'+date + Math.floor(Math.random() * 1000) + extensionName;

        /*
		bucket: 上传的目标空间

		file: File 对象，上传的文件

		key: 文件资源名

		token: 上传验证信息，前端通过接口请求后端获得

		config: object，其中的每一项都为可选
	*/

        // qiniu.upload(file: File, key: string, token: string, putExtra?: object, config?: object): observable

        // const token = null;
        // const observable = qiniu.upload(file, name, token, putExtra, config)
        // const subscription = observable.subscribe({
        //     next: (result) => {
        //         // 接收上传进度信息，result是带有total字段的 Object
        //         // loaded: 已上传大小; size: 上传总信息; percent: 当前上传进度
        //         console.log(result);    // 形如：{total: {loaded: 1671168, size: 2249260, percent: 74.29856930723882}}
        //         // this.percent = result.total.percent.toFixed(0);
        //     },
        //     error: (errResult) => {
        //         // 上传错误后失败报错
        //         console.log(errResult)
        //         this.message.error('上传失败');
        //     },
        //     complete: (result) => {
        //         // 接收成功后返回的信息
        //         console.log(result);   // 形如：{hash: "Fp5_DtYW4gHiPEBiXIjVsZ1TtmPc", key: "%TStC006TEyVY5lLIBt7Eg.jpg"}
        //         if (result.key) {
        //             this.message.success('上传成功');
        //         }
        //     }
        // }) // 上传开始


        console.log(fileName);
    }

    const onChange = async (_files, type, index) => {
        console.log(type)
        console.log(index)
        if(type == 'add'){
            const file = _files[_files.length-1];
            uploadImg(file.file)


            let fs = [],f = {};
            _files.map((item,i)=>{
                f.id = i;
                f.url = item.url;
                fs.push(f)
            })
            setFiles(fs)
        }else{
            setFiles(files.splice(index,1));
        }
    }

    const onSubmit = () =>{
        props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                let form = props.form.getFieldsValue()
                const now = new Date();
                const _files = files.map(item=>{
                   return {
                       pic_url:item.url,
                       create_time:''
                   }
                });

                let param = {
                    "user_name": form.user_name,
                    "user_phone": form.phone.replace(/\s/g,""),
                    "complaints_type": feedType,
                    chat_records:JSON.stringify([{
                        id:ID,
                        identity:0,
                        read_status: 0,
                        context:form.content,
                        create_time:moment(now).format("YYYY-MM-DD HH:mm:ss")
                    }]),
                    image_collection:[],
                    id:ID
                }

                console.log(param)

                submitFeedBack(param).then(response=>{
                    if(response.code === 200){
                        Toast.success(response.message);
                        history.push('/feedbackrecord?id='+ID);
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
                        <div className={feedType == 1?'my-tab active':'my-tab'} onClick={()=>changeLabel(1)}>售后咨询</div>
                        <div style={{width:'15px'}}></div>
                        <div className={feedType == 2?'my-tab active':'my-tab'} onClick={()=>changeLabel(2)}>我要投诉</div>
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
                <div style={{ margin: '0 10px'}}>
                    <ImagePicker
                        length="6"
                        files={files}
                        onChange={onChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={files.length < 7}
                    />
                </div>
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