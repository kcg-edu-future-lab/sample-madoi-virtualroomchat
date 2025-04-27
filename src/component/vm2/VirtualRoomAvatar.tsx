import { PointerEvent, useRef } from "react";
import { VirtualRoomAvatarModel } from "./VirtualRoomAvatarModel";

class DragState{
    constructor(private _x: number = 0, private _y: number = 0){
    }
    move(x: number, y: number){
        const dx = x - this._x;
        const dy = y - this._y;
        return {dx, dy};
    }
}
interface VirtualRoomAvatarProps{
    avatar: VirtualRoomAvatarModel;
}
export function VirtualRoomSelfAvatar({avatar}: VirtualRoomAvatarProps){
    console.log(`renter vm2.VirtualRoomSelfAvatar: ${avatar.id}`);
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
export function VirtualRoomAvatar({avatar}: VirtualRoomAvatarProps){
    console.log(`renter vm2.VirtualRoomAvatar: ${avatar.id}`);
    const gr = useRef<SVGGElement>(null!);
    return <g ref={gr} transform={`translate(${avatar.x} ${avatar.y})`}>
        <circle r={24} fill={avatar.color}></circle>
        <text textAnchor="middle" dominantBaseline="middle">{avatar.name}</text>
    </g>;
}
