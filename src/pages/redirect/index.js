
import React, { useEffect } from 'react';
import { createHashHistory } from 'history'; // 如果是hash路由

import { getUrlParam } from '../../utils/utils'
import {
    redirect
} from '../../servers/authorizationApi'

const history = createHashHistory();
function Redirect() {
    useEffect(() => {

        let parameter = getUrlParam('parameter');// 这是获取请求路径中带的参数
        console.log(parameter,"parameter")

        // if (/MicroMessenger/.test(window.navigator.userAgent)) {
        //     // 微信
        //     // 初始化数据接口
        //     getRedirect(parameter);
        // } else if (/AlipayClient/.test(window.navigator.userAgent)) {
        //     // 支付宝
        //     // setBrowserType(2)
        //     history.push({
        //         pathname: '/fakeAuthorization',
        //         search: 'parameter='+parameter,
        //     });
        // }

        getRedirect(parameter);

    }, [])


    const getRedirect = (parameter) => {
        redirect({parameter}).then(res=>{
            if(res.code === 200){
                window.location.href=res.data.redirect_url;
                // location.href=res.data.redirect_url;
            }else{
                // setInitMsg(res.message)
                // Toast.fail(res.message,toastTime);
            }
        })
    }
    return (<div></div>)
}

export default Redirect
