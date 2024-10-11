import{d as W,h as Y,i as z}from"./chunk-CHALMICD.js";import{F as u,Ia as M,K as m,Ka as h,L as R,Na as $,Oa as k,Pa as F,Qa as K,R as A,Ra as H,Sa as U,Ta as y,Va as j,Y as T,_ as w,aa as G,bb as O,cb as Z,db as N,eb as b,fb as o,gb as r,i as I,j as g,q as l,r as v,w as D,wa as c,x as P,y as C,z as L}from"./chunk-7G64M734.js";var _=class n{transform(i){return i?`${i.toString()}px`:null}static \u0275fac=function(e){return new(e||n)};static \u0275pipe=G({name:"px",type:n,pure:!0,standalone:!0})};var ni=(n,i)=>({width:n,height:i}),oi=(n,i,e)=>({width:n,height:i,left:e}),V=(n,i,e,t)=>({width:n,height:i,left:e,top:t});function ri(n,i){if(n&1&&(y(0,"div",3),o(1,"px"),o(2,"px"),o(3,"px"),o(4,"px")),n&2){let e=i.$implicit;h("ngStyle",b(9,V,r(1,1,e.width),r(2,3,e.height),r(3,5,e.x),r(4,7,e.y)))}}function ai(n,i){if(n&1&&(y(0,"div",4),o(1,"px"),o(2,"px"),o(3,"px"),o(4,"px")),n&2){let e=i,t=j();h("ngStyle",b(9,V,r(1,1,t.BALL_RADIUS),r(2,3,t.BALL_RADIUS),r(3,5,e.x),r(4,7,e.y)))}}var J=class n{document=T(W);TICKER_INTERVAL=17;GAME_FIELD_SIZE={width:960,height:640};PADDLE_WIDTH=140;PADDLE_HEIGHT=25;PADDLE_SPEED=500;PADDLE_KEY={left:"ArrowLeft",right:"ArrowRight"};BALL_RADIUS=20;BALL_SPEED=400;BRICK_ROWS=5;BRICK_COLUMNS=7;BRICK_HEIGHT=25;BRICK_GAP=7;INITIAL_OBJECTS={ball:{position:{x:this.GAME_FIELD_SIZE.width/2-this.BALL_RADIUS/2,y:this.GAME_FIELD_SIZE.height/2-this.BALL_RADIUS/2},direction:{x:1,y:1}},bricks:this.bricksFactory(),collisions:{paddle:!1,floor:!1,wall:!1,ceiling:!1,brick:!1}};paddlePositionSubject=new I(this.GAME_FIELD_SIZE.width/2-this.PADDLE_WIDTH/2);paddlePosition$=this.paddlePositionSubject.pipe(u());objectsSubject=new I(this.INITIAL_OBJECTS);bricks$=this.objectsSubject.pipe(l(({bricks:i})=>i),u());ball$=this.objectsSubject.pipe(l(({ball:i})=>i.position),u());bricksFactory(){let i=this.BRICK_COLUMNS+1,e=this.GAME_FIELD_SIZE.width/this.BRICK_COLUMNS-i*this.BRICK_GAP/this.BRICK_COLUMNS,t=[];for(let p=0;p<this.BRICK_ROWS;p++)for(let d=0;d<this.BRICK_COLUMNS;d++)t.push({x:d*(e+this.BRICK_GAP)+this.BRICK_GAP,y:p*(this.BRICK_HEIGHT+this.BRICK_GAP)+this.BRICK_GAP,width:e,height:this.BRICK_HEIGHT});return t}ticker$=P(this.TICKER_INTERVAL,g).pipe(l(()=>({time:Date.now(),deltaTime:null})),m((i,e)=>({time:e.time,deltaTime:(e.time-i.time)/1e3})),L(({deltaTime:i})=>i!==null),l(i=>i),R(1));keydownEvent$=D(this.document,"keydown");keyupEvent$=D(this.document,"keyup");userInput$=C(this.keydownEvent$.pipe(l(({key:i})=>i),L(i=>[this.PADDLE_KEY.left,this.PADDLE_KEY.right].includes(i)),l(i=>i===this.PADDLE_KEY.left?-1:1)),this.keyupEvent$.pipe(l(()=>0)));paddle$=this.ticker$.pipe(A(this.userInput$),m((i,[e,t])=>{let d=this.GAME_FIELD_SIZE.width-this.PADDLE_WIDTH,E=i+t*e.deltaTime*this.PADDLE_SPEED;return Math.max(Math.min(E,d),0)},this.GAME_FIELD_SIZE.width/2-this.PADDLE_WIDTH/2));objects$=this.ticker$.pipe(A(this.paddle$),m(({ball:i,bricks:e},[t,p])=>{let d=i.position.x+i.direction.x*t.deltaTime*this.BALL_SPEED,E=i.position.y+i.direction.y*t.deltaTime*this.BALL_SPEED,X=Math.min(Math.max(0,d),this.GAME_FIELD_SIZE.width-this.BALL_RADIUS),q=Math.min(Math.max(0,E),this.GAME_FIELD_SIZE.height-this.BALL_RADIUS),a={x:X,y:q},S=a.x+this.BALL_RADIUS>=p&&a.x<=p+this.PADDLE_WIDTH&&a.y+this.BALL_RADIUS>=this.GAME_FIELD_SIZE.height-this.PADDLE_HEIGHT,B=a.x<=0||a.x+this.BALL_RADIUS>=this.GAME_FIELD_SIZE.width,f=a.y<=0,Q=a.y+this.BALL_RADIUS>=this.GAME_FIELD_SIZE.height,x=e.some(s=>a.x+this.BALL_RADIUS>=s.x&&a.x<=s.x+s.width&&a.y+this.BALL_RADIUS>=s.y&&a.y<=s.y+s.height),ii=e.filter(s=>!(a.x+this.BALL_RADIUS>=s.x&&a.x<=s.x+s.width&&a.y+this.BALL_RADIUS>=s.y&&a.y<=s.y+s.height)),ei={x:B?-i.direction.x:i.direction.x,y:x||S||f?-i.direction.y:i.direction.y};return{ball:{position:a,direction:ei},bricks:ii,collisions:{paddle:S,floor:Q,wall:B,ceiling:f,brick:x}}},this.INITIAL_OBJECTS));startGame(){let i=v([this.ticker$,this.paddle$,this.objects$]).subscribe(([,e,t])=>{this.paddlePositionSubject.next(e),this.objectsSubject.next(t),t.collisions.floor&&(alert("Game over"),i.unsubscribe()),t.bricks.length||(alert("Congratulations"),i.unsubscribe())})}ngOnInit(){this.startGame()}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=w({type:n,selectors:[["app-breakout"]],standalone:!0,features:[O],decls:15,vars:26,consts:[[1,"flex","justify-center"],[1,"border","border-pink-400"],[1,"relative",3,"ngStyle"],[1,"absolute","rounded-sm","bg-blue-700",3,"ngStyle"],[1,"absolute","rounded-full","bg-red-800",3,"ngStyle"],[1,"absolute","bottom-0","rounded-sm","bg-pink-700",3,"ngStyle"]],template:function(e,t){if(e&1&&(H(0,"div",0)(1,"div",1)(2,"div",2),o(3,"px"),o(4,"px"),F(5,ri,5,14,"div",3,k),o(7,"async"),M(8,ai,5,14,"div",4),o(9,"async"),y(10,"div",5),o(11,"px"),o(12,"px"),o(13,"async"),o(14,"px"),U()()()),e&2){let p;c(2),h("ngStyle",Z(19,ni,r(3,3,t.GAME_FIELD_SIZE.width),r(4,5,t.GAME_FIELD_SIZE.height))),c(3),K(r(7,7,t.bricks$)),c(3),$((p=r(9,9,t.ball$))?8:-1,p),c(2),h("ngStyle",N(22,oi,r(11,11,t.PADDLE_WIDTH),r(12,13,t.PADDLE_HEIGHT),r(14,17,r(13,15,t.paddlePosition$))))}},dependencies:[Y,z,_],changeDetection:0})};export{J as BreakoutComponent};
