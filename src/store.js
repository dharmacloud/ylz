import {updateSettings,settings} from './savestore.ts'
import {usePtk} from 'ptk'
import {get,writable,derived } from 'svelte/store';
import {silence,mediabyid} from './mediaurls.js'
export const nanzangbooks=['sdpdrk1','sdpdrk2','sdpdrk3','sdpdrk4','sdpdrk5','sdpdrk6','sdpdrk7'];
export const vlinesOfBook=(bkid)=>~nanzangbooks.indexOf(bkid)?6:5;

export const activePtk=writable('dc');
export const activebookid=writable(settings.activebookid);
export const loadingbook=writable(false);
export const advancemode=writable(settings.advancemode);
export const activefolio=writable(1);  //one base
export const maxfolio=writable(0);
export const favorites=writable(settings.favorites);

export const isAndroid=writable(false)

export const mediaurls=writable([silence]);
export const ytplayer=writable(null)
export const qqplayer=writable(null)
export const player=function(vid){
    return mediabyid(vid||get(videoid))?.videohost=='youtube'?get(ytplayer):get(qqplayer);
}
// export const player=derived( videoid, v=>);


export const videoid=writable('');
export const folioLines=derived( activebookid,bid=>vlinesOfBook(bid));

export const folioChars=writable(17);

export const playing=writable(false);
export const continueplay=writable(false);
export const tapmark = writable(0);// folio*folioLines*folioChar+offset
export const remainrollback=writable(-1);//infinite

export const newbie=writable(settings.newbie);
export const idlecount=writable(0);
export const showpaiji=writable(false);


activebookid.subscribe((activebookid)=>updateSettings({activebookid}));
advancemode.subscribe((advancemode)=>updateSettings({advancemode}));
newbie.subscribe((newbie)=>updateSettings({newbie}));
favorites.subscribe((favorites)=>updateSettings({favorites}));

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

export const booknameOf=bkid=>{
    const ptk=usePtk('dc');//assuming sanskrit text always has chinese correspond
    const bk=ptk.defines.bk;
    const at=bk.fields.id.values.indexOf(bkid);
    return bk.innertext.get(at);
}

export const idletime=60;

