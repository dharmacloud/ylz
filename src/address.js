import {parseAction} from 'ptk'
import {curPtk} from './store.js'
export const makeAddressFromLine=(line,_ptk)=>{
    const ptk=_ptk||  curPtk();
    const bk=ptk.nearestTag(line+1,'bk','id');
    const ck=ptk.nearestTag(line+1,'ck','id');
    const n=ptk.nearestTag(line+1,'n','id');
    if (typeof bk=='undefined' || typeof ck=='undefined' ||typeof n=='undefined') return '';
    const addr= 'bk#'+bk+'.ck#'+ck+'.n'+n;
    const [start]=ptk.rangeOfAddress(addr);
    return (line-start>0)?addr+':'+(line-start):addr;
}

export const humanAddress=addr=>{
    const act=parseAction(addr);
    let out='',isNikaya=false;
    for (let i=0;i<act.length;i++) {
        const [tagname,v]=act[i];
        if (tagname=='bk') {
            // if (v=='agms') out+='';
            if (v=='agmm') out+='中';
            else if (v=='agmss') out+='別';
            else if (v=='agmd') out+='長';
            else if (v=='agmu') out+='增';
            
        } else if (tagname=='ak') {
            if (v=='mn') out+='中部';
            else if (v=='dn') out+='長部';
            else if (v=='an') out+='增支';
            else if (v=='sn') out+='相應';
            isNikaya=!!v.match(/[dmsa]n/);
        } else if (tagname=='ck') {
            if (isNikaya) {
                if (out=='相應') {
                    out=v.slice(1)+out;
                } else if (out=='增支') {
                    out+=v.slice(1)+'集';
                } else {
                    out+=v.slice(1)+'經';
                }
            } else {
                const ptk=curPtk();
                const [start]=ptk.rangeOfAddress(addr);
                const ck=ptk.nearestChunk(start);
                out+=ck?.caption.replace(/\d+$/g,'')||''; //remove tailing number
            }
        } else if (tagname=='n') {
            out+=v+'經';
        }
    }
    return out+" ";
}