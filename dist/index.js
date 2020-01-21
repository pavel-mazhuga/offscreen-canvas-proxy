import{wrap as r}from"comlink";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */var n=function(){return(n=Object.assign||function(r){for(var n,e=1,o=arguments.length;e<o;e++)for(var t in n=arguments[e])Object.prototype.hasOwnProperty.call(n,t)&&(r[t]=n[t]);return r}).apply(this,arguments)};export default function(e,o){var t=e.canvas,a=e.workerUrl,c=e.name;return new Promise((function(e,s){if(t.transferControlToOffscreen)try{var i=new Worker(a),f=t.transferControlToOffscreen(),l=r(i);i.postMessage(n({canvas:f,isWorker:!0},o),[f]),e(l)}catch(r){s(r)}else{var u=document.createElement("script");u.src=a,u.async=!0,u.onload=function(){e(window[c](n({canvas:t,isWorker:!1},o)))},u.onerror=function(r){return s(r)},document.head.appendChild(u)}}))}
