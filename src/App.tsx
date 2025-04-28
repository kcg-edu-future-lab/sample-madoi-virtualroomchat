import './App.css';
import { createContext, FormEvent, useContext, useRef, useState } from 'react';
import { getLastPath } from './lib/Util';
import { v4 as uuidv4 } from 'uuid';
import { LocalJsonStorage } from './lib/LocalJsonStorage';
import { madoiKey } from './keys';
import { Madoi, PeerInfo } from './lib/madoi';
import { useMadoiObject, useMadoiState } from './lib/reactHelpers';
import { VirtualRoom } from './component/VirtualRoom';
import { VirtualRoomModel } from './component/VirtualRoomModel';

const roomId: string = `sample-madoi-vroom-${getLastPath(window.location.href)}-sdsakyfs24df2sdfsfjo4`;
const ls = new LocalJsonStorage<{
    id: string, name: string, position: number[], bgImgUrl: string
}>(`presence-${roomId}`);
const selfPeerInfo: PeerInfo = {
    id: ls.get("id", () => uuidv4()),
    order: -1,
    profile: {
        name: ls.get("name", "匿名"),
        position: ls.get("position", () => [Math.random() * 100, Math.random() * 100])
    }
};
export const AppContext = createContext({
    madoi: new Madoi(
//      `ws://localhost:8080/madoi/rooms/${roomId}`,
        `wss://fungo.kcg.edu/madoi-20241213/rooms/${roomId}`,
        madoiKey, selfPeerInfo
    )
});

export default function App() {
    const app = useContext(AppContext);
    const [name, setName] = useState(ls.get("name"));
    const nameInput = useRef<HTMLInputElement>(null);
    const [bgUrl, setBgUrl] = useMadoiState(
            app.madoi, ls.get("bgImgUrl", "defaultBackground.png"));
    ls.set("bgImgUrl", bgUrl);
    const bgInput = useRef<HTMLInputElement>(null);

    const vrm = useMadoiObject(app.madoi, ()=>{
        const model = new VirtualRoomModel();
        model.addEventListener("selfPositionChanged", ({detail: {position}})=>{
            ls.set("position", position);
            app.madoi.updateSelfPeerProfile("position", position);
        });
        return model;
    });
    const onNameChange = (e: FormEvent)=>{
        e.preventDefault();
        const name = nameInput.current?.value.trim();
        if(!name || name === "") return;
        vrm.selfPeer!.name = name;
        setName(name);
        ls.set("name", name);
        app.madoi.updateSelfPeerProfile("name", name);
    };
    const onBackgroundChange = (e: FormEvent)=>{
        e.preventDefault();
        const url = bgInput.current?.value.trim();
        if(!url || url === "") return;
        setBgUrl(url);
    };

    return <>
        <div>
            <form onSubmit={onNameChange} style={{display: "inline-block"}}>
                <label>名前: <input ref={nameInput} defaultValue={name}></input></label>
                <button>変更</button>
            </form>
            &nbsp;&nbsp;
            <form onSubmit={onBackgroundChange} style={{display: "inline-block"}}>
                <label>背景: <input ref={bgInput} defaultValue={bgUrl}></input></label>
                <button>変更</button>
            </form>
        </div>
        <VirtualRoom vrm={vrm} background={bgUrl} />
    </>;
}
