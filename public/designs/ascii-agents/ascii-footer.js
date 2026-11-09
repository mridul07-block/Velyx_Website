/* ASCII hardware footer: <canvas class="ascii-footer"></canvas><script src="ascii-footer.js"></script>
   Colours come from CSS: .ascii-footer{--ink:#161412;--paper:transparent}
   Labels: data-labels="6 agents online|pick & place|inference 72%" */
(function(){
const SW=1920,SH=560,GY=480,LOOP=16,P=4,V=100,TAU=Math.PI*2;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t;
const ss=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function hash(a,b){let h=(a*374761393+b*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295}

function Footer(cv){
  const ctx=cv.getContext('2d'),off=document.createElement('canvas'),g=off.getContext('2d',{willReadFrequently:true});
  const labels=(cv.dataset.labels||'6 agents online|pick & place|inference 72%').split('|');
  let w,h,dpr,cols,rows,CW,CH=14,s,ox;

  const gray=v=>{const c=Math.round(clamp(v,0,1)*255);return`rgb(${c},${c},${c})`};
  const rect=(x,y,ww,hh,c)=>{g.fillStyle=gray(c);g.fillRect(x,y,ww,hh)};
  const circle=(x,y,r,c)=>{g.fillStyle=gray(c);g.beginPath();g.arc(x,y,r,0,TAU);g.fill()};
  const poly=(p,c)=>{g.fillStyle=gray(c);g.beginPath();g.moveTo(...p[0]);p.slice(1).forEach(q=>g.lineTo(...q));g.closePath();g.fill()};
  const line=(x1,y1,x2,y2,lw,c)=>{g.strokeStyle=gray(c);g.lineWidth=lw;g.lineCap='round';g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()};
  function box3d(x,y,bw,bh,dx,dy,cf,ct,cs){
    poly([[x,y],[x+bw,y],[x+bw+dx,y+dy],[x+dx,y+dy]],ct);
    if(dx>0)poly([[x+bw,y],[x+bw+dx,y+dy],[x+bw+dx,y+bh+dy],[x+bw,y+bh]],cs);
    else poly([[x,y],[x+dx,y+dy],[x+dx,y+bh+dy],[x,y+bh]],cs);
    rect(x,y,bw,bh,cf);
  }

  /* ---- hardware ---- */
  function rack(x,y,rw,rh,idx,t){
    box3d(x,y,rw,rh,30,-20,.62,.95,.42);
    rect(x+12,y+12,rw-24,rh-24,.4);
    let j=0;
    for(let by=y+24;by<y+rh-110;by+=36,j++){
      rect(x+22,by,rw-44,24,.95);
      for(let k=0;k<2;k++)rect(x+rw-58+k*18,by+7,10,10,hash(idx*99+j*2+k,Math.floor(t*5)%80)>.5?0:.7);
    }
    const r=Math.min(rw*.17,30),fy=y+rh-56;
    for(const fx of[x+rw*.3,x+rw*.7]){
      circle(fx,fy,r,.05);const a0=TAU*t/LOOP*(10+idx*2);
      for(let b=0;b<3;b++){const a=a0+b*TAU/3;g.fillStyle=gray(.95);g.beginPath();g.moveTo(fx,fy);g.arc(fx,fy,r*.85,a,a+.75);g.fill()}
      circle(fx,fy,r*.25,.05);
    }
  }
  function tower(t){
    const x=1520,y=120,tw=260,th=360;
    box3d(x,y,tw,th,-34,-22,.62,.95,.42);
    for(let fx=x+8;fx<x+tw-8;fx+=18)rect(fx,y-30,9,30,.4);
    rect(x+60,y+28,140,140,.05);
    for(let i=0;i<7;i++){rect(x+72+i*19,y+16,7,12,.4);rect(x+72+i*19,y+168,7,12,.4);rect(x+48,y+40+i*19,12,7,.4);rect(x+200,y+40+i*19,12,7,.4)}
    rect(x+88,y+56,84,84,Math.sin(TAU*t*2)>0?.95:.62);
    for(let i=0;i<8;i++){const hh=10+44*(.5+.5*Math.sin(TAU*t/LOOP*(i%3+3)+i*1.7));rect(x+34+i*26,y+256-hh,14,hh,.05)}
    const fx=x+tw/2,fy=y+305;circle(fx,fy,44,.05);const a0=-TAU*t/LOOP*14;
    for(let b=0;b<5;b++){const a=a0+b*TAU/5;g.fillStyle=gray(.95);g.beginPath();g.moveTo(fx,fy);g.arc(fx,fy,38,a,a+.6);g.fill()}
    circle(fx,fy,9,.05);
  }
  function belt(x1,x2,t){
    rect(x1,356,x2-x1,24,.8);
    for(let x=x1+(V*t)%32;x<x2;x+=32)rect(x,358,8,20,.05);
    rect(x1,380,x2-x1,22,.42);
    for(let x=x1+24;x<x2;x+=56)circle(x,391,6,.95);
    for(const lx of[x1+30,x2-46])rect(lx,402,16,GY-402,.42);
  }
  const crate=(cx,top)=>{box3d(cx-38,top,76,66,14,-12,.62,.95,.3);rect(cx-38,top+26,76,10,.3);rect(cx-14,top+44,28,12,.05)};
  // robot arm (IK on each side, joint-angle blend across the top)
  const S=[960,280],L1=200,L2=170,GRIP=70,H1=[760,220],D1=[760,314],H2=[1160,220],D2=[1160,314];
  const KEYS=[[0,H2],[.9,H1],[.95,H1],[1.25,D1],[1.45,D1],[1.9,H1],[2.8,H2],[3.1,D2],[3.35,D2],[3.7,H2],[4,H2]];
  function ik(p){
    const wx=p[0],wy=p[1]-GRIP,dx=wx-S[0],dy=wy-S[1];
    const d=clamp(Math.hypot(dx,dy),Math.abs(L1-L2)+1,L1+L2-1),a=Math.atan2(dy,dx);
    const al=Math.acos((L1*L1+d*d-L2*L2)/(2*L1*d)),t1=dx<0?a+al:a-al;
    return[t1,Math.atan2(wy-S[1]-L1*Math.sin(t1),wx-S[0]-L1*Math.cos(t1))];
  }
  const angLerp=(a,b,t)=>a+(((b-a+Math.PI*3)%TAU)-Math.PI)*t;
  function pose(u){
    let i=0;while(i<KEYS.length-2&&u>=KEYS[i+1][0])i++;
    const[t0,p0]=KEYS[i],[t1,p1]=KEYS[i+1],k=ss((u-t0)/(t1-t0));
    if((p0[0]<S[0])===(p1[0]<S[0]))return ik([lerp(p0[0],p1[0],k),lerp(p0[1],p1[1],k)]);
    const a=ik(p0),b=ik(p1);return[angLerp(a[0],b[0],k),angLerp(a[1],b[1],k)];
  }
  const seg=(x1,y1,x2,y2,lw)=>{line(x1,y1,x2,y2,lw,.05);line(x1,y1,x2,y2,lw-14,.95)};
  const joint=(x,y,r)=>{circle(x,y,r,.05);circle(x,y,r*.55,.95);circle(x,y,r*.2,.05)};
  function arm(t,carry){
    box3d(925,300,70,GY-300,-14,-10,.62,.95,.42);
    rect(S[0]-46,S[1],92,24,.05);
    const u=t%P,[a1,a2]=pose(u),E=[S[0]+L1*Math.cos(a1),S[1]+L1*Math.sin(a1)],Wr=[E[0]+L2*Math.cos(a2),E[1]+L2*Math.sin(a2)];
    seg(...S,...E,40);seg(...E,...Wr,34);joint(...S,30);joint(...E,24);
    const open=u>1.3&&u<3.2?32:50,tip=Wr[1]+GRIP;
    if(carry)crate(Wr[0],tip);
    rect(Wr[0]-26,Wr[1]+4,52,26,.05);
    line(Wr[0]-open/2,Wr[1]+28,Wr[0]-open/2,tip+14,9,.05);line(Wr[0]+open/2,Wr[1]+28,Wr[0]+open/2,tip+14,9,.05);
    joint(...Wr,18);
  }
  function crates(t){
    const n=Math.floor(t/P);let carry=false;
    for(let k=n-6;k<=n+4;k++){
      const arrive=k*P+1.2,place=k*P+3.2;
      if(t<k*P+1.3){const x=Math.min(760,760+V*(t-arrive));if(x>380)crate(x,314)}
      else if(t<place)carry=true;
      else{const x=1160+V*(t-place);if(x<1600)crate(x,314)}
    }
    return carry;
  }
  function cables(t){
    [[[250,GY-6],[700,GY+60],[1490,GY-6]],[[440,GY-6],[900,GY+40],[1500,GY-16]]].forEach(([a,b,c],k)=>{
      g.strokeStyle=gray(.42);g.lineWidth=9;g.beginPath();g.moveTo(...a);g.quadraticCurveTo(...b,...c);g.stroke();
      for(let j=0;j<4;j++){const u=(t/LOOP*(3+k)+j/4)%1,m=1-u;circle(m*m*a[0]+2*m*u*b[0]+u*u*c[0],m*m*a[1]+2*m*u*b[1]+u*u*c[1],10,.05)}
    });
  }
  function rover(f,k,t){
    const x=-160+(SW+320)*f,y=548-Math.abs(Math.sin(TAU*4*t+k))*4;
    for(const wx of[-30,30]){circle(x+wx,y-16,17,.05);circle(x+wx,y-16,7,.95);const a=x/17;line(x+wx,y-16,x+wx+Math.cos(a)*13,y-16+Math.sin(a)*13,3,.95)}
    box3d(x-50,y-72,100,42,10,-8,.62,.95,.42);
    box3d(x-46,y-106,32,32,8,-6,.95,.95,.42);rect(x-46,y-94,32,7,.42);
    box3d(x+2,y-114,44,40,8,-6,.42,.95,.05);
    circle(x+28,y-94,10,.95);circle(x+31,y-94,4,.05);
    line(x+14,y-120,x+14,y-142,3,.05);circle(x+14,y-146,6,hash(k,Math.floor(t*4)%64)>.5?.05:.95);
  }
  function drone(f,y,t){
    const x=-160+(SW+320)*f;y+=Math.sin(TAU*t/LOOP*3)*12;
    line(x,y+12,x,y+52,2,.42);crate(x,y+52);
    line(x-62,y-2,x+62,y-2,7,.05);
    g.fillStyle=gray(.42);g.beginPath();g.ellipse(x,y+6,36,15,0,0,TAU);g.fill();circle(x+14,y+4,5,.95);
    for(const rx of[x-62,x+62]){const sp=Math.abs(Math.cos(TAU*15*t+rx));line(rx-40*sp,y-16,rx+40*sp,y-16,5,.05);line(rx,y-16,rx,y-2,4,.05)}
  }
  function scene(t){
    g.setTransform(1,0,0,1,0,0);g.fillStyle='#fff';g.fillRect(0,0,off.width,off.height);
    g.setTransform(3*s/CW,0,0,3*s/CH,3*ox/CW,0);
    rect(-2000,GY,SW+4000,SH,.93);rect(-2000,GY,SW+4000,5,.05);
    cables(t);belt(380,880,t);belt(1040,1560,t);
    const carry=crates(t);
    rack(60,150,190,GY-150,0,t);rack(290,205,160,GY-205,1,t);
    tower(t);arm(t,carry);
    drone((t/LOOP+.15)%1,34,t);
    rover((t/LOOP)%1,0,t);rover((t/LOOP+.5)%1,1,t);
  }

  /* ---- text pass ---- */
  const TONES=' .:+#@',ALPHA=[0,.4,.62,.78,.9,1];
  const lvl=L=>L>=.9?0:L>=.72?1:L>=.5?2:L>=.3?3:L>=.15?4:5;
  function render(t){
    scene(t);
    const d=g.getImageData(0,0,off.width,off.height).data,ow=off.width,q=new Uint8Array(cols*rows);
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      let sum=0;for(let y=0;y<3;y++){const o=((r*3+y)*ow+c*3)*4;sum+=d[o]+d[o+4]+d[o+8]}
      q[r*cols+c]=lvl(sum/(9*255));
    }
    const over=new Map(),blink=Math.floor(t*2)%2;
    [[260,112],[960,52],[1650,62]].forEach(([x,y],i)=>{
      const txt=(blink?'* ':'  ')+labels[i],c0=Math.round((ox+x*s)/CW-txt.length/2),r0=Math.round(y*s/CH);
      for(let k=0;k<txt.length;k++)if(!q[r0*cols+c0+k])over.set(r0*cols+c0+k,txt[k]);
    });
    const st=getComputedStyle(cv),ink=st.getPropertyValue('--ink').trim()||'#161412',paper=st.getPropertyValue('--paper').trim()||'transparent';
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    if(paper!=='transparent'){ctx.fillStyle=paper;ctx.fillRect(0,0,w,h)}
    ctx.font=`600 12px "JetBrains Mono", ui-monospace, monospace`;ctx.textBaseline='top';ctx.fillStyle=ink;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const i=r*cols+c,v=q[i];let ch,a;
      if(over.has(i)){ch=over.get(i);a=1}
      else if(v>0){
        const L=c>0?q[i-1]:v,R=c<cols-1?q[i+1]:v,U=r>0?q[i-cols]:v,D=r<rows-1?q[i+cols]:v,gx=R-L,gy=D-U;
        if(Math.abs(gx)+Math.abs(gy)>=3){
          let ang=Math.atan2(gy*CW,gx*CH);if(ang<0)ang+=Math.PI;const deg=ang*180/Math.PI;
          ch=deg<22.5||deg>=157.5?'|':deg<67.5?'/':deg<112.5?'-':'\\';a=1;
        }else{ch=TONES[v];a=ALPHA[v]}
      }
      if(ch&&ch!==' '){ctx.globalAlpha=a;ctx.fillText(ch,c*CW,r*CH)}
    }
    ctx.globalAlpha=1;
  }
  function resize(){
    dpr=window.devicePixelRatio||1;w=cv.clientWidth;h=Math.max(Math.round(w*SH/SW),300);
    cv.style.height=h+'px';cv.width=w*dpr;cv.height=h*dpr;
    ctx.font='600 12px "JetBrains Mono", ui-monospace, monospace';CW=ctx.measureText('M').width;
    cols=Math.floor(w/CW);rows=Math.floor(h/CH);off.width=cols*3;off.height=rows*3;
    s=h/SH;ox=(w-SW*s)/2;
  }
  return{resize,render};
}

const items=[...document.querySelectorAll('canvas.ascii-footer')].map(Footer);
const start=()=>{
  items.forEach(f=>f.resize());
  addEventListener('resize',()=>items.forEach(f=>f.resize()));
  window.asciiFooterRender=t=>items.forEach(f=>f.render(t));
  if(window.ASCII_FOOTER_MANUAL)return;
  const t0=performance.now();(function loop(){window.asciiFooterRender(((performance.now()-t0)/1000)%LOOP);requestAnimationFrame(loop)})();
};
document.fonts?document.fonts.ready.then(start):start();
})();
