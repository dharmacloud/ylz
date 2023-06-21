import {writable } from 'svelte/store';
export const activePtk=writable('dc');
export const activebookid=writable('vcpp_kumarajiva');
export const activefolio=writable(1);  //one base
export const maxfolio=writable(0);
export const isAndroid=writable(false)
export const player=writable(null)
export const mediaid=writable(0);
export const folioLines=writable(5);
export const folioChars=writable(17);
export const playing=writable(false);
export const continueplay=writable(false);