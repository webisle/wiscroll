/*!
 * wiscroll v0.1.3 (ES5 UMD version)
 * (c) Tom Chen <tomchen.org@gmail.com>, MIT license
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).Wiscroll=e()}(this,(function(){"use strict";function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function e(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function n(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],o=!0,r=!1,i=void 0;try{for(var l,s=t[Symbol.iterator]();!(o=(l=s.next()).done)&&(n.push(l.value),!e||n.length!==e);o=!0);}catch(t){r=!0,i=t}finally{try{o||null==s.return||s.return()}finally{if(r)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function r(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var i={top:"0%",bottom:"100%"},l={top:{up:!0,down:!1,in:!0,out:!1},bottom:{up:!1,down:!0,in:!0,out:!1}},s={top:{in:!0,out:!1,up:!0,down:!1},bottom:{in:!1,out:!0,up:!0,down:!1}},u=function(t,e,n,o){var r,i=/(-{0,1})(.+)(px|%)/.exec(t),l=i[3],s=i[2],u=e.innerHeight||e.getBoundingClientRect().height;if("px"===o&&"%"===l&&(s=s*u/100,l="px"),r="px"===l?u-s:100-s,"-"===i[1]){var c=r;r=s,s=c}return{rootBorderFromTop:s,rootBorderFromBottom:r,rootBorderUnit:l}},c=function(t,e,n){var o,r,i,l,s=n,u=null,c=0,a=function(){c=0,u=null,r=t.apply(s,o),u||(s=null,o=null)};return function(){i=Date.now(),c||(c=i),l=e-(i-c),s=void 0;for(var n=arguments.length,f=new Array(n),p=0;p<n;p++)f[p]=arguments[p];return o=f,l<=0||l>e?(u&&(clearTimeout(u),u=null),c=i,r=t.apply(s,o),u||(s=null,o=null)):u||(u=setTimeout(a,l)),r}},a={init:null,in:null,out:null,delay:150,fromIsBelowTo:!0};return function(){function f(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,f),this.target=t,this.root=e,this.rootEl=e||window,this.observers=[],this.listeners=[]}var p,h,d;return p=f,(h=[{key:"observe",value:function(t,e,n,o,r){var c,a=this,f=t;f in i&&(f=i[f]);var p=l[e][n],h=s[e][n],d=u(f,this.rootEl),v=d.rootBorderFromTop,b=d.rootBorderFromBottom,g=d.rootBorderUnit,y=this.rootEl.innerHeight||this.rootEl.getBoundingClientRect().height,w=h?"".concat(this.target.getBoundingClientRect().height+y,"px"):"-".concat(v).concat(g),m=h?"-".concat(b).concat(g):"".concat(this.target.getBoundingClientRect().height+y,"px"),B=p?0:1,O=new IntersectionObserver((function(t){t.forEach((function(t){if(void 0===c&&"function"==typeof r&&r.call(a,t.rootBounds[h?"bottom":"top"]>t.boundingClientRect[e],t),t.isIntersecting){var n,i=t.boundingClientRect.y;i>c?n=!1:i<c&&(n=!0),n===h&&!0===t.isIntersecting&&"function"==typeof o&&o.call(a,t)}c=t.boundingClientRect.y}))}),{root:this.root,threshold:[B],rootMargin:"".concat(w," 0% ").concat(m)});return O.observe(this.target),this.observers.push(O),this}},{key:"cancel",value:function(){var t=this;return this.observers.forEach((function(e){e.unobserve(t.target)})),this.listeners.forEach((function(t){window.removeEventListener("scroll",t,!1)})),this}},{key:"on",value:function(t,e,n){var i=this,l=o(t.split(" "),3),s=l[0],u=l[1],c=l[2],a=n;return void 0===c?"function"==typeof e?(this.observe(s,u,"up",e,(function(t,n){t?e(n):a(n)})),this.observe(s,u,"down",(function(t){a(t)}))):(a=void 0===a||a,this.observe(s,u,"up",(function(){var t;(t=i.target.classList)[a?"add":"remove"].apply(t,r(e.split(" ")))}),(function(t){var n,o;t?(n=i.target.classList)[a?"add":"remove"].apply(n,r(e.split(" "))):(o=i.target.classList)[a?"remove":"add"].apply(o,r(e.split(" ")))})),this.observe(s,u,"down",(function(){var t;(t=i.target.classList)[a?"remove":"add"].apply(t,r(e.split(" ")))}))):this.observe(s,u,c,e,a),this}},{key:"init",value:function(t,e){var n=this,r=o(t.split(" "),2),i=r[0],l=r[1];return this.observe(i,l,"up",null,(function(t,o){e.call(n,t,o)})),this}},{key:"fromto",value:function(t,r,i,l){var s,f,p=this,h=o(t.split(" "),2),d=h[0],v=h[1],b=o(r.split(" "),2),g=b[0],y=b[1],w=function(t){for(var o=1;o<arguments.length;o++){var r=null!=arguments[o]?arguments[o]:{};o%2?n(Object(r),!0).forEach((function(n){e(t,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},a,{},l||{}),m=u(d,this.rootEl,w.fromIsBelowTo,"px").rootBorderFromTop,B=u(g,this.rootEl,w.fromIsBelowTo,"px").rootBorderFromTop-m;"top"===v&&"bottom"===y?B-=this.target.getBoundingClientRect().height:"bottom"===v&&"top"===y&&(B+=this.target.getBoundingClientRect().height);var O=function(){return(p.target.getBoundingClientRect()[v]-m)/B};return this.observe(d,v,w.fromIsBelowTo?"up":"down",(function(t){s=c((function(){i.call(p,O(),t)}),w.delay),w.in&&w.in.call(p,O(),t),window.addEventListener("scroll",s,!1),f=p.listeners.push(s)-1}),(function(t,e){var n=O();w.init&&w.init.call(p,n,e),n>0&&n<1&&(s=c((function(){i.call(p,O(),e)}),w.delay),w.in&&w.in.call(p,O(),e),window.addEventListener("scroll",s,!1),f=p.listeners.push(s)-1)})),this.observe(g,y,w.fromIsBelowTo?"down":"up",(function(t){s=c((function(){i.call(p,O(),t)}),w.delay),w.in&&w.in.call(p,O(),t),window.addEventListener("scroll",s,!1),f=p.listeners.push(s)-1})),this.observe(g,y,w.fromIsBelowTo?"up":"down",(function(t){window.removeEventListener("scroll",s,!1),delete p.listeners[f],w.out&&w.out.call(p,O(),t)})),this.observe(d,v,w.fromIsBelowTo?"down":"up",(function(t){window.removeEventListener("scroll",s,!1),delete p.listeners[f],w.out&&w.out.call(p,O(),t)})),this}},{key:"fromTo",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return this.fromto(e),this}}])&&t(p.prototype,h),d&&t(p,d),f}()}));
