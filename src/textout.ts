import {tosim} from './store.js'
import {get} from 'svelte/store'
import {toSim} from 'lossless-simplified-chinese';

export const _=(text:string,_sim)=>{
	const sim=(typeof _sim=='undefined')?get(tosim):_sim;
	if (parseInt(sim)) return toSim(text,sim);
    return text;
}
