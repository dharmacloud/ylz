import App from './app.svelte';
import {landscape} from './store.js'
window.addEventListener("deviceorientation", ()=>{
    landscape.set(screen.availWidth>screen.availHeight)
}, true);
landscape.set(screen.availWidth>screen.availHeight);

const app = new App({target: document.body});
document.querySelector("#bootmessage").innerHTML='';
export default app;