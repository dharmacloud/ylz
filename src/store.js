import {updateSettings,settings} from './savestore.ts'
import {usePtk} from 'ptk'
import {get,writable } from 'svelte/store';
export const activePtk=writable('dc');
export const activebookid=writable(settings.activebookid);
export const advancemode=writable(settings.advancemode);
export const activefolio=writable(1);  //one base
export const maxfolio=writable(0);
export const isAndroid=writable(false)
export const player=writable(null)
export const youtubeid=writable('');
export const folioLines=writable(5);
export const folioChars=writable(17);
export const playing=writable(false);
export const continueplay=writable(false);
export const tapmark = writable(0);// folio*folioLines*folioChar+offset
export const remainrollback=writable(-1);//infinite

activebookid.subscribe((activebookid)=>updateSettings({activebookid}));
advancemode.subscribe((advancemode)=>updateSettings({advancemode}));

export const findByYoutube=(id,column='timestamp')=>{
    const ptk=usePtk('dc');
    if (!ptk.columns[column]) return null;
    const ts=ptk.columns[column].fieldsByKey(id);
    
    return {youtube:id,...ts};
}

export const stopVideo=()=>{
    get(player)?.stopVideo();
    playing.set(false);
    youtubeid.set('')
    remainrollback.set(-1);
}