import {CacheName} from './constant.js'
const url2folioid=(url)=>url.slice(url.indexOf('folio/')+6).replace('.zip','');
import { bookByFolio } from './store.js';
import { bsearchNumber } from 'ptk';
export const fetchFolioList=async (store)=>{
    const cache=await caches.open(CacheName);
    const keys=await cache.keys();
    const out=keys.filter(it=>it.url.endsWith('.zip') && ~it.url.indexOf('folio/')).map(
        it=>url2folioid(it.url)
    );
    
    if (store) {
        const cached={};    
        for (let i=0;i<out.length;i++) {
            cached[out[i]]=true;
        }
        store.set(cached);
    } else {
        return out;
    }
};


export const ptkInCache=async() =>{
    const cache=await caches.open(CacheName);
    const keys=await cache.keys();
    const out=keys.filter(it=>~it.url.indexOf('.ptk')).map(it=>it.url.match(/([a-z\-_]+)\.ptk/)[1]);
    return out;
}

export const getTocItems=(ptk,folioid,loading)=>{
    if (loading) return [];
    const out=[];
    const bk=bookByFolio(folioid);
    const bookaddr='bk#'+bk;
    const [from,to]=ptk.rangeOfAddress(bookaddr);
    
    const ck=ptk.defines.ck;
    const at=bsearchNumber (ck.linepos, from);
    const at2=bsearchNumber (ck.linepos, to);
    for (let i=at;i<at2;i++) {
        out.push({caption:ck.innertext.get(i),at:i,id:ck.fields.id.values[i]});
    }
    return out;
}

export const getAllFolio=(ptk,folioid)=>{
    const out=[];
    const bk=bookByFolio(folioid);
    const bookaddr='bk#'+bk;
    const [from,to]=ptk.rangeOfAddress(bookaddr);
    
    const folio=ptk.defines.folio;
    const at=bsearchNumber (folio.linepos, from);
    const at2=bsearchNumber (folio.linepos, to);
    for (let i=at;i<at2;i++) {
        out.push(folio.fields.id.values[i]);
    }
    return out; 
}