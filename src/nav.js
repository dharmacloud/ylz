import {foliotext,activefolioid ,audioid,tapmark,folioincache,tapAddress,
    activepb,loadingfolio,bookByFolio, stopAudio,loadingzip,activePtk} from "./store.js";
import {get} from 'svelte/store'
import {fetchFolioList,getAllFolio} from './folio.js'
import {folioPosFromAddress,updateUrl,poolGetAll,usePtk,bsearchNumber,FolioText} from 'ptk'
export const CURSORMARK='◆'
export const goPb=(pbid,ck)=>{   
    activepb.set(pbid);
    if (ck) { //mark the starting of chunk
        const ft=get(foliotext);
        const [pbid,cx,cy]=ft.toFolioPos(ck);
        tapmark.set([pbid,cx, cy]);
        updateUrl(tapAddress());
    }
}

export const goPbAt=async (ptk,at)=>{
    const ck=ptk.defines.ck;
    const pb=ptk.defines.pb;
    const ckline=ck.linepos[at];
    const pbtag=ptk.nearestTag(ckline+1,'pb');
    const pbid=pb.fields.id.values[pbtag];
    goPb(pbid, ck.fields.id.values[at]);
}
export const loadFolio=(folioid,func)=>{
    let timer=0;
    if (folioid==get(activefolioid)) func&&func(folioid);
    else {
        stopAudio();
        audioid.set('')
        loadingfolio.set(true);
        activefolioid.set(folioid)
        timer=setInterval(()=>{
            if (!get(loadingzip)) {
                clearInterval(timer);
                setTimeout(()=>{//wait for 
                    loadingfolio.set(false);
                    updateUrl(tapAddress());
                    func&&func(folioid);
                    setTimeout(()=>{
                        fetchFolioList(folioincache);//update cache
                    },100);
                },100); 
            }
        },100);
    }
}



export const allJuan=(ptk,folioid)=>{
    folioid=folioid||get(activefolioid);
    const m=folioid.match(/([a-z\_]+)(\d+$)/);
    if (!m) return [];
    const folios=getAllFolio(ptk,folioid);
    const juans=[];
    for (let i=0;i<folios.length;i++) {
        if (folios[i].startsWith(m[1])) {
            const j=folios[i].slice( m[1].length);

            if (parseInt(j)) juans.push(j);
        }
    }
    return juans;
}

export const loadJuan=(ptk,folioid,loading)=>{
    if (!ptk || loading) return [];
    const m=folioid.match(/([a-z_]+)(\d+$)/);
    if (!m) return [];
    const juans=allJuan(ptk,folioid).map((it,idx)=>{
        return {caption:parseInt(it), idx:parseInt(idx), id:(idx+1).toString() }
    });
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
export const goPtkLine=(ptk,line,choff=0)=>{
    const {folioid,ckid,lineoff}=folioPosFromPtkLine(ptk,line);
    loadFolio(folioid,()=>{
        const foliopos=get(foliotext).toFolioPos(ckid,lineoff,choff);
        tapmark.set(foliopos);
        activepb.set(foliopos[0]);
    })
}

export const loadAddress=async(address)=>{
    if (!address) return;
    const allptks=poolGetAll();
    let addr={};
    for (let i=0;i<allptks.length;i++) {
        const ptk=allptks[i]
        if (!ptk || !ptk.defines.folio) continue;
        addr=await folioPosFromAddress(ptk,address);
        if (addr.id) {
            if (!get(foliotext)) { //initial load, foliotext is not ready, redo folioPosFromAddress
                const ftext=new FolioText(ptk);//fetchFolioText(ptk,$activefolioid);
                await ftext.load(addr.id)
                foliotext.set(ftext);
                addr=await folioPosFromAddress(ptk,address);
            }
            if (get(activePtk)!==ptk.name) {
                activePtk.set(ptk.name);
            }
            break;
        }
    }
    
    if (addr.id) {
        activefolioid.set(addr.id);
        const {pb,line,ch}=addr;
        activepb.set(pb)
        tapmark.set([pb,line,ch])
    }
}

export const getPrevJuan=folioid=>{
    const m=folioid.match(/(\d+)$/);
    if (!m) return;
    const juan=parseInt(m[1]);
    if (m && juan>1) {
        const prevjuan=folioid.slice(0,folioid.length-m[1].length)+ parseInt(juan-1);
        return prevjuan;
    }
}

export const getNextJuan=(folioid,ptk)=>{
    const maxjuan=allJuan(ptk,folioid).length;
    const m=folioid.match(/(\d+)$/);
    if (!m) return;
    const juan=parseInt(m[1]);
    if (juan<maxjuan) {
        return folioid.slice(0,folioid.length-m[1].length)+ parseInt(juan+1);
    }
}