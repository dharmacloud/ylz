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
    'TEST':{
        title:'測試人員',
        www:'https://nissaya.cn/',
    },
}

export const getVip=(field)=>{
    const obj=viplist[get(vip)]||{};
    return obj[field]||'';
}

