import './App.css';
import { createContext, useContext } from 'react';
import { getLastPath } from './lib/Util';
import { v4 as uuidv4 } from 'uuid';
import { LocalJsonStorage } from './lib/LocalJsonStorage';
import { madoiKey } from './keys';
import { Madoi } from './lib/madoi';
import { useMadoiObject } from './lib/reactHelpers';
import bg from './VirtualRoomDefaultBackground.png';
import { VirtualRoom } from './component/VirtualRoom';
import { VirtualRoomModel } from './component/VirtualRoomModel';

const roomId: string = `sample-madoi-vroom-${getLastPath(window.location.href)}-sdsakyfs24df2sdfsfjo4`;
const ls = new LocalJsonStorage<{id: string, name: string, position: number[]}>(`presence-${roomId}`);
const selfId = ls.get("id", () => uuidv4());
const selfName = ls.get("name", () => "匿名");
const selfPosition = ls.get("position", () => [Math.random() * 100, Math.random() * 100]);

export const AppContext = createContext({
    madoi: new Madoi(
//      `ws://localhost:8080/madoi/rooms/${roomId}`, madoiKey,
      `wss://fungo.kcg.edu/madoi-20241213/rooms/${roomId}`, madoiKey,
      {id: selfId, profile: {name: selfName, position: selfPosition}})
    });

export default function App() {
    const app = useContext(AppContext);
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
        <VirtualRoom selfName={selfName} vrm={vrm} background={bg} />
    </div>;
}
