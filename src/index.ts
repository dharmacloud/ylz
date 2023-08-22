import App from './app.svelte';
import {documentHeight} from './fullscreen.js'
documentHeight()
const app = new App({target: document.body});
document.querySelector("#bootmessage").innerHTML='';
export default app;