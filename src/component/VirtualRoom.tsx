import { FormEvent, useRef } from "react";
import { Avatar, SelfAvatar } from "./Avatar";
import { VirtualRoomModel } from "./model/VirtualRoomModel";
import { VirtualRoomLocalModel } from "./model/VirtualRoomLocalModel";

interface Props{
    vrm: VirtualRoomModel;
    vrlm: VirtualRoomLocalModel;
}
export function VirtualRoom({vrm, vrlm}: Props){
    const nameInput = useRef<HTMLInputElement>(null!);
    const bgInput = useRef<HTMLInputElement>(null!);

    const onNameChange = (e: FormEvent)=>{
        e.preventDefault();
        const name = nameInput.current?.value.trim();
        if(!name || name === "") return;
        vrlm.selfPeer!.name = name;
    };
    const onBackgroundChange = (e: FormEvent)=>{
        e.preventDefault();
        const url = bgInput.current?.value.trim();
        if(!url || url === "") return;
        vrm.background = url;
    };

    const self = vrlm.selfPeer;
    const peers = vrlm.otherPeers;
    return <>
        <div>
            <form onSubmit={onNameChange} style={{display: "inline-block"}}>
                <label>名前: <input ref={nameInput} defaultValue={vrlm.selfPeer?.name}></input></label>
                <button>変更</button>
            </form>
            &nbsp;&nbsp;
            <form onSubmit={onBackgroundChange} style={{display: "inline-block"}}>
                <label>背景: <input ref={bgInput} defaultValue={vrm.background}></input></label>
                <button>変更</button>
            </form>
        </div>
        <svg style={{width: "512px", height: "512px", backgroundImage: `url(${vrm.background})`}}>
            {/* self */}
            {self ? <SelfAvatar avatar={self} /> : ""}
            {/* peers */}
            {peers.map(p=><Avatar key={p.id} avatar={p} />)}
        </svg>
    </>;
}
