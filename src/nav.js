import {foliotext,activefolioid ,videoid,tapmark,activepb,loadingbook, stopVideo} from "./store.js";
import {get} from 'svelte/store'

export const CURSORMARK='◆'
export const goPb=(pbid,ck)=>{   
    activepb.set(pbid);
    if (ck) { //mark the starting of chunk
        const ft=get(foliotext);
        const [pbid,cx,cy]=ft.toFolioPos(ck);
        tapmark.set([pbid,cx, cy]);
    }
}

export const goPbAt=async (ptk,at)=>{
    const ck=ptk.defines.ck;
    const pb=ptk.defines.pb;
    const ckline=ck.linepos[at];
    const pbtag=ptk.nearestTag(ckline+1,'pb')-1;
    const pbid=pb.fields.id.values[pbtag];
    goPb(pbid, ck.fields.id.values[at]);
}
export const loadFolio=(folioid,func)=>{
    let timer=0;
    if (folioid==get(activefolioid)) func&&func(folioid);
    else {
        stopVideo();
        videoid.set('')
        activepb.set('1');
        loadingbook.set(true);
        activefolioid.set(folioid);
        tapmark.set(['1',0,0]);
        timer=setInterval(()=>{
            if (!get(loadingbook)) {
                clearInterval(timer);
                setTimeout(()=>{//wait for 
                    func&&func(folioid);
                },200);
            }
        },300);
    }
}




export const allJuan=(ptk,folioid)=>{
    folioid=folioid||get(activefolioid);
    const arrfolioid=ptk.defines.folio.fields.id.values;
    const m=folioid.match(/([a-z]+)(\d+$)/);
    const juans=[]
    if (!m) return [];
    for (let i=0;i<arrfolioid.length;i++) {
        if (arrfolioid[i].startsWith(m[1])) {
            const j=arrfolioid[i].slice( m[1].length);
            if (parseInt(j)) juans.push(j);
        }
    }
    return juans;
}

const markChunk=ckid=>{
    const fpos=get(foliotext).toFolioPos(ckid);
    activepb.set(fpos[0]);
    tapmark.set(fpos)
}
export const goChunk=(ptk,bkid,ckid,direction=0)=>{
    const ft=get(foliotext);

    if (direction!==0) {
        const ck=ptk.defines.ck;
        const [bkstart,bkend]=ptk.rangeOfAddress('bk#'+bkid);
        const [start,end]=ptk.rangeOfAddress('bk#'+bkid+'.ck#'+ckid);
        const newck=ptk.nearestChunk(start+1)
        
        const newat=newck.at+direction;
        const linepos=ck.linepos[newat];
        if (linepos<bkend && linepos>=bkstart) {
            ckid=ck.fields.id.values[newat];
        }
    }

    const at=ft.chunks.indexOf(ckid);
    if (at==-1) {
        const folioid=folioByChunk(ckid);
        loadFolio(folioid,()=> markChunk(ckid))
    } else {
        markChunk(ckid);
    }
}
