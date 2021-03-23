
import React, { useState, useEffect } from 'react';
import { List, Modal, Icon, Button, Toast } from 'antd-mobile';
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由
import $ from 'jquery'

import './wexinCss.css'
import { placeAnOrder, machinesaveOrder } from '../../../servers/authorizationApi'
import myjzj from '../img/myjzj.png'
import defaults from '../img/default.svg'
import select from '../img/select.svg'
import border from '../img/border.jpg'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;

function Order() {

    const toastTime = 1;
    
    const [sesameSeed,setSesameSeed] = useState(0);

    const [amount,setAmount] = useState(0);

    const [param,setParam] = useState({});

    const [visibleModal,setVisibleModal] = useState(false);

    const [agreeOrNot,setAgreeOrNot] = useState(true);
    
    const [loading,setLoading] = useState(false);

    useEffect(() => {
      document.title = '提交订单';
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
        if(!agreeOrNot){
            return Toast.fail("请查看并同意委托扣款授权书",toastTime);
        }
        if(loading){
            return false;
        }
        setLoading(true);
        if(param.exID){
            machinesaveOrder(param).then(response=>{
                setLoading(false);
                if(response.code === 200){
                    Toast.success(response.message,toastTime);
                    history.push('/fakeAuthorization/success');
                }else{
                    Toast.fail(response.message,toastTime);
                }
            }).catch(res=>{
                setLoading(false);
                Toast.info(res.message || "当前提交异常,请联系销售协助!");
            })
        }else{
            placeAnOrder(param).then(response=>{
                setLoading(false);
                if(response.code === 200){
                    Toast.success(response.message,toastTime);
                    history.push('/fakeAuthorization/success');
                }else{
                    Toast.fail(response.message,toastTime);
                }
            }).catch(res=>{
                setLoading(false);
                Toast.info(res.message || "当前提交异常,请联系销售协助!");
            })
        }
    }

    const openAgreementBox = () => {
        setVisibleModal(true)
    }

    const onClose = () => {
        setVisibleModal(false)
    }

    const changeSelect = () => {
        if(agreeOrNot){
            setAgreeOrNot(false)
        }else{
            setAgreeOrNot(true)
        }
    }


    return (
        <>
            <div className="orderBox">
                <img style={{"float":"left"}} src={border} />
                <div>
                    <div className={"item"}>
                        <div className={"setAddr"}>
                            <span style={{"padding-right":"10px"}}>收货地址</span>
                            <span></span>
                            {/* <img style={{"float":"right","height":"16px"}} src='../img/right.svg' /> */}
                        </div>
                        <div>
                            <span className="userName">{param.user_name}</span>
                            <span className="userPhone">{param.user_phone}</span>
                            <div className="userAddre">{param.user_address}</div>
                        </div>
                    </div>
                    <div className="item">
                        <div>支付方式</div>
                        <div className="wxtips">
                            <img src={myjzj} />
                            <span className="green" style={{"padding":"0 10px"}}>免押金领取</span>
                            <span>550分以上可免费领取</span>
                        </div>
                    </div>
                    <div className="item flex">
                        <div className="flex_item">商品总价</div>
                        <div className="text flex_item"><span className="num">{amount}</span>元</div>
                        <div className="flex_item" style={{"textAlign":"right"}}>已免除</div>
                    </div>

                    <div className="item" >
                        <div className="select" onClick={changeSelect}>
                            {agreeOrNot?
                            (<img className="agreeSelect" src={select}/>):
                            (<img className="notSelect" src={defaults}/>)
                            }
                        </div>
                        <div className="agreement">是否同意<span onClick={openAgreementBox}>《委托扣款授权书》</span></div>
                    </div>

                    <div className="item describe">温馨提示：微信支付分达到550及以上，免押金领取机器，您需在收货后30日内激活。</div>
                    {/* 不激活将通过微信支付分扣取机器押金<span className="num">{amount}</span>元。 */}
                    
                </div>
                <div className="footer">
                    <div className="bnt">
                        <div className="lease" onClick={submit}>
                            <span>免押金领取</span>
                            <div className="tip">(微信支付分550分以上可免费领取)</div>
                        </div>
                    </div>
                </div>
                
            </div>
            <Modal
                visible={visibleModal}
                transparent
                maskClosable={false}
                onClose={onClose}
                title="委托扣款授权书"
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

export default Order