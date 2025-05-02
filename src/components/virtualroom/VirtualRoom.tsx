import { FormEvent, useRef, useState } from "react";
import { Avatar, SelfAvatar } from "./Avatar";
import { VirtualRoomModel } from "./model/VirtualRoomModel";
import { VirtualRoomOwnModel } from "./model/VirtualRoomOwnModel";

interface Props{
    vrm: VirtualRoomModel;
    vrom: VirtualRoomOwnModel;
}
export function VirtualRoom({vrm, vrom}: Props){
    const nameInput = useRef<HTMLInputElement>(null!);
    const bgInput = useRef<HTMLInputElement>(null!);
    const [name, setName] = useState(vrom.selfPeer.name);

    const onNameChange = (e: FormEvent)=>{
        e.preventDefault();
        const name = nameInput.current?.value.trim();
        if(!name || name === "") return;
        vrom.selfPeer.name = name;
        setName(name);
    };
    const onBackgroundChange = (e: FormEvent)=>{
        e.preventDefault();
        const url = bgInput.current?.value.trim();
        if(!url || url === "") return;
        vrm.background = url;
    };

    return <>
        <div>
            <form onSubmit={onNameChange} style={{display: "inline-block"}}>
                <label>名前: <input ref={nameInput} defaultValue={name}></input></label>
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
            {<SelfAvatar avatar={vrom.selfPeer} />}
            {/* peers */}
            {vrom.otherPeers.map(p=><Avatar key={p.id} avatar={p} />)}
        </svg>
    </>;
}
