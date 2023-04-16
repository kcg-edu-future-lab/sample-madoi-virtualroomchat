
export class LocalStorage{
    get(name: string, def: string | (()=>string)) {
        let ret = localStorage.getItem(name);
        if(ret != null){
            return ret;
        }
        let v = def;
        if(typeof v !== 'string'){
            v = v();
        }
        return v;
    }

    set(name: string, value: string){
        localStorage.setItem(name, value);
    }
}
