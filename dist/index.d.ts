import { Remote } from 'comlink';
declare type ProxyData = {
    canvas: HTMLCanvasElement;
    workerUrl: string;
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
export declare function createOffscreenCanvas<T = any>({ canvas, workerUrl }: ProxyData, data: Record<string, any>): Promise<Remote<T>>;
export declare function initializeWorker(factory: Function): void;
export {};
