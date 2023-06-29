/*
  2023/jinglu/gen-vcpp-tempstamp.js

*/
const unpack=arr=>{
    for (let i=1;i<arr.length;i++) {
        arr[i]+=arr[i-1];
    }
}

//time stamp in delta seconds
//need to fill a whole page at the last
//jinglu/gen-vcpp-timestamp.js
const venxinding=[425,0,5,10,9,9,9,9,9,9,8,8,8,8,8,8,8,7,8,8,8,9,7,7,8,7,8,7,7,8,7,8,7,7,8,7,7,7,8,7,7,7,7,7,7,7,7,8,7,6,7,8,6,7,7,7,8,7,6,7,7,7,7,7,6,7,6,7,6,7,6,6,7,6,7,7,6,6,6,6,7,6,6,7,6,6,6,6,6,6,6,6,6,7,6,6,6,6,6,6,6,6,6,6,8,6,6,6,5,6,6,6,6,6,6,5,6,6,6,5,6,6,5,6,7,5,6,5,6,5,8,6,5,6,5,6,6,5,6,5,6,5,6,5,6,5,6,5,5,5,6,5,5,6,5,6,5,6,5,5,5,6,5,5,6,5,6,5,5,5,5,5,6,5,5,5,5,6,5,5,5,5,6,5,5,5,5,5,6,5,5,5,5,5,5,5,5,5,5,5,5,6,5,5,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,4,5,5,5,4,5,5,5,5,4,5,5,4,5,5,5,4,5,6,5,4,5,3,4,2,4,5,5,5,4,5,5,4,5,5,4,5,5,5,4,5,5,5,4,5,5,5,4,5,5,4,5,4,5,4,5,4,5,5,4,1,4,2,4,5,7,5,0];
const dharmadrum=[30,0,6,8,6,7,8,10,7,6,8,5,7,6,6,7,8,4,6,5,5,6,7,6,5,5,6,5,5,6,7,5,5,5,8,5,4,6,5,6,4,6,4,6,4,5,5,6,7,5,4,5,6,7,4,5,5,5,6,4,5,6,5,5,5,5,5,4,5,5,5,5,5,5,4,5,5,4,7,5,5,4,5,5,5,4,5,5,6,5,5,5,5,4,5,7,5,4,5,4,7,5,5,4,7,5,5,5,4,4,5,5,4,5,4,8,5,4,4,5,4,5,4,5,5,5,4,5,5,4,7,4,5,5,5,4,5,5,3,5,4,5,5,4,5,4,5,4,5,5,5,5,4,4,5,4,4,4,5,4,5,4,4,4,5,4,6,5,4,4,4,5,4,4,4,4,5,4,7,4,4,4,4,5,4,4,5,4,5,4,4,4,4,5,4,4,5,4,4,5,4,5,4,4,4,5,4,4,5,4,6,4,5,4,5,4,4,5,3,4,5,4,4,4,7,4,4,4,4,6,5,4,4,4,4,7,4,4,4,5,4,4,6,4,4,5,6,5,4,4,6,5,4,4,6,5,4,4,4,4,7,5,4,4,4,3,3,4,4,4,4,4,4,7,4,4,4,4,4,6,4,4,6,5,4,4,5,4,4,5,7,4,4,4,5,4,4,4,6,5,4,4,4,2,3,2,4,4,5,0];
const venjianhui=[30,0,3,5,5,5,6,5,6,5,4,6,5,5,5,7,4,5,5,4,5,6,5,5,5,5,5,5,5,5,5,6,4,5,5,6,5,5,5,5,5,6,5,5,5,6,4,5,6,5,4,6,5,6,5,5,6,5,6,4,6,6,5,5,5,5,5,5,5,6,5,5,6,5,5,5,6,4,5,5,5,5,5,5,5,5,6,5,5,5,6,5,4,5,6,5,5,5,5,4,5,6,5,5,7,4,5,6,5,6,5,5,5,5,4,6,5,5,5,5,5,6,5,5,6,5,5,5,5,5,5,7,5,4,5,5,5,4,6,4,6,5,6,4,5,5,6,5,5,5,5,5,5,5,5,6,4,5,4,5,5,5,5,4,4,5,6,4,5,5,4,5,5,5,4,5,5,4,6,4,5,4,5,5,5,5,4,5,5,5,4,4,5,5,4,6,5,4,5,4,6,6,5,5,5,5,5,5,5,5,6,4,5,5,5,5,4,5,6,5,5,5,5,6,5,5,5,5,4,6,5,5,5,5,5,5,5,5,5,5,6,5,6,4,4,5,5,4,5,5,5,5,5,4,5,5,5,4,5,5,6,5,5,5,4,4,4,1,5,4,5,4,5,5,4,5,5,5,5,5,5,4,5,5,6,6,5,5,5,4,6,5,4,5,5,5,4,6,5,4,5,5,5,2,3,3,4,5,7,1];
const jiangxun=[3,0,5,7,7,7,9,9,8,7,7,9,8,8,7,10,5,8,10,8,6,9,9,7,7,7,7,8,7,7,10,7,5,7,8,6,7,6,7,6,8,6,8,7,7,7,7,8,9,7,5,7,7,9,6,7,7,6,7,4,8,9,8,5,8,6,7,7,7,7,7,5,8,6,6,6,7,6,9,5,6,8,5,6,7,7,7,7,6,8,7,5,5,9,5,6,8,6,6,5,8,7,7,6,8,6,8,6,6,7,4,6,7,5,5,7,7,7,5,7,7,6,6,5,7,8,6,7,5,6,6,5,6,7,6,6,7,4,7,7,6,6,6,6,8,5,6,8,6,7,7,6,5,6,6,7,6,6,7,6,6,6,6,6,6,6,9,7,6,4,5,5,5,7,5,6,5,6,7,5,7,5,5,5,7,6,6,5,5,5,5,5,5,6,6,7,7,5,5,5,7,5,6,7,5,5,7,6,5,6,9,5,7,6,6,7,6,7,7,6,6,6,6,7,9,6,7,5,5,7,5,6,6,6,6,9,5,6,8,5,7,7,8,6,5,6,8,6,5,6,7,6,5,6,5,7,6,5,6,6,10,5,6,6,5,5,7,2,7,5,6,5,6,9,4,7,5,6,6,8,7,8,8,6,7,6,6,6,8,6,9,7,6,6,7,7,4,7,9,5,5,7,5,3,8,4,7,6,5,1];
const yangdeshi=[69,0,16,15,14,15,12,12,11,10,9,9,8,8,8,8,8,7,7,8,8,7,7,7,7,7,8,7,7,7,7,8,6,7,7,7,7,7,7,7,6,7,7,7,6,7,7,6,7,7,6,7,6,7,6,7,7,6,6,7,6,7,6,7,6,7,6,6,7,6,7,6,7,6,7,7,6,7,6,7,6,6,7,6,7,6,6,6,6,7,6,7,6,6,6,7,6,7,6,6,6,7,6,7,7,7,7,6,6,6,7,6,6,6,6,6,6,7,6,6,6,7,6,6,7,6,6,6,7,6,8,6,7,6,6,6,6,6,6,6,6,6,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,6,6,6,6,6,6,6,6,6,5,6,6,6,6,6,6,6,6,6,6,5,6,6,6,6,6,6,5,6,6,6,6,6,6,6,6,5,6,6,6,6,6,6,6,5,7,6,6,5,6,6,6,6,6,6,6,5,6,6,6,6,6,5,6,6,6,5,6,6,6,5,6,6,6,6,5,8,6,5,6,6,3,5,2,6,5,6,6,6,5,6,6,6,5,6,6,5,6,6,6,7,5,6,6,5,6,6,6,5,6,6,5,6,6,5,6,6,5,6,1,5,2,5,6,3,4];
const stamps=[venxinding,dharmadrum,venjianhui,jiangxun,yangdeshi];
stamps.forEach(unpack);

export const mediaurls=[
    {youtube:'-',author:'--靜默--'},
    {youtube:'5C4INS3hK40',author:'養德禪寺',bookid:'vcpp_kumarajiva',timestamp:yangdeshi},
    {youtube:'RquHJ4jzXKs',author:'法鼓山',timestamp:dharmadrum,bookid:'vcpp_kumarajiva'}, 
    {youtube:'m9ZmMrY88qE', author:'心定法師', timestamp:venxinding,bookid:'vcpp_kumarajiva'},
    {youtube:'z-IpOREVDHo',author:'見輝法師',bookid:'vcpp_kumarajiva',timestamp:venjianhui},
    {youtube:'wjvwySjCVoQ',author:'蔣勳',bookid:'vcpp_kumarajiva', timestamp:jiangxun},
    // {youtube:'1dVZ_bFWmgM',author:'黃慧音'}, //cannot embed
    {youtube:'XpROd_PKBb0',author:'王菲',bookid:'vcpp_kumarajiva', timestamp:jiangxun},

//王菲緊湊版
    //https://www.youtube.com/watch?v=jH6m_DawjVE&pp=ygUQ6YeR5Ymb57aTIOeOi-iPsg%3D%3D

    {youtube:'oul8mFUmtog',author:'chih',bookid:'bhaisajya', timestamp:[10,5,5,5,5,5,5,5,1000]},
    // {youtube:'0tszTzjhnRQ',author:'南海寺',bookid:'bhaisajya', timestamp:[10,5,5,1000]},
    {youtube:'DCjB_dfSrCQ',author:'見仁法師',bookid:'bhaisajya', timestamp:[10,5,5,5,5,5,5,5,1000]},
    {youtube:'Co5oCG33pc4',author:'安和共修',bookid:'bhaisajya', timestamp:[120,5,5,5,5,5,5,5,1000]},
    {youtube:'MSnMj_32MM8',author:'一心聽經',bookid:'bhaisajya', timestamp:[170,5,5,5,5,5,5,5,1000]},

    {youtube:'cRfrwnOmabA',author:'如來似去',bookid:'bhaisajya', timestamp:[170,5,5,5,5,5,5,5,1000]},
    {youtube:'DnLGZhs6hH0',author:'法鼓山',bookid:'bhaisajya', timestamp:[170,5,5,5,5,5,5,5,1000]},
    
    
    {youtube:'iUSI72_wK0E',author:'女音',bookid:'bhaisajya', timestamp:[170,5,5,5,5,5,5,5,1000]},
    
    {youtube:'VTXWriTcdCU',author:'疲客邦',bookid:'bhaisajya', timestamp:[400,5,5,5,5,5,5,5,1000]},

    {youtube:'J30N2eLFDnw',author:'台語',bookid:'bhaisajya', timestamp:[370,5,5,5,5,5,5,5,1000]},
    {youtube:'KMyG9nQofS8',author:'慧平法師',bookid:'bhaisajya', timestamp:[370,5,5,5,5,5,5,5,1000]},
    {youtube:'gcZ04ch96GQ',author:'明音法師',bookid:'bhaisajya', timestamp:[370,5,5,5,5,5,5,5,1000]},    

    {youtube:'fYh13HhsLEU',author:'Plum Village(越)',bookid:'bhaisajya', timestamp:[370,5,5,5,5,5,5,5,1000]},    
    
    {youtube:'-KqzJjrJjUA',author:'法護法師(梵)',bookid:'pph', timestamp:jiangxun},
    // {youtube:'FZ0w4B80uZA',author:'Gaiea',bookid:'pph', timestamp:jiangxun},
    {youtube:'bDOcp6uk584',author:'般禪梵唱',bookid:'pphs', timestamp:jiangxun},
    // {youtube:'bDOcp6uk584',author:'Sasikirana(爪哇配樂)',bookid:'pph', timestamp:jiangxun},
    {youtube:'RAcE8U8SWlo',author:'菩提寺(中)',bookid:'pphs', timestamp:jiangxun},
    {youtube:'-bRH1sGb0Ao',author:'心定法師',bookid:'pphs', timestamp:jiangxun},
    {youtube:'n7ehR3iVBLg',author:'王菲廣本',bookid:'pph', timestamp:jiangxun},
    {youtube:'bAVWsXm1ToY',author:'王菲',bookid:'pphs', timestamp:jiangxun},   
    {youtube:'fOtDeDKAENA',author:'孟庭葦',bookid:'pphs', timestamp:jiangxun},   
    {youtube:'gm4hTcRhoqI',author:'藥師寺寛邦(日)',bookid:'pphs', timestamp:jiangxun},
    {youtube:'GgfmLuUGETc',author:'蒂娜Tinh(日)',bookid:'pphs', timestamp:jiangxun},
    {youtube:'cm9wdgmC0Bs',author:'觀音禪林(韓)',bookid:'pphs', timestamp:jiangxun},
    // {youtube:'aUu_PBhzfg0',author:'衍偉法師(粵)',bookid:'pph', timestamp:jiangxun},
    {youtube:'30DeY31VnLs',author:'王菲梁朝偉(粵)',bookid:'pphs', timestamp:jiangxun},
    {youtube:'P5HI-Yw7Aao',author:'王菲張智霖',bookid:'pphs', timestamp:jiangxun},
    {youtube:'ghCEdNVZYWM',author:'梅艷芳',bookid:'pphs', timestamp:jiangxun},
    {youtube:'wYSMv7vRB0w',author:'劉德華',bookid:'pphs', timestamp:jiangxun},
    {youtube:'iL_W8W2737A',author:'張學友',bookid:'pphs', timestamp:jiangxun},
    {youtube:'Gq7mmyXac34',author:'Ruschman(英廣本)',bookid:'pph', timestamp:jiangxun},    
    {youtube:'aTfS8QB4n3I',author:'空門禪(英)',bookid:'pphs', timestamp:jiangxun},    

    // {youtube:'0HciqyTMa4k',author:'胡渭康',bookid:'pph', timestamp:jiangxun},

    // {youtube:'8gvWOPI1w2A',author:'葉倩文',bookid:'pph', timestamp:jiangxun},
    // {youtube:'ExnupRQlhOI',author:'齊豫',bookid:'pph', timestamp:jiangxun},
 
    
]
