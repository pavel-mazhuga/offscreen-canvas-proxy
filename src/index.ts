import { wrap } from 'comlink';

interface ProxyData {
    canvas: HTMLCanvasElement;
    workerUrl: string;
    id: string;
}

export interface OffscreenBaseData {
    canvas: HTMLCanvasElement;
    isWorker: boolean;
}

/**
 * @param  {} canvas - HTMLCanvasElement
 * @param  {} workerUrl - path to the worker file
 * @param  {} id - unique id for accessing module from 'window' object
 * (if 'transferControlToOffscreen' is not supported)
 */
export function createOffscreenCanvas<T>({ canvas, workerUrl, id }: ProxyData, data: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
        if (canvas.transferControlToOffscreen) {
            try {
                const worker = new Worker(workerUrl);
                const offscreen = canvas.transferControlToOffscreen();

                worker.addEventListener('message', event => {
                    if (event.data === 'ready') {
                        const proxy = wrap<T>(worker);
                        resolve(proxy);
                    }
                });

                worker.postMessage(
                    {
                        message: 'init',
                        options: {
                            canvas: offscreen,
                            isWorker: true,
                            ...data,
                        },
                    },
                    [offscreen],
                );
            } catch (err) {
                reject(err);
            }
        } else {
            const script = document.createElement('script');
            script.src = workerUrl;
            script.async = true;
            script.onload = () => {
                resolve(
                    new (window as any)[id]({
                        canvas,
                        isWorker: false,
                        ...data,
                    }),
                );
                (window as any)[id] = null;
            };
            script.onerror = err => reject(err);
            document.head.appendChild(script);
        }
    });
}

export class BaseEntity {
    private rAF: number;

    canvas: HTMLCanvasElement;

    isWorker: boolean;

    constructor(options: OffscreenBaseData) {
        this.rAF = 0;
        this.state = {};
        this.canvas = options.canvas;
        this.isWorker = options.isWorker;
    }

    async getState() {
        return this.state;
    }

    async setState(newState = {}) {
        this.state = { ...this.state, ...newState };
    }
}
