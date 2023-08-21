export const AppPrefix='YLZ.'
export const loadSettings=()=>{
    const activefolioid=localStorage.getItem(AppPrefix+'activefolioid')||'pphs';  
    const autodict=localStorage.getItem(AppPrefix+'autodict')||'off';  
    const newbie=localStorage.getItem(AppPrefix+'newbie')||'on';  
    const playnextjuan=localStorage.getItem(AppPrefix+'playnextjuan')||'on';  
    const showpunc=localStorage.getItem(AppPrefix+'showpunc')||'on';  
    const showsponsor=localStorage.getItem(AppPrefix+'showsponsor')||'off';  
    const showyoutube=localStorage.getItem(AppPrefix+'showyoutube')||'off';  
    let _favorites=localStorage.getItem(AppPrefix+'favorites')||'{}';
    let _preferaudio=localStorage.getItem(AppPrefix+'preferaudio')||'{}';
    let _tofindhistory=localStorage.getItem(AppPrefix+'tofindhistory')||'[]';
    
    let favorites={},preferaudio={},tofindhistory=[];
    try {
        favorites=JSON.parse(_favorites);
        preferaudio=JSON.parse(_preferaudio);
        tofindhistory=JSON.parse(_tofindhistory);
    } catch (e){
        console.log(e);
        favorites={};
        preferaudio={}
    }
    return {activefolioid,tofindhistory,showsponsor,showyoutube,autodict,newbie,favorites,playnextjuan,preferaudio,showpunc};
}

export const saveSettings=()=>{ //immediate save
    for (let key in settingsToBeSave) {
        localStorage.setItem(key, settingsToBeSave[key]);
        delete settingsToBeSave[key]
    }
    clearTimeout(updateTimer);
    // console.log('settings autosaved on',new Date())
}
let updateTimer=0;
const settingsToBeSave={};
export const updateSettings=_settings=>{
    let updated=false,oldval;
    for (let key in _settings) {
        if (_settings.hasOwnProperty(key) ) {
            if (settings[key]!==_settings[key]) {
                let val=_settings[key];
                if (typeof val=='object') {
                    val=JSON.stringify(_settings[key]);
                    oldval=JSON.stringify( localStorage.getItem(key) );
                }
                if (val!==oldval) {
                    settingsToBeSave[AppPrefix+key]=val;
                    if (typeof _settings[key]=='object') {
                        settings[key]=JSON.parse(JSON.stringify(_settings[key]));
                    } else {
                        settings[key]=_settings[key];
                    }
                    updated=true;
                }    
            }
        }
    }
    
    if (updated) {
        clearTimeout(updateTimer);
        updateTimer=setTimeout(saveSettings,5000); //autosave in 5 seconds
    }
}
export const settings=loadSettings();
