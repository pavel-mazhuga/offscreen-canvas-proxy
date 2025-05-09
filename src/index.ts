/* eslint-disable no-restricted-globals */
import { wrap, expose, Remote } from 'comlink';

type ProxyData = {
    canvas: HTMLCanvasElement;
    worker?: Worker;
    WorkerConstructor?: new () => Worker;
    workerUrl: string | URL;
};

export type OffscreenBaseData = {
    canvas: HTMLCanvasElement;
    isWorker: boolean;
};

export interface BaseEntity {
    rAF: number;
    state: Record<string, any>;
    canvas: HTMLCanvasElement;
    isWorker: boolean;
}

export class BaseEntity {
    constructor(options: OffscreenBaseData) {
        this.rAF = 0;
        this.state = {};
        this.canvas = options.canvas;
        this.isWorker = options.isWorker;
    }

    getState() {
        return this.state;
    }

    setState(newState = {}) {
        this.state = { ...this.state, ...newState };
    }
}

/**
 * @param  {} canvas - HTMLCanvasElement
 * @param  {} WorkerConstructor - custom Worker Constructor
 * @param  {} workerUrl - path to a worker file
 */
export function createOffscreenCanvas<T = any>(
    { canvas, worker: workerInstance, WorkerConstructor, workerUrl }: ProxyData,
    data: Record<string, any>,
    forceMainThread = false,
): Promise<Remote<T>> {
    return new Promise((resolve, reject) => {
        if (canvas.transferControlToOffscreen && !forceMainThread) {
            try {
                const worker =
                    workerInstance ||
                    (WorkerConstructor ? new WorkerConstructor() : new Worker(workerUrl, { type: 'module' }));
                const offscreen = canvas.transferControlToOffscreen();

                worker.addEventListener('message', (event) => {
                    if (event.data === 'ready') {
                        const proxy = wrap<T>(worker);
                        resolve(proxy);
                    }
                });

                worker.postMessage(
                    {
                        message: 'init',
                        options: { canvas: offscreen, isWorker: true, ...data },
                    },
                    [offscreen],
                );
            } catch (err) {
                reject(err);
            }
        } else {
            const script = document.createElement('script');
            const src = workerUrl instanceof URL ? workerUrl.toString() : workerUrl;
            script.src = src;
            script.async = true;
            script.onload = () => {
                resolve((window as any)[src]({ canvas, isWorker: false, ...data }));
                (window as any)[src] = null;
            };
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        }
    });
}

export function initializeWorker(factory: (_options: any) => any) {
    self.addEventListener('message', ({ data: { message, options } }) => {
        if (message === 'init') {
            expose(factory(options));
            (self as any).postMessage('ready');
        }
    });
}
