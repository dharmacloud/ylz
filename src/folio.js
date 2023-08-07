import {Cachesname} from './constant.js'
const url2folioid=(url)=>url.slice(url.indexOf('folio/')+6).replace('.zip','');

export const fetchFolioList=async (store)=>{
    const cache=await caches.open(Cachesname);
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
