import{$ as w,Ba as D,S as y,T as o,V as h,X as c,Y as d,aa as A,ib as _,jb as v,ka as S,na as f,ob as g,pb as I,ub as p,va as b,xa as l}from"./chunk-7G64M734.js";var R=null;function m(){return R}function ze(t){R??=t}var M=class{};var T=new h(""),P=(()=>{class t{historyGo(e){throw new Error("")}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=o({token:t,factory:()=>d(k),providedIn:"platform"})}}return t})();var k=(()=>{class t extends P{constructor(){super(),this._doc=d(T),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return m().getBaseHref(this._doc)}onPopState(e){let n=m().getGlobalEventTarget(this._doc,"window");return n.addEventListener("popstate",e,!1),()=>n.removeEventListener("popstate",e)}onHashChange(e){let n=m().getGlobalEventTarget(this._doc,"window");return n.addEventListener("hashchange",e,!1),()=>n.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,n,i){this._history.pushState(e,n,i)}replaceState(e,n,i){this._history.replaceState(e,n,i)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=o({token:t,factory:()=>new t,providedIn:"platform"})}}return t})();function N(t,r){if(t.length==0)return r;if(r.length==0)return t;let e=0;return t.endsWith("/")&&e++,r.startsWith("/")&&e++,e==2?t+r.substring(1):e==1?t+r:t+"/"+r}function L(t){let r=t.match(/#|\?|$/),e=r&&r.index||t.length,n=e-(t[e-1]==="/"?1:0);return t.slice(0,n)+t.slice(e)}function u(t){return t&&t[0]!=="?"?"?"+t:t}var E=(()=>{class t{historyGo(e){throw new Error("")}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=o({token:t,factory:()=>d(x),providedIn:"root"})}}return t})(),$=new h(""),x=(()=>{class t extends E{constructor(e,n){super(),this._platformLocation=e,this._removeListenerFns=[],this._baseHref=n??this._platformLocation.getBaseHrefFromDOM()??d(T).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return N(this._baseHref,e)}path(e=!1){let n=this._platformLocation.pathname+u(this._platformLocation.search),i=this._platformLocation.hash;return i&&e?`${n}${i}`:n}pushState(e,n,i,s){let a=this.prepareExternalUrl(i+u(s));this._platformLocation.pushState(e,n,a)}replaceState(e,n,i,s){let a=this.prepareExternalUrl(i+u(s));this._platformLocation.replaceState(e,n,a)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static{this.\u0275fac=function(n){return new(n||t)(c(P),c($,8))}}static{this.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();var U=(()=>{class t{constructor(e){this._subject=new S,this._urlChangeListeners=[],this._urlChangeSubscription=null,this._locationStrategy=e;let n=this._locationStrategy.getBaseHref();this._basePath=j(L(B(n))),this._locationStrategy.onPopState(i=>{this._subject.emit({url:this.path(!0),pop:!0,state:i.state,type:i.type})})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,n=""){return this.path()==this.normalize(e+u(n))}normalize(e){return t.stripTrailingSlash(V(this._basePath,B(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,n="",i=null){this._locationStrategy.pushState(i,"",e,n),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+u(n)),i)}replaceState(e,n="",i=null){this._locationStrategy.replaceState(i,"",e,n),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+u(n)),i)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(n=>{this._notifyUrlChangeListeners(n.url,n.state)}),()=>{let n=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(n,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",n){this._urlChangeListeners.forEach(i=>i(e,n))}subscribe(e,n,i){return this._subject.subscribe({next:e,error:n,complete:i})}static{this.normalizeQueryParams=u}static{this.joinWithSlash=N}static{this.stripTrailingSlash=L}static{this.\u0275fac=function(n){return new(n||t)(c(E))}}static{this.\u0275prov=o({token:t,factory:()=>z(),providedIn:"root"})}}return t})();function z(){return new U(c(E))}function V(t,r){if(!t||!r.startsWith(t))return r;let e=r.substring(t.length);return e===""||["/",";","?","#"].includes(e[0])?e:r}function B(t){return t.replace(/\/index.html$/,"")}function j(t){if(new RegExp("^(https?:)?//").test(t)){let[,e]=t.split(/\/\/[^\/]+/);return e}return t}function Ve(t,r){r=encodeURIComponent(r);for(let e of t.split(";")){let n=e.indexOf("="),[i,s]=n==-1?[e,""]:[e.slice(0,n),e.slice(n+1)];if(i.trim()===r)return decodeURIComponent(s)}return null}var je=(()=>{class t{constructor(e,n,i){this._ngEl=e,this._differs=n,this._renderer=i,this._ngStyle=null,this._differ=null}set ngStyle(e){this._ngStyle=e,!this._differ&&e&&(this._differ=this._differs.find(e).create())}ngDoCheck(){if(this._differ){let e=this._differ.diff(this._ngStyle);e&&this._applyChanges(e)}}_setStyle(e,n){let[i,s]=e.split("."),a=i.indexOf("-")===-1?void 0:b.DashCase;n!=null?this._renderer.setStyle(this._ngEl.nativeElement,i,s?`${n}${s}`:n,a):this._renderer.removeStyle(this._ngEl.nativeElement,i,a)}_applyChanges(e){e.forEachRemovedItem(n=>this._setStyle(n.key,null)),e.forEachAddedItem(n=>this._setStyle(n.key,n.currentValue)),e.forEachChangedItem(n=>this._setStyle(n.key,n.currentValue))}static{this.\u0275fac=function(n){return new(n||t)(l(f),l(I),l(D))}}static{this.\u0275dir=w({type:t,selectors:[["","ngStyle",""]],inputs:{ngStyle:"ngStyle"},standalone:!0})}}return t})();function G(t,r){return new y(2100,!1)}var C=class{createSubscription(r,e){return p(()=>r.subscribe({next:e,error:n=>{throw n}}))}dispose(r){p(()=>r.unsubscribe())}},F=class{createSubscription(r,e){return r.then(e,n=>{throw n})}dispose(r){}},H=new F,Y=new C,Ge=(()=>{class t{constructor(e){this._latestValue=null,this.markForCheckOnValueUpdate=!0,this._subscription=null,this._obj=null,this._strategy=null,this._ref=e}ngOnDestroy(){this._subscription&&this._dispose(),this._ref=null}transform(e){if(!this._obj){if(e)try{this.markForCheckOnValueUpdate=!1,this._subscribe(e)}finally{this.markForCheckOnValueUpdate=!0}return this._latestValue}return e!==this._obj?(this._dispose(),this.transform(e)):this._latestValue}_subscribe(e){this._obj=e,this._strategy=this._selectStrategy(e),this._subscription=this._strategy.createSubscription(e,n=>this._updateLatestValue(e,n))}_selectStrategy(e){if(_(e))return H;if(v(e))return Y;throw G(t,e)}_dispose(){this._strategy.dispose(this._subscription),this._latestValue=null,this._subscription=null,this._obj=null}_updateLatestValue(e,n){e===this._obj&&(this._latestValue=n,this.markForCheckOnValueUpdate&&this._ref?.markForCheck())}static{this.\u0275fac=function(n){return new(n||t)(l(g,16))}}static{this.\u0275pipe=A({name:"async",type:t,pure:!1,standalone:!0})}}return t})();var Z="browser",W="server";function He(t){return t===Z}function Ye(t){return t===W}var O=class{};export{m as a,ze as b,M as c,T as d,E as e,U as f,Ve as g,je as h,Ge as i,Z as j,He as k,Ye as l,O as m};
