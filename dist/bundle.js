!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=(e,t)=>e<t?e:t;function o(e){let t={weeksNonOvertimeHours:0,consecutiveDays:0},n=[];return e.forEach(e=>{let o=function(e,t){let n=0===e?0:t.consecutiveDays+1,o=t.weeksNonOvertimeHours,a=[];if(7===n)e>8&&a.push({hours:e-8,reason:"More than 8 hours on the 7th consecutive day in a workweek",rate:2}),a.push({hours:r(e,8),reason:"7th consecutive day in a workweek",rate:1.5});else{let n=0;e>12&&(a.push({hours:e-12,reason:"More than 12 hours in a workday",rate:2}),n+=e-12),e>8&&(a.push({hours:r(e-8,4),reason:"More than 8 hours in a day",rate:1.5}),n+=r(e-8,4)),t.weeksNonOvertimeHours+e-n>40&&(a.push({hours:r(t.weeksNonOvertimeHours+e-n-40,e),reason:"More then 40 non-overtime hours in a workweek",rate:1.5}),n+=r(t.weeksNonOvertimeHours+e-n-40,e)),e-n>0?(a.push({hours:e-n,reason:"Normal",rate:1}),o+=e-n):0===a.length&&a.push({hours:0,reason:"Normal",rate:1})}return{breakdown:a,newContext:{consecutiveDays:n,weeksNonOvertimeHours:o}}}(e,t);t=o.newContext,n.push(o.breakdown)}),n}t.PayWithReason=o;let a=e=>e.map(e=>`${e.hours} hours @ ${e.rate}x because ${e.reason}`).join(" | ");const u={1:0,1.5:0,2:0};t.TotalEffectiveHours=function(e,t=!1){t&&console.table(o(e).map(a));const n=(e,t)=>({1:(e[1]||0)+(t[1]||0),1.5:(e[1.5]||0)+(t[1.5]||0),2:(e[2]||0)+(t[2]||0)});return o(e).map(e=>e.map(e=>({[e.rate]:e.hours})).reduce(n,u)).reduce(n,u)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),o=e=>document.getElementById(e);window.onload=(()=>{a();for(let e=1;e<=7;e++){o("day"+e).onchange=a}});function a(){let e=function(){let e=[0,0,0,0,0,0,0];for(let t=1;t<=7;t++){let n=o("day"+t);n.value&&(e[t-1]=parseFloat(n.value))}return e}();o("response").style.display="block";let t=r.TotalEffectiveHours(e);o("hoursspan1").textContent=""+t[1],o("hoursspan1.5").textContent=""+t[1.5],o("hoursspan2").textContent=""+t[2],function(e){const t=["Thursday","Friday","Saturday","Sunday","Monday","Tuesday","Wednesday"],n=(e,t,n)=>{for(let r=n.length-1;r>=0;r--){let o=document.createElement("tr"),a=document.createElement("td");a.innerText=r===n.length-1?t:"",o.appendChild(a);let u=document.createElement("td");u.innerText=""+n[r].hours,o.appendChild(u);let s=document.createElement("td");s.innerText=""+n[r].rate,o.appendChild(s);let l=document.createElement("td");l.innerText=""+n[r].reason,o.appendChild(l),e.appendChild(o)}};o("description-table").innerHTML="";let r=o("description-table").appendChild(document.createElement("table"));(e=>{let t=document.createElement("tr"),n=document.createElement("th");n.innerText="Day",t.appendChild(n);let r=document.createElement("th");r.innerText="Hours",t.appendChild(r);let o=document.createElement("th");o.innerText="Rate",t.appendChild(o);let a=document.createElement("th");a.innerText="Reason",t.appendChild(a),e.appendChild(t)})(r);for(let o=0;o<7;o++){n(r,t[o],e[o]);let a=document.createElement("tr");a.id="sep",r.appendChild(a)}r.innerHTML+="</table>"}(r.PayWithReason(e))}}]);