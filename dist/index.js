/*!
 * wiscroll v0.1.1
 * (c) Tom Chen <tomchen.org@gmail.com>, MIT license
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Wiscroll=e():t.Wiscroll=e()}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t){return function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function l(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],o=!0,r=!1,i=void 0;try{for(var l,u=t[Symbol.iterator]();!(o=(l=u.next()).done)&&(n.push(l.value),!e||n.length!==e);o=!0);}catch(t){r=!0,i=t}finally{try{o||null==u.return||u.return()}finally{if(r)throw i}}return n}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function u(t,e){for(var n,o=0;o<e.length;o++)(n=e[o]).enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}var c={top:"0%",bottom:"100%"},s={top:{up:!0,down:!1,in:!0,out:!1},bottom:{up:!1,down:!0,in:!0,out:!1}},a={top:{in:!0,out:!1,up:!0,down:!1},bottom:{in:!1,out:!0,up:!0,down:!1}},f=function(t,e,n,o){var r,i=/(-{0,1})(.+)(px|%)/.exec(t),l=i[3],u=i[2],c=e.innerHeight||e.getBoundingClientRect().height;if("px"===o&&"%"===l&&(u=u*c/100,l="px"),r="px"===l?c-u:100-u,"-"===i[1]){var s=r;r=u,u=s}return{rootBorderFromTop:u,rootBorderFromBottom:r,rootBorderUnit:l}},p=function(t,e){var n,o,r,i,l,u=null,c=0,s=function(){c=0,u=null,r=t.apply(n,o),u||(n=null,o=null)};return function(){i=Date.now(),c||(c=i),l=e-(i-c),n=void 0;for(var a=arguments.length,f=Array(a),p=0;p<a;p++)f[p]=arguments[p];return o=f,0>=l||l>e?(u&&(clearTimeout(u),u=null),c=i,r=t.apply(n,o),!u&&(n=null,o=null)):!u&&(u=setTimeout(s,l)),r}},d={init:null,in:null,out:null,delay:150,fromIsBelowTo:!0},h=function(){function t(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")})(this,t),this.target=e,this.root=n,this.rootEl=n||window,this.observers=[],this.listeners=[]}return function(t,e,n){e&&u(t.prototype,e),n&&u(t,n)}(t,[{key:"observe",value:function(t,e,n,o,r){var i,l=this,u=t;u in c&&(u=c[u]);var p=s[e][n],d=a[e][n],h=f(u,this.rootEl),v=h.rootBorderFromTop,b=h.rootBorderFromBottom,y=h.rootBorderUnit,g=this.rootEl.innerHeight||this.rootEl.getBoundingClientRect().height,m=d?"".concat(this.target.getBoundingClientRect().height+g,"px"):"-".concat(v).concat(y),w=d?"-".concat(b).concat(y):"".concat(this.target.getBoundingClientRect().height+g,"px"),O=p?0:1,j=new IntersectionObserver((function(t){t.forEach((function(t){if(void 0===i&&"function"==typeof r&&r.call(l,t.rootBounds[d?"bottom":"top"]>t.boundingClientRect[e],t),t.isIntersecting){var n,u=t.boundingClientRect.y;u>i?n=!1:u<i&&(n=!0),n===d&&!0===t.isIntersecting&&"function"==typeof o&&o.call(l,t)}i=t.boundingClientRect.y}))}),{root:this.root,threshold:[O],rootMargin:"".concat(m," 0% ").concat(w)});return j.observe(this.target),this.observers.push(j),this}},{key:"cancel",value:function(){var t=this;return this.observers.forEach((function(e){e.unobserve(t.target)})),this.listeners.forEach((function(t){window.removeEventListener("scroll",t,!1)})),this}},{key:"on",value:function(t,e,n){var o=this,r=l(t.split(" "),3),u=r[0],c=r[1],s=r[2],a=n;return void 0===s?"function"==typeof e?(this.observe(u,c,"up",e,(function(t,n){t?e(n):a(n)})),this.observe(u,c,"down",(function(t){a(t)}))):(a=void 0===a||a,this.observe(u,c,"up",(function(){var t;(t=o.target.classList)[a?"add":"remove"].apply(t,i(e.split(" ")))}),(function(t){var n,r;t?(n=o.target.classList)[a?"add":"remove"].apply(n,i(e.split(" "))):(r=o.target.classList)[a?"remove":"add"].apply(r,i(e.split(" ")))})),this.observe(u,c,"down",(function(){var t;(t=o.target.classList)[a?"remove":"add"].apply(t,i(e.split(" ")))}))):this.observe(u,c,s,e,a),this}},{key:"init",value:function(t,e){var n=this,o=l(t.split(" "),2),r=o[0],i=o[1];return this.observe(r,i,"up",null,(function(t,o){e.call(n,t,o)})),this}},{key:"fromto",value:function(t,e,n,i){var u,c,s=this,a=l(t.split(" "),2),h=a[0],v=a[1],b=l(e.split(" "),2),y=b[0],g=b[1],m=function(t){for(var e,n=1;n<arguments.length;n++)e=null==arguments[n]?{}:arguments[n],n%2?o(e,!0).forEach((function(n){r(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):o(e).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}));return t}({},d,{},i||{}),w=f(h,this.rootEl,m.fromIsBelowTo,"px").rootBorderFromTop,O=f(y,this.rootEl,m.fromIsBelowTo,"px").rootBorderFromTop-w;"top"===v&&"bottom"===g?O-=this.target.getBoundingClientRect().height:"bottom"===v&&"top"===g&&(O+=this.target.getBoundingClientRect().height);var j=function(){return(s.target.getBoundingClientRect()[v]-w)/O};return this.observe(h,v,m.fromIsBelowTo?"up":"down",(function(t){u=p((function(){n.call(s,j(),t)}),m.delay),m.in&&m.in.call(s,j(),t),window.addEventListener("scroll",u,!1),c=s.listeners.push(u)-1}),(function(t,e){var o=j();m.init&&m.init.call(s,o,e),0<o&&1>o&&(u=p((function(){n.call(s,j(),e)}),m.delay),m.in&&m.in.call(s,j(),e),window.addEventListener("scroll",u,!1),c=s.listeners.push(u)-1)})),this.observe(y,g,m.fromIsBelowTo?"down":"up",(function(t){u=p((function(){n.call(s,j(),t)}),m.delay),m.in&&m.in.call(s,j(),t),window.addEventListener("scroll",u,!1),c=s.listeners.push(u)-1})),this.observe(y,g,m.fromIsBelowTo?"up":"down",(function(t){window.removeEventListener("scroll",u,!1),delete s.listeners[c],m.out&&m.out.call(s,j(),t)})),this.observe(h,v,m.fromIsBelowTo?"down":"up",(function(t){window.removeEventListener("scroll",u,!1),delete s.listeners[c],m.out&&m.out.call(s,j(),t)})),this}},{key:"fromTo",value:function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];return this.fromto(e),this}}]),t}();e.default=h}]).default}));