import {updateSettings,settings} from './savestore.ts'
import {bsearchNumber, usePtk} from 'ptk'
import {get,writable } from 'svelte/store';
import {silence,mediabyid} from './mediaurls.js'

export const activePtk=writable('dc');

export const loadingbook=writable(false);
export const advancemode=writable(settings.advancemode);
export const activepb=writable(1);  //zero base
export const activefolioid=writable(settings.activefolioid);
export const maxfolio=writable(0);
export const favorites=writable(settings.favorites);
export const prefervideo=writable(settings.prefervideo);
export const showpunc=writable(settings.showpunc);

export const isAndroid=writable(false)

export const mediaurls=writable([silence]);
export const ytplayer=writable(null)
export const qqplayer=writable(null)
export const player=function(vid){
    return mediabyid(vid||get(videoid))?.videohost=='youtube'?get(ytplayer):get(qqplayer);
}
export const bookByFolio=(fid)=>{
    const dc=usePtk('dc');
    const folio=dc.defines.folio;
    const bk=dc.defines.bk;
    const at=folio.fields.id.values.indexOf(fid);
    if (!~at) return '';
    const line=folio.linepos[at]+1;
    const at2=bsearchNumber(bk.linepos, line)-1;//closest bk
    return bk.fields.id.values[at2];
}
export const videoid=writable('');
export const folioLines=function(_fid){
    const ptk=usePtk('dc');
    const fid=_fid||get(activefolioid);
    const at=ptk.defines.folio.fields.id?.values.indexOf(fid);
    if (~at) {
        return ptk.defines.folio.fields.lines.values[at]||5;
    }
    return 5;
}

export const folioChars=writable(17);

export const playing=writable(false);
export const continueplay=writable(false);
export const playnextjuan=writable(settings.playnextjuan);//自動播放下一卷
export const tapmark = writable(0);// folio*folioLines*folioChar+offset
export const remainrollback=writable(-1);//infinite

export const newbie=writable(settings.newbie);
export const idlecount=writable(0);
export const showpaiji=writable(false);


activefolioid.subscribe((activefolioid)=>updateSettings({activefolioid}));
advancemode.subscribe((advancemode)=>updateSettings({advancemode}));
newbie.subscribe((newbie)=>updateSettings({newbie}));
showpunc.subscribe((showpunc)=>updateSettings({showpunc}));
favorites.subscribe((favorites)=>updateSettings({favorites}));
prefervideo.subscribe((prefervideo)=>updateSettings({prefervideo}));

export const findByVideoId=(id,column='timestamp')=>{
    const ptk=usePtk('dc');
    if (!ptk.columns[column]) return null;
    const ts=ptk.columns[column].fieldsByKey(id);
    return {id,...ts};
}

export const stopVideo=()=>{
    pauseVideo();
    playing.set(false);
    remainrollback.set(-1);
}
export const pauseVideo=()=>{
   
    get(qqplayer)?.pause&&get(qqplayer).pause();
    get(ytplayer)?.stopVideo&&get(ytplayer).stopVideo();
}

export const booknameOf=folioid=>{
    const bkid=bookByFolio(folioid)
    const ptk=usePtk('dc');//assuming sanskrit text always has chinese correspond
    const bk=ptk.defines.bk;
    const at=bk.fields.id.values.indexOf(bkid);
    return bk.innertext.get(at);
}

export const idletime=60;

export const hasVariorum=bkid=>{
    const ptk=usePtk('dc');
    const at=bkid.indexOf('_')
    if (~at) bkid=bkid.slice(0,at);
    return ~ptk.defines.bk.fields.id.values.indexOf(bkid+'_variorum');
}
export const hasSanskrit=bkid=>{
    const ptk=usePtk('dc_sanskrit');
    const at=bkid.indexOf('_')
    if (~at) bkid=bkid.slice(0,at);
    const at2=ptk.defines.bk.fields.id.values.indexOf(bkid);
    return ~at2;
}

export const parallelFolios=(folioid)=>{
    const ptk=usePtk('dc');
    folioid=folioid||get(activefolioid);
    const folio=ptk.defines.folio;
    const at=folioid.indexOf('_');
    const prefix=~at?folioid.slice(0,at ):folioid;
    const out=[],idarr=folio.fields.id.values;
    for (let i=0;i<idarr.length;i++) {
        if (~idarr[i].indexOf('_variorum')) continue;
        if (idarr[i].startsWith(prefix+'_') && idarr[i]!==folioid) {
            out.push(i)
        }
    }
    return out;
}

export const selectmedia=(vid,restart)=>{
    if (get(remainrollback)==0) remainrollback.set(-1);
    if (!vid) stopVideo();
    else {
        const prefer=get(prefervideo)
        prefer[get(activefolioid)]=vid;
        prefervideo.set(Object.assign({},prefer));
    }
    videoid.set(vid||'');
    if (restart) activepb.set(0);
}