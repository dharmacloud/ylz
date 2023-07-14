import {fetchFolioText,concreateLength} from 'ptk';
import { folioChars,folioLines,activefolioid ,tapmark,activepb,loadingbook} from "./store.js";
import {get} from 'svelte/store'

export const goPbAt=async (ptk,at)=>{
    const ck=ptk.defines.ck;
    const pb=ptk.defines.pb;
    const ckline=ck.linepos[at];
    const pbtag=ptk.nearestTag(ckline+1,'pb')-1;
    const pbid=pb.fields.id.values[pbtag];
    await goPb(ptk,pbid,ck.fields.id.values[at]);
}
export const loadFolio=(folioid,func)=>{
    let timer=0;
    if (folioid==get(activefolioid)) func&&func(folioid);
    else {
        loadingbook.set(true);
        activefolioid.set(folioid);
        timer=setInterval(()=>{
            if (!get(loadingbook)) {
                clearInterval(timer);
                setTimeout(()=>{//wait for 
                    func&&func(folioid);
                },300);
            }
        },500);
    }
}

export const goPb=async (ptk,pbid,ck)=>{
    const newpb=parseInt(pbid)-1;
    activepb.set(newpb);
    if (ck) { //mark the starting of chunk
        console.log('gopb',ck)
        const [foliotext]=await fetchFolioText(ptk,get(activefolioid),newpb+1);
        const fc=get(folioChars);
        const fl=folioLines();
        for (let i=0;i<foliotext.length;i++) {
            const at2=foliotext[i].indexOf('^ck'+ck);
            if (~at2) {
                const r=(newpb*fl*fc)+i*fc+
                    concreateLength(foliotext[i].slice(0,at2));
                tapmark.set(r);
                break;
            }
        }
    }
}