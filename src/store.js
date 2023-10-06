import {updateSettings,settings} from './savestore.ts'
import {bsearchNumber, usePtk,makeAddress} from 'ptk'
import { get,writable } from 'svelte/store';
import {silence} from './mediaurls.js'

export const online=writable(navigator.onLine);
export const thezip=writable(null)
export const activePtk=writable('ylz-prjn');
export const folioincache=writable({});
export const loadingfolio=writable(false);  //loadFolio done
export const loadingzip=writable(false);  //load the folio zip
export const autodict=writable(settings.autodict);
export const activepb=writable('1');  
export const activefolioid=writable(settings.activefolioid);
export const maxfolio=writable(0);
export const downloading=writable(0)
export const sharing=writable(false);
export const favorites=writable(settings.favorites);
export const preferaudio=writable(settings.preferaudio);
export const showpunc=writable(settings.showpunc);
export const showsponsor=writable(settings.showsponsor);
export const showyoutube=writable(settings.showyoutube)
export const landscape=writable(false)
export const isAndroid=writable(false)
export const searchable=writable('')
export const leftmode=writable('folio');
export const foliotext=writable(null);
export const tofind=writable('');
export const tofindhistory=writable(settings.tofindhistory);
export const heightratio=writable(settings.heightratio);
export const textsize=writable(settings.textsize);
export const vip=writable(settings.vip);
export const tosim=writable(settings.tosim);
export const palitrans=writable(0)
export const hasupdate=writable(true)
export const playrate=writable(settings.playrate);
export let player
export const setplayer=p=>player=p;
// export const foliorawtexts=writable([]);
// export const foliostartfrom=writable(0)

export const mediaurls=writable([silence]);
export const notificationmessage=writable('');
export const bookByFolio=(fid,ptk)=>{
    if (ptk) {
        const folio=dc.defines.folio;
        const bk=dc.defines.bk;
        const at=folio.fields.id.values.indexOf(fid);
        if (!~at) return '';
        const line=folio.linepos[at]+1;
        const at2=bsearchNumber(bk.linepos, line)-1;//closest bk
        return bk.fields.id.values[at2];   
    } else {
        return fid.replace(/\d+$/,'')
    }
}
export const audioid=writable('');

export const folioLines=function(_fid){
    const ptk=usePtk(get(activePtk));
    const fid=_fid||get(activefolioid);
    const at=ptk.defines.folio.fields.id?.values.indexOf(fid);
    if (~at) {
        return ptk.defines.folio.fields.lines.values[at]||5;
    }
    return 5;
}

export const folioChars=writable(17);

export const playing=writable(false);
export const continueplay=writable(false);
export const playnextjuan=writable(settings.playnextjuan);//自動播放下一卷
export const tapmark = writable(['2',0,0]);// folio*folioLines*folioChar+offset
export const remainrollback=writable(-1);//infinite

export const newbie=writable(settings.newbie);
export const idlecount=writable(0);
export const showpaiji=writable(false);
export const ptks=['ylz-prjn','ylz-tg','ylz_sanskrit','dc'];
export const allptks=['ylz-prjn','ylz-tg','ylz-svk','ylz-vny','ylz_sanskrit','dc'];

activefolioid.subscribe((activefolioid)=>updateSettings({activefolioid}));
autodict.subscribe((autodict)=>updateSettings({autodict}));
newbie.subscribe((newbie)=>updateSettings({newbie}));
showpunc.subscribe((showpunc)=>updateSettings({showpunc}));
showsponsor.subscribe((showsponsor)=>updateSettings({showsponsor}));
showyoutube.subscribe((showyoutube)=>updateSettings({showyoutube}));
favorites.subscribe((favorites)=>updateSettings({favorites}));
playrate.subscribe((playrate)=>updateSettings({playrate}));
preferaudio.subscribe((preferaudio)=>updateSettings({preferaudio}));
tofindhistory.subscribe((tofindhistory)=>updateSettings({tofindhistory}));
heightratio.subscribe((heightratio)=>updateSettings({heightratio}));
tosim.subscribe((tosim)=>updateSettings({tosim}));
textsize.subscribe((textsize)=>{
    const tsz=(textsize/100).toFixed(2)+'em'
    document.documentElement.style.setProperty('--textsize',tsz);
    updateSettings({textsize})
});
vip.subscribe((vip)=>updateSettings({vip}));
export const findByAudioId=(id,column='timestamp')=>{
    const ptk=usePtk('dc');
    if (!ptk.columns[column]) return null;
    const ts=ptk.columns[column].fieldsByKey(id);
    return {id,...ts};
}

export const stopAudio=()=>{
    if (player&&player.paused) player?.pause();
    playing.set(false);
    remainrollback.set(-1);
}

export const booknameOf=folioid=>{
    const bkid=bookByFolio(folioid);
    const ptks=allptks.filter(it=>it.startsWith("ylz-"));
    for (let i=0;i<ptks.length;i++) {
        let ptk=usePtk(ptks[i]);
        if (!ptk) continue;
        let at=ptk.defines.bk.fields.id.values.indexOf(bkid);
        if (~at) return bk.innertext.get(at);
    }
    return '';
}

export const idletime=30;

export const hasVariorum=(bkid)=>{
    const ptk=usePtk('ylz_sanskrit');
    const at=bkid.indexOf('_')
    if (~at) bkid=bkid.slice(0,at);
    return ~ptk.defines.bk.fields.id.values.indexOf(bkid+'_variorum');
}
export const hasSanskrit=bkid=>{
    const ptk=usePtk('ylz_sanskrit');
    const at=bkid.indexOf('_')
    if (~at) bkid=bkid.slice(0,at);
    const at2=ptk.defines.bk.fields.id.values.indexOf(bkid);
    return ~at2;
}
export const hasTranslation=(ptk,bkid)=>{
    const books=ptk.getParallelBook(bkid);
    return books.length
}

export const makeAddressFromFolioPos=(pbid,cx=0,cy=0)=>{
    if (typeof pbid!=='string') {
        cx=pbid[1];
        cy=pbid[2];
        pbid=pbid[0];
    }
    const ft=get(foliotext);
    if (!ft||!ft.fromFolioPos) return '';
    const {ckid,lineoff,choff}=ft.fromFolioPos(pbid,cx,cy);

    const address=makeAddress('','bk#'+bookByFolio(get(activefolioid)) + '.ck#'+ckid, 0,0, lineoff,choff) ;
    return address;
}
export const tapAddress=()=>makeAddressFromFolioPos(get(tapmark));

export const parallelFolios=(ptk,folioid)=>{
    folioid=folioid||get(activefolioid);
    const folio=ptk.defines.folio;
    const at=folioid.indexOf('_');
    const prefix=(~at?folioid.slice(0,at ):folioid).replace(/1$/,'');//only accept juan 1
    const out=[],idarr=folio.fields.id.values;
    for (let i=0;i<idarr.length;i++) {        
        if (~idarr[i].indexOf('_variorum')) continue;
        if (idarr[i].startsWith(prefix+'_') && idarr[i]!==folioid
        && !idarr[i].replace(/1$/,'').match(/\d$/) ) { //only accept juan 1
            out.push(i)
        }
    }
    return out;
}

export const selectmedia=(aid,restart)=>{
    if (get(remainrollback)==0) remainrollback.set(-1);
    if (!aid) stopAudio();
    else {
        const prefer=get(preferaudio)
        prefer[get(activefolioid)]=aid;
        preferaudio.set(Object.assign({},prefer));
        playing.set(true);        
    }
    audioid.set(aid||'');
    if (restart) activepb.set('1');
    setTimeout(()=>{
        player.play();
    },100)

}

export const sideWidth=()=>{
    const w=(window.innerHeight *0.45);//  folio image W720 /H1600 = 0.45
    const r=((w*100/window.innerWidth)).toFixed(2);
    return 'left:'+r+'vw;width:'+(100-r)+'vw';
}
export const folioHolderWidth=(ls,ratio=1,_swiper)=>{
    let style='100vw'
    ratio=ratio||1;
    if (get(landscape)) {
        const w=(window.innerHeight *0.45 * ratio);
        const r=(w*100/window.innerWidth).toFixed(2);
        style=r+'vw';
    }
    if (_swiper&&_swiper?.update) setTimeout(()=>{
        _swiper?.update&&_swiper?.update();
    },100)
    return style;
}

export const paijitexts=[
    '施主※陳碧吟',
    '施主※甯耀南',
    '施主※葉雅柏',
    '施主※李玉媚',
]
export const isSidePaiji=()=>{
    const m=sideWidth().match(/width:(\d+)/);
    const sidepaiji=m&&m[1]&&parseInt(m[1])>20;
    return sidepaiji;    
}

export const favortypes=['♡','🤍','❤️', '💚', '💙','💜','🖤'];


export const shareAddress=(addr)=>{
    if (!addr) addr= makeAddressFromFolioPos(get(tapmark));
    return location.origin+location.pathname+'#'+addr;
}

export const addTofind=tf=>{
    tf=tf.trim().slice(0,20);
    if (!tf) return;
    let arr=get(tofindhistory);
    if (arr[0]==tf) return;
    arr=removeTofind(tf);
    arr.unshift(tf);
    while (arr.length>10) arr.pop();
    tofindhistory.set(arr.slice(0,arr.length));
}

export const removeTofind=tf=>{
    const arr=get(tofindhistory);
    const at=arr.indexOf(tf);
    if (~at) {
        arr.splice(at,1);
        tofindhistory.set(arr.slice(0,arr.length));
    }
    return arr;
}
