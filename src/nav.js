import {foliotext,activefolioid ,audioid,tapmark,folioincache,tapAddress,
    activepb,loadingbook,bookByFolio, stopAudio} from "./store.js";
import {updateUrl} from './urlhash.js'
import {get} from 'svelte/store'
import {bsearchNumber} from 'ptk/utils'
import {fetchFolioList} from './folio.js'
import {folioPosFromAddress} from 'ptk'
export const CURSORMARK='◆'
export const goPb=(pbid,ck)=>{   
    activepb.set(pbid);
    if (ck) { //mark the starting of chunk
        const ft=get(foliotext);
        const [pbid,cx,cy]=ft.toFolioPos(ck);
        tapmark.set([pbid,cx, cy]);
        updateUrl(get(tapAddress));
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
    // console.log('loading folio',folioid)
    if (folioid==get(activefolioid)) func&&func(folioid);
    else {
        stopAudio();
        audioid.set('')
        //activepb.set('1');
        loadingbook.set(true);
        activefolioid.set(folioid);
        //tapmark.set(['2',0,0]);
        timer=setInterval(()=>{
            if (!get(loadingbook)) {
                clearInterval(timer);
                setTimeout(()=>{//wait for 
                    func&&func(folioid);
                    setTimeout(()=>{
                        
                        fetchFolioList(folioincache);//update cache
                    },10);
                },10); 
            }
        },10);
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
        const folioid=folioByChunk(ptk,get(activefolioid),ckid)
        loadFolio(folioid,()=> markChunk(ckid))
    } else {
        markChunk(ckid);
    }
}

export const folioByChunk=(ptk,folioid,ckid)=>{
    const [start]=ptk.rangeOfAddress('bk#'+bookByFolio(folioid)+'.ck#'+ckid);
    const newfolioid=ptk.nearestTag(start+1,'folio','id');
    return newfolioid;
}

export const folioPosFromPtkLine=(ptk,line)=>{
    const folio=ptk.defines.folio;
    const ck=ptk.defines.ck;
    const folioat=bsearchNumber(folio.linepos,line+1)-1;
    const ckat=bsearchNumber(ck.linepos,line+1)-1;
    let folioid='',ckid='',lineoff=0;
    if (~folioat && folio.linepos[folioat+1]>line) {
        folioid=folio.fields.id.values[folioat];
        ckid=ck.fields.id.values[ckat];
        lineoff=line-ck.linepos[ckat];
    }
    return {folioid,ckid,lineoff}
}
export const goPtkLine=(ptk,line)=>{
    const {folioid,ckid,lineoff}=folioPosFromPtkLine(ptk,line);
    loadFolio(folioid,()=>{
        const foliopos=get(foliotext).toFolioPos(ckid,lineoff);
        tapmark.set(foliopos);
        activepb.set(foliopos[0]);
    })
}

export const loadAddress=async(ptk,address)=>{
    if (!address) return;
    const addr=await folioPosFromAddress(ptk,address);
    if (addr.id) {
        activefolioid.set(addr.id);
        const {pb,line,ch}=addr;
        activepb.set(pb)
        tapmark.set([pb,line,ch])
    }
}