export function createAudio(){
var soundOn=true,AC=null;
function getAC(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AC;}
function tone(f,type,dur,vol,delay){if(!soundOn)return;var ctx=getAC();if(!ctx)return;try{var o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type=type||'sine';o.frequency.value=f;var t=ctx.currentTime+(delay||0);g.gain.setValueAtTime(vol||0.3,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.start(t);o.stop(t+dur+0.05);}catch(e){}}
function noise(dur,vol,delay){if(!soundOn)return;var ctx=getAC();if(!ctx)return;try{var buf=ctx.createBuffer(1,ctx.sampleRate*dur,ctx.sampleRate),data=buf.getChannelData(0);for(var i=0;i<data.length;i++)data[i]=(Math.random()*2-1);var src=ctx.createBufferSource(),g=ctx.createGain();src.buffer=buf;src.connect(g);g.connect(ctx.destination);var t=ctx.currentTime+(delay||0);g.gain.setValueAtTime(vol||0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);src.start(t);}catch(e){}}
var SFX={
  gol:function(){[523,659,784,1047,1319].forEach(function(f,i){tone(f,'square',.18,.25,i*.12);});tone(1319,'square',.4,.3,.6);noise(1.5,.08,.2);},
  gol_rival:function(){tone(400,'sine',.15,.2);tone(300,'sine',.2,.15,.15);tone(200,'sine',.3,.1,.35);},
  pitido:function(){tone(1200,'square',.08,.3);tone(1200,'square',.08,.2,.12);},
  pitidoLargo:function(){tone(1100,'square',.35,.28);},
  patada:function(){noise(.08,.3);tone(120,'sine',.1,.2);},
  pase:function(){noise(.06,.2);tone(200,'sine',.08,.15,.03);},
  entrada:function(){noise(.12,.4);tone(80,'sawtooth',.1,.2);},
  lesion:function(){tone(200,'sawtooth',.15,.2);tone(150,'sawtooth',.2,.15,.1);},
  evento_pos:function(){tone(523,'sine',.1,.2);tone(659,'sine',.1,.15,.1);tone(784,'sine',.15,.15,.2);},
  evento_neg:function(){tone(300,'sawtooth',.12,.2);tone(220,'sawtooth',.18,.15,.12);},
  seleccionar:function(){tone(600,'sine',.05,.15);},
  mover:function(){tone(400,'sine',.04,.1);},
  regate_ok:function(){tone(700,'sine',.08,.2);tone(900,'sine',.08,.15,.08);},
  regate_fail:function(){tone(250,'sawtooth',.1,.25);},
  parada:function(){noise(.1,.35);tone(150,'sine',.12,.2,.05);},
  sustitucion:function(){tone(440,'sine',.08,.2);tone(554,'sine',.08,.15,.1);},
  turno:function(){tone(500,'sine',.06,.15);},
  zoc_pen:function(){tone(350,'sawtooth',.08,.18);} // penalizaciÃ³n ZoC en pase/tiro
};

// â”€â”€ EQUIPOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

return { SFX, getAC, toggleSound: function(){ soundOn=!soundOn; return soundOn; }, isSoundOn: function(){ return soundOn; } };
}

