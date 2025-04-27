
import { MouseEvent, useRef, useState } from "react";
import VirtualRoomDefaultBackground from "./VirtualRoomDefaultBackground.png"
import '@svgdotjs/svg.draggable.js'
import { VirtualRoomModel } from "./VirtualRoomModel";
import { VirtualRoomAvatar, VirtualRoomSelfAvatar } from "./VirtualRoomAvatar";

interface Props{
    selfName: string;
    vrm: VirtualRoomModel;
    background?: string;
}
export function VirtualRoom({selfName, background=VirtualRoomDefaultBackground, vrm}: Props){
    console.log(`render vm2.VirtualRoom: self: ${vrm.selfPeer?.id}, others: ${vrm.otherPeers.map(p=>p.id)}`);
    const [name, setName] = useState(selfName);
    const svg = useRef<SVGSVGElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);

    const onNameChangeButtonClick = (e: MouseEvent)=>{
        e.preventDefault();
        const name = nameInput.current?.value.trim();
        if(!name || name === "") return;
        vrm.selfPeer!.name = name;
        setName(name);
    };
/*
    @Share({ maxLog: 1000 })
    changeBgImg(url: string) {
        this.svg.style.backgroundImage = `url('${url}')`;
        this.container.size(this.svg.clientWidth, this.svg.clientHeight);
    }
*/

    const self = vrm.selfPeer;
    const peers = vrm.otherPeers;
    return <div style={{width: "100%", height: "100%"}}>
        <div>
            <label>name: <input ref={nameInput} defaultValue={name}></input></label>
            <button onClick={onNameChangeButtonClick}>change</button>
        </div>
        <svg ref={svg} style={{width: "100%", height: "100%", backgroundImage: `url(${background})`}}>
            {/* self */}
            {self ? <VirtualRoomSelfAvatar avatar={self} /> : ""}
            {/* peers */}
            {peers.map(p=><VirtualRoomAvatar key={p.id} avatar={p} />)}
        </svg>
    </div>;
}
