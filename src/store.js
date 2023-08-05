import {updateSettings,settings} from './savestore.ts'
import {bsearchNumber, usePtk,makeAddress} from 'ptk'
import {derived, get,writable } from 'svelte/store';
import {silence} from './mediaurls.js'

export const thezip=writable(null)
export const activePtk=writable('dc');
export const loadingbook=writable(false);
export const autodict=writable(settings.autodict);
export const activepb=writable('1');  
export const activefolioid=writable(settings.activefolioid);
export const maxfolio=writable(0);
export const favorites=writable(settings.favorites);
export const preferaudio=writable(settings.preferaudio);
export const showpunc=writable(settings.showpunc);
export const showsponsor=writable(settings.showsponsor);
export const landscape=writable(false)
export const isAndroid=writable(false)
export const searchable=writable('')
export const leftmode=writable('folio');
export const foliotext=writable({});
export const tofind=writable('');
export const lefttextline=writable(0);//ptk line to be shown in vtext
export let player
export const setplayer=p=>player=p;
// export const foliorawtexts=writable([]);
// export const foliostartfrom=writable(0)

export const mediaurls=writable([silence]);

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
    const ptk=usePtk('dc');
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
export const tapmark = writable(['1',0,0]);// folio*folioLines*folioChar+offset
export const remainrollback=writable(-1);//infinite

export const newbie=writable(settings.newbie);
export const idlecount=writable(0);
export const showpaiji=writable(false);

activefolioid.subscribe((activefolioid)=>updateSettings({activefolioid}));
autodict.subscribe((autodict)=>updateSettings({autodict}));
newbie.subscribe((newbie)=>updateSettings({newbie}));
showpunc.subscribe((showpunc)=>updateSettings({showpunc}));
favorites.subscribe((favorites)=>updateSettings({favorites}));
preferaudio.subscribe((preferaudio)=>updateSettings({preferaudio}));

export const findByAudioId=(id,column='timestamp')=>{
    const ptk=usePtk('dc');
    if (!ptk.columns[column]) return null;
    const ts=ptk.columns[column].fieldsByKey(id);
    return {id,...ts};
}

export const stopAudio=()=>{
    player?.pause();
    playing.set(false);
    remainrollback.set(-1);
}

export const booknameOf=folioid=>{
    const bkid=bookByFolio(folioid)
    const ptk=usePtk('dc');//assuming sanskrit text always has chinese correspond
    const bk=ptk.defines.bk;
    const at=bk.fields.id.values.indexOf(bkid);
    return bk.innertext.get(at);
}

export const idletime=30;

export const hasVariorum=(ptk,bkid)=>{
    const at=bkid.indexOf('_')
    if (~at) bkid=bkid.slice(0,at);
    return ~ptk.defines.bk.fields.id.values.indexOf(bkid+'_variorum');
}
export const hasSanskrit=bkid=>{
    const ptk=usePtk('dc_sanskrit');
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
export const tapAddress=derived(tapmark,(mark)=> makeAddressFromFolioPos(mark));
export const tapChunkLine=derived(tapmark,(mark)=> {
    const ft=get(foliotext);
    if (!ft||!ft.fromFolioPos) return {};
    return ft.fromFolioPos(mark);
});

export const parallelFolios=(ptk,folioid)=>{
    folioid=folioid||get(activefolioid);
    const folio=ptk.defines.folio;
    const at=folioid.indexOf('_');
    const prefix=~at?folioid.slice(0,at ):folioid;
    const out=[],idarr=folio.fields.id.values;
    for (let i=0;i<idarr.length;i++) {
        if (~idarr[i].indexOf('_variorum')) continue;
        if (idarr[i].startsWith(prefix+'_') && idarr[i]!==folioid) {
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
        _swiper?.update();
    },100)
    return style;
}

export const paijitexts=[
    '中部全國供佛齋僧大會',
    '施主※陳碧吟',
    '施主※甯耀南',
]


export const favortypes=['♡','🤍','❤️', '💚', '💙','💜','🖤'];