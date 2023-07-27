import {foliotext,activefolioid ,videoid,tapmark,activepb,loadingbook, stopVideo,bookByFolio} from "./store.js";
import {get} from 'svelte/store'

export const goPbAt=async (ptk,at)=>{
    const ck=ptk.defines.ck;
    const pb=ptk.defines.pb;
    const ckline=ck.linepos[at];
    const pbtag=ptk.nearestTag(ckline+1,'pb')-1;
    const pbid=pb.fields.id.values[pbtag];
    goPb(pbid,ck.fields.id.values[at]);
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


export const goPb=(pbid,ck)=>{   
    activepb.set(pbid);
    if (ck) { //mark the starting of chunk
        //console.log('gopb',ck)
        const foliopage=get(foliotext).folioPageText(pbid);
        for (let i=0;i<foliopage.length;i++) {
            const at2=foliopage[i].indexOf('^ck'+ck);
            if (~at2) {
                tapmark.set([pbid,i, 0]);
                break;
            }
        }
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

export const makeAddressFromFolioPos=(pbid,cx=0,cy=0)=>{
    const [ck,lineoff]=get(foliotext).fromFolioPos(pbid,cx,cy);

    const address= 'bk#'+bookByFolio(get(activefolioid)) + '.ck#'+ck+(lineoff?':'+lineoff:'') ;
    return address;
}