import './App.css';
import { useState } from 'react';
import { useEffectOnce } from '../lib/ReactUtil';
import { getLastPath } from '../lib/Util';
import { Madoi } from '../lib/madoi';
import VirtualRoom from '../component/VirtualRoom';
import { madoiKey } from '../keys';

export default function App() {
    const roomId: string = `sample-madoi-vroom-${getLastPath(window.location.href)}-sdsa3tyfs24df2sdfsfjo4`;
    const [madoi, setMadoi] = useState<Madoi>();

    useEffectOnce(()=>{
        if(madoi) return;
        const m = new Madoi(
            `wss://fungo.kcg.edu/madoi-20220920/rooms/${roomId}`,
//            `ws://localhost:8080/madoi/rooms/${roomId}`,
            madoiKey
            );
        setMadoi(m);
        m.on("enterRoom", ({self: {id}})=>{
            console.log(`enterRoom(${id})`);
        });
        m.on("leaveRoom", ()=>{
            console.log("leaveRoom");
        });
        m.on("peerJoin", ({peer})=>{
            console.log(`peerJoin(${peer.id})`);
        });
        m.on("peerLeave", ({peerId})=>{
            console.log(`peerLeave(${peerId})`);
        });
        m.start();
    });

    return <div style={{width: "100%", height: "800px"}}>
        <VirtualRoom madoi={madoi} />
    </div>;
}
