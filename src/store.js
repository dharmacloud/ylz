import {writable } from 'svelte/store';


export const activePtk=writable('dc');
export const activebookid=writable('vcpp_kumarajiva');
export const activefolio=writable(1);  //one base
export const autoplay=writable(0);
export const maxfolio=writable(0);
export const isAndroid=writable(false)