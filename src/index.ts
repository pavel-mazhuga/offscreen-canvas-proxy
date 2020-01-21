import { wrap } from 'comlink';

interface ProxyData {
    canvas: HTMLCanvasElement;
    workerUrl: string;
    name: string;
}
/**
 * @param  {} canvas - HTMLCanvasElement
 * @param  {} workerUrl - path to the worker file
 * @param  {} name - unique name for accessing module from 'window' object
 * (if 'transferControlToOffscreen' is not supported)
 */
export default ({ canvas, workerUrl, name }: ProxyData, data: unknown[]) => {
    return new Promise((resolve, reject) => {
        if (canvas.transferControlToOffscreen) {
            try {
                const worker = new Worker(workerUrl);
                const offscreen = canvas.transferControlToOffscreen();
                const proxy = wrap(worker);

                worker.postMessage(
                    {
                        canvas: offscreen,
                        isWorker: true,
                        ...data,
                    },
                    [offscreen],
                );

                resolve(proxy);
            } catch (err) {
                reject(err);
            }
        } else {
            const script = document.createElement('script');
            script.src = workerUrl;
            script.async = true;
            script.onload = () => {
                resolve(
                    (window as any)[name]({
                        canvas,
                        isWorker: false,
                        ...data,
                    }),
                );
            };

            script.onerror = err => reject(err);
            document.head.appendChild(script);
        }
    });
};
