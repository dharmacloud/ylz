let ptk;
import { CacheName } from "./constant.js";
import { get } from "svelte/store";
import { online } from "./store.js";

export const silence={audioid:'',performer:'--停止播放--'};
export const audiofolder='/baudio/'

export const setTimestampPtk=_ptk=>{
    ptk=_ptk;
}
/*
export const mediabyid=(_vid)=>{
    if (!ptk || !_vid) return 
    const ts=ptk.columns.timestamp;
    for (let i=0;i<ts.keys.len();i++) {
        const vid=ts.keys.get(i);
        const videohost=ts.videohost[i];
        const performer=ts.performer[i];
        const timestamp=ts.timestamp[i];
        const bookid=ts.bookid[i];
        if (vid==_vid) return {videohost,vid,performer,timestamp,bookid};
    }
}
*/
export const fetchAudioList=async (alltracks,activeid,store,showyoutube=false)=>{
    let out=[];
    const cache=await caches.open(CacheName);
    const keys=await cache.keys();
    const incaches=keys.filter(it=>it.url.endsWith('.mp3')).map(it=>it.url.slice(window.location.origin.length+audiofolder.length).replace('.mp3',''))

    const tracks=alltracks[activeid]||[];
    if (!tracks.length && get(online) && activeid!='vcppkeyi'){// no tracks, assuming no timestamp yet
        const incache= 1 - !~incaches.indexOf(activeid);
        out.push({folioid:activeid,audioid:activeid,performer:'誦讀',youtube:'',incache,timestamp:[]})
    } else {
        for (let i=0;i<tracks.length;i++) {
            const audioid=tracks[i].audio;
            const folioid=activeid;
            let performer=tracks[i].title||'誦讀';
            let youtube=tracks[i].youtube||'';
            if (!showyoutube) youtube=''

            const timestamp=[];//not ready yet
            const incache= 1 - !~incaches.indexOf(audioid);
            out.push( {folioid,audioid,performer,youtube,incache,timestamp});
        }
    }
    //sort by name
    out.sort((a,b)=>   a.performer==b.performer?0: (a.performer<b.performer?-1:1))

    const cacheno=out.filter(it=>!it.incache).concat();
    out=out.filter(it=>it.incache).concat(cacheno);   
    out.unshift(silence);
    if (store) store.set(out);
    return out;
};
