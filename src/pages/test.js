import React, { useState, useEffect, useRef } from 'react';
import VConsole from 'vconsole';
import MobileDetect from 'mobile-detect';


let test = ['Mobile', 'Build', 'Version', 'VendorID', 'iPad', 'iPhone', 'iPod', 'Kindle', 'Chrome', 'Coast', 'Dolfin', 'Firefox', 'Fennec', 'Edge', 'IE', 'NetFront', 'NokiaBrowser', 'Opera', 'Opera Mini', 'Opera Mobi', 'UCBrowser', 'MQQBrowser', 'MicroMessenger', 'baiduboxapp', 'baidubrowser', 'SamsungBrowser', 'Iron', 'Safari', 'Skyfire', 'Tizen', 'Webkit', 'PaleMoon', 'SailfishBrowser', 'Gecko', 'Trident', 'Presto', 'Goanna', 'iOS', 'Android', 'Sailfish', 'BlackBerry', 'BREW', 'Java', 'Windows Phone OS', 'Windows Phone', 'Windows CE', 'Windows NT', 'Symbian', 'webOS']

function Test(props) {

    const [defaultUAParam,setDefaultUAParam] = useState('');
    const [UAParam,setUAParam] = useState({});
    const [md,setmd] = useState('');
    useEffect(()=>{
        new VConsole();
        // tests();
        let md = new MobileDetect(window.navigator.userAgent);
        setDefaultUAParam(window.navigator.userAgent)
        let param = {};
        // setmd()
        console.log( md.mobile() );          // 'Sony'
        console.log( md.phone() );           // 'Sony'
        console.log( md.tablet() );          // null
        console.log( md.userAgent() );       // 'Safari'
        console.log( md.os() );              // 'AndroidOS'
        console.log( md.is('iPhone') );      // false
        console.log( md.is('bot') );         // false
        console.log( md.version('Webkit') );         // 534.3
        console.log( md.versionStr('MicroMessenger') );       // '4.1.A.0.562'
        console.log( md.match('playstation|xbox') ); // false
        
        let operatingSystem = md.os();

        if(operatingSystem === 'iOS'){
            operatingSystem = operatingSystem +' '+ md.version('iPhone')
            //window.navigator.userAgent.split(';')[1].match(/(\d+)_(\d+)_?(\d+)?/)[0]
        }else if(operatingSystem === 'Android'){
            operatingSystem = operatingSystem +' '+ md.version('Android')
            //window.navigator.userAgent.split(';')[1].match(/\d+\.\d+/g)[0]
        }else{
            operatingSystem = '暂无';
        }
        test.map(item=>{
            if(md.versionStr(item)){
                console.log(md.versionStr(item),item,"md.versionStr(item)")
            }
            
        })

        let browserVersion = '';
        if(md.userAgent() === 'WeChat'){
            browserVersion = md.versionStr('MicroMessenger');
        }else if (/AlipayClient/.test(window.navigator.userAgent)){
            browserVersion = window.navigator.userAgent.match(/AlipayClient\/([\d\.]+)/)[1];
            //md.versionStr('AlipayClient');
        }else{
            browserVersion = md.versionStr(md.userAgent());
        }
        param.terminalModel = md.versionStr('Mobile')
        let browser = "";
        if(md.userAgent()){
            browser = md.userAgent()
        }else if (/AlipayClient/.test(window.navigator.userAgent)){
            browser = 'AlipayClient'
        }else{
            browser = '暂无';
        }

        param.isMobile = !!window.navigator.userAgent.match(/AppleWebKit.*Mobile.*/)
        param.kernel = 'Webkit' +' '+ md.version('Webkit');
        param.operatingSystem = operatingSystem;
        param.browser = browser;
        param.browserVersion = browserVersion;
        setUAParam(param)
    },[])

    // var md = new MobileDetect(
    //     'Mozilla/5.0 (Linux; U; Android 4.0.3; en-in; SonyEricssonMT11i' +
    //     ' Build/4.1.A.0.562) AppleWebKit/534.30 (KHTML, like Gecko)' +
    //     ' Version/4.0 Mobile Safari/534.30');
    
    // // more typically we would instantiate with 'window.navigator.userAgent'
    // // as user-agent; this string literal is only for better understanding
    
   

    function tests(){
        // return {//移动终端浏览器版本信息
        //     trident: u.indexOf('Trident') > -1, //IE内核
        //     presto: u.indexOf('Presto') > -1, //opera内核
        //     webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        //     gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        //     mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        //     ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        //     android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        //     iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
        //     iPad: u.indexOf('iPad') > -1, //是否iPad
        //     webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        // };
    
        // let defaultUA = window.navigator.userAgent;
        let  ua = window.navigator.userAgent.toLowerCase();  
        setDefaultUAParam(window.navigator.userAgent)

        console.log(window.navigator.userAgent.match(/Mobile\/([\d\.]+)/),"是否是移动端")

        // var regStr_chrome = /AppleWebKit\/[\d.]+/gi ;
        // alert(window.navigator.userAgent)
        let defaultUAParam = [
            { key : 'IE' , val: ua.match(/rv:([\d.]+)\) like gecko/) },
            { key : 'Edge' , val: ua.match(/edge\/([\d\.]+)/) },
            { key : 'Firefox' , val: ua.match(/firefox\/([\d\.]+)/) },
            { key : 'Opera' , val: ua.match(/(?:opera|opr).([\d\.]+)/) },
            { key : 'Chrome' , val: ua.match(/chrome\/([\d\.]+)/) , kernel: ua.match(/AppleWebKit\/([\d\.]+)/)},
            { key : 'Safari' , val: ua.match(/version\/([\d\.]+).*safari/) },
        ]
        let _param = {}
        defaultUAParam.map(item=>{
            console.log(item.val,"item.val")
            if(item.val){
                _param.version = item.val[1];
                _param.browserName = item.key;
            }
        })

        // setUAParam(_param)
        console.log(_param,"_param")
    }

    return (
        <>
            <div>默认信息{defaultUAParam}</div>
            <div>终端类型：{UAParam.isMobile ? 'Mobile' : 'Web'}</div>
            <div>终端型号：{UAParam.terminalModel}</div>
            <div>浏览器信息</div>
            <div>浏览器：{UAParam.browser}</div>
            <div>版本号：{UAParam.browserVersion}</div>
            <div>内核：{UAParam.kernel}</div>
            <div>操作系统：{UAParam.operatingSystem}</div>
        </>
    )
}
export default Test