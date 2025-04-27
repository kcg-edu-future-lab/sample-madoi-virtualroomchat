import { RefObject, useEffect, useRef } from "react";
import { GetState, Madoi, SetState, Share } from "../../lib/madoi";
import VirtualRoomDefaultBackground from "./VirtualRoomDefaultBackground.png"
import { Circle, Container, G, Image, SVG, Text } from "@svgdotjs/svg.js";
import '@svgdotjs/svg.draggable.js'
import { computeIfAbsentMap } from "../../lib/Util";
import { LocalJsonStorage } from "../../lib/LocalJsonStorage";

let i = 0;
interface Props{
    madoi?: Madoi;
    background?: string;
}
export function VirtualRoom({madoi, background=VirtualRoomDefaultBackground}: Props){
    const svg = useRef<SVGSVGElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const nameChangeButton = useRef<HTMLButtonElement>(null);

    useEffect(()=>{
        if(!madoi) return;
        if(!svg.current || !nameInput.current || !nameChangeButton.current) return;
        console.log(`vm1.VitualRoom useEffectOnce. ${i++}`);

        const vrm = madoi.register(new VirtualRoomManager(svg.current));
        madoi.addEventListener("enterRoomAllowed", ({detail: {selfPeer: {id, profile}}})=>{
            vrm.createSelfAvator(id, profile.name, Math.random() * 300 + 20, Math.random() * 300 + 20);
        });
        window.onbeforeunload = function () {
            vrm.deleteSelfAvator();
        };
        nameChangeButton.current.addEventListener("click", ()=>{
            if(!nameInput.current) return;
            vrm.setSelfName(nameInput.current.value);
        });
    }, [madoi]);

    return <div style={{width: "100%", height: "100%"}}>
        <div>
            <label>name: <input ref={nameInput}></input></label>
            <button ref={nameChangeButton}>change</button>
        </div>
        <svg ref={svg} style={{width: "100%", height: "100%", backgroundImage: `url(${background})`}}>
        </svg>
    </div>;
}

class VirtualRoomManager{
    private container: Container;
    private selfId: string | null = null;
    private avators: Map<string, Avator>;

    constructor(private svg: SVGSVGElement) {
        this.container = SVG(svg);
        this.container.size(this.svg.clientWidth, this.svg.clientHeight);
        this.avators = new Map<string, Avator>();
    }

    getSelfId() {
        return this.selfId;
    }

    createSelfAvator(id: string, name: string, x: number, y: number) {
        this.selfId = id;
        this.newAvator(id, name, x, y);
    }

    deleteSelfAvator(){
        if(!this.selfId) return;
        this.deleteAvator(this.selfId);
    }

    setSelfName(name: string){
        if(!this.selfId) return;
        this.setName(this.selfId, name);
    }

    @Share({ type: "afterExec", maxLog: 1000 })
    newAvator(id: string, name: string, x: number, y: number) {
        console.log(`vm1.VirtualRoomManager.newAvator(${id}, ${name}, ${x}, ${y})`);
        const thisId = id;
        const avator = computeIfAbsentMap(
            this.avators,
            id, () => {
                const a = new Avator(this.container, id, name);
                a.setPosition(x, y);
                if (thisId == this.selfId) {
                    a.setSelf(true);
                    a.getGroup().draggable().on('dragmove', (e: any) => {
                        const { handler, box } = e.detail;
                        this.setPosition(thisId, box.x + box.width / 2, box.y + box.height / 2);
                    });
                }
                return a;
            });
    }
    
    @Share({ type: "afterExec", maxLog: 1000 })
    deleteAvator(id: string): void{
        if(id == this.selfId) return;
        console.log(`vm1.VirtualRoomManager.deleteAvator: ${id}`);
        const avator = this.avators.get(id);
        if (!avator) return;
        this.avators.delete(id);
        avator.remove();
    }

    @Share({ type: "afterExec", maxLog: 1000 })
    setName(id: string, name: string) {
        const a = this.avators.get(id);
        a?.setName(name);
        console.log(`vm1.VirtualRoomManager.setName: id: ${id}, name: ${name}`);
    }

    @Share({ type: "afterExec", maxLog: 1000 })
    setPosition(id: string, x: number, y: number) {
        const avator = this.avators.get(id);
        if (avator) {
            avator.setPosition(x, y);
        }
    }

    @Share({ maxLog: 1000 })
    changeBgImg(url: string) {
        this.svg.style.backgroundImage = `url('${url}')`;
        this.container.size(this.svg.clientWidth, this.svg.clientHeight);
    }

    @GetState({ maxInterval: 10000, maxUpdates: 1000})
    getState(): string {
        console.log("vm1.VirtualRoomManager.getState() called.");
        const ret = [];
        for (const [key, value] of this.avators) {
            const a: Avator = value;
            ret.push({
                "id": key, "name": a.getName(),
                "x": a.getX(), "y": a.getY()
            });
        }
        return JSON.stringify(ret);
    }

    @SetState()
    setState(state: string) {
        console.log("vm1.VirtualRoomManager.setState() called.", state);
        const s = JSON.parse(state);
        for (const element of s) {
            if ("id" in element) {
                const a = computeIfAbsentMap(this.avators, element["id"],
                    (key: string) => {
                        return new Avator(this.container, element["id"], element["name"]);
                    }
                );
                console.log(`vm1.VirtualRoomManager.setState: ${element["id"]}: ${element['x']},${element['y']}`)
                a.setPosition(element["x"], element["y"]);
                a.setName(element["name"]);
            } else {
                console.error(element);
            }
        }
    }
}

class Avator{
    private id: string;
    private name: string = "匿名";
    private moved: boolean = false;
    private group: G;
    private circle: Circle;
    private text: Text;
    private img: Image;
    constructor(svg: Container, id: string, name: string){
        this.group = svg.group();
        this.id = id;
        this.name = name;
        this.circle = svg.circle(48).attr("fill", "#99aaFF");
        this.group.add(this.circle);
        this.text = svg.plain(this.name);
        this.group.add(this.text);
    //        const fo = svg.foreignObject(50,50);
    //        this.group.add(fo);
    //        fo.add(SVG(`<canvas id="face" width="50" height="50"></canvas>`));
    //        const c = document.querySelector(`#face`) as HTMLCanvasElement;
    //        c.getContext("2d")?.fillRect(0, 0, 10, 10);
        this.text
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle");
        const cbox = this.circle.bbox();
        const tbox = this.text.bbox();
        this.text.center(
            cbox.x + cbox.width / 2,
            cbox.y + cbox.height / 2
        );
        this.img = svg.image().size(48, 48);
        this.group.add(this.img);
    }

    updateImage(url: string){
        this.img.attr("href", url);
    }

    clearImage(){
        this.img.attr("href", "");
    }

    setSelf(self: boolean){
        if(self){
            this.circle.attr({fill: '#0fa'});
        }
    }

    getId(): string{
        return this.id;
    }

    getName(): string{
        return this.name;
    }

    getAndClearMoved(): boolean{
        const r = this.moved;
        this.moved = false;
        return r;
    }

    setName(name: string): void{
        this.name = name;
        this.text.plain(name);
    }

    getGroup(): G{
        return this.group;
    }

    getX(){
        return this.group.cx();
    }

    getY(){
        return this.group.cy();
    }

    setPosition(x: number, y: number){
        this.group.center(x, y);
        this.moved = true;
    }

    remove(){
        this.group.remove();
    }
}
