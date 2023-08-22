import {landscape,heightratio} from './store.js'
import {get} from 'svelte/store'
let portrait = window.matchMedia("(orientation: portrait)");
portrait.addEventListener("change", function(e) {
    // console.log(e.matches)
    landscape.set(!e.matches)
})

window.addEventListener("deviceorientation", ()=>{
    landscape.set(screen.availWidth>screen.availHeight)
}, true);
landscape.set(screen.availWidth>screen.availHeight);


export const documentHeight = () => {
    const doc = document.documentElement
    const h=window.innerHeight*get(heightratio);
    doc.style.setProperty('--doc-height', `${h}px`)
}
window.addEventListener('resize', documentHeight)
