
import React, { useState, useEffect } from 'react';
import { List, Modal, Icon, Button, Toast } from 'antd-mobile';
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由
import $ from 'jquery'

import './index.css'
import { placeAnOrder } from '../../../servers/authorizationApi'
import capitalSecurity from '../img/capitalSecurity.svg'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;

function Alipay() {
    // const setAddres = () => {
    //     history.push('/addres');
    // }

    const toastTime = 1;

    const [sesameSeed,setSesameSeed] = useState(0);

    const [amount,setAmount] = useState(0);

    const [param,setParam] = useState({});

    const [visibleModal,setVisibleModal] = useState(false);
    
    useEffect(() => {
      document.title = '芝麻信用服务';
      setSesameSeed(Math.floor(Math.random() * (780 - 600 + 1) + 600))
      //画刻度
      drawline($(".line-min"),30,40);


      console.log(sessionStorage.saveParam)
    // 获取数据
      let saveParam = JSON.parse(sessionStorage.saveParam);
      setAmount(saveParam.pay_amount);
      setParam(saveParam);

    }, [])

    const drawline = (wrap,num,translate) => {
        var gap=360/num;
        console.log(num)
        for(var i=0;i<20;i++){
            var $li=$("<li/>").css({
                "transform":"rotate("+gap*i+"deg)  translate("+translate+"px,50%)"
            });
            wrap.append($li);
        }
    }

    const submit = () => {
        
        
        placeAnOrder(param).then(response=>{
            if(response.code === 200){
                Toast.success(response.message,toastTime);
                history.push('/fakeAuthorization/success');
            }else{
                Toast.fail(response.message,toastTime);
            }
        })
    }

    const openAgreementBox = () => {
        setVisibleModal(true)
    }

    const onClose = () => {
        setVisibleModal(false)
    }

    return (
        <>
            <div className={"sesameCrediservice"}>
                <div className={"clock"}>
                    <ul className={"line-min"}></ul>
                    <div className={"top-content"}>
                        <span className={"ft28"}>{sesameSeed}</span>
                        <span className={"ft14"}>芝麻分</span>
                        <span className={"title_s"}>你的信用真棒</span>
                    </div>
                </div>
                <div className={"title"}>商家为你"减免押金"</div>
                <div className={"money"}>¥<span className={"huaxian"}>{amount}</span></div>
                <div className={"capitalSecurity"}>
                    <img src={capitalSecurity}/>
                </div>
                <div className={"title_s"}>免押金租借</div>
            
                <div className={"alipayFooter"}>
                    <div>阅读<span style={{"color":"#007aff"}} onClick={openAgreementBox}>《服务协议》</span></div>
                    <div className={"submit"} onClick={submit}>同意并且使用</div>
                </div>
            </div>
            <Modal
                visible={visibleModal}
                transparent
                maskClosable={false}
                onClose={onClose}
                title="服务协议"
                footer={[{ text: '关闭', onPress: () => { onClose(); } }]}
                style={{ width:350,}}
                >
                <div className={"texts scroll"} style={{height:400}}>
                    <p>本授权书由您向厦门软猫科技有限公司（下称“厦门软猫”）出具，具有授权之法律效力。请您务必审慎阅读、充分理解本授权书各条款内容，特别是免除或者限制责任的条款，前述条款可能以加粗字体显示，您应重点阅读。除非您已阅读并接受本授权书所有条款，否则您无权使用微信支付的自动续费、自动缴费、自动扣款等服务。您同意本授权书即视为您已授权厦门软猫代理您向财付通支付科技有限公司（下称“财付通”）申请开通微信支付自动续费和免密支付功能，并自愿承担由此导致的一切法律后果。</p>
            
                    <p>您确认并不可撤销地授权厦门软猫向财付通发出扣款指令，财付通即可在不验证您的支付密码、短信动态码等信息的情况下直接从您的银行账户或微信支付账户中扣划厦门软猫指定的款项至厦门软猫指定账户。</p>
            
                    <p>在任何情况下，只要厦门软猫向财付通发出支付指令，财付通就可按照该指令进行资金扣划，财付通对厦门软猫的支付指令的正确性、合法性、完整性、真实性不承担任何法律责任，相关法律责任由您和厦门软猫自行承担。</p>
                    <p>您在扣款账户内必须预留有足够的资金余额，否则因账户余额不足导致无法及时扣款或扣款错误、失败的，一切责任由您自行承担。因不可归责于财付通的事由，导致的不能及时划付款项、划账错误等责任与财付通无关。</p>
                    <p>您确认，因上厦门软猫的原因导致您遭受经济损失的，由您与厦门软猫协商解决，与财付通无关。</p>
            
                </div>
            </Modal>
       </>
   );
}

export default Alipay