function E(){}const V=t=>t;function D(t,e){for(const n in e)t[n]=e[n];return t}function P(t){return t()}function X(){return Object.create(null)}function q(t){t.forEach(P)}function B(t){return typeof t=="function"}function Y(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function Z(t){return Object.keys(t).length===0}function I(t,...e){if(t==null){for(const i of e)i(void 0);return E}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function $(t,e,n){t.$$.on_destroy.push(I(e,n))}function tt(t,e,n,i){if(t){const r=N(t,e,n,i);return t[0](r)}}function N(t,e,n,i){return t[1]&&i?D(n.ctx.slice(),t[1](i(e))):n.ctx}function et(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const s=[],c=Math.max(e.dirty.length,r.length);for(let o=0;o<c;o+=1)s[o]=e.dirty[o]|r[o];return s}return e.dirty|r}return e.dirty}function nt(t,e,n,i,r,s){if(r){const c=N(e,n,i,s);t.p(c,r)}}function it(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function rt(t){return t&&B(t.destroy)?t.destroy:E}let m=!1;function ct(){m=!0}function lt(){m=!1}function M(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function O(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&l.push(a)}e=l}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let l=0;l<e.length;l++){const u=e[l].claim_order,a=(r>0&&e[n[r]].claim_order<=u?r+1:M(1,r,S=>e[n[S]].claim_order,u))-1;i[l]=n[a]+1;const k=a+1;n[k]=l,r=Math.max(k,r)}const s=[],c=[];let o=e.length-1;for(let l=n[r]+1;l!=0;l=i[l-1]){for(s.push(e[l-1]);o>=l;o--)c.push(e[o]);o--}for(;o>=0;o--)c.push(e[o]);s.reverse(),c.sort((l,u)=>l.claim_order-u.claim_order);for(let l=0,u=0;l<c.length;l++){for(;u<s.length&&c[l].claim_order>=s[u].claim_order;)u++;const a=u<s.length?s[u]:null;t.insertBefore(c[l],a)}}function T(t,e){t.appendChild(e)}function H(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function ot(t){const e=A("style");return e.textContent="/* empty */",L(H(t),e),e.sheet}function L(t,e){return T(t.head||t,e),e.sheet}function R(t,e){if(m){for(O(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function st(t,e,n){m&&!n?R(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function ut(t){t.parentNode&&t.parentNode.removeChild(t)}function at(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function A(t){return document.createElement(t)}function x(t){return document.createTextNode(t)}function ft(){return x(" ")}function _t(){return x("")}function dt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function ht(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function mt(t){return t.dataset.svelteH}function pt(t){return t===""?null:+t}function yt(t){return Array.from(t.childNodes)}function z(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function j(t,e,n,i,r=!1){z(t);const s=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const o=t[c];if(e(o)){const l=n(o);return l===void 0?t.splice(c,1):t[c]=l,r||(t.claim_info.last_index=c),o}}for(let c=t.claim_info.last_index-1;c>=0;c--){const o=t[c];if(e(o)){const l=n(o);return l===void 0?t.splice(c,1):t[c]=l,r?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,o}}return i()})();return s.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,s}function F(t,e,n,i){return j(t,r=>r.nodeName===e,r=>{const s=[];for(let c=0;c<r.attributes.length;c++){const o=r.attributes[c];n[o.name]||s.push(o.name)}s.forEach(c=>r.removeAttribute(c))},()=>i(e))}function bt(t,e,n){return F(t,e,n,A)}function U(t,e){return j(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>x(e),!0)}function gt(t){return U(t," ")}function xt(t,e){e=""+e,t.data!==e&&(t.data=e)}function vt(t,e){t.value=e??""}function kt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,"")}function wt(t,e,n){for(let i=0;i<t.options.length;i+=1){const r=t.options[i];if(r.__value===e){r.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function Et(t){const e=t.querySelector(":checked");return e&&e.__value}function W(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function Nt(t,e){return new t(e)}let h;function p(t){h=t}function v(){if(!h)throw new Error("Function called outside component initialization");return h}function At(t){v().$$.on_mount.push(t)}function jt(t){v().$$.after_update.push(t)}function Ct(){const t=v();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const s=W(e,n,{cancelable:i});return r.slice().forEach(c=>{c.call(t,s)}),!s.defaultPrevented}return!0}}const d=[],w=[];let _=[];const b=[],C=Promise.resolve();let g=!1;function G(){g||(g=!0,C.then(K))}function St(){return G(),C}function J(t){_.push(t)}function Dt(t){b.push(t)}const y=new Set;let f=0;function K(){if(f!==0)return;const t=h;do{try{for(;f<d.length;){const e=d[f];f++,p(e),Q(e.$$)}}catch(e){throw d.length=0,f=0,e}for(p(null),d.length=0,f=0;w.length;)w.pop()();for(let e=0;e<_.length;e+=1){const n=_[e];y.has(n)||(y.add(n),n())}_.length=0}while(d.length);for(;b.length;)b.pop()();g=!1,y.clear(),p(t)}function Q(t){if(t.fragment!==null){t.update(),q(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(J)}}function Pt(t){const e=[],n=[];_.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),_=e}export{Et as $,H as A,ot as B,q as C,B as D,J as E,W as F,V as G,X as H,K as I,Z as J,Pt as K,h as L,p as M,P as N,d as O,G as P,ct as Q,lt as R,vt as S,dt as T,pt as U,Ct as V,mt as W,rt as X,at as Y,Dt as Z,wt as _,ft as a,yt as b,bt as c,U as d,A as e,ut as f,gt as g,R as h,st as i,xt as j,$ as k,tt as l,it as m,E as n,et as o,_t as p,jt as q,At as r,Y as s,x as t,nt as u,ht as v,kt as w,w as x,Nt as y,St as z};
