import './App.css';
import { createContext, useContext } from 'react';
import { getLastPath } from './lib/Util';
import { VirtualRoom as VR1 } from './component/vm1/VirtualRoom';
import { VirtualRoom as VR2 } from './component/vm2/VirtualRoom';
import { VirtualRoomModel as VRM2 } from './component/vm2/VirtualRoomModel';
import { v4 as uuidv4 } from 'uuid';
import { LocalJsonStorage } from './lib/LocalJsonStorage';
import { Madoi } from './lib/madoi';
import { useMadoiObject } from './lib/reactHelpers';
import { madoiKey } from './keys';
import bg from './VirtualRoomDefaultBackground.png';

const roomId: string = `sample-madoi-vroom-${getLastPath(window.location.href)}-sdsakyfs24df2sdfsfjo4`
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
    const vrm2 = useMadoiObject(app.madoi, ()=>{
        const model = new VRM2();
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

    return <div style={{width: "100%"}}>
        <VR1 madoi={app.madoi} />
        <VR2 selfName={selfName} vrm={vrm2} background={bg}/>
    </div>;
}
