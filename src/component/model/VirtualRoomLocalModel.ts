import { EnterRoomAllowed, EnterRoomAllowedDetail, PeerEntered, PeerEnteredDetail, PeerInfo, PeerLeaved, PeerLeavedDetail, PeerProfileUpdated, PeerProfileUpdatedDetail, ShareClass, TypedEventTarget } from "../../lib/madoi";
import { AvatarModel } from "./AvatarModel";

export interface SelfNameChangedDetail{
    name: string;
}
export interface SelfPositionChangedDetail{
    position: number[];
}
@ShareClass({className: "VirtualRoomLocalModel"})
export class VirtualRoomLocalModel extends TypedEventTarget<VirtualRoomLocalModel, {
    selfNameChanged: SelfNameChangedDetail,
    selfPositionChanged: SelfPositionChangedDetail,
}>{
    private self: AvatarModel | null = null;
    private others: Map<string, AvatarModel> = new Map();

    get selfPeer(){
        return this.self;
    }

    get otherPeers(){
        return this.others.values().toArray();
    }

    @EnterRoomAllowed()
    protected enterRoomAllowed({selfPeer, otherPeers}: EnterRoomAllowedDetail){
        this.self = this.createAvatarFromPeer(selfPeer, "#0fa");
        this.self.addEventListener("nameChanged", ({detail: {name}})=>{
            this.dispatchCustomEvent("selfNameChanged", {name});
        });
        this.self.addEventListener("positionChanged", ({detail: {x, y}})=>{
            this.dispatchCustomEvent("selfPositionChanged", {position: [x, y]});
        });
        for(const p of otherPeers){
            this.others.set(p.id, this.createAvatarFromPeer(p, "#99aaFF"));
        }
    }

    @PeerEntered()
    protected peerEntered({peer: p}: PeerEnteredDetail){
        this.others.set(p.id, this.createAvatarFromPeer(p, "#99aaFF"));
    }

    @PeerProfileUpdated()
    protected peerProfileUpdated(d: PeerProfileUpdatedDetail){
        const peer = this.others.get(d.peerId);
        if(!peer || !d.updates) return;
        if(d.updates["name"]) peer.name = d.updates["name"];
        if(d.updates["position"]){
            [peer.x, peer.y] = d.updates["position"];
        }
    }

    @PeerLeaved()
    protected peerLeaved(d: PeerLeavedDetail){
        this.others.delete(d.peerId);
    }

    private createAvatarFromPeer(p: PeerInfo, color: string){
        const [x, y] = p.profile["position"];
        return new AvatarModel(
            p.id, p.profile["name"], color, x, y);
    }
}
