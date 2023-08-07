// Step 1: start the fetch and obtain a reader

export const downloadToCache=async(url,cb,cachename='v1::ylz')=>{
    const cachefn=url;
    if (location.host!=='nissaya.cn' 
    && location.host.indexOf('localhost')==-1 
    && location.host.indexOf('127.0.0.1')==-1) url="https://nissaya.cn/"+url.replace(/^\//,'');

    const headers=url.indexOf('.zip')?{"Accept":"application/octet-stream"}:{"Accept":"audio/mpeg"};

    cb&&cb('requesting')
    let response = await fetch(url,{method:"GET",mode:"no-cors",
    redirect:"follow",
    credentials: "omit",
    origin:"https://nissaya.cn",
    headers});

    cb&&cb('responsed')

    const cache=await caches.open(cachename);
    const cached=await cache.match(url);
    // console.log(response.headers.get('Content-Length') , cached.headers.get('Content-Length'))
    if (cached && response.headers.get('Content-Length') == cached.headers.get('Content-Length')) {
        // console.log('use cached')
        return response;
    }

    if (response.body) { //support progress
        const reader = response.body.getReader();
        // Step 2: get total length
        const contentLength = +response.headers.get('Content-Length');
        // Step 3: read the data
        let receivedLength = 0; // received that many bytes at the moment
        let chunks = []; // array of received binary chunks (comprises the body)
        while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            cb&&cb( Math.floor( (100*receivedLength/contentLength))+'%');
        // console.log(`Received ${receivedLength} of ${contentLength}`)
        }
    
        // Step 4: concatenate chunks into single Uint8Array
        let chunksAll = new Uint8Array(receivedLength); // (4.1)
        let position = 0;
        for(let chunk of chunks) {
            chunksAll.set(chunk, position); // (4.2)
            position += chunk.length;
        }
        //put to cache
        const resp= {
            status:response.status,
            statusText:response.statusText,
            headers: {'X-Shaka-From-Cache': true,"Content-Type":'audio/mpeg',"Content-Length": contentLength}
        };
        const res=new Response(chunksAll,resp)
        cache.put(cachefn, res.clone());
        cb&&cb('cached');
        return res;
    } else { //doesn't support download progress
        cache.put(cachefn, response.clone());
        cb&&cb('cached');
        return response;
    }
}