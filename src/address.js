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
    const ptk=curPtk();
    let out='';
    const [start]=ptk.rangeOfAddress(addr);
    const ck=ptk.nearestChunk(start);
    out+=ck?.caption.replace(/\d+$/g,'')||''; //remove tailing number
    return out;
}

export const paliHumanAddress=addr=>{
    const m=addr.match(/ak#([dmsa])n\.ck#([^\.]+)(.*)/);
    if (!m) return '';
    let r='';
    const section=m[2].replace(/[dmsa]/,'');
    const sutta=m[3].replace('.n','');
    if (m[1]=='d') {
        r='長部'+section+'經';
    }
    else if (m[1]=='m') {
        r='中部'+section+'經';
    }
    else if (m[1]=='s') {
        r=section+'相應'+sutta+'經';
    }
    else if (m[1]=='a') {
        r='增支'+section+'集'+sutta+'經'
    }
    return r;
}