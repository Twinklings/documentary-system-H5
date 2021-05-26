
import React, { useState, useEffect, useRef } from 'react';
import { List, Button, WhiteSpace, Modal, Toast, InputItem, Radio, Picker, TextareaItem, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createHashHistory } from 'history'; // 如果是hash路由
import {repairOrderList} from '../../servers/api'
import fankui from '../../assets/fankui.svg'
import noData from '../../assets/no-data.png'


import './index.css'
import {getUrlParam} from "../../utils/utils";

const history = createHashHistory();

function FeedBackList(props) {
    const [dataList,setDataList] = useState([]);
    const [ID,setID] = useState(null)

    useEffect(() => {
        document.title = '反馈记录';
        let id = getUrlParam('id');// 这是获取请求路径中带的参数
        setID(id);
        getInfo(id);
    }, [])

    const getInfo=(id)=>{
        repairOrderList({id:id}).then(res=>{
            if(res.code==200) {
                setDataList(res.data)
            }else{
                Toast.info(res.message, 30);
            }
        })
    }

    const joinAdd = () =>{
        history.push('/feedback?id='+ID);
    }
    const listMethod =(item) =>{
        let url = '/feedbackdetail?id='+item.id+'&complaints_type='+item.complaints_type;
        if(item.platform_reply_status == 2){
            url+='&type='+2;
        }
        history.push(url);
    }

    const types = {0:'待回复', 1:'已回复',  2:'已完成'};
    const btnTests ={0:'回复', 1:'查看', 2:'评价'};


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
        <div className={"box feedbacklist"} style={{display:"block"}}>
            {
                dataList.map((item,index)=>{
                    return(
                        <div key={index} className={"listItem"}>
                            <div className={'listItemTop'}>
                                <div className={'listItemToplaebl'}>{item.complaints_describe}</div>
                                <div className={'state0'+item.platform_reply_status}>{types[item.platform_reply_status]}</div>
                            </div>
                            <div>{item.latest_records}</div>
                            <div>反馈时间：{item.create_time}</div>
                            <div>受理时间：{item.latest_feedback_time}</div>
                            <div className={'listBtn'} onClick={()=>listMethod(item)}>{btnTests[item.platform_reply_status]}</div>
                        </div>
                    )
                })
            }
            {
                dataList.length == 0 && (
                    <img src={noData} style={{
                        width:' 80px',
                        margin: '40% auto',
                        display: 'inherit'}}/>
                )
            }
            <div>
                <div className={'write-btn'} id={'touchMove'} onClick={joinAdd}>
                    <img src={fankui} style={{width:'100%'}}/>
                </div>
            </div>
        </div>
    );
}

export default createForm()(FeedBackList)