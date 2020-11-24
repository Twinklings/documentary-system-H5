
import React, { useState, useEffect } from 'react';
import { List, Modal, Icon, Button, Toast, Checkbox } from 'antd-mobile';
// import {Flex,WhiteSpace} from 'antd-mobile'
import { createHashHistory } from 'history'; // 如果是hash路由
import $ from 'jquery'

import './index.css'
import { placeAnOrder } from '../../../servers/authorizationApi'
import capitalSecurity from '../img/capitalSecurity.svg'

const history = createHashHistory();
const Item = List.Item;
const Brief = Item.Brief;
const CheckboxItem = Checkbox.CheckboxItem;

function Alipay() {

    const toastTime = 1;

    const [sesameSeed,setSesameSeed] = useState(0);

    const [amount,setAmount] = useState(0);

    const [type,setType] = useState(false);
    

    const [param,setParam] = useState({});

    const [visibleModal,setVisibleModal] = useState(false);

    const [loading,setLoading] = useState(false);
    
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
        if(!type){
            return Toast.fail("请阅读并同意《用户授权协议》",toastTime);
        }
        
        if(loading){
            return false;
        }
        setLoading(true);
        placeAnOrder(param).then(response=>{
            setLoading(false);
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

    const onChange = (val) => {
        console.log(val);
        setType(val);
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
                    
                    <div style={{fontSize:"14px"}}>
                        <CheckboxItem
                         onChange={(e) => onChange(e.target.checked)}
                         style={{
                            float: 'left',
                            width: '29px',
                            paddingLeft: 0,
                            height: '24px',
                            minHeight: '10px',
                         }}
                         ></CheckboxItem>
                        
                        我已阅读并同意<span style={{"color":"#007aff"}} onClick={openAgreementBox}>《用户授权协议》</span>，在使用上述服务时，授权商户了解我的信用评估结果。</div>
                    <div className={"submit"} onClick={submit}>同意并且使用</div>
                </div>
            </div>
            {/* <Modal
                visible={visibleModal}
                transparent
                maskClosable={false}
                onClose={onClose}
                title="服务协议"
                footer={[{ text: '关闭', onPress: () => { onClose(); } }]}
                style={{ width:350,}}
                > */}
                <div className={"backgroundModal"} style={visibleModal ? {display:"block"} : {display:"none"}}>
                    <Icon type="cross" className={"crossModal"} size={"lg"} onClick={() => { onClose(); }}></Icon>
                    <div className={"texts scroll"}>
                        <p>《用户授权协议》</p>
                        <p>(以下简称“本协议”)是支付宝（中国）网络技术有限公司（以下简称“支付宝”或“我们”）与用户（以下简称“您”）所订立的有效合约。请您先仔细阅读本协议内容，尤其是字体加粗部分。 如您对本协议内容或页面提示信息有疑问，请勿进行下一步操作。您可通过支付宝在线客服或官方热线95188进行咨询，以便我们为您解释和说明。如您通过页面点击或我们认可的其他方式确认本协议即表示您已同意本协议。 </p>
                
                        <p>1、为了便于您使用第三方的服务，您同意支付宝将您的用户编号及页面提示的相关信息传递给第三方。页面提示上会展示具体授权对象以及授权信息类型，您的信息将通过加密通道传递给第三方。支付宝会要求第三方严格遵守相关法律法规与监管要求，依法使用您的信息，并应对您的信息保密。点击授权之后，授权关系长期有效，直至您主动解除。为了更好的保护您的信息安全，我们采用了信息查询令牌技术。授权有效期内，当您使用被授权方服务时，将激活令牌，被授权方仅在令牌激活期内方可查询您的信息。激活期届满后，令牌将暂时失效，直至您再次使用被授权方服务时被激活。</p>
                
                        <p>2、支付宝是中立的非银行支付机构，上述第三方服务由该第三方独立运营并独立承担全部责任。因第三方服务或其使用您的信息而产生的纠纷，或第三方服务违反相关法律法规或协议约定，或您在使用第三方服务过程中遭受损失的，请您和第三方协商解决。</p>
                        <p>3、如我们对本协议进行变更，我们将通过公告或客户端消息等方式予以通知，该等变更自通知载明的生效时间开始生效。若您无法同意变更修改后的协议内容，您有权停止使用相关服务；双方协商一致的，也可另行变更相关服务和对应协议内容。</p>
                        <p>4、本协议《信用免押》未约定事宜，均以支付宝网站公布的<a style={{color:"#096dd9"}} href="https://render.alipay.com/p/f/fd-iztow1fi/index.html">《支付宝服务协议》</a>及相关规则为补充；本协议与《支付宝服务协议》及相关规则不一致的地方，以本协议为准。</p>
                        <p>5、本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国法律。因本协议产生的争议， 均应依照中华人民共和国法律予以处理，并由被告住所地人民法院管辖。</p>
                    
                    
                        <p>《信用免押协议》</p>
                        <p>1，协议制定本协议由第三方与支付宝协商完成，第三方作为支付宝授权服务提供商，面向合规用户提供“信用免押”等服务。 </p>
                        <p>2，信用免押标准以下简称“标准” 芝麻信用分≥550分以上，即符合“信用免押”标准，第三方承诺对于符合标准的用户，免收产品押金， 并免费提供给标准用户使用。 </p>
                        <p>3，限制条款 第三方根据标准免收押金为符合标准用户免费提供产品使用，为避免出现违规但不限于“恶意领取、 二次销售、转卖、倒卖机器零部件、破坏信用免押正常秩序等”违规行为，第三方在为用户提供免押服务的同时，可设置限制条款，以保障第三方和用户的基本权利，具体如下：“用户通过第三方和支付宝授权成功领取收到产品后，需在15天内激活并使用一次，如超过本协议 规定时间未正常激活使用，第三方和支付宝有权发起违约扣款，扣款渠道包括但不限于支付宝、花呗、余额宝、绑定支付宝信用卡、银行卡等” 。</p>
                        <p>4，补充条款如用户收到产品15日内激活并使用，则不扣款，如违约，将在3个工作日内完成扣款行为，超期扣款失败，支付宝有权根据协议，对违规用户进行对应处罚，包括但不限于“扣除对应芝麻信用分、法律诉讼等方式”，这将对您的个人信用值有一定影响，请谨慎处理。</p>
                        <p>5，本协议同意即生效，如有疑问，可咨询第三方，最终解释归第三方所有，支付宝仅提供服务支持。</p>
                    </div>
                </div>
            {/* </Modal> */}
       </>
   );
}


 
 
  
 


export default Alipay