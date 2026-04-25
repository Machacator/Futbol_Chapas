export function createRenderer(ctx){
var S=ctx.S,NC=ctx.NC,NR=ctx.NR,W=ctx.W,H=ctx.H,CW=ctx.CW,CH=ctx.CH,$=ctx.$,onFicha=ctx.onFicha,onVacia=ctx.onVacia,nMarcadores=ctx.nMarcadores,adyacentes=ctx.adyacentes;
function se(tag,attrs){var el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(var k in attrs)el.setAttribute(k,attrs[k]);return el;}
function renderSVG(){
  var svg=$('svg-campo');svg.innerHTML='';
  for(var c=0;c<NC;c++)svg.appendChild(se('rect',{x:c*CW,y:0,width:CW,height:H,fill:c%2?'#357a35':'#2d7a2d'}));
  for(var c=0;c<=NC;c++)svg.appendChild(se('line',{x1:c*CW,y1:0,x2:c*CW,y2:H,stroke:'rgba(0,0,0,.1)','stroke-width':'.5'}));
  for(var r=0;r<=NR;r++)svg.appendChild(se('line',{x1:0,y1:r*CH,x2:W,y2:r*CH,stroke:'rgba(0,0,0,.1)','stroke-width':'.5'}));
  svg.appendChild(se('rect',{x:1,y:1,width:W-2,height:H-2,stroke:'#fff','stroke-width':'1.5',fill:'none'}));
  svg.appendChild(se('line',{x1:W/2,y1:1,x2:W/2,y2:H-1,stroke:'#fff','stroke-width':'1.5'}));
  svg.appendChild(se('circle',{cx:W/2,cy:H/2,r:58,stroke:'#fff','stroke-width':'1.5',fill:'none'}));
  svg.appendChild(se('circle',{cx:W/2,cy:H/2,r:3,fill:'#fff'}));
  var aw=4*CW,ah=10*CH,ay=2.5*CH;
  svg.appendChild(se('rect',{x:0,y:ay,width:aw,height:ah,stroke:'#fff','stroke-width':'1.5',fill:'none'}));
  svg.appendChild(se('rect',{x:W-aw,y:ay,width:aw,height:ah,stroke:'#fff','stroke-width':'1.5',fill:'none'}));
  var pw=2*CW,ph=5*CH,py=5*CH;
  svg.appendChild(se('rect',{x:0,y:py,width:pw,height:ph,stroke:'#fff','stroke-width':'1.5',fill:'none'}));
  svg.appendChild(se('rect',{x:W-pw,y:py,width:pw,height:ph,stroke:'#fff','stroke-width':'1.5',fill:'none'}));
  svg.appendChild(se('circle',{cx:3.5*CW,cy:H/2,r:3,fill:'#fff'}));svg.appendChild(se('circle',{cx:W-3.5*CW,cy:H/2,r:3,fill:'#fff'}));
  svg.appendChild(se('path',{d:'M'+aw+' '+(H/2-44)+'A58 58 0 0 1 '+aw+' '+(H/2+44),stroke:'#fff','stroke-width':'1.5',fill:'none'}));
  svg.appendChild(se('path',{d:'M'+(W-aw)+' '+(H/2-44)+'A58 58 0 0 0 '+(W-aw)+' '+(H/2+44),stroke:'#fff','stroke-width':'1.5',fill:'none'}));
  var pth=3*CH,pty=(NR/2-1.5)*CH,ptw=CW*.65;
  svg.appendChild(se('rect',{x:-ptw,y:pty,width:ptw+2,height:pth,fill:'none',stroke:'#fff','stroke-width':'2'}));
  svg.appendChild(se('rect',{x:2,y:pty+2,width:ptw-3,height:pth-4,fill:'rgba(255,255,255,.07)'}));
  svg.appendChild(se('rect',{x:0,y:pty,width:4,height:pth,fill:'#fff'}));
  svg.appendChild(se('rect',{x:W-2,y:pty,width:ptw,height:pth,fill:'none',stroke:'#fff','stroke-width':'2'}));
  svg.appendChild(se('rect',{x:W-ptw,y:pty+2,width:ptw-3,height:pth-4,fill:'rgba(255,255,255,.07)'}));
  svg.appendChild(se('rect',{x:W-4,y:pty,width:4,height:pth,fill:'#fff'}));

  var fs=S.fsel;
  if(fs&&S.fase=='mover'&&S.movR>0){for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var d=Math.max(Math.abs(c-fs.col),Math.abs(r-fs.row));if(d>0&&d<=S.movR&&!S.T[c][r])svg.appendChild(se('rect',{x:c*CW+1,y:r*CH+1,width:CW-2,height:CH-2,fill:'rgba(255,255,0,.22)',rx:'2'}));}}
  if(fs&&S.fase=='pasar'){var alp2=fs.pos=='POR'?fs.alcSaq:fs.alp;for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var t=S.T[c][r];if(!t||t.eq!=fs.eq||t._key==fs._key)continue;var d=Math.sqrt((c-fs.col)*(c-fs.col)+(r-fs.row)*(r-fs.row));if(d<=alp2)svg.appendChild(se('rect',{x:c*CW+1,y:r*CH+1,width:CW-2,height:CH-2,fill:'rgba(80,200,255,.3)',rx:'2'}));}}
  if(fs&&S.fase=='tirar'){var c1=fs.eq===0?NC-2:0,c2=fs.eq===0?NC-1:1;for(var cc=c1;cc<=c2;cc++)for(var r=6;r<=8;r++)svg.appendChild(se('rect',{x:cc*CW+1,y:r*CH+1,width:CW-2,height:CH-2,fill:'rgba(255,80,80,.38)',rx:'2'}));}
  // Entrada highlight (adyacentes con rival con balÃ³n)
  if(fs&&S.fase=='mover'){var adys=adyacentes(fs.col,fs.row);for(var i=0;i<adys.length;i++){var t=S.T[adys[i].c][adys[i].r];if(t&&t.eq!=fs.eq&&S.bal.key==t._key)svg.appendChild(se('rect',{x:adys[i].c*CW,y:adys[i].r*CH,width:CW,height:CH,fill:'rgba(255,100,0,.3)',rx:'2'}));}}
  // ZoC rivals tenue
  if(fs){var eqR=fs.eq===0?1:0;for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var f=S.T[c][r];if(!f||f.eq!=eqR)continue;var adys2=adyacentes(c,r);for(var i=0;i<adys2.length;i++)svg.appendChild(se('rect',{x:adys2[i].c*CW,y:adys2[i].r*CH,width:CW,height:CH,fill:'rgba(200,50,50,.06)',rx:'1'}));}}

  if(!S.bal.key){var bx=S.bal.c*CW+CW/2,by=S.bal.r*CH+CH/2;svg.appendChild(se('circle',{cx:bx,cy:by,r:6,fill:'#fff',stroke:'#999','stroke-width':'1'}));svg.appendChild(se('circle',{cx:bx,cy:by,r:2,fill:'#666'}));}

  for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){
    var f=S.T[c][r];if(!f)continue;
    var cx=c*CW+CW/2,cy=r*CH+CH/2,rad=Math.min(CW,CH)*.38;
    var ago=!!S.movidas[f._key],isSel=fs&&fs._key==f._key;
    var nmarcado=nMarcadores(f);
    var gg=se('g',{});
    if(isSel)gg.appendChild(se('circle',{cx:cx,cy:cy,r:rad+4,fill:'rgba(255,220,0,.35)'}));
    // Anillo de marcaje: grosor proporcional al nÂº de marcadores
    if(nmarcado>0){
      var grosorAnillo=1+nmarcado*.6;
      gg.appendChild(se('circle',{cx:cx,cy:cy,r:rad+2,stroke:'rgba(255,80,80,.7)','stroke-width':grosorAnillo.toFixed(1),fill:'none'}));
    }
    var fill=f.eq===0?(ago?'#1a2a50':'#1565c0'):(ago?'#4a1010':'#b71c1c');
    if(f.tumbado){gg.appendChild(se('ellipse',{cx:cx,cy:cy,rx:rad,ry:rad*.48,fill:fill,stroke:'#fff','stroke-width':'1','stroke-dasharray':'3,2',opacity:'.6'}));}
    else{gg.appendChild(se('circle',{cx:cx,cy:cy,r:rad,fill:fill,stroke:f.pos=='POR'?'gold':'#fff','stroke-width':f.pos=='POR'?'2':'1'}));if(ago){var o=rad*.42;gg.appendChild(se('line',{x1:cx-o,y1:cy-o,x2:cx+o,y2:cy+o,stroke:'rgba(255,255,255,.48)','stroke-width':'1.5'}));gg.appendChild(se('line',{x1:cx+o,y1:cy-o,x2:cx-o,y2:cy+o,stroke:'rgba(255,255,255,.48)','stroke-width':'1.5'}));}}
    if(S.bal.key==f._key)gg.appendChild(se('circle',{cx:cx+rad-3,cy:cy-rad+3,r:5,fill:'#fff',stroke:'#666','stroke-width':'1'}));
    // NÃºmero de marcadores encima si >1
    if(nmarcado>1){var nt=se('text',{x:cx+rad-2,y:cy-rad+2,'text-anchor':'middle','font-size':'7','font-weight':'bold',fill:'#ff5555','pointer-events':'none'});nt.textContent='Ã—'+nmarcado;gg.appendChild(nt);}
    var txt=se('text',{x:cx,y:cy+3,'text-anchor':'middle','font-size':'7','font-weight':'bold',fill:ago?'rgba(255,255,255,.4)':'#fff','pointer-events':'none'});txt.textContent=f.n.substring(0,4).toUpperCase();gg.appendChild(txt);
    (function(cc,rr){gg.addEventListener('click',function(){onFicha(cc,rr);});})(c,r);svg.appendChild(gg);
  }
  for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){if(!S.T[c][r]){var cel=se('rect',{x:c*CW,y:r*CH,width:CW,height:CH,fill:'transparent'});(function(cc,rr){cel.addEventListener('click',function(){onVacia(cc,rr);});})(c,r);svg.appendChild(cel);}}
}

// â”€â”€ MECÃNICA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

return { se, renderSVG };
}

