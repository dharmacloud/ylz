import {vip} from './store.js'
import {get} from 'svelte/store'
export const viplist={
    'YAP':{
        title:'作者',
        www:'https://shutonggui.cn/',
    },
    'XIU':{
        title:'魏秀秀',
        www:'https://shutonggui.cn/',
    },
    'ESEN':{
        title:'黃義盛',
        www:'https://shutonggui.cn/',
    },
}

export const getVip=(field)=>{
    const obj=viplist[get(vip)]||{};
    return obj[field]||'';
}
export const hasVip=vipcode=>{
    return viplist[vipcode];
}

