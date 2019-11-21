/*!
 * wiscroll v0.1.1
 * (c) Tom Chen <tomchen.org@gmail.com>, MIT license
 */
!function(t){var e={};function o(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=e,o.d=function(t,e,r){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(r,n,function(e){return t[e]}.bind(null,n));return r},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)}([function(t,e,o){"use strict";o.r(e);const r={top:"0%",bottom:"100%"},n={top:{up:!0,down:!1,in:!0,out:!1},bottom:{up:!1,down:!0,in:!0,out:!1}},i={top:{in:!0,out:!1,up:!0,down:!1},bottom:{in:!1,out:!0,up:!0,down:!1}},s=(t,e,o,r)=>{const n=/(-{0,1})(.+)(px|%)/.exec(t);let i,s=n[3],l=n[2];const u=e.innerHeight||e.getBoundingClientRect().height;if("px"===r&&"%"===s&&(l=l*u/100,s="px"),i="px"===s?u-l:100-l,"-"===n[1]){const t=i;i=l,l=t}return{rootBorderFromTop:l,rootBorderFromBottom:i,rootBorderUnit:s}},l=(t,e)=>{let o,r,n,i,s,l=null,u=0;const c=()=>{u=0,l=null,n=t.apply(o,r),l||(o=null,r=null)};return(...h)=>(i=Date.now(),u||(u=i),s=e-(i-u),o=void 0,r=h,0>=s||s>e?(l&&(clearTimeout(l),l=null),u=i,n=t.apply(o,r),!l&&(o=null,r=null)):!l&&(l=setTimeout(c,s)),n)},u={init:null,in:null,out:null,delay:150,fromIsBelowTo:!0};e.default=class{constructor(t,e=null){this.target=t,this.root=e,this.rootEl=e||window,this.observers=[],this.listeners=[]}observe(t,e,o,l,u){let c,h=t;h in r&&(h=r[h]);const d=n[e][o],a=i[e][o],{rootBorderFromTop:p,rootBorderFromBottom:f,rootBorderUnit:g}=s(h,this.rootEl,a),v=this.rootEl.innerHeight||this.rootEl.getBoundingClientRect().height,b=a?`${this.target.getBoundingClientRect().height+v}px`:`-${p}${g}`,m=a?`-${f}${g}`:`${this.target.getBoundingClientRect().height+v}px`,w=d?0:1,B=new IntersectionObserver(t=>{t.forEach(t=>{if(void 0===c&&"function"==typeof u&&u.call(this,t.rootBounds[a?"bottom":"top"]>t.boundingClientRect[e],t),t.isIntersecting){let e;const o=t.boundingClientRect.y;o>c?e=!1:o<c&&(e=!0),e===a&&!0===t.isIntersecting&&"function"==typeof l&&l.call(this,t)}c=t.boundingClientRect.y})},{root:this.root,threshold:[w],rootMargin:`${b} 0% ${m}`});return B.observe(this.target),this.observers.push(B),this}cancel(){return this.observers.forEach(t=>{t.unobserve(this.target)}),this.listeners.forEach(t=>{window.removeEventListener("scroll",t,!1)}),this}on(t,e,o){const[r,n,i]=t.split(" ");let s=o;return void 0===i?"function"==typeof e?(this.observe(r,n,"up",e,(t,o)=>{t?e(o):s(o)}),this.observe(r,n,"down",t=>{s(t)})):(s=void 0===s||s,this.observe(r,n,"up",()=>{this.target.classList[s?"add":"remove"](...e.split(" "))},t=>{t?this.target.classList[s?"add":"remove"](...e.split(" ")):this.target.classList[s?"remove":"add"](...e.split(" "))}),this.observe(r,n,"down",()=>{this.target.classList[s?"remove":"add"](...e.split(" "))})):this.observe(r,n,i,e,s),this}init(t,e){const[o,r]=t.split(" ");return this.observe(o,r,"up",null,(t,o)=>{e.call(this,t,o)}),this}fromto(t,e,o,r){const[n,i]=t.split(" "),[c,h]=e.split(" "),d={...u,...r||{}};let a,p;const f=s(n,this.rootEl,d.fromIsBelowTo,"px").rootBorderFromTop;let g=s(c,this.rootEl,!d.fromIsBelowTo,"px").rootBorderFromTop-f;"top"===i&&"bottom"===h?g-=this.target.getBoundingClientRect().height:"bottom"===i&&"top"===h&&(g+=this.target.getBoundingClientRect().height);const v=()=>(this.target.getBoundingClientRect()[i]-f)/g;return this.observe(n,i,d.fromIsBelowTo?"up":"down",t=>{a=l(()=>{o.call(this,v(),t)},d.delay),d.in&&d.in.call(this,v(),t),window.addEventListener("scroll",a,!1),p=this.listeners.push(a)-1},(t,e)=>{const r=v();d.init&&d.init.call(this,r,e),0<r&&1>r&&(a=l(()=>{o.call(this,v(),e)},d.delay),d.in&&d.in.call(this,v(),e),window.addEventListener("scroll",a,!1),p=this.listeners.push(a)-1)}),this.observe(c,h,d.fromIsBelowTo?"down":"up",t=>{a=l(()=>{o.call(this,v(),t)},d.delay),d.in&&d.in.call(this,v(),t),window.addEventListener("scroll",a,!1),p=this.listeners.push(a)-1}),this.observe(c,h,d.fromIsBelowTo?"up":"down",t=>{window.removeEventListener("scroll",a,!1),delete this.listeners[p],d.out&&d.out.call(this,v(),t)}),this.observe(n,i,d.fromIsBelowTo?"down":"up",t=>{window.removeEventListener("scroll",a,!1),delete this.listeners[p],d.out&&d.out.call(this,v(),t)}),this}fromTo(...t){return this.fromto(t),this}}}]);