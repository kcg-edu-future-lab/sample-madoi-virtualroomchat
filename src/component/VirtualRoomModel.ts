import { EnterRoomAllowed, EnterRoomAllowedDetail, GetState, Madoi, PeerEntered, PeerEnteredDetail, PeerInfo, PeerLeaved, PeerLeavedDetail, PeerProfileUpdated, PeerProfileUpdatedDetail, SetState, Share, ShareClass, TypedEventTarget } from "../lib/madoi";
import { VirtualRoomAvatarModel } from "./VirtualRoomAvatarModel";

interface SelfNameChangedDetail{
    name: string;
}
interface SelfPositionChangedDetail{
    position: number[];
}

@ShareClass({className: "VirtualRoom"})
export class VirtualRoomModel extends TypedEventTarget<VirtualRoomModel, {
    selfNameChanged: SelfNameChangedDetail;
    selfPositionChanged: SelfPositionChangedDetail;
}>{
    private self: VirtualRoomAvatarModel | null = null;
    private others: Map<string, VirtualRoomAvatarModel> = new Map();

    get selfPeer(){
        return this.self;
    }

    get otherPeers(){
        return this.others.values().toArray();
    }

    @GetState()
    getState(){
        return new Array();
    }

    @SetState()
    setState(state: any){
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
            peer.x = d.updates["position"][0];
            peer.y = d.updates["position"][1];
        }
    }

    @PeerLeaved()
    protected peerLeaved({peerId}: PeerLeavedDetail){
        this.others.delete(peerId);
    }

    private createAvatarFromPeer(p: PeerInfo, color: string){
        return new VirtualRoomAvatarModel(
            p.id, p.profile["name"], color,
            p.profile["position"][0], p.profile["position"][1]);
    }
}
