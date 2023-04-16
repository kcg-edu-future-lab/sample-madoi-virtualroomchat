
export function getLastPath(url: string){
    let urlPath = window.location.href;
    if(urlPath.indexOf("?") != -1) urlPath = urlPath.substring(0, urlPath.indexOf("?"));
    if(urlPath == "/") urlPath = "";
    return urlPath.replace(/\//g, "_").split("#")[0];
}

export function computeIfAbsentMap<T, U>(map: Map<T, U>, key: T, comp: Function): U{
    let ret = map.get(key);
    if(ret != null){
        return ret;
    }
    const value = comp(key);
    map.set(key, value);
    return value;
}
