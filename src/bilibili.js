async function requestSource(url, type = 'blob') {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = type;
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                console.log('get response')
                resolve(this.response)
            }
        }
        xhr.onerror = function(e) {
            console.log('an error occurred in the request')
            reject(e);
        }
        console.log('start request source')
        xhr.send();
    })
}



// 兼容特殊页面
export async function activityBiliAudioDownload() {
    let initState = window.__INITIAL_STATE__;
    let videoInfo = initState.videoInfo || initState.videoData;
    let { cid, bvid, title } = videoInfo;
    let url = `https://api.bilibili.com/x/player/playurl?cid=${cid}&bvid=${bvid}&fnval=4048`
    let playinfo = await requestSource(url, 'json');
    if (playinfo) {
        requestSource(playinfo.data.dash.audio[0].baseUrl)
            .then(res => {
                let blob = new Blob([res]);
                let url = window.URL.createObjectURL(blob, { type: 'audio/mp3' });
                let link = document.createElement('a');
                link.href = url;
                link.download = `${title}.mp3`;
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.log(error)
                console.log('download fail')
            })
    }
}
export async function activityBiliVideoDownload() {
    let initState = window.__INITIAL_STATE__;
    let videoInfo = initState.videoInfo || initState.videoData;
    let { cid, bvid, title } = videoInfo;
    let url = `https://api.bilibili.com/x/player/playurl?cid=${cid}&bvid=${bvid}&fnval=4048`
    let playinfo = await requestSource(url, 'json');
    if (playinfo) {
        requestSource(playinfo.data.dash.video[0].baseUrl)
            .then(res => {
                let blob = new Blob([res]);
                let url = window.URL.createObjectURL(blob, { type: 'video/mp4' });
                let link = document.createElement('a');
                link.href = url;
                link.download = `${title}.mp4`;
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.log(error)
                console.log('download fail')
            })
    }
}



// 新版本
// window.__playinfo__.data.dash.audio和video是一个数组,根据id区分视频清晰度和音频质量
// data.accept_quality是视频清晰度id数组,对应accept_description视频清晰度txt数组
export function biliAudioDownload(filename) {
    let urls = window.__playinfo__.data.dash.audio;
    requestSource(urls[0].baseUrl)
        .then((result) => {
            // Do things with result
            let binaryData = [result];
            // 改成Boole或者file类型
            const fileurl = window.URL.createObjectURL(new Blob(binaryData, { type: 'audio/mp3' }));
            let a = document.createElement('a');
            // a.style.display = 'none';
            document.body.appendChild(a);
            a.href = fileurl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(fileurl);
            document.body.remove(a);
        })
        .catch(e => {
            console.log(e)
            console.log('download fail')
        });
}
export function biliVideoDownload(filename) {
    let urls = window.__playinfo__.data.dash.video;
    requestSource(urls[0].baseUrl)
        .then((result) => {
            // Do things with result
            let binaryData = [result];
            // 改成Boole或者file类型
            const fileurl = window.URL.createObjectURL(new Blob(binaryData, { type: 'video/mp4' }));
            let a = document.createElement('a');
            // a.style.display = 'none';
            document.body.appendChild(a);
            a.href = fileurl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(fileurl);
            document.body.remove(a);
        })
        .catch(e => {
            console.log(e)
            console.log('download fail')
        });
}
