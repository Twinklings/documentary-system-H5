import React, { useState, useEffect, useRef } from 'react';
import VConsole from 'vconsole';
import MobileDetect from 'mobile-detect';
import $ from 'jquery';
import { CITY } from '../utils/city'



let test = ['Mobile', 'Build', 'Version', 'VendorID', 'iPad', 'iPhone', 'iPod', 'Kindle', 'Chrome', 'Coast', 'Dolfin', 'Firefox', 'Fennec', 'Edge', 'IE', 'NetFront', 'NokiaBrowser', 'Opera', 'Opera Mini', 'Opera Mobi', 'UCBrowser', 'MQQBrowser', 'MicroMessenger', 'baiduboxapp', 'baidubrowser', 'SamsungBrowser', 'Iron', 'Safari', 'Skyfire', 'Tizen', 'Webkit', 'PaleMoon', 'SailfishBrowser', 'Gecko', 'Trident', 'Presto', 'Goanna', 'iOS', 'Android', 'Sailfish', 'BlackBerry', 'BREW', 'Java', 'Windows Phone OS', 'Windows Phone', 'Windows CE', 'Windows NT', 'Symbian', 'webOS']

function Test(props) {

    const [defaultUAParam,setDefaultUAParam] = useState('');
    const [UAParam,setUAParam] = useState({});
    const [md,setmd] = useState('');
    const [iPdata,setIPdata] = useState({});
    const [returnCitySNs,setReturnCitySN] = useState('');
    useEffect(()=>{
        new VConsole();
        // tests();

        // setDefaultUAParam(window.navigator.userAgent);
        let md = new MobileDetect(window.navigator.userAgent);
        setDefaultUAParam(window.navigator.userAgent)
        let param = {};
        param.isMobile = !!window.navigator.userAgent.match(/AppleWebKit.*Mobile.*/)
        let returnCitySN = JSON.parse(sessionStorage.returnCitySN);
        setReturnCitySN(sessionStorage.returnCitySN)
        console.log(sessionStorage.returnCitySN,"123123")

        let _data = {};
        if(returnCitySN.cid){
            _data.ip_address_code = returnCitySN.cid
        }
        if(returnCitySN.cip){
            _data.ip_address = returnCitySN.cip
        }
        if(returnCitySN.cname){
            _data.ip_address_describe = returnCitySN.cname
        }
        _data.equip_ua = window.navigator.userAgent;
        setIPdata(_data)
        console.log(_data,"_data")

        param.ip = returnCitySN.cip;
        param.ipNama = returnCitySN.cname
        
        console.log( md.mobile() );          // 'Sony'
        console.log( md.phone() );           // 'Sony'
        console.log( md.tablet() );          // null
        console.log( md.userAgent() ,'userAgent');       // 'Safari'
        console.log( md.os() );              // 'AndroidOS'
        console.log( md.is('iPhone') );      // false
        console.log( md.is('bot') );         // false
        console.log( md.version('Webkit') );         // 534.3
        console.log( md.versionStr('MicroMessenger') );       // '4.1.A.0.562'
        console.log( md.match('playstation|xbox') ); // false

        let operatingSystem = md.os();
        let browserVersion = '';
        let browser = "";
        // 移动端
        if(param.isMobile){
            if(operatingSystem === 'iOS'){
                operatingSystem = operatingSystem +' '+ md.version('iPhone')
                //window.navigator.userAgent.split(';')[1].match(/(\d+)_(\d+)_?(\d+)?/)[0]
            }else if(operatingSystem === 'Android'){
                operatingSystem = operatingSystem +' '+ md.version('Android')
                //window.navigator.userAgent.split(';')[1].match(/\d+\.\d+/g)[0]
            }else{
                operatingSystem = '暂无';
            }
            
            if(md.userAgent() === 'WeChat'){
                browserVersion = md.versionStr('MicroMessenger');
            }else if (/AlipayClient/.test(window.navigator.userAgent)){
                browserVersion = window.navigator.userAgent.match(/AlipayClient\/([\d\.]+)/)[1];
                //md.versionStr('AlipayClient');
            }else{
                browserVersion = md.versionStr(md.userAgent());
            }
            
            if(md.userAgent()){
                browser = md.userAgent()
            }else if (/AlipayClient/.test(window.navigator.userAgent)){
                browser = 'AlipayClient'
            }else{
                browser = '暂无';
            }

            param.terminalModel = md.versionStr('Mobile')
            param.kernel = 'Webkit' +' '+ md.version('Webkit');
            param.operatingSystem = operatingSystem;
            param.browser = browser;
            param.browserVersion = browserVersion;
            setUAParam(param)
        }else{
            let  ua = window.navigator.userAgent.toLowerCase();  
        

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
            defaultUAParam.map(item=>{
                console.log(item.val,"item.val")
                if(item.val){
                    param.browserVersion = item.val[1];
                    param.browser = item.key;
                }
            })
            param.kernel = 'Webkit' +' '+ md.version('Webkit');
            param.operatingSystem = getOsInfo()
            console.log(param,"_param")
            setUAParam(param)
        }

        // getCode(CITY, _data);
        getipaddress();
    },[]);
    useEffect(()=>{
        getCode(iPdata.ip_address_code,"1");
    },[iPdata.ip_address])

    let addressList = []
    // 设置地址
    const getCode = (addressCode,time) => {
        console.log(addressCode)
        for(let i=0; i<CITY.length; i++){
            if(CITY[i].children){
                geIPcode(CITY[i],CITY[i].children,addressCode,time)
            }
        }
    }

    const geIPcode = (nextData,data,addressCode,time) => {
        for(let i=0; i<data.length; i++){
            if(data[i].value === addressCode){
                if(time === "1"){
                    addressList[2] = data[i]
                }
                if(time === "2"){
                    addressList[0] = nextData
                    addressList[1] = data[i];
                    let code = '', text = '';
                    addressList.map((item,index)=>{
                        code = code === '' ? item.value : code+'|'+item.value;
                        text = text === '' ? item.label : text+''+item.label
                    })
                    let _iPdata = {...iPdata}
                    _iPdata.ip_address_code = code;
                    _iPdata.ip_address_describe = text;
                    console.log(_iPdata,"_iPdata")
                    setIPdata(_iPdata);
                }
                getCode(nextData.value,"2")
            }else if(data[i].children){
                geIPcode(data[i],data[i].children,addressCode,time)
            }
        }
    }

    function getipaddress(){

        // function mycallback(result) {
			
        //     var city = result['content']['address_detail']['city'];
        //       console.log(city,'p_item');
           
        // }

        $.ajax({
            type: "get",
            url: 'http://api.map.baidu.com/location/ip',
            data:{
                ak:'1IZOnhUdOCvHXy6vKuz0gGcq1T25CAf4',
                output:'json',
                coordtype:'bd09ll',
                // location:rs.point.lat+","+rs.point.lng
            },
            dataType: "jsonp",
            jsonpCallback: "success_jsonpCallback",
            success: (res) => {
                console.log(res,'res')
                // getProv(res.result.addressComponent.adcode,"1")
            },
        });

        // var url = "http://api.map.baidu.com/location/ip";
        // var data = {
        //     ak: "1IZOnhUdOCvHXy6vKuz0gGcq1T25CAf4",
        //     coor: "bd09ll",
        //     callback: 'mycallback'  //your callback function
        // };
        // //组合url
        // var buffer = [];
        // for (var key in data) {
        //     buffer.push(key + '=' + encodeURIComponent(data[key]));
        // }
        // var fullpath = url + '?' + buffer.join('&');
        // CreateScript(fullpath);
        // //生成script
        // function CreateScript(src){
        //     var el = document.createElement('script');
        //     el.src = src;
        //     el.async = false;
        //     el.defer = false;
        //     document.body.appendChild(el);
        // }
    }
    
    // function getCode(datas, _data, p_item){
    //     datas.map(item=>{
    //         if(item.value === _data.ip_address_code){
    //             if(p_item){
    //                 _data.ip_address_code = p_item.value+';'+ _data.ip_address_code;
    //                 setIPdata(_data);
    //                 console.log(_data,'p_item')
    //             }
    //         }
    //         if(item.children){
    //             getCode(item.children, _data, item)
    //         }
    //     })
    // }

    function getOsInfo() {
        var userAgent = navigator.userAgent.toLowerCase();
        var name = 'Unknown';
        var version = 'Unknown';
        if (userAgent.indexOf('win') > -1) {
            name = 'Windows';
            if (userAgent.indexOf('windows nt 5.0') > -1) {
                version = 'Windows 2000';
            } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
                version = 'Windows XP';
            } else if (userAgent.indexOf('windows nt 6.0') > -1) {
                version = 'Windows Vista';
            } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
                version = 'Windows 7';
            } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
                version = 'Windows 8';
            } else if (userAgent.indexOf('windows nt 6.3') > -1) {
                version = 'Windows 8.1';
            } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
                version = 'Windows 10';
            } else {
                version = 'Unknown';
            }
        } else if (userAgent.indexOf('iphone') > -1) {
            name = 'Iphone';
        } else if (userAgent.indexOf('mac') > -1) {
            name = 'Mac';
        } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
            name = 'Unix';
        } else if (userAgent.indexOf('linux') > -1) {
            if (userAgent.indexOf('android') > -1) {
                name = 'Android';
            } else {
                name = 'Linux';
            }
        } else {
            name = 'Unknown';
        }

        return version
    }

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
       
    }

    return (
        <>
            <div>默认信息{defaultUAParam}</div>
            <div>IP：{iPdata.ip_address}</div>
            <div>归属地Code：{iPdata.ip_address_code}</div>
            <div>归属地：{iPdata.ip_address_describe}</div>
            <div>终端类型：{UAParam.isMobile ? 'Mobile' : 'Web'}</div>
            <div>终端型号：{UAParam.terminalModel}</div>
            {/* <div>浏览器信息</div> */}
            <div>浏览器：{UAParam.browser}</div>
            <div>版本号：{UAParam.browserVersion}</div>
            <div>内核：{UAParam.kernel}</div>
            <div>操作系统：{UAParam.operatingSystem}</div>
        </>
    )
}
export default Test