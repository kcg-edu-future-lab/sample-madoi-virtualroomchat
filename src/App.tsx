import './App.css';
import { createContext, useContext } from 'react';
import { getLastPath } from './lib/Util';
import { v4 as uuidv4 } from 'uuid';
import { LocalJsonStorage } from './lib/LocalJsonStorage';
import { madoiKey, madoiUrl } from './keys';
import { Madoi } from './lib/madoi';
import { useMadoiModel } from './lib/reactHelpers';
import { VirtualRoom } from './component/VirtualRoom';
import { VirtualRoomOwnModel } from './component/model/VirtualRoomOwnModel';
import { VirtualRoomModel } from './component/model/VirtualRoomModel';

const roomId: string = `sample-madoi-vroom-${getLastPath(window.location.href)}-sdsakydfsfjo4`;
const ls = new LocalJsonStorage<{id: string, background: string}>(`presence-${roomId}`);
export const AppContext = createContext({
    storage: ls,
    madoi: new Madoi(
//      `ws://localhost:8080/madoi/rooms/${roomId}`,
        `${madoiUrl}/${roomId}`,
        madoiKey,
        {id: ls.get("id", () => uuidv4()), profile: {}}
    )
});

export default function App() {
    const app = useContext(AppContext);

    const vrom = useMadoiModel(app.madoi, ()=>new VirtualRoomOwnModel(
        roomId, "匿名", [Math.random() * 100, Math.random() * 100]));
    const vrm = useMadoiModel(app.madoi, ()=>new VirtualRoomModel(
        roomId, "defaultBackground.png"));

    return <VirtualRoom vrm={vrm} vrom={vrom} />;
}
