interface EnterRoomEventDetail {
    self: {
        id: string;
        order: number;
    };
    peers: PeerInfo[];
}
interface LeaveRoomEventDetail {
}
interface PeerJoinEventDetail {
    peer: PeerInfo;
}
interface PeerLeaveEventDetail {
    peerId: string;
}
interface ElseEventDetail {
    type: string;
    sender?: string;
    castType?: CastType;
    recipients?: string[];
    body: any;
}
interface ErrorEventDetail {
    error: any;
}
declare class MadoiEvents extends EventTarget {
    on(type: "enterRoom", callback: (detail: EnterRoomEventDetail) => void): void;
    on(type: "leaveRoom", callback: (detail: LeaveRoomEventDetail) => void): void;
    on(type: "peerJoin", callback: (detail: PeerJoinEventDetail) => void): void;
    on(type: "peerLeave", callback: (detail: PeerLeaveEventDetail) => void): void;
    on(type: "else", callback: (detail: ElseEventDetail) => void): void;
    on(type: "error", callback: (detail: ErrorEventDetail) => void): void;
    protected fire(type: "enterRoom", detail: EnterRoomEventDetail): void;
    protected fire(type: "leaveRoom", detail: LeaveRoomEventDetail): void;
    protected fire(type: "peerJoin", detail: PeerJoinEventDetail): void;
    protected fire(type: "peerLeave", detail: PeerLeaveEventDetail): void;
    protected fire(type: "else", detail: ElseEventDetail): void;
    protected fire(type: "error", detail: ErrorEventDetail): void;
}
export declare function ShareClass(option?: any): (target: any) => void;
export interface ShareConfig {
    type?: "beforeExec" | "afterExec";
    maxLog?: number;
    allowedTo?: string[];
    update?: {
        freq?: number;
        interpolateBy?: number;
        reckonUntil?: number;
    };
}
export declare const shareConfigDefault: ShareConfig;
export declare function Share(config?: ShareConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface GetStateConfig {
    maxInterval?: number;
    maxUpdates?: number;
}
export declare const getStateConfigDefault: GetStateConfig;
export declare function GetState(config?: GetStateConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface SetStateConfig {
}
export declare function SetState(config?: SetStateConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface EnterRoomConfig {
}
export declare function EnterRoom(config?: EnterRoomConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface LeaveRoomConfig {
}
export declare function LeaveRoom(config?: LeaveRoomConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface PeerJoinConfig {
}
export declare function PeerJoin(config?: PeerJoinConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface PeerLeaveConfig {
}
export declare function PeerLeave(config?: PeerLeaveConfig): (target: any, name: string, descriptor: PropertyDescriptor) => void;
export interface MethodConfig {
    share?: ShareConfig;
    getState?: GetStateConfig;
    setState?: SetStateConfig;
    enterRoom?: EnterRoomConfig;
    leaveRoom?: LeaveRoomConfig;
    peerJoin?: PeerJoinConfig;
    peerLeave?: PeerLeaveConfig;
}
export type CastType = "UNICAST" | "MULTICAST" | "BROADCAST" | "OTHERCAST" | "SELFCAST" | "CLIENTTOSERVER" | "SERVERTOCLIENT";
export interface Message {
    type: string;
    sender?: string;
    castType?: CastType;
    recipients?: string[];
    [name: string]: any;
}
export interface SystemMessage extends Message {
    sender: undefined;
    castType: undefined;
    recipients: undefined;
}
export interface LoginRoomBody {
    key?: string;
    roomSpec?: {};
    peerProfile?: {};
}
export interface LoginRoom extends SystemMessage, LoginRoomBody {
    type: "LoginRoom";
}
export declare function newLoginRoom(body: LoginRoomBody): LoginRoom;
export interface PeerInfo {
    id: string;
    order: number;
    profile: {
        [key: string]: any;
    };
}
export interface EnterRoom extends Message {
    type: "EnterRoom";
    sender: "__SYSTEM__";
    self: {
        id: string;
        order: number;
    };
    peers: PeerInfo[];
    histories: StoredMessageType[];
}
export interface LeaveRoom extends Message {
    type: "LeaveRoom";
    sender: "__SYSTEM__";
}
export interface PeerJoin extends Message {
    type: "PeerJoin";
    sender: "__SYSTEM__";
    peer: PeerInfo;
}
export interface PeerLeave extends Message {
    type: "PeerLeave";
    sender: "__SYSTEM__";
    peerId: string;
}
export interface UpdatePeerProfileBody {
    peerId: string;
    updates?: {};
    deletes?: string[];
}
export interface UpdatePeerProfile extends SystemMessage, UpdatePeerProfileBody {
    type: "UpdatePeerProfile";
}
export declare function newUpdatePeerProfile(body: UpdatePeerProfileBody): UpdatePeerProfile;
export interface ObjectDefinitionBody {
    objId: number;
    className: string;
    methods: MethodDefinition[];
}
export interface ObjectDefinition extends SystemMessage, ObjectDefinitionBody {
    type: "ObjectDefinition";
}
export declare function newObjectDefinition(body: ObjectDefinitionBody): ObjectDefinition;
export interface MethodDefinitionBody {
    funcId?: number;
    name: string;
    config: MethodConfig;
}
export interface MethodDefinition extends SystemMessage, MethodDefinitionBody {
    type: "MethodDefinition";
}
export declare function newMethodDefinition(body: MethodDefinitionBody): MethodDefinition;
export interface FunctionDefinitionBody {
    funcId: number;
    name: string;
    config: ShareConfig;
}
export interface FunctionDefinition extends SystemMessage, FunctionDefinitionBody {
    type: "FunctionDefinition";
}
export declare function newFunctionDefinition(body: FunctionDefinitionBody): FunctionDefinition;
export interface InvocationBody {
    objId?: number;
    objRevision?: number;
    funcId: number;
    funcName: string;
    args: any[];
}
export interface Invocation extends Message, InvocationBody {
    type: "Invocation";
    sender: undefined;
    castType: CastType;
    recipients: undefined;
}
export declare function newInvocation(castType: CastType, body: InvocationBody): Invocation;
export interface ObjectStateBody {
    objId: number;
    state: string;
    revision: number;
}
export interface ObjectState extends SystemMessage {
    type: "ObjectState";
}
export declare function newObjectState(body: ObjectStateBody): ObjectState;
export interface CustomMessage extends Message {
    body: any;
}
export type UpstreamMessageType = LoginRoom | UpdatePeerProfile | ObjectDefinition | MethodDefinition | FunctionDefinition | ObjectState | Invocation;
export type DownStreamMessageType = EnterRoom | LeaveRoom | PeerJoin | PeerLeave | UpdatePeerProfile | Invocation | ObjectState;
export type StoredMessageType = Invocation | ObjectState;
export interface MethodAndConfigParam {
    method: Function;
    share?: ShareConfig;
    getState?: GetStateConfig;
    setState?: SetStateConfig;
    enterRoom?: EnterRoomConfig;
    leaveRoom?: LeaveRoomConfig;
    peerJoin?: PeerJoinConfig;
    peerLeave?: PeerLeaveConfig;
}
export declare class Madoi extends MadoiEvents {
    private connecting;
    private interimQueue;
    private sharedFunctions;
    private sharedObjects;
    private getStateMethods;
    private setStateMethods;
    private enterRoomMethods;
    private leaveRoomMethods;
    private peerJoinMethods;
    private peerLeaveMethods;
    private promises;
    private objectModifications;
    private objectRevisions;
    private handlers;
    private url;
    private ws;
    private selfPeerId;
    private profile;
    private peers;
    private currentSender;
    private lastObjRevision;
    constructor(servicePath: string, key?: string | null, roomSpecs?: {}, profile?: {});
    start(): void;
    getSelfPeerId(): string | null;
    getCurrentSenderPeerId(): string | null;
    isCurrentSenderSelf(): boolean;
    getCurrentSenderPeer(): PeerInfo | null | undefined;
    getObjRevision(): number | null;
    close(): void;
    private handleOnOpen;
    private handleOnClose;
    private handleOnError;
    private handleOnMessage;
    private data;
    onOpen(_e: Event): void;
    onClose(_e: Event): void;
    onError(_e: Event): void;
    onElse(_msg: any): void;
    onEnterRoom(self: {
        id: string;
        order: number;
    }, peers: PeerInfo[]): void;
    onLeaveRoom(): void;
    onPeerJoin(peer: PeerInfo): void;
    onPeerLeave(peerId: string): void;
    onUpdatePeerProfile(peerId: string, updates?: {}, deletes?: string[]): void;
    send(type: string, body: any, castType?: CastType): void;
    unicast(type: string, body: any, recipient: string): void;
    multicast(type: string, body: any, recipients: string[]): void;
    broadcast(type: string, body: any): void;
    othercast(type: string, body: any): void;
    setHandler(type: string, handler: (body: any) => void): void;
    clearHandler(type: string): void;
    sendMessage(msg: Message): void;
    register<T>(object: T, methodAndConfigs?: MethodAndConfigParam[]): T;
    registerFunction(func: Function, config?: ShareConfig): () => any;
    private addSharedFunction;
    saveStates(): void;
    private applyInvocation;
}
export {};
