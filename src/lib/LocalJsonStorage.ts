
export class LocalJsonStorage<Items extends Record<string, any>>{
    constructor(private keyPrefix: string){
    }
    get<K extends keyof Items>(
        name: K,
        defaultValue: Items[K] | (()=>Items[K] | undefined)): Items[K];
    get(name: string, defaultValue: any | (()=>any) | undefined) {
        const key = `${this.keyPrefix}:${name}`;
        let ret = JSON.parse(localStorage.getItem(key) || "null");
        if(ret !== null){
            return ret;
        }
        if(typeof defaultValue === 'undefined') return defaultValue;
        let v = defaultValue;
        if(typeof v === 'function'){
            v = v();
        }
        localStorage.setItem(key, JSON.stringify(v));
        return v;
    }

    set<K extends keyof Items>(
        name: K,
        value: Items[K]): void;
    set(name: string, value: any){
        const key = `${this.keyPrefix}:${name}`;
        localStorage.setItem(key, JSON.stringify(value));
    }
}
