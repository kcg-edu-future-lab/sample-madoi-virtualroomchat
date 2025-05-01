import { LocalJsonStorage } from "../../lib/LocalJsonStorage";
import { BeforeEnterRoom, EnterRoomAllowed, EnterRoomAllowedDetail, Madoi, PeerEntered, PeerEnteredDetail, PeerInfo, PeerLeaved, PeerLeavedDetail, PeerProfileUpdated, PeerProfileUpdatedDetail, ShareClass, TypedEventTarget } from "../../lib/madoi";
import { AvatarModel } from "./AvatarModel";

export interface SelfNameChangedDetail{
    name: string;
}
export interface SelfPositionChangedDetail{
    position: number[];
}
@ShareClass({className: "VirtualRoomLocalModel"})
export class VirtualRoomOwnModel extends TypedEventTarget<VirtualRoomOwnModel, {
    selfNameChanged: SelfNameChangedDetail,
    selfPositionChanged: SelfPositionChangedDetail,
}>{
    private static selfColor = "#0fa";
    private static othersColor = "#99aaFF";
    private ls: LocalJsonStorage<{name: string, position: number[]}>;
    private self: AvatarModel;
    private others: Map<string, AvatarModel> = new Map();
    private madoi: Madoi | null = null;

    constructor(roomId: string, private initialName: string, private initialPosition: number[]){
        super();
        this.ls = new LocalJsonStorage(roomId);
        this.self = new AvatarModel(
            "", this.ls.get("name", initialName),
            VirtualRoomOwnModel.selfColor,
            this.ls.get("position", initialPosition));
    }

    get selfPeer(){
        return this.self;
    }

    get otherPeers(){
        return this.others.values().toArray();
    }

    @BeforeEnterRoom()
    protected beforeEnterRoom(selfPeerProfile: {[key: string]: any}, madoi: Madoi){
        console.log("VirtualRoomOwnModel.beforeEnterRoom");
        this.madoi = madoi;
        selfPeerProfile["name"] = this.ls.get("name", this.initialName);
        selfPeerProfile["position"] = this.ls.get("position", this.initialPosition);
    }

    @EnterRoomAllowed()
    protected enterRoomAllowed({selfPeer, otherPeers}: EnterRoomAllowedDetail){
        console.log("VirtualRoomOwnModel.enterRoomAllowed", selfPeer, otherPeers);
        this.self = this.createAvatarFromPeer(selfPeer, VirtualRoomOwnModel.selfColor);
        this.self.addEventListener("nameChanged", ({detail: {name}})=>{
            this.ls.set("name", name);
            this.madoi?.updateSelfPeerProfile("name", name);
            this.dispatchCustomEvent("selfNameChanged", {name});
        });
        this.self.addEventListener("positionChanged", ({detail: {position}})=>{
            this.ls.set("position", position);
            this.madoi?.updateSelfPeerProfile("position", position);
            this.dispatchCustomEvent("selfPositionChanged", {position});
        });
        for(const p of otherPeers){
            this.others.set(p.id, this.createAvatarFromPeer(p, VirtualRoomOwnModel.othersColor));
        }
    }

    @PeerEntered()
    protected peerEntered({peer}: PeerEnteredDetail){
        console.log("VirtualRoomOwnModel.peerEntered", {peer});
        this.others.set(peer.id, this.createAvatarFromPeer(peer, VirtualRoomOwnModel.othersColor));
    }

    @PeerProfileUpdated()
    protected peerProfileUpdated({peerId, updates}: PeerProfileUpdatedDetail){
        console.log("VirtualRoomOwnModel.peerProfileUpdated", {peerId, updates});
        const peer = this.others.get(peerId);
        if(!peer || !updates) return;
        if(updates["name"]) peer.name = updates["name"];
        if(updates["position"]){
            peer.position = updates["position"];
        }
    }

    @PeerLeaved()
    protected peerLeaved({peerId}: PeerLeavedDetail){
        console.log("VirtualRoomOwnModel.peerLeaved", {peerId});
        this.others.delete(peerId);
    }

    private createAvatarFromPeer(p: PeerInfo, color: string){
        return new AvatarModel(
            p.id, p.profile["name"], color, p.profile["position"]);
    }
}
