import App from './app.svelte';
import {documentHeight} from './fullscreen.js'

const app = new App({target: document.body});
document.querySelector("#bootmessage").innerHTML='';
export default app;