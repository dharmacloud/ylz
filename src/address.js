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