export const silence={vid:'',performer:'-靜默-'};
let ptk;
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

export const getAudioList=(activeid,loading)=>{
    if (loading) return [];
    const ts=ptk.columns.timestamp;
    const out=[silence];
    if (!ptk) return out;
    for (let i=0;i<ts.keys.len();i++) {
        const vid=ts.keys.get(i);
        const videohost=ts.videohost[i];
        const performer=ts.performer[i];
        const timestamp=ts.timestamp[i];
        const bookid=ts.bookid[i];
        activeid==bookid&&out.push( {vid,performer,bookid,timestamp,videohost});
    }
    out.sort((a,b)=>a.performer==b.performer?0: (a.performer<b.performer?-1:1))
    return out;
};
