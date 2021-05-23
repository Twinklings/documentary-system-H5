
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由
import {repairOrderDetail,chatUpdate,chatUpdateStatus} from '../../servers/api'
import pictureO from '../../assets/picture-outline.svg'
import starHollow from '../../assets/star-hollow.svg'
import starSolid from '../../assets/star-solid.svg'

import './index.css'
import {getLogisticsCompany, getUrlParam} from "../../utils/utils";
import moment from "moment/moment";
import $ from "jquery";

const history = createHashHistory();

function FeedBackList(props) {
    const [dataInfo,setDataInfo] = useState([]);
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState(null);
    const [isModal,setIsModal] = useState(false);

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

    const submit = () =>{
        const now = new Date();
        let param = {
                "id": dataInfo.id,
                "creatime": moment(now).format("YYYY-MM-DD HH:mm:ss"),
                "context": message,
                "pic_zoom_url": "",
                "pic_url": "",
                "read_status": "0",
                "identity": "0"
            }
        chatUpdate(param).then(res=>{
            if(res.code == 200){
                getDetailData({
                    id:dataInfo.id,
                    complaints_type:dataInfo.complaints_type
                })
            }else{
                Toast.fail(res.message);
            }
        })
    }

    const updateStatus =()=>{
        let ids = [];
        messages.map(item=>{
            if(item.read_status == 0){
                ids.push(item.id)
            }
        })
        chatUpdateStatus({
            id:dataInfo.id,
            message_ids:ids
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

                    updateStatus();
                }
            }else{
                Toast.info(res.message, 30);
            }

        })
    }
    var appraise=[1,2,3,4,5];
    return (

        <div className={"box feedbackdetail"} style={{display:"block"}}>
            <div className={'content-box'}>
            {
                messages.map(item=>{
                    return  item.identity == '0' ?
                        (
                            //客户
                            <div className={'detailItem'}>
                                <div className={'creatime'}>{item.creatime}</div>
                                <div className={'detailMesage'}>
                                    <div className={'null'}></div>
                                    <div className={'message'}>{item.context}</div>
                                    <div className={'userPhoto'}>我</div>
                                </div>
                            </div>
                        ):(
                            //后台
                            <div className={'detailItem'}>
                                <div className={'creatime'}>{item.creatime}</div>
                                <div className={'detailMesage'}>
                                    <div className={'userPhoto'}>客服</div>
                                    <div className={'message'}>{item.context}</div>
                                    <div className={'null'}></div>
                                </div>
                            </div>
                        )
                })
            }
            </div>
            <div className={'bottom-box'}>
                <div className={'bottom-box-labels'}>
                    <span className={'bottom-box-label'}>已解决</span>
                    <span className={'bottom-box-label'}>未解决</span>
                    <span className={'bottom-box-label'} onClick={()=>setIsModal(true)}>评分</span>
                </div>
                <div className={'senbox'}>
                    <div className={'senImg'}>
                        <img src={pictureO} style={{width:'20px'}}/>
                    </div>
                    <TextareaItem
                        placeholder="输入文字"
                        rows={1}
                        onBlur={(v)=>setMessage(v)}
                    />
                    <div className={'sendbtn'} onClick={submit}>发送</div>
                </div>
            </div>

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
                    <div className={'appraisebtn'}>评分</div>
                </div>
            </Modal>
        </div>
    );
}

export default createForm()(FeedBackList)