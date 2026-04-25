export function createZoC(ctx){
var S=ctx.S,NC=ctx.NC,NR=ctx.NR,M=ctx.M,r2=ctx.r2,log=ctx.log,SFX=ctx.SFX,renderSVG=ctx.renderSVG,desel=ctx.desel;
function adyacentes(c,r){var res=[];for(var dc=-1;dc<=1;dc++)for(var dr=-1;dr<=1;dr++){if(dc==0&&dr==0)continue;var nc=c+dc,nr=r+dr;if(nc>=0&&nc<NC&&nr>=0&&nr<NR)res.push({c:nc,r:nr});}return res;}

// Â¿EstÃ¡ f marcado? â†’ devuelve nÃºmero de rivales que lo marcan
function nMarcadores(f){
  var n=0,adys=adyacentes(f.col,f.row);
  for(var i=0;i<adys.length;i++){var t=S.T[adys[i].c][adys[i].r];if(t&&t.eq!=f.eq)n++;}
  return n;
}
function estaMarcado(f){return nMarcadores(f)>0;}

// Bonus de entrada: aliados adyacentes al DEF (portador) no marcados
function bonusEntrada(atac,def){
  var b=0,adys=adyacentes(def.col,def.row);
  for(var i=0;i<adys.length;i++){var t=S.T[adys[i].c][adys[i].r];if(t&&t.eq==atac.eq&&t._key!=atac._key&&!estaMarcado(t))b++;}
  return b;
}

// Bonus de regate (apoyo de compaÃ±eros no marcados adyacentes al que regatea)
function bonusRegate(fs){
  var b=0,adys=adyacentes(fs.col,fs.row);
  for(var i=0;i<adys.length;i++){var t=S.T[adys[i].c][adys[i].r];if(t&&t.eq==fs.eq&&!estaMarcado(t))b++;}
  return b;
}

// PenalizaciÃ³n de pase/tiro por marcaje: -1 por cada rival marcador
function penMarcajePaseTiro(fs){
  return nMarcadores(fs);
}

function hayRivalAdyEn(c,r,eq){var adys=adyacentes(c,r);for(var i=0;i<adys.length;i++){var t=S.T[adys[i].c][adys[i].r];if(t&&t.eq!=eq)return true;}return false;}

function tiradaRegate(fs){
  var rv=r2(),bon=bonusRegate(fs),m=M(fs.eq);
  var v=rv.t+fs.reg+(m.regMod||0)+bon;
  log('ZoC-Regate '+fs.n+':['+rv.d+']+REG'+fs.reg+(bon?'+apo'+bon:'')+' = '+v+' (â‰¥7)','lzoc');
  if(v<7){SFX.regate_fail();log(fs.n+' falla el regate â€” cae al suelo.','lles');S.T[fs.col][fs.row].tumbado=true;S.movidas[fs._key]=true;S.fsel=null;S.movR=0;renderSVG();desel();return false;}
  SFX.regate_ok();return true;
}

// â”€â”€ DRAFT POOL ALEATORIO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

return { adyacentes, nMarcadores, estaMarcado, bonusEntrada, bonusRegate, penMarcajePaseTiro, hayRivalAdyEn, tiradaRegate };
}

