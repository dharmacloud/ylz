let ptk;

export const silence={vid:'',performer:'-靜默-'};
export const audiofolder='/baudio/'
export const setTimestampPtk=_ptk=>{
    ptk=_ptk;
}
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

export const fetchAudioList=async (activeid,loading,store)=>{
    if (loading) return [];
    const ts=ptk.columns.timestamp;
    let out=[];
    if (!ptk) return out;
    const cache=await caches.open('v1::ylz');
    const keys=await cache.keys();
    const incaches=keys.map(it=>it.url.slice(window.location.origin.length+audiofolder.length).replace('.mp3',''))

    for (let i=0;i<ts.keys.len();i++) {
        const aid=ts.keys.get(i);
        const audiohost=ts.videohost[i];
        const performer=ts.performer[i];
        const timestamp=ts.timestamp[i];
        const bookid=ts.bookid[i];
        const incache= 1 - !~incaches.indexOf(aid) 
        activeid==bookid&&out.push( {aid,performer,incache,bookid,timestamp,audiohost});
    }
    //sort by name
    out.sort((a,b)=>   a.performer==b.performer?0: (a.performer<b.performer?-1:1))

    const cacheno=out.filter(it=>!it.incache).concat();
    out=out.filter(it=>it.incache).concat(cacheno);
    out.unshift(silence);
    if (store) store.set(out);
    return out;
};
