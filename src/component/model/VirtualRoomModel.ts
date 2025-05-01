import { GetState, SetState, ShareClass, TypedEventTarget } from "../../lib/madoi";

export interface BackgroundChangedDetail{
    background: string;
}
@ShareClass({className: "VirtualRoomModel"})
export class VirtualRoomModel extends TypedEventTarget<VirtualRoomModel, {
    backgroundChanged: BackgroundChangedDetail
}>{
    constructor(private _background: string){
        super();
    }

    get background(){
        return this._background;
    }

    set background(background: string){
        this._background = background;
        this.dispatchCustomEvent("backgroundChanged", {background});
    }

    @GetState()
    getState(){
        return {background: this._background};
    }

    @SetState()
    setState({background}: {background: string}){
        this._background = background;
        this.dispatchCustomEvent("backgroundChanged", {background});
    }
}
