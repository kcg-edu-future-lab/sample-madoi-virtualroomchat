import { TypedEventTarget } from "../../lib/madoi";

export interface NameChangedDetail{
    name: string;
}
export interface TranslatedDetail{
    x: number;
    y: number;
}
export class AvatarModel extends TypedEventTarget<AvatarModel, {
    nameChanged: NameChangedDetail,
    positionChanged: TranslatedDetail
}>{
    constructor(private _id: string, private _name: string,
            private _color: string, private _x: number, private _y: number){
        super();
    }
    get id(){
        return this._id;
    }
    get name(){
        return this._name;
    }
    set name(name: string){
        this._name = name;
        this.dispatchCustomEvent("nameChanged", {name});
    }
    get x(){
        return this._x;
    }
    set x(x: number){
        this._x = x;
        this.dispatchCustomEvent("positionChanged", {x: this._x, y: this._y});
    }
    get y(){
        return this._y;
    }
    set y(y: number){
        this._y = y;
        this.dispatchCustomEvent("positionChanged", {x: this._x, y: this._y});
    }
    get color(){
        return this._color;
    }
    translate(dx: number, dy: number){
        this._x += dx;
        this._y += dy;
        this.dispatchCustomEvent("positionChanged", {x: this._x, y: this._y});
    }
}