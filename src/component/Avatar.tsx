import { PointerEvent, useRef } from "react";
import { AvatarModel } from "./model/AvatarModel";

class DragState{
    constructor(private _x: number = 0, private _y: number = 0){
    }
    move(x: number, y: number){
        const dx = x - this._x;
        const dy = y - this._y;
        return {dx, dy};
    }
}
interface Props{
    avatar: AvatarModel;
}
export function Avatar({avatar}: Props){
    return <g transform={`translate(${avatar.x} ${avatar.y})`}>
        <circle r={24} fill={avatar.color}></circle>
        <text textAnchor="middle" dominantBaseline="middle">{avatar.name}</text>
    </g>;
}
export function SelfAvatar({avatar}: Props){
    const gr = useRef<SVGGElement>(null!);
    const drag = useRef<DragState | null>(null);
    const onPointerDown = (e: PointerEvent<SVGGElement>)=>{
        drag.current = new DragState(e.clientX, e.clientY);
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent<SVGGElement>)=>{
        if(drag.current === null) return;
        const {dx, dy} = drag.current.move(e.clientX, e.clientY);
        gr.current.setAttribute("transform", `translate(${avatar.x + dx} ${avatar.y + dy})`);
    }
    const onPointerUp = (e: PointerEvent<SVGGElement>)=>{
        if(drag.current === null) return;
        const {dx, dy} = drag.current.move(e.clientX, e.clientY);
        avatar.translate(dx, dy);
        drag.current = null;
    }
    return <g ref={gr} transform={`translate(${avatar.x} ${avatar.y})`}
            onPointerDown={onPointerDown} onMouseMove={onPointerMove} onMouseUp={onPointerUp}>
        <circle r={24} fill={avatar.color}></circle>
        <text textAnchor="middle" dominantBaseline="middle">{avatar.name}</text>
    </g>;
}