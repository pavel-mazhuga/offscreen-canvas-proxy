interface ProxyData {
    canvas: HTMLCanvasElement;
    workerUrl: string;
    name: string;
}
declare const _default: ({ canvas, workerUrl, name }: ProxyData, data: unknown[]) => Promise<unknown>;
/**
 * @param  {} canvas - HTMLCanvasElement
 * @param  {} workerUrl - path to the worker file
 * @param  {} name - unique name for accessing module from 'window' object
 * (if 'transferControlToOffscreen' is not supported)
 */
export default _default;
