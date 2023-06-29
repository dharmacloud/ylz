import {updateSettings,settings} from './savestore.ts'
import {usePtk} from 'ptk'
import {writable } from 'svelte/store';
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

activebookid.subscribe((activebookid)=>updateSettings({activebookid}));
advancemode.subscribe((advancemode)=>updateSettings({advancemode}));

export const findByYoutube=(id)=>{
    const ptk=usePtk('dc');
    const ts=ptk.columns.timestamp.fieldsByKey(id);
    
    return {youtube:id,...ts};
}