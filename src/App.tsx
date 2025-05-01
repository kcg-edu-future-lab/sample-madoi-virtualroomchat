import './App.css';
import { createContext, useContext, useRef, useState } from 'react';
import { getLastPath } from './lib/Util';
import { v4 as uuidv4 } from 'uuid';
import { LocalJsonStorage } from './lib/LocalJsonStorage';
import { madoiKey, madoiUrl } from './keys';
import { Madoi, PeerInfo } from './lib/madoi';
import { useMadoiModel } from './lib/reactHelpers';
import { VirtualRoom } from './component/VirtualRoom';
import { VirtualRoomLocalModel } from './component/model/VirtualRoomLocalModel';
import { VirtualRoomModel } from './component/model/VirtualRoomModel';

const roomId: string = `sample-madoi-vroom-${getLastPath(window.location.href)}-sdsakyfs24df2sdfsfjo4`;
const ls = new LocalJsonStorage<{
    id: string, name: string, position: number[], background: string
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
    storage: ls,
    madoi: new Madoi(
//      `ws://localhost:8080/madoi/rooms/${roomId}`,
        `${madoiUrl}/${roomId}`,
        madoiKey, selfPeerInfo
    )
});

export default function App() {
    const app = useContext(AppContext);
    const [_, setName] = useState(ls.get("name"));

    const vrlm = useMadoiModel(app.madoi, ()=>{
        const model = new VirtualRoomLocalModel();
        model.addEventListener("selfNameChanged", ({detail: {name}})=>{
            app.storage.set("name", name);
            app.madoi.updateSelfPeerProfile("name", name);
            setName(name);
        });
        model.addEventListener("selfPositionChanged", ({detail: {position}})=>{
            app.storage.set("position", position);
            app.madoi.updateSelfPeerProfile("position", position);
        });
        return model;
    });
    const vrm = useMadoiModel(app.madoi, ()=>{
        const model = new VirtualRoomModel(
            app.storage.get("background", "defaultBackground.png"));
        model.addEventListener("backgroundChanged", ({detail: {background}})=>{
            app.storage.set("background", background);
        });
        return model;
    });

    return <VirtualRoom vrm={vrm} vrlm={vrlm} />;
}
