import{wrap as s,expose as e}from"comlink";class t{constructor(s){this.rAF=0,this.state={},this.canvas=s.canvas,this.isWorker=s.isWorker}getState(){return this.state}setState(s={}){this.state=Object.assign(Object.assign({},this.state),s)}}function n({canvas:e,workerUrl:t},n,a=!1){return new Promise(((r,o)=>{if(e.transferControlToOffscreen&&!a)try{const a=new Worker(t),o=e.transferControlToOffscreen();a.addEventListener("message",(e=>{if("ready"===e.data){const e=s(a);r(e)}})),a.postMessage({message:"init",options:Object.assign({canvas:o,isWorker:!0},n)},[o])}catch(s){o(s)}else{const s=document.createElement("script");s.src=t,s.async=!0,s.onload=()=>{r(window[t](Object.assign({canvas:e,isWorker:!1},n))),window[t]=null},s.onerror=s=>o(s),document.head.appendChild(s)}}))}function a(s){self.addEventListener("message",(({data:{message:t,options:n}})=>{"init"===t&&(e(s(n)),self.postMessage("ready"))}))}export{t as BaseEntity,n as createOffscreenCanvas,a as initializeWorker};
