
import { VirtualRoomModel } from "./VirtualRoomModel";
import { VirtualRoomAvatar, VirtualRoomSelfAvatar } from "./VirtualRoomAvatar";

interface Props{
    vrm: VirtualRoomModel;
    background?: string;
}
export function VirtualRoom({background, vrm}: Props){
    const self = vrm.selfPeer;
    const peers = vrm.otherPeers;
    return <div>
        <svg style={{width: "512px", height: "512px", backgroundImage: `url(${background})`}}>
            {/* self */}
            {self ? <VirtualRoomSelfAvatar avatar={self} /> : ""}
            {/* peers */}
            {peers.map(p=><VirtualRoomAvatar key={p.id} avatar={p} />)}
        </svg>
    </div>;
}
