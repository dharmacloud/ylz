import {fetchFolioText,concreateLength} from 'ptk';
import { folioChars,folioLines,activebookid ,tapmark,activefolio,loadingbook} from "./store.js";
import {get} from 'svelte/store'

export const gofolioAt=async (ptk,at)=>{
    const ck=ptk.defines.ck;
    const pb=ptk.defines.pb;
    const ckline=ck.linepos[at];
    const pbtag=ptk.nearestTag(ckline+1,'pb')-1;
    const pbid=pb.fields.id.values[pbtag];
    await gofolio(ptk,pbid,ck.fields.id.values[at]);
}
export const loadBook=(bk,func)=>{
    let timer=0;
    if (bk==get(activebookid)) func(bk);
    else {
        loadingbook.set(true);
        activebookid.set(bk);
        timer=setInterval(()=>{
            if (!get(loadingbook)) {
                clearInterval(timer);
                func(bk);
            }
        },500);
    }
}

export const gofolio=async (ptk,pbid,ck)=>{
    const newfolio=parseInt(pbid)-1;
    console.log(newfolio)
    activefolio.set(newfolio);
    if (ck) {
        [foliotext,foliofrom]=await fetchFolioText(ptk,get(activebookid),newfolio+1);
        const fc=get(folioChars);
        const fl=get(folioLines);
        for (let i=0;i<foliotext.length;i++) {
            const at2=foliotext[i].indexOf('^ck'+ck);
            if (~at2) {
                const r=(newfolio*fl*fc)+i*fc+
                    concreateLength(foliotext[i].slice(0,at2));
                tapmark.set(r);
                break;
            }
        }
    }
}