import {vip} from './store.js'
import {get} from 'svelte/store'
export const viplist={
    'FAWANG':{
        title:'法王講堂',
        www:'http://fawang.com.tw/main1_0.htm',
    },
    'FAYUN':{
        title:'法雲寺',
        www:'https://dcm.org.tw/',
    },
    'YAP':{
        title:'作者',
        www:'https://nissaya.cn/',
    },
    'HAIYIN':{
        title:'金門海印寺',
        www:'https://kinmen.travel/zh-tw/travel/attraction/401',
    }
}

export const getVip=(field)=>{
    const obj=viplist[get(vip)]||{};
    return obj[field]||'';
}

