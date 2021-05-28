
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由
import {repairOrderDetail, chatUpdate, chatUpdateStatus, getUpToken,feedBackScore} from '../../servers/api'
import pictureO from '../../assets/picture-outline.svg'
import starHollow from '../../assets/star-hollow.svg'
import starSolid from '../../assets/star-solid.svg'

import './index.css'
import {getLogisticsCompany, getUrlParam} from "../../utils/utils";
import moment from "moment/moment";
import $ from "jquery";
const qiniu = require('qiniu-js') // 需要加载qiniu模块的
const imgHttp = 'https://oss.gendanbao.com.cn/';

const history = createHashHistory();
let config = {
    useCdnDomain: true,         // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
    region: qiniu.region.z2     // 上传域名区域（z1为华北）,当为 null 或 undefined 时，自动分析上传域名区域
};
let putExtra = {
    fname: "",          // 文件原文件名
    params: {},         // 放置自定义变量： 'x:name': 'sex'
    mimeType: null      // 限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
};


function FeedBackList(props) {
    const [dataInfo,setDataInfo] = useState([]);
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState('');
    const [isModal,setIsModal] = useState(false);
    const [isImgModal,setIsImgModal] = useState(false);
    const [viewImgModal,setViewImgModal] = useState(false);

    const [appraiseSpeed,setAppraiseSpeed] = useState(0)
    const [appraiseServer,setAppraiseServer] = useState(0)
    const [appraiseResult,setAppraiseResult] = useState(0)

    useEffect(() => {
        document.title = '反馈详情';
        let id = getUrlParam('id');// 这是获取请求路径中带的参数
        let complaints_type = getUrlParam('complaints_type');
        let type = getUrlParam('type');
        if(type == 2){
            setIsModal(true);
        }
        getDetailData({
            id:id,
            complaints_type:complaints_type
        })
    }, [])

    const submit = (url) =>{
        const now = new Date();
        let param = {
                "id": dataInfo.id,
                "create_time": moment(now).format("YYYY-MM-DD HH:mm:ss"),
                "context": message,
                "pic_zoom_url": "",
                "pic_url": url,
                "read_status": 0,
                "identity": 0,
                complaints_type:dataInfo.complaints_type
            }
        chatUpdate(param).then(res=>{
            if(res.code == 200){
                setMessage(null);
                getDetailData({
                    id:dataInfo.id,
                    complaints_type:dataInfo.complaints_type
                })
            }else{
                Toast.fail(res.message);
            }
        })
    }

    const submitApprais =()=>{
        let a = [appraiseSpeed,appraiseServer,appraiseResult];
        feedBackScore( {
            id:dataInfo.id,
            score_array:a.join(",")
        }).then(res=>{
            if(res.code==200){
                //成功后返回列表
                history.go(-1);
            }else{
                Toast.info(res.message, 30);
            }
        })
    }

    const updateStatus =(j,m)=>{
        let ids = [];
        m.map(item=>{
            //未读并且后台标识
            if(item.read_status == 0 && item.identity == 1){
                ids.push(item.id)
            }
        })
        if(ids.length==0) return false;
        chatUpdateStatus({
            id:j.id,
            message_ids:ids,
            complaints_type:j.complaints_type
        }).then(res=>{
            if(res.code == 200){

            }else{
                Toast.info(res.message, 30);
            }
        })
    }
    const getDetailData = (json) => {
        repairOrderDetail(json).then(res=>{
            if(res.code==200) {
                setDataInfo(res.data);
                if(res.data){
                    setMessages(JSON.parse(res.data.chat_records))

                    let feedbackContent = document.getElementById('feedbackContent');
                    feedbackContent.scrollTop = feedbackContent.scrollHeight;
                    updateStatus(json,JSON.parse(res.data.chat_records));
                }
            }else{
                Toast.info(res.message, 30);
            }

        })
    }

    const UpToken =  (name) =>{
        return new Promise((resolve,reject) => {
            getUpToken(name).then(res=>{
                if(res.code == 200){
                    resolve(res.data)
                }else{
                    reject(res.message)
                }
            })
        });
    }

    const uploadImg = async (file)=>{
        return new Promise(async (resolve,reject) => {
            const date = new Date().getTime(); // 当前时间
            const name = file.name || ".png";
            const extensionName = name.substr(name.indexOf(".")); // 文件扩展名
            const fileName ='h5/feedback/'+date + Math.floor(Math.random() * 1000) + extensionName;

            const tokenJson = await UpToken(name);
            /*
            file: File 对象，上传的文件
            key: 文件资源名
            token: 上传验证信息，前端通过接口请求后端获得
            config: object，其中的每一项都为可选
        */

            const observable = qiniu.upload(file, tokenJson.imgUrl, tokenJson.token, putExtra, config)
            const subscription = observable.subscribe({
                next: (result) => {
                    // 接收上传进度信息，result是带有total字段的 Object
                    // loaded: 已上传大小; size: 上传总信息; percent: 当前上传进度
                    console.log(result);    // 形如：{total: {loaded: 1671168, size: 2249260, percent: 74.29856930723882}}
                    // this.percent = result.total.percent.toFixed(0);
                },
                error: (errResult) => {
                    // 上传错误后失败报错
                    console.log(errResult)
                    Toast.fail('上传失败');
                    reject(errResult)
                },
                complete: (result) => {
                    // 接收成功后返回的信息
                    console.log(result);   // 形如：{hash: "Fp5_DtYW4gHiPEBiXIjVsZ1TtmPc", key: "%TStC006TEyVY5lLIBt7Eg.jpg"}
                    if (result.key) {
                        // this.message.success('上传成功');
                        resolve(result.key)
                    }
                }
            }) // 上传开始

        });

    }

    const uploadImgSubmit = async (event)=>{
        let file = event.target.files[0];
        let url = await uploadImg(file);
        submit(url);
    }

    const viewImgBig = (e,url)=>{
        e.stopPropagation();
        setViewImgModal(url)
        setIsImgModal(true)
    }

    var appraise=[1,2,3,4,5];
    return (

        <div className={"box feedbackdetail"} style={{display:"block"}}>
            <div className={'content-box'} id={'feedbackContent'}>
                {/*客户第一条*/}
                {messages.length>0 && (
                    <div className={'detailItem'}>
                        <div className={'creatime'}>{dataInfo.create_time}</div>
                        <div className={'detailMesage detailMessage1'}>
                            <div className={'userPhoto'}>我</div>
                            <div className={'message message1'} style={{marginRight:'8px'}}>
                                <div>反馈类型：{dataInfo.complaints_describe}</div>
                                <div>反馈内容：{messages[0].context}</div>
                                <br/>
                                <div>联系方式</div>
                                <div>姓名：{dataInfo.user_name}</div>
                                <div>手机号：{dataInfo.user_phone}</div>
                                <div className={messages[0].read_status == 0 ? 'message-state02':'message-state01'}>{messages[0].read_status == 0 ? '未读':'已读'}</div>
                            </div>
                            <div className={'null'}></div>
                        </div>
                    </div>
                )}
                {
                    messages.map((item,i)=>{
                        return i==0 ? '': item.identity == 0 ?
                            (
                                //客户
                                <div className={'detailItem'}>
                                    <div className={'creatime'}>{item.create_time}</div>
                                    <div className={'detailMesage detailMessage1'}>
                                        <div className={'userPhoto'}>我</div>
                                        <div className={'message message1'} style={{marginRight:'8px'}}>
                                            {item.context}
                                            {item.pic_url && (
                                                <img style={{width:'100%'}} src={imgHttp+item.pic_url} onClick={(e)=>viewImgBig(e,item.pic_url)}/>
                                            )}
                                            <div className={item.read_status == 0 ? 'message-state02':'message-state01'}>{item.read_status == 0 ? '未读':'已读'}</div>
                                        </div>
                                        <div className={'null'}></div>
                                    </div>
                                </div>
                            ):(
                                //后台
                                <div className={'detailItem'}>
                                    <div className={'creatime'}>{item.create_time}</div>
                                    <div className={'detailMesage'}>
                                        <div className={'userPhoto'}>客服</div>
                                        <div className={'message'}>
                                            {item.context}
                                            {item.pic_url && (
                                                <img style={{width:'100%'}} src={imgHttp+item.pic_url}/>
                                            )}
                                        </div>
                                        <div className={'null'}></div>
                                    </div>
                                </div>
                            )
                    })
                }
            </div>
            <div className={'bottom-box'}>
                <div className={'bottom-box-labels'}>
                    {/*<span className={'bottom-box-label'}>已解决</span>*/}
                    {/*<span className={'bottom-box-label'}>未解决</span>*/}
                    <span className={'bottom-box-label'} onClick={()=>setIsModal(true)}>评分</span>
                </div>
                <div className={'senbox'}>
                    <div className={'senImg'}>
                        <img src={pictureO} style={{width:'20px'}}/>
                        <input type="file" id="id-pic-file" accept="image/*" className={'file'} onChange={uploadImgSubmit}/>
                    </div>
                    <TextareaItem
                        placeholder="输入文字"
                        rows={1}
                        value={message}
                        onChange={(v)=>setMessage(v)}
                    />
                    <div className={'sendbtn'} onClick={()=>submit('')}>发送</div>
                </div>
            </div>

            {/*评论*/}
            <Modal
                visible={isModal}
                transparent
                maskClosable={false}
                onClose={()=>{setIsModal(false)}}
                title="请对服务进行评分"
                closable={true}
                className={'appraiseBox'}
                // afterClose={() => { alert('afterClose'); }}
            >
                <div className={'sub'}>评分完成后工单不可再处理</div>
                <div style={{ height: 200, overflow: 'scroll' }}>
                    <div className={'appraiseItem'}>
                        <label>处理速度：</label>
                        {
                            appraise.map((item, index) => {
                                return <img src={appraiseSpeed >index ? starSolid:starHollow} className={'appraise'} onClick={()=>setAppraiseSpeed(index+1)}></img>
                             })
                        }
                    </div>
                    <div className={'appraiseItem'}>
                        <label>服务态度：</label>
                        {
                            appraise.map((item, index) => {
                                return <img src={appraiseServer >index ? starSolid:starHollow} className={'appraise'} onClick={()=>setAppraiseServer(index+1)}></img>
                            })
                        }
                    </div>
                    <div className={'appraiseItem'}>
                        <label>处理结果：</label>
                        {
                            appraise.map((item, index) => {
                                return <img src={appraiseResult >index ? starSolid:starHollow} className={'appraise'} onClick={()=>setAppraiseResult(index+1)}></img>
                            })
                        }
                    </div>
                    <div className={'appraisebtn'} onClick={submitApprais}>评分</div>
                </div>
            </Modal>
            {/*查看大图*/}
            <Modal
                visible={isImgModal}
                transparent
                maskClosable={true}
                onClose={()=>{setIsImgModal(false)}}
                closable={true}
                className={'imgBox'}
                style={{ width:'80%'}}
            >
                <div>
                    <img style={{width:'100%'}} src={imgHttp+viewImgModal}/>
                </div>
            </Modal>
        </div>
    );
}

export default createForm()(FeedBackList)