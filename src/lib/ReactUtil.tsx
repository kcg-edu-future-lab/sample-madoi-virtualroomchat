import { RefObject, useEffect, useRef } from "react";

export function useEffectOnce(effect: ()=>void){
    const refFirst = useRef(true);
    useEffect(()=>{
        if (process.env.NODE_ENV === "development" && refFirst.current) {
            refFirst.current = false;
            return;
        }
        effect();
    });
}

export function useRefAndTarget<T>(initialValue: null): [RefObject<T>, T]{
    const ref = useRef(null);
    return [ref, ref.current!];
}
