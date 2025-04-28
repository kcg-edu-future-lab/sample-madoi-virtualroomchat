import './App.css';
import { createContext, MouseEvent, useContext, useRef, useState } from 'react';
import { getLastPath } from './lib/Util';
import { v4 as uuidv4 } from 'uuid';
import { LocalJsonStorage } from './lib/LocalJsonStorage';
import { madoiKey } from './keys';
import { Madoi } from './lib/madoi';
import { useMadoiObject, useMadoiState } from './lib/reactHelpers';
import { VirtualRoom } from './component/VirtualRoom';
import { VirtualRoomModel } from './component/VirtualRoomModel';

const roomId: string = `sample-madoi-vroom-${getLastPath(window.location.href)}-sdsakyfs24df2sdfsfjo4`;
const ls = new LocalJsonStorage<{id: string, name: string, position: number[], bgImgUrl: string}>(`presence-${roomId}`);
const selfId = ls.get("id", () => uuidv4());
const selfName = ls.get("name", "匿名");
const selfPosition = ls.get("position", () => [Math.random() * 100, Math.random() * 100]);
const bgImgUrl = ls.get("bgImgUrl", "VirtualRoomDefaultBackground.png");

export const AppContext = createContext({
    madoi: new Madoi(
//      `ws://localhost:8080/madoi/rooms/${roomId}`, madoiKey,
      `wss://fungo.kcg.edu/madoi-20241213/rooms/${roomId}`, madoiKey,
      {id: selfId, profile: {name: selfName, position: selfPosition}})
    });

export default function App() {
    const app = useContext(AppContext);
    const [name, setName] = useState(selfName);
    const nameInput = useRef<HTMLInputElement>(null);
    const [bgUrl, setBgUrl] = useMadoiState(app.madoi, bgImgUrl);
    const bgInput = useRef<HTMLInputElement>(null);
    const onBackgroundeChangeButtonClick = (e: MouseEvent)=>{
        e.preventDefault();
        const url = bgInput.current?.value.trim();
        if(!url || url === "") return;
        setBgUrl(url);
    };
    ls.set("bgImgUrl", bgUrl);

/*
    @Share({ maxLog: 1000 })
    changeBgImg(url: string) {
        this.svg.style.backgroundImage = `url('${url}')`;
        this.container.size(this.svg.clientWidth, this.svg.clientHeight);
    }
*/
    const onNameChangeButtonClick = (e: MouseEvent)=>{
        e.preventDefault();
        const name = nameInput.current?.value.trim();
        if(!name || name === "") return;
        vrm.selfPeer!.name = name;
        setName(name);
    };
    const vrm = useMadoiObject(app.madoi, ()=>{
        const model = new VirtualRoomModel();
        model.addEventListener("selfNameChanged", ({detail: {name}})=>{
            ls.set("name", name);
            app.madoi.updateSelfPeerProfile("name", name);
        });
        model.addEventListener("selfPositionChanged", ({detail: {position}})=>{
            ls.set("position", position);
            app.madoi.updateSelfPeerProfile("position", position);
        });
        return model;
    });

    return <div>
        <div>
            <label>name: <input ref={nameInput} defaultValue={name}></input></label>
            <button onClick={onNameChangeButtonClick}>change</button>
            <label>background: <input ref={bgInput} defaultValue={bgUrl}></input></label>
            <button onClick={onBackgroundeChangeButtonClick}>change</button>
       </div>
        <VirtualRoom vrm={vrm} background={bgUrl} />
    </div>;
}
