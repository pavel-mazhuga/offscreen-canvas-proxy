import { Remote } from 'comlink';
declare type ProxyData = {
    canvas: HTMLCanvasElement;
    worker?: Worker;
    workerUrl: string | URL;
};
export declare type OffscreenBaseData = {
    canvas: HTMLCanvasElement;
    isWorker: boolean;
};
export interface BaseEntity {
    rAF: number;
    state: Record<string, any>;
    canvas: HTMLCanvasElement;
    isWorker: boolean;
}
export declare class BaseEntity {
    constructor(options: OffscreenBaseData);
    getState(): Record<string, any>;
    setState(newState?: {}): void;
}
export declare function createOffscreenCanvas<T = any>({ canvas, worker, workerUrl }: ProxyData, data: Record<string, any>, forceMainThread?: boolean): Promise<Remote<T>>;
export declare function initializeWorker(factory: (_options: any) => any): void;
export {};
