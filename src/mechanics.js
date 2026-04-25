var NC=24,NR=15,W=720,H=480,CW=W/NC,CH=H/NR,BUD=700;

// â”€â”€ AUDIO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
var EQS=[
  {id:'madrid',  n:'Real Madrid',  e:'âšª',b:-0.25},
  {id:'barca',   n:'FC Barcelona', e:'ðŸ”µ',b:-0.15},
  {id:'atletico',n:'AtlÃ©tico',     e:'ðŸ”´',b:0.10},
  {id:'sevilla', n:'Sevilla FC',   e:'âš«',b:0.15},
  {id:'valencia',n:'Valencia CF',  e:'ðŸŸ¡',b:0.12},
  {id:'betis',   n:'Real Betis',   e:'ðŸŸ¢',b:0.18},
];

function J(id,n,pos,mov,a,b,c,d,e,f,g,val,cat){
  return{id:id,n:n,pos:pos,mov:mov,
    ent:pos!='POR'?a:0,reg:pos!='POR'?b:0,res:pos!='POR'?c:0,
    alp:pos!='POR'?d:0,prp:pos!='POR'?e:0,alt:pos!='POR'?f:0,prt:pos!='POR'?g:0,
    parada:pos=='POR'?a:0,alcSaq:pos=='POR'?b:0,precSaq:pos=='POR'?c:0,
    val:val,cat:cat,lesionPen:0};
}

// â”€â”€ POOL DE JUGADORES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
var POOL={
madrid:{
POR:[J('mp1','Casillas','POR',3,11,8,7,0,0,0,0,90,'star'),J('mp2','Courtois','POR',3,10,8,7,0,0,0,0,82,'star'),J('mp3','Keylor Navas','POR',3,9,7,6,0,0,0,0,70,'exc'),J('mp4','Buyo','POR',3,8,6,6,0,0,0,0,46,'exc'),J('mp5','IllÃ¡n Meslier','POR',3,7,6,5,0,0,0,0,38,'exc'),J('mp6','RubÃ©n YÃ¡Ã±ez','POR',3,7,5,5,0,0,0,0,30,'exc'),J('mp7','G.Pumares','POR',3,6,5,5,0,0,0,0,26,'exc'),J('mp8','Pacheco','POR',3,6,5,4,0,0,0,0,22,'exc'),J('mp9','Soto Bueno','POR',3,6,5,4,0,0,0,0,20,'exc'),J('mp10','Thibaut R2','POR',3,7,6,5,0,0,0,0,28,'exc'),J('mp11','P.Filial A','POR',3,5,4,4,0,0,0,0,16,'med'),J('mp12','P.Filial B','POR',3,5,4,4,0,0,0,0,14,'med'),J('mp13','P.Cantera A','POR',3,4,4,3,0,0,0,0,11,'med'),J('mp14','P.Cantera B','POR',3,4,3,3,0,0,0,0,9,'med'),J('mp15','P.Reserva A','POR',3,4,3,3,0,0,0,0,8,'med'),J('mp16','P.Reserva B','POR',3,3,3,3,0,0,0,0,7,'med'),J('mp17','P.Afic.A','POR',3,3,3,3,0,0,0,0,6,'bad'),J('mp18','P.Afic.B','POR',3,3,2,2,0,0,0,0,5,'bad'),J('mp19','P.Afic.C','POR',3,2,2,2,0,0,0,0,4,'bad'),J('mp20','El Gato','POR',3,2,2,2,0,0,0,0,3,'bad'),J('mp21','Sin Reflejos','POR',3,2,2,2,0,0,0,0,2,'bad'),J('mp22','Palosanto','POR',3,2,2,2,0,0,0,0,2,'bad'),J('mp23','Manos Piedra','POR',3,2,2,2,0,0,0,0,2,'bad'),J('mp24','El Colador','POR',3,2,2,2,0,0,0,0,2,'bad'),J('mp25','Ni Toco Pelota','POR',3,2,2,2,0,0,0,0,2,'bad')],
DEF:[J('md1','Sergio Ramos','DEF',5,9,8,9,7,6,6,5,85,'star'),J('md2','Roberto Carlos','DEF',7,7,8,7,8,6,7,5,78,'star'),J('md3','Marcelo','DEF',7,6,8,7,8,6,6,5,68,'exc'),J('md4','Varane','DEF',6,8,7,9,6,5,5,4,66,'exc'),J('md5','Carvajal','DEF',6,7,7,7,7,5,6,5,60,'exc'),J('md6','Pepe','DEF',5,9,6,9,6,4,4,3,60,'exc'),J('md7','Mendy','DEF',7,7,7,7,7,5,5,4,58,'exc'),J('md8','Hierro','DEF',4,8,7,9,6,5,5,4,52,'exc'),J('md9','Nacho','DEF',5,8,7,8,6,5,5,4,48,'exc'),J('md10','MilitÃ£o','DEF',6,8,7,9,6,5,5,4,64,'exc'),J('md11','SanchÃ­s','DEF',4,7,6,8,6,4,4,3,34,'med'),J('md12','Chendo','DEF',5,6,6,7,5,4,4,3,30,'med'),J('md13','M.Salgado','DEF',5,6,6,7,5,4,4,3,28,'med'),J('md14','Vallejo','DEF',5,7,6,7,5,4,4,3,30,'med'),J('md15','Odriozola','DEF',6,6,6,6,6,4,5,4,32,'med'),J('md16','D.Filial A','DEF',4,5,5,6,5,3,3,3,18,'med'),J('md17','D.Filial B','DEF',4,5,5,6,5,3,3,3,16,'med'),J('md18','Pepito Lateral','DEF',4,4,4,5,4,3,3,2,12,'bad'),J('md19','ManolÃ­n Ceporra','DEF',4,4,4,5,4,3,3,2,10,'bad'),J('md20','D.Afic. A','DEF',3,3,3,4,3,2,2,2,9,'bad'),J('md21','D.Afic. B','DEF',3,3,3,4,3,2,2,2,8,'bad'),J('md22','El TapÃ³n','DEF',3,3,3,4,3,2,2,2,7,'bad'),J('md23','Patapalo','DEF',3,2,2,3,2,2,2,1,5,'bad'),J('md24','Sin Quite','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('md25','El PortÃ³n','DEF',3,2,2,3,2,2,2,1,4,'bad')],
MED:[J('mm1','Zidane','MED',6,6,10,6,10,9,8,8,98,'star'),J('mm2','Modric','MED',6,7,9,7,11,9,7,7,92,'star'),J('mm3','Kroos','MED',5,6,8,7,12,10,7,6,88,'star'),J('mm4','Figo','MED',7,6,9,7,10,8,8,7,80,'star'),J('mm5','Casemiro','MED',5,9,8,9,9,8,5,5,72,'exc'),J('mm6','Valverde','MED',7,8,8,8,9,7,7,6,70,'exc'),J('mm7','Isco','MED',6,6,10,6,10,8,7,6,68,'exc'),J('mm8','Guti','MED',6,5,8,6,11,8,7,6,62,'exc'),J('mm9','Seedorf','MED',6,8,8,8,9,8,7,6,56,'exc'),J('mm10','Camavinga','MED',7,7,7,7,8,6,6,5,62,'exc'),J('mm11','MÃ­chel','MED',5,7,7,7,9,7,6,5,42,'med'),J('mm12','Pirri','MED',5,7,7,7,8,6,5,5,38,'med'),J('mm13','Amancio','MED',5,6,7,6,8,6,6,5,36,'med'),J('mm14','Ozil','MED',6,4,7,5,9,7,6,5,44,'med'),J('mm15','James RodrÃ­guez','MED',6,5,7,6,9,7,7,6,52,'med'),J('mm16','M.Filial A','MED',5,5,6,6,7,5,5,4,18,'med'),J('mm17','M.Filial B','MED',5,5,6,6,7,5,5,4,16,'med'),J('mm18','Juancho MC','MED',4,4,5,5,6,4,4,4,12,'bad'),J('mm19','Pacheco T.','MED',4,4,4,5,6,4,4,3,10,'bad'),J('mm20','M.Afic.A','MED',4,3,4,4,5,3,3,3,9,'bad'),J('mm21','M.Afic.B','MED',3,3,3,3,4,3,3,2,8,'bad'),J('mm22','El Pelotazo','MED',3,3,3,3,4,2,3,2,7,'bad'),J('mm23','Sin Toque','MED',3,2,2,3,3,2,2,2,5,'bad'),J('mm24','El Perdido','MED',3,2,2,3,3,2,2,2,4,'bad'),J('mm25','Sin Primera','MED',3,2,2,3,3,2,2,2,4,'bad')],
DEL:[J('mdl1','Ronaldo Naz.','DEL',7,4,10,7,7,6,10,9,100,'star'),J('mdl2','Di StÃ©fano','DEL',7,7,9,7,10,8,10,9,98,'star'),J('mdl3','C.Ronaldo','DEL',7,5,9,7,8,6,11,10,95,'star'),J('mdl4','PuskÃ¡s','DEL',5,4,8,6,8,7,9,9,88,'star'),J('mdl5','RaÃºl','DEL',6,5,8,7,9,7,9,8,84,'exc'),J('mdl6','Vinicius','DEL',8,4,10,6,8,6,8,7,80,'exc'),J('mdl7','Benzema','DEL',6,5,8,7,9,7,9,8,78,'exc'),J('mdl8','Bale','DEL',8,5,8,7,7,5,9,8,70,'exc'),J('mdl9','Morientes','DEL',6,5,7,7,7,6,9,8,56,'exc'),J('mdl10','ButragueÃ±o','DEL',6,5,8,7,8,6,8,7,58,'exc'),J('mdl11','Hugo SÃ¡nchez','DEL',6,4,8,6,6,5,9,8,54,'med'),J('mdl12','Savio','DEL',7,4,9,6,7,5,8,7,48,'med'),J('mdl13','Soldado','DEL',6,4,6,6,5,4,8,7,40,'med'),J('mdl14','HiguaÃ­n','DEL',6,4,7,6,5,4,8,7,46,'med'),J('mdl15','Suker','DEL',7,4,7,6,6,5,8,7,50,'med'),J('mdl16','D.Filial A','DEL',5,4,6,5,6,4,7,6,20,'med'),J('mdl17','D.Filial B','DEL',5,4,6,5,6,4,7,6,18,'med'),J('mdl18','Paquito R.','DEL',5,3,4,4,4,3,5,4,13,'bad'),J('mdl19','D.Afic.A','DEL',4,3,4,4,4,3,5,4,11,'bad'),J('mdl20','D.Afic.B','DEL',4,3,3,3,3,2,4,3,9,'bad'),J('mdl21','MiguelÃ­n','DEL',4,2,3,3,3,2,4,3,8,'bad'),J('mdl22','El Lento','DEL',3,2,3,3,3,2,3,3,7,'bad'),J('mdl23','El CaÃ±as','DEL',3,2,2,3,2,2,3,2,5,'bad'),J('mdl24','Sin Gol M','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('mdl25','El OfsÃ¡ider M','DEL',3,2,2,3,2,2,3,2,4,'bad')]
},
barca:{
POR:[J('bp1','Zamora','POR',3,11,7,7,0,0,0,0,70,'star'),J('bp2','ter Stegen','POR',3,10,9,8,0,0,0,0,82,'star'),J('bp3','ValdÃ©s','POR',3,9,8,7,0,0,0,0,70,'exc'),J('bp4','Zubizarreta','POR',3,8,6,6,0,0,0,0,48,'exc'),J('bp5','Arnau','POR',3,7,6,5,0,0,0,0,36,'exc'),J('bp6','Pinto','POR',3,7,5,5,0,0,0,0,30,'exc'),J('bp7','Neto','POR',3,8,7,6,0,0,0,0,44,'exc'),J('bp8','Reina','POR',3,7,6,5,0,0,0,0,34,'exc'),J('bp9','IÃ±aki PeÃ±a','POR',3,7,6,5,0,0,0,0,30,'exc'),J('bp10','Dani Morro','POR',3,6,5,5,0,0,0,0,20,'exc'),J('bp11','P.MasÃ­a A','POR',3,5,5,4,0,0,0,0,18,'med'),J('bp12','P.MasÃ­a B','POR',3,5,4,4,0,0,0,0,15,'med'),J('bp13','P.Filial A','POR',3,5,4,4,0,0,0,0,12,'med'),J('bp14','P.Filial B','POR',3,4,4,3,0,0,0,0,10,'med'),J('bp15','P.Cantera','POR',3,4,3,3,0,0,0,0,8,'med'),J('bp16','P.Reserva','POR',3,4,3,3,0,0,0,0,7,'med'),J('bp17','P.Afic.A','POR',3,3,3,3,0,0,0,0,6,'bad'),J('bp18','P.Afic.B','POR',3,3,2,2,0,0,0,0,5,'bad'),J('bp19','El Palosanto','POR',3,2,2,2,0,0,0,0,4,'bad'),J('bp20','Manos Piedra','POR',3,2,2,2,0,0,0,0,3,'bad'),J('bp21','Sin Reflejos B','POR',3,2,2,2,0,0,0,0,2,'bad'),J('bp22','El CagÃ³n','POR',3,2,2,2,0,0,0,0,2,'bad'),J('bp23','El Colador B','POR',3,2,2,2,0,0,0,0,2,'bad'),J('bp24','Ni Toco B','POR',3,2,2,2,0,0,0,0,2,'bad'),J('bp25','Sin Guantes','POR',3,2,2,2,0,0,0,0,2,'bad')],
DEF:[J('bd1','Puyol','DEF',5,9,7,10,6,5,5,4,68,'star'),J('bd2','Dani Alves','DEF',7,7,8,7,10,7,7,6,72,'star'),J('bd3','PiquÃ©','DEF',5,8,7,8,7,6,5,5,64,'exc'),J('bd4','Jordi Alba','DEF',8,6,8,7,9,6,6,5,64,'exc'),J('bd5','Koeman','DEF',4,7,7,8,8,6,7,6,56,'exc'),J('bd6','Abidal','DEF',6,7,7,8,6,5,4,4,50,'exc'),J('bd7','Umtiti','DEF',5,8,7,8,6,5,5,4,54,'exc'),J('bd8','Sergi Roberto','DEF',6,7,8,7,9,6,6,5,54,'exc'),J('bd9','Guardiola','DEF',4,7,8,7,9,7,5,5,50,'exc'),J('bd10','Araujo','DEF',5,8,7,9,6,5,5,4,58,'exc'),J('bd11','Oleguer','DEF',5,6,6,7,5,4,4,3,28,'med'),J('bd12','Sylvinho','DEF',6,6,7,6,7,5,5,4,30,'med'),J('bd13','Belletti','DEF',6,7,7,7,7,5,5,4,42,'med'),J('bd14','Balde','DEF',7,6,7,6,8,5,5,4,48,'exc'),J('bd15','Dest','DEF',7,6,7,6,8,5,6,5,44,'exc'),J('bd16','D.MasÃ­a A','DEF',4,5,5,6,5,4,4,3,18,'med'),J('bd17','D.MasÃ­a B','DEF',4,5,5,6,5,4,4,3,16,'med'),J('bd18','D.Filial A','DEF',4,4,4,5,4,3,3,2,12,'bad'),J('bd19','D.Filial B','DEF',4,4,4,5,4,3,3,2,10,'bad'),J('bd20','TapÃ³n CulÃ©','DEF',3,3,3,4,3,2,2,2,9,'bad'),J('bd21','D.Afic.A','DEF',3,3,3,4,3,2,2,2,8,'bad'),J('bd22','Patapalo C','DEF',3,3,3,4,3,2,2,2,7,'bad'),J('bd23','Sin Quite C','DEF',3,2,2,3,2,2,2,1,5,'bad'),J('bd24','El PortÃ³n B','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('bd25','Sin Marcaje','DEF',3,2,2,3,2,2,2,1,4,'bad')],
MED:[J('bm1','Xavi','MED',6,7,9,7,12,10,6,6,88,'star'),J('bm2','Iniesta','MED',7,7,11,7,11,10,7,7,96,'star'),J('bm3','Laudrup','MED',7,6,9,6,11,9,8,7,78,'star'),J('bm4','Busquets','MED',5,9,9,8,10,9,5,5,72,'exc'),J('bm5','De Jong','MED',7,7,9,7,10,8,6,6,74,'exc'),J('bm6','Pedri','MED',6,6,9,6,11,9,7,6,78,'exc'),J('bm7','Gavi','MED',6,8,9,7,10,8,6,6,72,'exc'),J('bm8','RakitiÄ‡','MED',7,8,8,8,10,8,7,6,68,'exc'),J('bm9','Thiago','MED',6,6,9,7,11,9,7,6,72,'exc'),J('bm10','Deco','MED',6,7,8,7,9,7,6,6,62,'exc'),J('bm11','S.Barjuan','MED',5,6,7,6,8,6,5,5,32,'med'),J('bm12','Popescu','MED',5,7,7,7,8,6,5,5,34,'med'),J('bm13','Hleb','MED',6,5,8,6,9,7,7,6,44,'med'),J('bm14','Olmo','MED',7,6,8,6,9,7,7,6,58,'exc'),J('bm15','Ferran Torres MED','MED',7,5,7,6,8,6,7,6,52,'exc'),J('bm16','M.MasÃ­a A','MED',5,5,6,6,7,5,5,4,18,'med'),J('bm17','M.MasÃ­a B','MED',5,5,6,6,7,5,5,4,16,'med'),J('bm18','Tiquitaca T','MED',4,4,5,5,6,4,4,4,12,'bad'),J('bm19','M.Filial B','MED',4,4,4,5,6,4,4,3,10,'bad'),J('bm20','Pase Roto','MED',4,3,4,4,5,3,3,3,9,'bad'),J('bm21','M.Afic.A','MED',3,3,4,4,5,3,3,3,8,'bad'),J('bm22','M.Afic.B','MED',3,3,3,3,4,3,3,2,7,'bad'),J('bm23','Sin Control','MED',3,2,2,3,3,2,2,2,5,'bad'),J('bm24','El Perdido B','MED',3,2,2,3,3,2,2,2,4,'bad'),J('bm25','Sin Primera B','MED',3,2,2,3,3,2,2,2,4,'bad')],
DEL:[J('bdl1','Messi','DEL',7,4,12,6,10,9,11,10,100,'star'),J('bdl2','Cruyff','DEL',7,5,10,6,10,8,9,8,94,'star'),J('bdl3','Ronaldinho','DEL',7,4,11,6,9,8,9,9,92,'star'),J('bdl4','Neymar','DEL',8,4,11,6,9,7,9,8,90,'star'),J('bdl5','SuÃ¡rez','DEL',6,5,9,7,8,7,10,9,86,'exc'),J('bdl6','Kubala','DEL',6,5,9,7,9,8,9,8,84,'exc'),J('bdl7','Yamal','DEL',8,4,10,5,8,7,8,7,82,'exc'),J('bdl8','Stoichkov','DEL',7,6,9,7,8,7,10,9,74,'exc'),J('bdl9','Rivaldo','DEL',6,5,9,7,9,8,10,9,78,'exc'),J('bdl10','Lewandowski','DEL',6,5,8,7,7,6,10,9,76,'exc'),J('bdl11',"Eto'o",'DEL',7,4,8,6,6,5,9,8,68,'med'),J('bdl12','Villa ced.','DEL',7,5,8,6,7,6,9,8,58,'med'),J('bdl13','Ansu Fati','DEL',7,3,8,4,6,5,8,7,60,'exc'),J('bdl14','Ferran DEL','DEL',7,4,7,5,7,5,8,7,54,'exc'),J('bdl15','Riqui Puig','DEL',6,4,8,5,8,6,7,6,46,'med'),J('bdl16','D.MasÃ­a A','DEL',5,4,6,5,6,5,7,6,20,'med'),J('bdl17','D.MasÃ­a B','DEL',5,4,6,5,6,5,7,6,18,'med'),J('bdl18','D.Filial A','DEL',5,3,5,4,5,4,6,5,13,'bad'),J('bdl19','D.Filial B','DEL',4,3,4,4,4,3,6,5,11,'bad'),J('bdl20','El Pateador','DEL',4,3,4,4,4,3,5,4,9,'bad'),J('bdl21','D.Afic.A','DEL',4,2,3,3,3,2,4,3,8,'bad'),J('bdl22','D.Afic.B','DEL',3,2,3,3,3,2,4,3,7,'bad'),J('bdl23','Sin Gol B','DEL',3,2,2,3,2,2,3,2,5,'bad'),J('bdl24','El OfsÃ¡ider B','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('bdl25','Falla Solo B','DEL',3,2,2,3,2,2,3,2,4,'bad')]
},
atletico:{
POR:[J('ap1','Oblak','POR',3,12,8,7,0,0,0,0,96,'star'),J('ap2','Fillol','POR',3,10,7,7,0,0,0,0,65,'star'),J('ap3','Molina','POR',3,8,7,6,0,0,0,0,42,'exc'),J('ap4','Asenjo','POR',3,8,6,6,0,0,0,0,38,'exc'),J('ap5','Adan','POR',3,7,5,5,0,0,0,0,26,'exc'),J('ap6','Mono Burgos','POR',3,6,5,4,0,0,0,0,28,'exc'),J('ap7','Gazzaniga','POR',3,7,6,5,0,0,0,0,33,'exc'),J('ap8','Musso','POR',3,9,7,6,0,0,0,0,52,'exc'),J('ap9','MoyÃ¡','POR',3,7,6,5,0,0,0,0,30,'exc'),J('ap10','P.Res B','POR',3,5,5,4,0,0,0,0,17,'exc'),J('ap11','P.Filial A','POR',3,5,4,4,0,0,0,0,14,'med'),J('ap12','P.Filial B','POR',3,4,4,3,0,0,0,0,12,'med'),J('ap13','P.Filial C','POR',3,4,3,3,0,0,0,0,10,'med'),J('ap14','P.Cantera','POR',3,4,3,3,0,0,0,0,9,'med'),J('ap15','P.Afic.A','POR',3,3,3,3,0,0,0,0,8,'med'),J('ap16','P.Afic.B','POR',3,3,3,3,0,0,0,0,7,'med'),J('ap17','El Palos','POR',3,3,2,2,0,0,0,0,6,'bad'),J('ap18','Gato Malo','POR',3,2,2,2,0,0,0,0,5,'bad'),J('ap19','Ni pa atrÃ¡s','POR',3,2,2,2,0,0,0,0,4,'bad'),J('ap20','Sin Ref A','POR',3,2,2,2,0,0,0,0,3,'bad'),J('ap21','Palosanto W','POR',3,2,2,2,0,0,0,0,2,'bad'),J('ap22','Manos Blandas','POR',3,2,2,2,0,0,0,0,2,'bad'),J('ap23','El Colador A','POR',3,2,2,2,0,0,0,0,2,'bad'),J('ap24','Sin Guantes A','POR',3,2,2,2,0,0,0,0,2,'bad'),J('ap25','Palosanto A2','POR',3,2,2,2,0,0,0,0,2,'bad')],
DEF:[J('ad1','GodÃ­n','DEF',5,9,8,10,6,5,5,4,68,'star'),J('ad2','FÃ­lipe Luis','DEF',7,7,8,7,9,6,6,5,62,'star'),J('ad3','GimÃ©nez','DEF',5,9,7,9,6,5,5,4,62,'exc'),J('ad4','Trippier','DEF',6,7,8,7,10,7,7,6,64,'exc'),J('ad5','SaviÄ‡','DEF',5,9,7,9,6,5,5,4,60,'exc'),J('ad6','Llorente D','DEF',7,7,8,7,9,7,7,6,66,'exc'),J('ad7','Juanfran','DEF',6,8,7,8,7,6,6,5,52,'exc'),J('ad8','Reinildo','DEF',6,7,7,7,7,5,5,4,50,'exc'),J('ad9','Hermoso','DEF',5,8,7,9,6,5,5,4,56,'exc'),J('ad10','Witsel D','DEF',5,8,7,8,6,5,5,4,46,'exc'),J('ad11','Perea','DEF',5,7,6,8,5,4,4,3,34,'med'),J('ad12','T.JimÃ©nez','DEF',5,6,6,7,5,4,4,3,26,'med'),J('ad13','Aguilera','DEF',5,6,6,7,5,4,4,3,24,'med'),J('ad14','Azpilicueta','DEF',6,7,7,7,7,5,5,4,44,'med'),J('ad15','Marcos Ll. D','DEF',7,7,8,7,9,7,7,6,60,'exc'),J('ad16','D.Filial A','DEF',4,5,5,6,5,3,3,3,16,'med'),J('ad17','D.Filial B','DEF',4,5,5,6,5,3,3,3,14,'med'),J('ad18','El Cerrojo','DEF',4,4,4,5,4,3,3,2,11,'bad'),J('ad19','Muro BerlÃ­n','DEF',3,4,4,5,4,3,3,2,9,'bad'),J('ad20','D.Afic.A','DEF',3,3,3,4,3,2,2,2,8,'bad'),J('ad21','D.Afic.B','DEF',3,3,3,4,3,2,2,2,7,'bad'),J('ad22','TapÃ³n A','DEF',3,3,3,4,3,2,2,2,6,'bad'),J('ad23','Sin Quite A','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('ad24','El PortÃ³n A','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('ad25','Sin Marcaje A','DEF',3,2,2,3,2,2,2,1,3,'bad')],
MED:[J('am1','Koke','MED',7,8,8,8,10,8,7,6,70,'star'),J('am2','Arda Turan','MED',7,8,9,7,9,7,8,7,66,'star'),J('am3','SaÃºl','MED',6,8,8,8,9,7,7,6,64,'exc'),J('am4','De Paul','MED',6,8,8,8,9,7,7,6,66,'exc'),J('am5','Gabi','MED',6,9,8,9,9,7,6,5,54,'exc'),J('am6','Witsel','MED',5,9,8,9,8,7,5,5,56,'exc'),J('am7','Tiago','MED',5,9,8,8,9,7,5,5,54,'exc'),J('am8','Lemar','MED',7,6,8,7,9,7,7,6,56,'exc'),J('am9','Caminero','MED',6,7,8,7,9,7,7,6,50,'exc'),J('am10','Futre','MED',7,6,9,6,8,6,7,6,56,'exc'),J('am11','Correa M','MED',7,7,8,7,8,6,7,6,54,'med'),J('am12','HÃ©ctor Herrera','MED',6,8,7,8,8,6,5,5,48,'med'),J('am13','Llorente M','MED',7,7,8,7,9,7,7,6,60,'exc'),J('am14','Ujfalusi','MED',5,8,7,8,7,5,4,4,28,'med'),J('am15','Luis GarcÃ­a M','MED',6,7,7,7,7,5,5,4,34,'med'),J('am16','M.Filial A','MED',5,5,6,6,7,5,5,4,16,'med'),J('am17','M.Filial B','MED',5,5,6,6,7,5,5,4,14,'med'),J('am18','Correcaminos','MED',4,4,5,5,6,4,4,4,11,'bad'),J('am19','El Pelotazo A','MED',4,4,4,5,6,4,4,3,9,'bad'),J('am20','M.Afic.A','MED',4,3,4,4,5,3,3,3,8,'bad'),J('am21','Trinquete A','MED',3,3,3,3,4,3,3,2,7,'bad'),J('am22','Sin Toque A','MED',3,3,3,3,4,2,3,2,6,'bad'),J('am23','Desmarcado A','MED',3,2,2,3,3,2,2,2,4,'bad'),J('am24','El Perdido A','MED',3,2,2,3,3,2,2,2,4,'bad'),J('am25','Sin Primera A','MED',3,2,2,3,3,2,2,2,3,'bad')],
DEL:[J('adl1','Griezmann','DEL',7,5,9,7,9,8,10,9,88,'star'),J('adl2','JoÃ£o FÃ©lix','DEL',7,4,10,6,9,8,9,8,82,'star'),J('adl3','ForlÃ¡n','DEL',6,5,8,7,8,7,10,9,72,'exc'),J('adl4','Torres F','DEL',7,5,8,7,8,6,9,8,70,'exc'),J('adl5','Diego Costa','DEL',6,8,8,10,6,5,9,7,66,'exc'),J('adl6','SuÃ¡rez L','DEL',6,5,9,7,8,7,10,9,74,'exc'),J('adl7','MandzukiÄ‡','DEL',6,7,7,9,6,5,9,7,60,'exc'),J('adl8','Memphis','DEL',7,5,9,7,8,7,9,8,66,'exc'),J('adl9','Morata','DEL',7,5,7,7,7,6,9,8,60,'exc'),J('adl10','Correa DEL','DEL',7,5,8,6,7,6,8,7,56,'exc'),J('adl11','AdriÃ¡n','DEL',5,5,7,7,7,6,8,7,42,'med'),J('adl12','Kiko','DEL',6,5,7,6,6,5,8,7,46,'med'),J('adl13','J.Salinas','DEL',6,5,7,6,6,5,8,7,42,'med'),J('adl14','Cunha','DEL',7,5,8,6,7,5,8,7,52,'med'),J('adl15','Vitolo DEL','DEL',7,5,7,5,7,5,7,6,46,'med'),J('adl16','D.Filial A','DEL',5,4,6,5,6,5,7,6,16,'med'),J('adl17','D.Filial B','DEL',5,4,6,5,6,5,7,6,14,'med'),J('adl18','D.Afic.A','DEL',5,3,5,4,5,4,6,5,11,'bad'),J('adl19','D.Afic.B','DEL',4,3,4,4,4,3,6,5,9,'bad'),J('adl20','PunterÃ­a0','DEL',4,3,4,4,4,3,5,4,8,'bad'),J('adl21','Falla Solo A','DEL',4,2,3,3,3,2,4,3,7,'bad'),J('adl22','Sin Gol A','DEL',3,2,3,3,3,2,4,3,6,'bad'),J('adl23','El OfsÃ¡ider A','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('adl24','Sin PunterÃ­a A','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('adl25','El CaÃ±as A','DEL',3,2,2,3,2,2,3,2,3,'bad')]
},
sevilla:{
POR:[J('sp1','Palop','POR',3,9,6,6,0,0,0,0,44,'star'),J('sp2','Vaclik','POR',3,8,7,6,0,0,0,0,44,'star'),J('sp3','Dmitrovic','POR',3,7,6,5,0,0,0,0,36,'exc'),J('sp4','Beto','POR',3,7,5,5,0,0,0,0,32,'exc'),J('sp5','Diego LÃ³pez','POR',3,7,6,5,0,0,0,0,34,'exc'),J('sp6','Esteban','POR',3,7,6,5,0,0,0,0,30,'exc'),J('sp7','Notario','POR',3,7,5,5,0,0,0,0,28,'exc'),J('sp8','Marcos POR','POR',3,6,5,5,0,0,0,0,22,'exc'),J('sp9','Bounou','POR',3,8,7,6,0,0,0,0,50,'exc'),J('sp10','Lecomte','POR',3,7,6,5,0,0,0,0,32,'exc'),J('sp11','P.Nerv A','POR',3,6,5,4,0,0,0,0,18,'med'),J('sp12','P.Nerv B','POR',3,5,4,4,0,0,0,0,14,'med'),J('sp13','P.Filial A','POR',3,5,4,4,0,0,0,0,12,'med'),J('sp14','P.Filial B','POR',3,4,4,3,0,0,0,0,10,'med'),J('sp15','P.Filial C','POR',3,4,3,3,0,0,0,0,8,'med'),J('sp16','P.Cantera','POR',3,4,3,3,0,0,0,0,7,'med'),J('sp17','P.Afic.A','POR',3,3,3,3,0,0,0,0,6,'bad'),J('sp18','P.Afic.B','POR',3,3,2,2,0,0,0,0,5,'bad'),J('sp19','P.Afic.C','POR',3,2,2,2,0,0,0,0,4,'bad'),J('sp20','Dedos Oro no','POR',3,2,2,2,0,0,0,0,3,'bad'),J('sp21','Sin Ref S','POR',3,2,2,2,0,0,0,0,2,'bad'),J('sp22','Palosanto S','POR',3,2,2,2,0,0,0,0,2,'bad'),J('sp23','Manos S','POR',3,2,2,2,0,0,0,0,2,'bad'),J('sp24','El Colador S','POR',3,2,2,2,0,0,0,0,2,'bad'),J('sp25','Sin Guantes S','POR',3,2,2,2,0,0,0,0,2,'bad')],
DEF:[J('sd1','JesÃºs Navas','DEF',8,6,8,6,9,7,7,6,64,'star'),J('sd2','KoundÃ©','DEF',6,8,8,8,8,6,5,5,64,'star'),J('sd3','EscudÃ©','DEF',5,8,7,8,6,5,4,4,44,'exc'),J('sd4','CarriÃ§o','DEF',5,8,7,8,6,5,4,4,42,'exc'),J('sd5','Aleix Vidal','DEF',7,7,8,7,8,6,6,5,50,'exc'),J('sd6','Coke','DEF',6,7,7,7,7,5,6,5,44,'exc'),J('sd7','ReguilÃ³n','DEF',7,6,7,6,8,6,5,5,52,'exc'),J('sd8','Rekik','DEF',5,7,7,7,6,5,4,4,40,'exc'),J('sd9','Fernando','DEF',5,8,7,8,6,5,4,4,48,'exc'),J('sd10','MarcÃ£o','DEF',5,7,7,8,5,4,4,3,40,'exc'),J('sd11','Sergi GÃ³mez','DEF',5,7,6,7,6,5,4,4,34,'med'),J('sd12','Kolodjezak','DEF',5,7,6,7,5,4,4,3,34,'med'),J('sd13','D.Castedo','DEF',5,6,6,6,5,4,4,3,24,'med'),J('sd14','J.Navarro','DEF',5,6,6,7,5,4,4,3,22,'med'),J('sd15','AcuÃ±a','DEF',7,7,7,7,8,6,5,5,50,'exc'),J('sd16','D.Filial A','DEF',4,5,5,6,5,3,3,3,16,'med'),J('sd17','D.Filial B','DEF',4,5,5,6,5,3,3,3,14,'med'),J('sd18','D.Afic.A','DEF',4,4,4,5,4,3,3,2,11,'bad'),J('sd19','D.Afic.B','DEF',4,4,4,5,4,3,3,2,9,'bad'),J('sd20','D.Afic.C','DEF',3,3,3,4,3,2,2,2,8,'bad'),J('sd21','El Patata','DEF',3,3,3,4,3,2,2,2,7,'bad'),J('sd22','Sin Zurda S','DEF',3,3,3,4,3,2,2,2,6,'bad'),J('sd23','FallaSAndres','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('sd24','Sin Quite S','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('sd25','El TapÃ³n S','DEF',3,2,2,3,2,2,2,1,3,'bad')],
MED:[J('sm1','RakitiÄ‡','MED',7,8,8,8,10,8,7,6,68,'star'),J('sm2','Banega','MED',6,6,8,7,10,8,6,6,60,'star'),J('sm3','Papu GÃ³mez','MED',7,7,9,7,9,7,8,7,64,'exc'),J('sm4','DAlves M','MED',7,7,8,7,10,7,7,6,66,'exc'),J('sm5','JA Reyes','MED',7,6,9,6,9,7,8,7,56,'exc'),J('sm6','Vitolo','MED',7,7,8,7,9,7,7,6,56,'exc'),J('sm7','Nasri','MED',6,6,8,7,9,7,7,6,52,'exc'),J('sm8','F.VÃ¡zquez','MED',6,6,8,6,9,7,7,6,50,'exc'),J('sm9','Fernando MED','MED',5,8,7,8,8,6,5,5,46,'exc'),J('sm10','Suso','MED',7,5,7,5,8,6,6,5,46,'exc'),J('sm11','F.Navarro','MED',5,8,7,7,8,6,5,5,38,'med'),J('sm12','Dario Silva','MED',7,5,8,6,7,6,7,6,44,'med'),J('sm13','KanoutÃ© M','MED',6,6,8,8,7,6,9,8,54,'med'),J('sm14','P.Blanco','MED',5,6,7,6,7,5,5,4,28,'med'),J('sm15','Corona MED','MED',7,5,7,5,7,5,7,6,46,'med'),J('sm16','M.Filial A','MED',5,5,6,6,7,5,5,4,16,'med'),J('sm17','M.Filial B','MED',5,5,6,6,7,5,5,4,14,'med'),J('sm18','M.Afic.A','MED',4,4,5,5,6,4,4,4,11,'bad'),J('sm19','M.Afic.B','MED',4,4,4,5,6,4,4,3,9,'bad'),J('sm20','PelotazoN','MED',4,3,4,4,5,3,3,3,8,'bad'),J('sm21','Sin ToquS','MED',3,3,3,3,4,3,3,2,7,'bad'),J('sm22','El TocÃ³n S','MED',3,3,3,3,4,2,3,2,6,'bad'),J('sm23','El Perdido S','MED',3,2,2,3,3,2,2,2,4,'bad'),J('sm24','Sin Primera S','MED',3,2,2,3,3,2,2,2,4,'bad'),J('sm25','Pase Roto S','MED',3,2,2,3,3,2,2,2,3,'bad')],
DEL:[J('sdl1','KanoutÃ©','DEL',6,5,8,8,7,6,9,8,64,'star'),J('sdl2','Luis Fabiano','DEL',6,5,8,7,7,6,9,8,62,'star'),J('sdl3','Bacca','DEL',7,5,8,7,7,6,9,8,62,'exc'),J('sdl4','Gameiro','DEL',7,5,8,7,7,6,9,8,56,'exc'),J('sdl5','Iago Aspas','DEL',7,5,9,7,8,7,9,8,60,'exc'),J('sdl6','Negredo','DEL',6,6,7,9,7,6,9,8,56,'exc'),J('sdl7','Munir','DEL',7,5,8,6,8,6,8,7,46,'exc'),J('sdl8','Julio Cruz','DEL',6,6,7,8,6,5,8,7,50,'exc'),J('sdl9','En-Nesyri','DEL',7,5,8,7,7,5,9,8,56,'exc'),J('sdl10','Ocampos','DEL',7,6,8,7,7,6,8,7,58,'exc'),J('sdl11','El-Arabi','DEL',6,5,7,7,6,5,8,7,42,'med'),J('sdl12','R.MartÃ­nez','DEL',7,5,7,6,7,5,8,7,40,'med'),J('sdl13','Bent','DEL',6,4,7,6,5,4,8,7,36,'med'),J('sdl14','Fabrice F','DEL',7,4,7,5,6,5,7,6,30,'med'),J('sdl15','Corona DEL','DEL',7,5,7,5,7,5,7,6,46,'med'),J('sdl16','D.Filial A','DEL',5,4,6,5,6,5,7,6,16,'med'),J('sdl17','D.Filial B','DEL',5,4,6,5,6,5,7,6,14,'med'),J('sdl18','D.Afic.A','DEL',5,3,5,4,5,4,6,5,11,'bad'),J('sdl19','D.Afic.B','DEL',4,3,4,4,4,3,6,5,9,'bad'),J('sdl20','Sin Def S','DEL',4,3,4,4,4,3,5,4,8,'bad'),J('sdl21','Falla Solo S','DEL',4,2,3,3,3,2,4,3,7,'bad'),J('sdl22','FueraJuego S','DEL',3,2,3,3,3,2,4,3,6,'bad'),J('sdl23','Sin Gol S','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('sdl24','El OfsÃ¡ider S','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('sdl25','PunterÃ­a0 S','DEL',3,2,2,3,2,2,3,2,3,'bad')]
},
valencia:{
POR:[J('vp1','CaÃ±izares','POR',3,10,7,7,0,0,0,0,54,'star'),J('vp2','Diego Alves','POR',3,9,7,6,0,0,0,0,50,'star'),J('vp3','Jaume','POR',3,8,6,6,0,0,0,0,42,'exc'),J('vp4','Guaita','POR',3,8,7,6,0,0,0,0,46,'exc'),J('vp5','PallarÃ©s','POR',3,7,6,5,0,0,0,0,28,'exc'),J('vp6','Urruticoechea','POR',3,7,6,5,0,0,0,0,26,'exc'),J('vp7','Alberola','POR',3,6,5,5,0,0,0,0,20,'exc'),J('vp8','Angloma POR','POR',3,6,5,4,0,0,0,0,18,'exc'),J('vp9','Cillessen','POR',3,8,7,6,0,0,0,0,44,'exc'),J('vp10','Mamardashvili','POR',3,9,7,6,0,0,0,0,52,'exc'),J('vp11','P.Mestalla A','POR',3,6,5,4,0,0,0,0,16,'med'),J('vp12','P.Mestalla B','POR',3,5,4,4,0,0,0,0,13,'med'),J('vp13','P.Filial A','POR',3,5,4,4,0,0,0,0,11,'med'),J('vp14','P.Filial B','POR',3,4,4,3,0,0,0,0,9,'med'),J('vp15','P.Filial C','POR',3,4,3,3,0,0,0,0,8,'med'),J('vp16','P.Cantera','POR',3,4,3,3,0,0,0,0,7,'med'),J('vp17','P.Afic.A','POR',3,3,3,3,0,0,0,0,6,'bad'),J('vp18','P.Afic.B','POR',3,3,2,2,0,0,0,0,5,'bad'),J('vp19','Murcielago C','POR',3,2,2,2,0,0,0,0,4,'bad'),J('vp20','Sin Palmas','POR',3,2,2,2,0,0,0,0,3,'bad'),J('vp21','Mano Dura no','POR',3,2,2,2,0,0,0,0,2,'bad'),J('vp22','Palosanto V','POR',3,2,2,2,0,0,0,0,2,'bad'),J('vp23','El Colador V','POR',3,2,2,2,0,0,0,0,2,'bad'),J('vp24','Sin Guantes V','POR',3,2,2,2,0,0,0,0,2,'bad'),J('vp25','Manos Blandas V','POR',3,2,2,2,0,0,0,0,2,'bad')],
DEF:[J('vd1','Ayala','DEF',5,8,7,9,6,5,5,4,62,'star'),J('vd2','Jordi Alba','DEF',8,6,8,7,9,6,6,5,64,'star'),J('vd3','Marchena','DEF',5,7,7,8,6,5,4,4,44,'exc'),J('vd4','BellerÃ­n','DEF',7,7,8,7,8,6,6,5,56,'exc'),J('vd5','Guilherme','DEF',6,7,7,7,7,5,5,4,40,'exc'),J('vd6','Diakhaby','DEF',5,8,7,8,6,5,5,4,44,'exc'),J('vd7','Toni Lato','DEF',7,6,7,7,7,5,5,4,42,'exc'),J('vd8','Vezo','DEF',5,7,7,8,6,5,4,4,40,'exc'),J('vd9','GayÃ ','DEF',7,6,8,6,8,6,5,5,52,'exc'),J('vd10','Hugo Guillamon','DEF',5,7,7,8,5,4,4,3,38,'exc'),J('vd11','BarragÃ¡n','DEF',6,6,6,7,6,4,5,4,34,'med'),J('vd12','Angloma DEF','DEF',7,6,7,6,8,5,6,5,36,'med'),J('vd13','CafÃº ced','DEF',7,7,8,7,9,6,7,5,46,'med'),J('vd14','Ayala Res','DEF',5,7,7,8,5,4,4,3,28,'med'),J('vd15','Correia','DEF',7,6,7,6,7,5,5,4,38,'med'),J('vd16','D.Filial A','DEF',4,5,5,6,5,3,3,3,16,'med'),J('vd17','D.Filial B','DEF',4,5,5,6,5,3,3,3,14,'med'),J('vd18','D.Afic.A','DEF',4,4,4,5,4,3,3,2,11,'bad'),J('vd19','D.Afic.B','DEF',4,4,4,5,4,3,3,2,9,'bad'),J('vd20','Murcielago L','DEF',3,3,3,4,3,2,2,2,8,'bad'),J('vd21','D.Afic.C','DEF',3,3,3,4,3,2,2,2,7,'bad'),J('vd22','Sin Quite V','DEF',3,3,3,4,3,2,2,2,6,'bad'),J('vd23','El PortÃ³n V','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('vd24','Sin Marcaje V','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('vd25','Patapalo V','DEF',3,2,2,3,2,2,2,1,3,'bad')],
MED:[J('vm1','David Silva','MED',7,6,9,7,10,8,7,6,80,'star'),J('vm2','Mendieta','MED',7,7,8,7,10,7,8,7,66,'star'),J('vm3','Dani Parejo','MED',6,7,8,7,11,8,6,6,64,'exc'),J('vm4','Kondogbia','MED',6,9,8,9,8,6,5,5,56,'exc'),J('vm5','Coquelin','MED',5,9,8,8,8,6,5,5,50,'exc'),J('vm6','FerrÃ¡n Torres','MED',7,6,8,7,8,6,8,7,60,'exc'),J('vm7','Vicente','MED',7,6,9,6,8,6,7,6,56,'exc'),J('vm8','Baraja','MED',5,8,7,8,9,7,6,5,50,'exc'),J('vm9','Albelda','MED',5,9,8,8,9,7,5,5,50,'exc'),J('vm10','Soler','MED',6,6,7,6,9,7,6,5,52,'exc'),J('vm11','JoaquÃ­n ced','MED',7,6,9,6,9,7,7,6,52,'med'),J('vm12','Carboni','MED',5,7,7,7,8,6,5,5,30,'med'),J('vm13','C.PÃ©rez','MED',5,6,7,6,7,5,5,4,24,'med'),J('vm14','Musah','MED',7,6,7,6,8,6,6,5,42,'med'),J('vm15','Guilbert MED','MED',6,6,6,6,6,5,5,4,28,'med'),J('vm16','M.Filial A','MED',5,5,6,6,7,5,5,4,16,'med'),J('vm17','M.Filial B','MED',5,5,6,6,7,5,5,4,14,'med'),J('vm18','M.Afic.A','MED',4,4,5,5,6,4,4,4,11,'bad'),J('vm19','M.Afic.B','MED',4,4,4,5,6,4,4,3,9,'bad'),J('vm20','Murcielago T','MED',4,3,4,4,5,3,3,3,8,'bad'),J('vm21','Sin ControlV','MED',3,3,3,3,4,3,3,2,7,'bad'),J('vm22','El Desordenado','MED',3,3,3,3,4,2,3,2,6,'bad'),J('vm23','Fuera Sitio V','MED',3,2,2,3,3,2,2,2,4,'bad'),J('vm24','Sin Primera V','MED',3,2,2,3,3,2,2,2,4,'bad'),J('vm25','Pase Roto V','MED',3,2,2,3,3,2,2,2,3,'bad')],
DEL:[J('vdl1','David Villa','DEL',7,5,9,7,8,7,9,8,82,'star'),J('vdl2','Roy Makaay','DEL',6,5,7,7,6,5,9,8,56,'star'),J('vdl3','Rodrigo','DEL',7,5,8,7,8,7,9,8,62,'exc'),J('vdl4','Cavani','DEL',7,5,8,7,7,6,10,9,72,'exc'),J('vdl5','Paco AlcÃ¡cer','DEL',6,5,7,7,7,6,9,8,56,'exc'),J('vdl6','Claudio LÃ³pez','DEL',7,5,8,6,7,5,9,8,60,'exc'),J('vdl7','Mista','DEL',6,5,8,6,7,5,8,7,50,'exc'),J('vdl8','Soler DEL','DEL',6,5,8,7,9,7,7,6,56,'exc'),J('vdl9','Guedes','DEL',7,5,8,6,7,5,8,7,54,'exc'),J('vdl10','Duro','DEL',7,5,7,7,6,5,8,7,46,'exc'),J('vdl11','Salvo','DEL',6,5,7,6,6,5,8,7,38,'med'),J('vdl12','Angulo','DEL',6,4,7,6,5,4,8,7,36,'med'),J('vdl13','John Carew','DEL',6,5,7,7,5,4,8,7,40,'med'),J('vdl14','ButragueÃ±o c','DEL',6,5,8,7,7,6,8,7,48,'med'),J('vdl15','Hugo Duro','DEL',7,4,6,6,5,4,7,6,40,'med'),J('vdl16','D.Filial A','DEL',5,4,6,5,6,5,7,6,16,'med'),J('vdl17','D.Filial B','DEL',5,4,6,5,6,5,7,6,14,'med'),J('vdl18','D.Afic.A','DEL',5,3,5,4,5,4,6,5,11,'bad'),J('vdl19','D.Afic.B','DEL',4,3,4,4,4,3,6,5,9,'bad'),J('vdl20','PunterÃ­a V','DEL',4,3,4,4,4,3,5,4,8,'bad'),J('vdl21','Falla Solo V','DEL',4,2,3,3,3,2,4,3,7,'bad'),J('vdl22','El Offside V','DEL',3,2,3,3,3,2,4,3,6,'bad'),J('vdl23','Sin Gol V','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('vdl24','El OfsÃ¡ider V','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('vdl25','CaÃ±as V','DEL',3,2,2,3,2,2,3,2,3,'bad')]
},
betis:{
POR:[J('bep1','Claudio Bravo','POR',3,10,8,7,0,0,0,0,60,'star'),J('bep2','Rui Silva','POR',3,9,7,7,0,0,0,0,48,'star'),J('bep3','Pau LÃ³pez','POR',3,8,7,6,0,0,0,0,44,'exc'),J('bep4','Adan','POR',3,7,5,5,0,0,0,0,28,'exc'),J('bep5','Doblas','POR',3,7,6,5,0,0,0,0,26,'exc'),J('bep6','Casto','POR',3,6,5,5,0,0,0,0,20,'exc'),J('bep7','Dani GimÃ©nez','POR',3,6,5,4,0,0,0,0,18,'exc'),J('bep8','Joel Robles','POR',3,7,5,5,0,0,0,0,24,'exc'),J('bep9','Bravo Res','POR',3,7,6,5,0,0,0,0,30,'exc'),J('bep10','Vieites','POR',3,7,6,5,0,0,0,0,28,'exc'),J('bep11','P.Heliop A','POR',3,6,5,4,0,0,0,0,14,'med'),J('bep12','P.Heliop B','POR',3,5,4,4,0,0,0,0,12,'med'),J('bep13','P.Filial A','POR',3,5,4,4,0,0,0,0,10,'med'),J('bep14','P.Filial B','POR',3,4,4,3,0,0,0,0,8,'med'),J('bep15','P.Filial C','POR',3,4,3,3,0,0,0,0,7,'med'),J('bep16','P.Cantera','POR',3,4,3,3,0,0,0,0,6,'med'),J('bep17','P.Afic.A','POR',3,3,3,3,0,0,0,0,6,'bad'),J('bep18','P.Afic.B','POR',3,3,2,2,0,0,0,0,5,'bad'),J('bep19','Manos Mant','POR',3,2,2,2,0,0,0,0,4,'bad'),J('bep20','El CagÃ³n B','POR',3,2,2,2,0,0,0,0,3,'bad'),J('bep21','Sin Ref B','POR',3,2,2,2,0,0,0,0,2,'bad'),J('bep22','Ni pa atrÃ¡s B','POR',3,2,2,2,0,0,0,0,2,'bad'),J('bep23','El Colador B2','POR',3,2,2,2,0,0,0,0,2,'bad'),J('bep24','Sin Guantes B','POR',3,2,2,2,0,0,0,0,2,'bad'),J('bep25','Palosanto B','POR',3,2,2,2,0,0,0,0,2,'bad')],
DEF:[J('bed1','Marc Bartra','DEF',5,7,7,8,6,5,5,4,50,'star'),J('bed2','Emerson Royal','DEF',7,7,8,7,8,6,6,5,60,'star'),J('bed3','Aissa Mandi','DEF',5,7,7,8,6,5,4,4,44,'exc'),J('bed4','Ãlex Moreno','DEF',7,6,8,7,9,6,6,5,54,'exc'),J('bed5','GermÃ¡n','DEF',5,8,7,8,6,5,4,4,40,'exc'),J('bed6','Sabaly','DEF',6,7,7,7,7,5,5,4,50,'exc'),J('bed7','Pezzella','DEF',5,7,7,8,6,5,5,4,46,'exc'),J('bed8','J.Miranda','DEF',7,6,7,7,8,6,5,5,46,'exc'),J('bed9','Jordi Amat','DEF',5,7,6,7,5,4,4,3,32,'exc'),J('bed10','Mykhaylichenko','DEF',6,6,7,6,7,5,5,4,36,'exc'),J('bed11','Edgar Gzlez','DEF',5,7,6,7,5,4,4,3,30,'med'),J('bed12','Varela','DEF',5,6,6,6,5,4,4,3,22,'med'),J('bed13','Paulao','DEF',5,6,6,7,5,4,4,3,20,'med'),J('bed14','Ruibal DEF','DEF',7,6,7,6,7,5,5,4,36,'med'),J('bed15','Montoya DEF','DEF',6,6,7,6,7,5,5,4,30,'med'),J('bed16','D.Filial A','DEF',4,5,5,6,5,3,3,3,16,'med'),J('bed17','D.Filial B','DEF',4,5,5,6,5,3,3,3,14,'med'),J('bed18','D.Afic.A','DEF',4,4,4,5,4,3,3,2,11,'bad'),J('bed19','D.Afic.B','DEF',4,4,4,5,4,3,3,2,9,'bad'),J('bed20','Torpe B','DEF',3,3,3,4,3,2,2,2,8,'bad'),J('bed21','D.Afic.C','DEF',3,3,3,4,3,2,2,2,7,'bad'),J('bed22','Sin Quite B','DEF',3,3,3,4,3,2,2,2,6,'bad'),J('bed23','Patapalo B2','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('bed24','El PortÃ³n B','DEF',3,2,2,3,2,2,2,1,4,'bad'),J('bed25','Sin Marcaje B','DEF',3,2,2,3,2,2,2,1,3,'bad')],
MED:[J('bem1','S.Canales','MED',7,7,9,7,10,8,7,6,64,'star'),J('bem2','Nabil Fekir','MED',7,7,10,7,9,8,8,7,70,'star'),J('bem3','JoaquÃ­n','MED',7,6,9,6,9,7,7,6,54,'exc'),J('bem4','D.Ceballos','MED',6,6,9,6,10,8,7,6,60,'exc'),J('bem5','Guardado','MED',6,8,8,7,9,7,6,6,56,'exc'),J('bem6','Lo Celso','MED',6,7,9,7,9,8,7,6,62,'exc'),J('bem7','Ayoze','MED',7,6,8,7,8,7,8,7,54,'exc'),J('bem8','Ruibal','MED',7,6,7,6,7,5,6,5,40,'exc'),J('bem9','Isco B','MED',6,6,9,6,9,7,7,6,52,'exc'),J('bem10','Fornals','MED',7,6,8,6,8,6,7,6,50,'exc'),J('bem11','V.Ruiz','MED',5,8,7,7,7,5,5,4,38,'med'),J('bem12','Algobia','MED',5,5,7,6,8,6,6,5,32,'med'),J('bem13','Denilson','MED',7,4,9,6,7,5,7,6,48,'med'),J('bem14','Finidi MED','MED',7,4,8,5,7,5,6,5,34,'med'),J('bem15','Rodri Sanchez','MED',5,7,7,7,7,5,5,4,30,'med'),J('bem16','M.Filial A','MED',5,5,6,6,7,5,5,4,16,'med'),J('bem17','M.Filial B','MED',5,5,6,6,7,5,5,4,14,'med'),J('bem18','M.Afic.A','MED',4,4,5,5,6,4,4,4,11,'bad'),J('bem19','M.Afic.B','MED',4,4,4,5,6,4,4,3,9,'bad'),J('bem20','El Palomero','MED',4,3,4,4,5,3,3,3,8,'bad'),J('bem21','El Largo','MED',3,3,3,3,4,3,3,2,7,'bad'),J('bem22','Sin Pase B','MED',3,3,3,3,4,2,3,2,6,'bad'),J('bem23','Desmarcado B','MED',3,2,2,3,3,2,2,2,4,'bad'),J('bem24','Sin Primera B2','MED',3,2,2,3,3,2,2,2,4,'bad'),J('bem25','Pase Roto B','MED',3,2,2,3,3,2,2,2,3,'bad')],
DEL:[J('bedl1','Borja Iglesias','DEL',6,5,8,7,7,6,9,8,60,'star'),J('bedl2','Finidi George','DEL',7,4,9,6,7,5,8,7,54,'star'),J('bedl3','Assane Diao','DEL',8,4,8,5,7,5,8,7,46,'exc'),J('bedl4','Denilson D','DEL',7,4,9,6,7,5,7,6,50,'exc'),J('bedl5','Antonio','DEL',6,5,7,7,7,6,8,7,46,'exc'),J('bedl6','Willian JosÃ©','DEL',6,5,7,7,6,5,8,7,44,'exc'),J('bedl7','Ayoze DEL','DEL',7,5,8,6,7,6,8,7,50,'exc'),J('bedl8','Carvalho D','DEL',5,7,7,7,8,6,5,5,52,'exc'),J('bedl9','Abde','DEL',8,4,8,5,6,5,7,6,42,'exc'),J('bedl10','Juanmi','DEL',7,4,7,6,5,4,8,7,46,'exc'),J('bedl11','Loren MorÃ³n','DEL',6,5,7,7,6,5,8,7,40,'med'),J('bedl12','Chrisantus','DEL',7,4,7,5,6,4,7,6,36,'med'),J('bedl13','RubÃ©n Castro','DEL',6,5,7,6,6,5,8,7,38,'med'),J('bedl14','Capi','DEL',5,4,6,6,5,4,7,6,30,'med'),J('bedl15','Rafa Mir','DEL',6,5,7,7,5,4,7,6,38,'med'),J('bedl16','D.Filial A','DEL',5,4,6,5,6,5,7,6,16,'med'),J('bedl17','D.Filial B','DEL',5,4,6,5,6,5,7,6,14,'med'),J('bedl18','D.Afic.A','DEL',5,3,5,4,5,4,6,5,11,'bad'),J('bedl19','D.Afic.B','DEL',4,3,4,4,4,3,6,5,9,'bad'),J('bedl20','Bombero B','DEL',4,3,4,4,4,3,5,4,8,'bad'),J('bedl21','Sin Def B','DEL',4,2,3,3,3,2,4,3,7,'bad'),J('bedl22','El Palo B','DEL',3,2,3,3,3,2,4,3,6,'bad'),J('bedl23','OfsÃ¡ider B','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('bedl24','Sin PunterÃ­a B','DEL',3,2,2,3,2,2,3,2,4,'bad'),J('bedl25','CaÃ±as B','DEL',3,2,2,3,2,2,3,2,3,'bad')]
}
};

// â”€â”€ EVENTOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
var EVS_CLUB={
  madrid:[{t:'Â¡Juanito Maravilla!',d:'+2 MOV.',ic:'ðŸ”¥',pos:true,ef:{movMod:2,sc:'own'}},{t:'Â¡Hala Madrid!',d:'+3 al tiro.',ic:'ðŸ“£',pos:true,ef:{tiroMod:3,sc:'own'}},{t:'Kroos masterclass',d:'+2 PREC PASE.',ic:'ðŸŽ¯',pos:true,ef:{precPaseMod:2,sc:'own'}},{t:'Fiesta descontrolada',d:'-1 MOV y -1 RES.',ic:'ðŸŽ‰',pos:false,ef:{movMod:-1,resMod:-1,sc:'own'}},{t:'ReuniÃ³n Florentino',d:'-2 MOV.',ic:'ðŸ˜´',pos:false,ef:{movMod:-2,sc:'own'}},{t:'Drama vestuario',d:'-1 ENT y -1 REG.',ic:'ðŸ˜¤',pos:false,ef:{entMod:-1,regMod:-1,sc:'own'}},{t:'PresiÃ³n PeÃ±as',d:'Rival +1 MOV.',ic:'ðŸ—£ï¸',pos:false,ef:{movMod:1,sc:'rival'}}],
  barca:[{t:'Â¡Tiki-taka!',d:'+2 PREC PASE.',ic:'ðŸŽ¯',pos:true,ef:{precPaseMod:2,sc:'own'}},{t:'Guardiola palco',d:'+1 MOV y +1 REG.',ic:'ðŸ§ ',pos:true,ef:{movMod:1,regMod:1,sc:'own'}},{t:'Pedri inspira',d:'+2 REG.',ic:'âœ¨',pos:true,ef:{regMod:2,sc:'own'}},{t:'Crisis resultados',d:'-2 MOV.',ic:'ðŸ“°',pos:false,ef:{movMod:-2,sc:'own'}},{t:'VAR anula gol',d:'Si llevas ventaja, -1 gol.',ic:'ðŸ“º',pos:false,ef:{sp:'anular_gol'}},{t:'ERTO exprÃ©s',d:'-1 MOV.',ic:'ðŸ“‰',pos:false,ef:{movMod:-1,sc:'own'}},{t:'Fichaje Griezmann',d:'Rival +1 MOV.',ic:'ðŸ¤¦',pos:false,ef:{movMod:1,sc:'rival'}}],
  atletico:[{t:'Â¡Simeone cÃ³rner!',d:'+2 ENT.',ic:'ðŸ‘',pos:true,ef:{entMod:2,sc:'own'}},{t:'Atleti no se rinde',d:'Si pierdes, dels +3 MOV.',ic:'ðŸ’ª',pos:true,ef:{sp:'remontada'}},{t:'Bufanda Wanda',d:'+1 MOV y +1 ENT.',ic:'ðŸ§£',pos:true,ef:{movMod:1,entMod:1,sc:'own'}},{t:'LesiÃ³n Torres',d:'Tu delantero mÃ¡s caro sale.',ic:'ðŸš‘',pos:false,ef:{sp:'lesion_del'}},{t:'Griezmann se va',d:'-1 REG.',ic:'ðŸ’”',pos:false,ef:{regMod:-1,sc:'own'}},{t:'5h tÃ¡ctica Cholo',d:'-2 MOV.',ic:'ðŸ“‹',pos:false,ef:{movMod:-2,sc:'own'}}],
  sevilla:[{t:'Â¡Monchi lo hace!',d:'+1 REG y +1 ENT.',ic:'ðŸŽ©',pos:true,ef:{regMod:1,entMod:1,sc:'own'}},{t:'Europa League',d:'+2 REG.',ic:'ðŸ†',pos:true,ef:{regMod:2,sc:'own'}},{t:'PizjuÃ¡n ruge',d:'+1 MOV y +1 ENT.',ic:'ðŸ“£',pos:true,ef:{movMod:1,entMod:1,sc:'own'}},{t:'Venta exprÃ©s',d:'Tu jugador mÃ¡s caro sale.',ic:'âœˆï¸',pos:false,ef:{sp:'vender_estrella'}},{t:'Derbi agota',d:'-1 RES.',ic:'ðŸ˜“',pos:false,ef:{resMod:-1,sc:'own'}},{t:'Estadio obras',d:'-2 PREC PASE.',ic:'ðŸš§',pos:false,ef:{precPaseMod:-2,sc:'own'}}],
  valencia:[{t:'La Bomba Moreno',d:'+2 PREC TIRO.',ic:'ðŸ’£',pos:true,ef:{precTiroMod:2,sc:'own'}},{t:'MurciÃ©lagos vuelan',d:'+1 ENT y +1 REG.',ic:'ðŸ¦‡',pos:true,ef:{entMod:1,regMod:1,sc:'own'}},{t:'David Silva inspira',d:'+2 PREC PASE.',ic:'âœ¨',pos:true,ef:{precPaseMod:2,sc:'own'}},{t:'Crisis presidencial',d:'-1 MOV.',ic:'ðŸ¤¯',pos:false,ef:{movMod:-1,sc:'own'}},{t:'Meriton vende',d:'Rival +2 MOV.',ic:'ðŸ“‰',pos:false,ef:{movMod:2,sc:'rival'}},{t:'Mestalla silba',d:'-2 PREC TIRO.',ic:'ðŸ˜¤',pos:false,ef:{precTiroMod:-2,sc:'own'}}],
  betis:[{t:'Â¡Viva el Betis!',d:'+2 MOV.',ic:'ðŸ’š',pos:true,ef:{movMod:2,sc:'own'}},{t:'Chiste JoaquÃ­n',d:'+1 REG y +1 RES.',ic:'ðŸ˜‚',pos:true,ef:{regMod:1,resMod:1,sc:'own'}},{t:'Noche Triana',d:'+1 MOV, ENT y REG.',ic:'ðŸŒ¹',pos:true,ef:{movMod:1,entMod:1,regMod:1,sc:'own'}},{t:'Resaca Feria',d:'-2 MOV.',ic:'ðŸº',pos:false,ef:{movMod:-2,sc:'own'}},{t:'VillamarÃ­n obras',d:'Rival +1 MOV.',ic:'ðŸ—ï¸',pos:false,ef:{movMod:1,sc:'rival'}},{t:'Fekir desaparece',d:'-1 REG.',ic:'ðŸ‘»',pos:false,ef:{regMod:-1,sc:'own'}}]
};
var EVS_PARTIDO=[
  {t:'Â¡Lluvia!',d:'Todos -1 MOV.',ic:'ðŸŒ§ï¸',ef:{movMod:-1,sc:'all'}},{t:'CÃ¡nticos grada',d:'Activo +1 MOV.',ic:'ðŸ“£',ef:{movMod:1,sc:'own'}},{t:'Ãrbitro lesionado',d:'-1 ENT rival.',ic:'ðŸ¦µ',ef:{entMod:-1,sc:'rival'}},{t:'InvasiÃ³n campo',d:'MÃ¡x 2 casillas.',ic:'ðŸƒ',ef:{movMax:2,sc:'all'}},{t:'VAR revisa',d:'+1 PREC PASE activo.',ic:'ðŸ“º',ef:{precPaseMod:1,sc:'own'}},{t:'Calor sofocante',d:'-1 MOV y -1 RES.',ic:'â˜€ï¸',ef:{movMod:-1,resMod:-1,sc:'all'}},{t:'Niebla densa',d:'-2 PAS y TIR.',ic:'ðŸŒ«ï¸',ef:{precPaseMod:-2,precTiroMod:-2,sc:'all'}},{t:'MicrÃ³fono abierto',d:'-1 ENT rival.',ic:'ðŸŽ™ï¸',ef:{entMod:-1,sc:'rival'}},{t:'Granizo',d:'-1 PREC PASE.',ic:'ðŸŒ¨ï¸',ef:{precPaseMod:-1,sc:'all'}},{t:'Silencio sepulcral',d:'+1 REG todos.',ic:'ðŸ”‡',ef:{regMod:1,sc:'all'}},{t:'Bengala',d:'Levanta ficha tumbada.',ic:'ðŸ”´',ef:{sp:'levantar_tumbado'}},{t:'Noche Reyes',d:'+1 MOV todos.',ic:'ðŸŽ„',ef:{movMod:1,sc:'all'}},{t:'Fallo riego',d:'-1 MOV.',ic:'ðŸ’¦',ef:{movMod:-1,sc:'all'}},{t:'Racha buen juego',d:'+2 PREC PASE activo.',ic:'âš¡',ef:{precPaseMod:2,sc:'own'}},{t:'Drone estadio',d:'-1 MOV rival.',ic:'ðŸ›¸',ef:{movMod:-1,sc:'rival'}}
];

// â”€â”€ ESTADO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function newMods(){return{movMod:0,entMod:0,regMod:0,resMod:0,precPaseMod:0,precTiroMod:0,movMax:99,tiroMod:0};}
var S={
  eq:[null,null],plant:[[],[]],selJ:0,draftPool:[[],[]],
  T:[],bal:{c:0,r:0,key:null},
  turno:1,mitad:1,ja:0,trRest:8,goles:[0,0],
  fsel:null,movR:0,fase:'sel',movidas:{},
  mods:[newMods(),newMods()],evAct:[],evPend:null,
  sustDisp:[3,3],banquillo:[[],[]],sustEnCampo:[[],[]],
};
function M(i){return S.mods[i];}
function resetMods(){S.mods=[newMods(),newMods()];}
function shuf(a){var b=a.slice();for(var i=b.length-1;i>0;i--){var j=0|Math.random()*(i+1);var t=b[i];b[i]=b[j];b[j]=t;}return b;}
function d6(){return 1+(0|Math.random()*6);}
function r2(){var a=d6(),b=d6();return{t:a+b,d:[a,b]};}
function $(id){return document.getElementById(id);}
function show(id){var pp=document.querySelectorAll('.page');for(var i=0;i<pp.length;i++)pp[i].classList.remove('on');$(id).classList.add('on');}
function log(msg,cls){var d=document.createElement('div');d.style.cssText='margin-bottom:2px;padding-bottom:2px;border-bottom:1px solid #0d0d1a;';if(cls=='lgol')d.style.color='#27ae60';else if(cls=='lles')d.style.color='#e74c3c';else if(cls=='ldado')d.style.color='#e67e22';else if(cls=='lev')d.style.color='#9b59b6';else if(cls=='lzoc')d.style.color='#3498db';d.textContent=msg;var lb=$('logbox');lb.insertBefore(d,lb.firstChild);}

// â”€â”€ ZoC HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
function generarDraftPool(eqId){
  var pool=POOL[eqId],out={POR:[],DEF:[],MED:[],DEL:[]};
  ['POR','DEF','MED','DEL'].forEach(function(pos){out[pos]=shuf(pool[pos]||[]).slice(0,20);});
  return out;
}

// â”€â”€ GRIDS EQUIPO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildEqGrid(gid,bid,j){
  var g=$(gid);g.innerHTML='';
  EQS.forEach(function(eq){
    var d=document.createElement('div');d.className='eq-card';
    d.innerHTML='<div style="font-size:2rem;margin-bottom:4px">'+eq.e+'</div><div style="font-size:13px;font-weight:600">'+eq.n+'</div>';
    d.onclick=function(){var cc=g.querySelectorAll('.eq-card');for(var i=0;i<cc.length;i++)cc[i].classList.remove('sel');d.classList.add('sel');S['_eq'+j]=eq;$(bid).disabled=false;SFX.seleccionar();};
    g.appendChild(d);
  });
}

// â”€â”€ DRAFT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildDraft(){
  var eqId=S.eq[S.selJ].id;S.draftPool[S.selJ]=generarDraftPool(eqId);
  $('draft-h').textContent='Jugador '+(S.selJ+1)+' â€” Draft: '+S.eq[S.selJ].n;
  var w=$('draft-body');w.innerHTML='';
  var nom={POR:'Porteros',DEF:'Defensas',MED:'Centrocampistas',DEL:'Delanteros'};
  ['POR','DEF','MED','DEL'].forEach(function(pos){
    var jugs=S.draftPool[S.selJ][pos]||[];if(!jugs.length)return;
    var sec=document.createElement('div');sec.className='psec';
    sec.innerHTML='<div class="ptitle p'+pos+'">'+nom[pos]+'</div><div class="pgrid" id="pg'+pos+'"></div>';
    w.appendChild(sec);var grid=sec.querySelector('#pg'+pos);
    jugs.forEach(function(jug){grid.appendChild(makePcard(jug));});
  });
  updBudget();renderSquad();
}
function makePcard(jug){
  var d=document.createElement('div');d.className='pc';d.id='card-'+jug.id;
  var cc={star:'cstar',exc:'cexc',med:'cmed',bad:'cbad'};
  var st=jug.pos=='POR'?'PAR:'+jug.parada+' SAQ:'+jug.alcSaq+'/'+jug.precSaq:'MOV:'+jug.mov+' ENT:'+jug.ent+' REG:'+jug.reg+' RES:'+jug.res+'<br>PAS:'+jug.alp+'/'+jug.prp+' TIR:'+jug.alt+'/'+jug.prt;
  d.innerHTML='<span class="pip '+cc[jug.cat]+'"></span><div class="pcn">'+jug.n+'</div><div class="pcs">'+st+'</div><div class="pcv">'+jug.val+'Mâ‚¬</div>';
  d.onclick=function(){togglePick(jug);};return d;
}
function togglePick(jug){
  var j=S.selJ,sel=S.plant[j];
  var idx=-1;for(var i=0;i<sel.length;i++)if(sel[i].id==jug.id){idx=i;break;}
  var used=0;for(var i=0;i<sel.length;i++)used+=sel[i].val;
  var el=$('card-'+jug.id);
  if(idx>=0){sel.splice(idx,1);el.classList.remove('on');SFX.seleccionar();}
  else{if(sel.length>=15||used+jug.val>BUD)return;sel.push(jug);el.classList.add('on');SFX.seleccionar();}
  updBudget();blockCards();renderSquad();
}
function blockCards(){
  var j=S.selJ,sel=S.plant[j],used=0;for(var i=0;i<sel.length;i++)used+=sel[i].val;
  var pool=S.draftPool[j];
  ['POR','DEF','MED','DEL'].forEach(function(pos){
    (pool[pos]||[]).forEach(function(jug){
      var el=$('card-'+jug.id);if(!el)return;
      var inSel=false;for(var i=0;i<sel.length;i++)if(sel[i].id==jug.id){inSel=true;break;}
      el.classList.toggle('off',!inSel&&(sel.length>=15||used+jug.val>BUD));
    });
  });
}
function renderSquad(){
  var sl=$('sqlist');sl.innerHTML='';
  S.plant[S.selJ].forEach(function(jug,i){
    var d=document.createElement('div');d.className='sqi';
    var lbl=i<11?'<span style="color:#27ae60;font-size:9px">TIT</span>':'<span style="color:#aaa;font-size:9px">BNQ</span>';
    d.innerHTML='<span>'+jug.n+' '+lbl+'</span><span style="color:#aaa;font-size:9px">'+jug.val+'Mâ‚¬</span><span class="sqx">âœ•</span>';
    d.querySelector('.sqx').onclick=function(){removePick(jug.id);};sl.appendChild(d);
  });
}
function removePick(id){
  var j=S.selJ,sel=S.plant[j];
  for(var i=0;i<sel.length;i++)if(sel[i].id==id){sel.splice(i,1);break;}
  var el=$('card-'+id);if(el)el.classList.remove('on');
  updBudget();blockCards();renderSquad();
}
function updBudget(){
  var j=S.selJ,sel=S.plant[j],used=0;for(var i=0;i<sel.length;i++)used+=sel[i].val;
  var pct=Math.round(used/BUD*100);
  $('b-gasto').textContent=used;$('bfill').style.width=Math.min(pct,100)+'%';
  $('bfill').style.background=pct>90?'#e74c3c':'#27ae60';
  $('b-cnt').textContent=sel.length+'/15 (11 TIT)';
  var hasPOR=false;for(var i=0;i<sel.length;i++)if(sel[i].pos=='POR'){hasPOR=true;break;}
  $('btn-draft').disabled=!(sel.length>=11&&sel.length<=15&&hasPOR&&used<=BUD);
}
function confirmarDraft(){if(S.selJ===0){buildEqGrid('grid-eq2','btn-eq2',2);$('btn-eq2').disabled=true;show('page-eq2');}else startMatch();}

// â”€â”€ POSICIONES INICIALES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function placeTeam(plant,eq){
  var pors=[],defs=[],meds=[],dels=[];
  var tit=plant.slice(0,11);
  S.banquillo[eq]=plant.slice(11).map(function(j){return Object.assign({},j);});
  tit.forEach(function(j){if(j.pos=='POR')pors.push(j);else if(j.pos=='DEF')defs.push(j);else if(j.pos=='MED')meds.push(j);else dels.push(j);});
  var out=[];
  function place(list,cols,rows){list.forEach(function(jug,i){var rawC=cols[i%cols.length];var col=eq===0?rawC:(NC-1-rawC);var row=rows[i%rows.length];out.push(Object.assign({},jug,{eq:eq,col:col,row:row,tumbado:false,lpen:jug.lesionPen||0,_key:jug.id+'_'+eq}));});}
  place(pors.slice(0,1),[1],[7]);if(pors.length>1)place(pors.slice(1,2),[2],[7]);
  place(defs.slice(0,10),[3,3,4,4,4,5,5,5,5,5],[1,13,3,6,9,12,2,5,8,11]);
  place(meds.slice(0,10),[7,7,8,8,8,9,9,9,9,9],[2,12,3,6,7,9,4,7,10,11]);
  place(dels.slice(0,10),[11,11,10,10,10,11,11,11,11,11],[4,10,3,7,11,5,9,6,8,7]);
  return out;
}
function colocarSaqueCentro(eq){
  var cc=NC/2|0,rc=NR/2|0,fichas=[];
  for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var f=S.T[c][r];if(f&&f.eq==eq)fichas.push({f:f,c:c,r:r});}
  var conBal=null,otro=null;
  for(var i=0;i<fichas.length;i++){var f=fichas[i].f;if(f.pos!='POR'){if(!conBal)conBal=fichas[i];else if(!otro){otro=fichas[i];break;}}}
  if(!conBal)conBal=fichas[0];if(!otro){for(var i=0;i<fichas.length;i++)if(fichas[i].f._key!=conBal.f._key){otro=fichas[i];break;}}
  var c1=eq===0?cc-1:cc+1,c2=eq===0?cc-2:cc+2;
  if(conBal){S.T[conBal.c][conBal.r]=null;conBal.f.col=c1;conBal.f.row=rc;S.T[c1][rc]=conBal.f;S.bal.key=conBal.f._key;S.bal.c=c1;S.bal.r=rc;}
  if(otro&&S.T[c2]&&!S.T[c2][rc]){S.T[otro.c][otro.r]=null;otro.f.col=c2;otro.f.row=rc;S.T[c2][rc]=otro.f;}
  for(var dc=-2;dc<=2;dc++)for(var dr=-2;dr<=2;dr++){var nc=cc+dc,nr=rc+dr;if(nc>=0&&nc<NC&&nr>=0&&nr<NR){var f=S.T[nc][nr];if(f&&f.eq!=eq)S.T[nc][nr]=null;}}
}

// â”€â”€ PARTIDO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function startMatch(){
  S.goles=[0,0];S.turno=1;S.mitad=1;S.ja=0;S.trRest=8;
  S.movidas={};S.fsel=null;S.movR=0;S.fase='sel';S.evAct=[];resetMods();
  S.sustDisp=[3,3];S.banquillo=[[],[]];S.sustEnCampo=[[],[]];
  $('scn0').textContent=S.eq[0].n;$('scn1').textContent=S.eq[1].n;
  $('sh0').textContent=S.eq[0].e;$('sh1').textContent=S.eq[1].e;
  $('bq-title0').textContent='Banquillo '+S.eq[0].n;$('bq-title1').textContent='Banquillo '+S.eq[1].n;
  resetTablero();updScore();renderBanquillo();show('page-partido');
  SFX.pitidoLargo();
  setTimeout(function(){colocarSaqueCentro(0);renderSVG();log('Â¡Comienza el partido!');launchEvent();},100);
}
function resetTablero(){
  S.T=[];for(var c=0;c<NC;c++){S.T.push([]);for(var r=0;r<NR;r++)S.T[c].push(null);}
  var all=placeTeam(S.plant[0],0).concat(placeTeam(S.plant[1],1));
  all.forEach(function(f){if(f.col>=0&&f.col<NC&&f.row>=0&&f.row<NR&&!S.T[f.col][f.row])S.T[f.col][f.row]=f;});
  S.bal={c:11,r:7,key:null};
}

// â”€â”€ SVG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
function movTotal(f){var m=M(f.eq);return Math.min(Math.max(1,(f.mov-(f.lpen||0))+(m.movMod||0)),m.movMax||99);}
function tieneBalon(f){return S.bal.key==f._key;}
function puedePasar(f){
  if(!tieneBalon(f))return false;
  var alp=f.pos=='POR'?f.alcSaq:f.alp;if(!alp)return false;
  for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var t=S.T[c][r];if(!t||t.eq!=f.eq||t._key==f._key)continue;var d=Math.sqrt((c-f.col)*(c-f.col)+(r-f.row)*(r-f.row));if(d<=alp)return true;}
  return false;
}
function puedeTirar(f){if(!tieneBalon(f))return false;var portC=f.eq===0?NC-1:0;return Math.abs(portC-f.col)<=f.alt;}

function onFicha(c,r){
  var f=S.T[c][r];if(!f)return;
  if(S.fase=='sel'){
    if(f.eq==S.ja&&!S.movidas[f._key]){
      if(f.tumbado){S.T[c][r].tumbado=false;S.movidas[f._key]=true;log(f.n+' se levanta.');SFX.mover();renderSVG();desel();return;}
      SFX.seleccionar();selFicha(f,c,r);
    }
  } else if(S.fase=='mover'){
    var fs=S.fsel;
    if(f.eq!=S.ja&&S.bal.key==f._key){var dist=Math.max(Math.abs(c-fs.col),Math.abs(r-fs.row));if(dist==1)entrada(fs,f,c,r);else log('Debes estar adyacente para entrar al balÃ³n.','lzoc');}
  } else if(S.fase=='pasar'){
    var fs=S.fsel;if(f.eq==fs.eq&&f._key!=fs._key){var alp=fs.pos=='POR'?fs.alcSaq:fs.alp;var d=Math.sqrt((c-fs.col)*(c-fs.col)+(r-fs.row)*(r-fs.row));if(d<=alp)pase(fs,c,r);}
  } else if(S.fase=='tirar'){tiro(S.fsel,c,r);}
}
function onVacia(c,r){
  if(S.fase=='mover'){
    var fs=S.fsel;if(!fs)return;
    var d=Math.max(Math.abs(c-fs.col),Math.abs(r-fs.row));
    if(d>0&&d<=S.movR){
      var enZocOrig=hayRivalAdyEn(fs.col,fs.row,fs.eq),enZocDest=hayRivalAdyEn(c,r,fs.eq);
      if(enZocOrig||enZocDest){if(!tiradaRegate(fs))return;}
      SFX.mover();moverF(fs,c,r);
    }
  } else if(S.fase=='tirar'){tiro(S.fsel,c,r);}
}
function selFicha(f,c,r){S.fsel=Object.assign({},f,{col:c,row:r});S.movR=movTotal(f);S.fase='mover';showPanel(f);showMovBar();showAcc();updateZocInfo(f);renderSVG();}
function moverF(fs,nc,nr){
  var d=Math.max(Math.abs(nc-fs.col),Math.abs(nr-fs.row));
  S.T[fs.col][fs.row]=null;var tb=tieneBalon(fs);
  fs.col=nc;fs.row=nr;S.T[nc][nr]=Object.assign({},fs);
  if(tb){S.bal.c=nc;S.bal.r=nr;}
  if(!S.bal.key&&S.bal.c==nc&&S.bal.r==nr){S.bal.key=fs._key;log(fs.n+' recoge el balÃ³n.');}
  S.movR-=d;S.fsel=Object.assign({},fs);chkGol(fs,nc);showPanel(S.fsel);showMovBar();showAcc();updateZocInfo(S.fsel);renderSVG();
}
function chkGol(f,nc){if(f.eq===0&&tieneBalon(f)&&nc>=NC-2&&f.row>=6&&f.row<=8)golear(0);else if(f.eq===1&&tieneBalon(f)&&nc<=1&&f.row>=6&&f.row<=8)golear(1);}
function golear(eq){
  S.goles[eq]++;if(S.ja==eq)SFX.gol();else SFX.gol_rival();
  log('âš½ Â¡GOL de '+S.eq[eq].n+'!','lgol');updScore();SFX.pitidoLargo();
  setTimeout(function(){alert('âš½ GOL!\n'+S.eq[0].n+' '+S.goles[0]+' â€“ '+S.goles[1]+' '+S.eq[1].n);S.movidas={};S.fsel=null;S.movR=0;S.fase='sel';resetTablero();var jg=eq;colocarSaqueCentro(jg===0?1:0);renderSVG();desel();},40);
}

function entrada(atac,def,c,r){
  SFX.entrada();
  var mA=M(atac.eq),mD=M(def.eq);
  var bon=bonusEntrada(atac,def),rA=r2(),rD=r2();
  var va=rA.t+atac.ent+(mA.entMod||0)+bon,vd=rD.t+def.reg+(mD.regMod||0);
  var logBon=bon>0?' (+'+bon+' apoyo)':'';
  log('Entrada'+logBon+': '+atac.n+'['+rA.d+']+ENT'+atac.ent+'='+va+' vs '+def.n+'['+rD.d+']+REG'+def.reg+'='+vd,'ldado');
  if(va>vd){
    S.bal.key=atac._key;S.bal.c=atac.col;S.bal.r=atac.row;
    log(atac.n+' roba el balÃ³n.');lesion(def,c,r);
    S.movR=0;S.fsel=Object.assign({},atac);showPanel(atac);showMovBar();showAcc();updateZocInfo(atac);
  } else {
    log(def.n+' conserva el balÃ³n.');SFX.lesion();lesion(atac,atac.col,atac.row);
    S.movidas[atac._key]=true;desel();
  }
  renderSVG();
}

function lesion(f,c,r){
  var m=M(f.eq),res=f.res+(m.resMod||0),r1=r2();
  if(r1.t+res<=8){
    var sv=r2().t;log('LesiÃ³n '+f.n+':['+r1.d+']+RES'+res+'â†’sev:'+sv,'ldado');
    var cel=S.T[c]?S.T[c][r]:null;
    if(sv<=5){if(cel)cel.tumbado=true;log(f.n+' cae al suelo.','lles');SFX.lesion();}
    else if(sv<=9){if(cel){cel.tumbado=true;cel.lpen=(cel.lpen||0)+1;}log(f.n+' lesionado (âˆ’1MOV).','lles');SFX.lesion();}
    else{if(S.T[c])S.T[c][r]=null;if(S.bal.key==f._key)S.bal.key=null;log(f.n+' sale del campo.','lles');SFX.lesion();}
  }
}

function pase(fs,nc,nr){
  SFX.pase();
  var prp=fs.pos=='POR'?fs.precSaq:fs.prp;
  var m=M(fs.eq),rv=r2();
  // PenalizaciÃ³n ZoC por marcaje: -1 por cada rival marcador
  var penMarcaje=penMarcajePaseTiro(fs);
  var v=rv.t+prp+(m.precPaseMod||0)-penMarcaje;
  var penStr=penMarcaje>0?' -'+penMarcaje+'(marc)':'';
  log('Pase '+fs.n+':['+rv.d+']+PREC'+prp+penStr+'='+v+' (â‰¥9)','ldado');
  if(penMarcaje>0)SFX.zoc_pen();
  if(v>=9){var t=S.T[nc][nr];if(t&&t.eq==fs.eq){S.bal.key=t._key;S.bal.c=nc;S.bal.r=nr;log('Pase a '+t.n+'.');}else{S.bal.key=null;S.bal.c=nc;S.bal.r=nr;log('BalÃ³n libre.');}}
  else{S.bal.key=null;S.bal.c=Math.max(0,Math.min(NC-1,fs.col+(Math.random()>.5?1:-1)));S.bal.r=Math.max(0,Math.min(NR-1,fs.row+(Math.random()>.5?1:-1)));log('Pase impreciso.');}
  S.movidas[fs._key]=true;desel();renderSVG();
}

function tiro(fs,c,r){
  SFX.patada();
  var eqR=fs.eq===0?1:0;var por=buscarPor(eqR);
  var mA=M(fs.eq),mD=M(eqR);
  var rA=r2();
  // PenalizaciÃ³n ZoC por marcaje: -1 por cada rival marcador
  var penMarcaje=penMarcajePaseTiro(fs);
  var v=rA.t+fs.prt+(mA.precTiroMod||0)+(mA.tiroMod||0)-penMarcaje;
  var vp,rP;if(por){rP=r2();vp=rP.t+por.parada+(mD.regMod||0);}else{rP={d:['?','?'],t:4};vp=8;}
  var penStr=penMarcaje>0?' -'+penMarcaje+'(marc)':'';
  log('Tiro '+fs.n+':['+rA.d+']+PREC'+fs.prt+penStr+'='+v+' vs ['+rP.d+']+PAR'+(por?por.parada:4)+'='+vp,'ldado');
  if(penMarcaje>0)SFX.zoc_pen();
  if(v>vp)golear(fs.eq);
  else{SFX.parada();if(por){S.bal.key=por._key;S.bal.c=por.col;S.bal.r=por.row;log('El portero detiene.');}S.movidas[fs._key]=true;desel();renderSVG();setTimeout(function(){pasarTurno();},400);}
}

function buscarPor(eq){for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var f=S.T[c][r];if(f&&f.eq==eq&&f.pos=='POR')return f;}return null;}

// â”€â”€ PANEL / INFO ZoC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function updateZocInfo(f){
  var box=$('zoc-info');
  if(!f){box.style.display='none';return;}
  var nm=nMarcadores(f);
  var bonEnt=bonusEntrada(f,f); // no aplicable directamente, solo informativo
  var penPT=penMarcajePaseTiro(f);
  var bonReg=bonusRegate(f);
  var parts=[];
  if(nm>0)parts.push('<b style="color:#e74c3c">Marcado Ã—'+nm+'</b> â†’ Pase/Tiro <b>âˆ’'+penPT+'</b>');
  if(bonReg>0)parts.push('Apoyo regate: <b style="color:#27ae60">+'+bonReg+'</b>');
  if(nm==0&&bonReg==0){box.style.display='none';return;}
  box.style.display='block';
  box.innerHTML='<span style="color:#3498db">â¬¡ ZoC</span> Â· '+parts.join(' &nbsp; ');
}

function showPanel(f){
  var m=M(f.eq);var nm=nMarcadores(f);
  var st=f.pos=='POR'?'PAR:<b>'+f.parada+'</b> SAQ:<b>'+f.alcSaq+'/'+f.precSaq+'</b>':'MOV:<b>'+movTotal(f)+'</b> ENT:<b>'+(f.ent+(m.entMod||0))+'</b> REG:<b>'+(f.reg+(m.regMod||0))+'</b> RES:<b>'+(f.res+(m.resMod||0))+'</b><br>PAS:<b>'+f.alp+'/'+(f.prp+(m.precPaseMod||0))+'</b> TIR:<b>'+f.alt+'/'+(f.prt+(m.precTiroMod||0))+'</b>';
  var ago=!!S.movidas[f._key];
  var marcTag=nm>0?'<span style="color:#e74c3c;font-size:9px">MarcadoÃ—'+nm+'</span>':'';
  $('pinfo').innerHTML='<div style="display:flex;align-items:center;gap:5px;margin-bottom:5px"><b style="font-size:12px">'+f.n+'</b><span class="ptitle p'+f.pos+'" style="padding:2px 6px;font-size:9px">'+f.pos+'</span>'+(f.tumbado?'<span style="color:#e74c3c;font-size:9px">Tumbado</span>':'')+(ago?'<span style="color:#555;font-size:9px">Agotado</span>':'')+marcTag+'</div><div style="line-height:1.8;color:#aaa">'+st+'<br><b style="color:#f1c40f">'+f.val+'Mâ‚¬</b></div>';
}
function showMovBar(){var mb=$('movbar'),fs=S.fsel;if(!fs){mb.style.display='none';return;}mb.style.display='block';$('mov-n').textContent=S.movR;var tot=movTotal(fs),pips=$('mpips');pips.innerHTML='';for(var i=0;i<tot;i++){var p2=document.createElement('div');p2.className='mpip'+(i>=S.movR?' u':'');pips.appendChild(p2);}}
function showAcc(){
  var acc=$('acciones');acc.innerHTML='';var fs=S.fsel;if(!fs)return;
  if(!S.movidas[fs._key]){
    if(S.movR>0&&S.fase=='mover')mkBtn(acc,'Mover mÃ¡s','bb',function(){S.fase='mover';renderSVG();});
    if(puedePasar(fs))mkBtn(acc,'Pasar','bb',function(){S.fase='pasar';renderSVG();});
    if(puedeTirar(fs))mkBtn(acc,'Tirar','br',function(){S.fase='tirar';renderSVG();});
    mkBtn(acc,'Terminar','bgr',function(){S.movidas[S.fsel._key]=true;desel();});
  }
  mkBtn(acc,'Cancelar','bgr',desel);
}
function mkBtn(p,t,c,fn){var b=document.createElement('button');b.className='btn sm '+c;b.textContent=t;b.onclick=fn;p.appendChild(b);}
function desel(){S.fsel=null;S.movR=0;S.fase='sel';$('pinfo').innerHTML='<span style="color:#444">Selecciona un jugador.</span>';$('acciones').innerHTML='';$('movbar').style.display='none';$('zoc-info').style.display='none';renderSVG();}

// â”€â”€ BANQUILLO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderBanquillo(){
  for(var eq=0;eq<2;eq++){
    var panel=$('banquillo'+eq);panel.innerHTML='';var bq=S.banquillo[eq]||[];
    bq.forEach(function(jug){
      var usado=false;for(var i=0;i<S.sustEnCampo[eq].length;i++)if(S.sustEnCampo[eq][i]==jug.id)usado=true;
      var d=document.createElement('div');d.className='bq-item '+(usado?'usado':'disponible');
      d.textContent=jug.n+' ('+jug.pos+') '+jug.val+'Mâ‚¬';
      if(!usado){(function(jj,eq2){d.onclick=function(){abrirSust(jj,eq2);};})(jug,eq);}
      panel.appendChild(d);
    });
    if(!bq.length){var d=document.createElement('div');d.style.cssText='font-size:9px;color:#555;padding:3px';d.textContent='Sin suplentes';panel.appendChild(d);}
  }
  $('sust-cnt0').textContent=S.sustDisp[0];$('sust-cnt1').textContent=S.sustDisp[1];
}
function abrirSust(jugBq,eq){
  if(S.ja!=eq){log('No es tu turno.','lev');return;}
  if(S.sustDisp[eq]<=0){log('No quedan sustituciones.','lev');return;}
  var lista=$('sust-lista');lista.innerHTML='';
  for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){
    var f=S.T[c][r];if(!f||f.eq!=eq)continue;
    (function(ff,cc,rr,bq){var d=document.createElement('div');d.className='sust-item';d.textContent='Sacar: '+ff.n+' â†’ Entra: '+bq.n;d.onclick=function(){realizarSust(ff,cc,rr,bq,eq);}; lista.appendChild(d);})(f,c,r,jugBq);
  }
  $('sust-modal').classList.add('on');
}
function realizarSust(fSale,c,r,fEntra,eq){
  $('sust-modal').classList.remove('on');SFX.sustitucion();SFX.pitido();
  S.T[c][r]=null;if(S.bal.key==fSale._key)S.bal.key=null;
  var nuevo=Object.assign({},fEntra,{eq:eq,col:c,row:r,tumbado:false,lpen:fEntra.lesionPen||0,_key:fEntra.id+'_'+eq});
  S.T[c][r]=nuevo;S.sustDisp[eq]--;S.sustEnCampo[eq].push(fEntra.id);S.movidas[nuevo._key]=true;
  log('â‡„ '+fSale.n+' â†’ '+fEntra.n,'lev');renderBanquillo();renderSVG();
}

// â”€â”€ MARCADOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function updScore(){$('scg0').textContent=S.goles[0];$('scg1').textContent=S.goles[1];$('sc-info').textContent='T'+S.turno+'/8Â·'+S.mitad+'Âª';$('sc-quien').textContent=S.eq[S.ja].n;$('sh0').classList.toggle('on',S.ja===0);$('sh1').classList.toggle('on',S.ja===1);}

// â”€â”€ EVENTOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderEvActive(){var box=$('ev-active');if(!S.evAct.length){box.style.display='none';return;}box.style.display='block';box.innerHTML=S.evAct.map(function(ev){return'<div class="evrow"><span style="font-size:13px">'+ev.ic+'</span><div><div class="evtit">'+ev.t+'</div><div class="evdsc">'+ev.d+'</div></div></div>';}).join('');}
function launchEvent(){
  var eq=S.eq[S.ja],ev,tipo;
  if(Math.random()<.35){ev=EVS_PARTIDO[0|Math.random()*EVS_PARTIDO.length];tipo='partido';}
  else{var pool=EVS_CLUB[eq.id]||[];if(!pool.length){renderSVG();return;}var ps=[],ng=[];pool.forEach(function(e){(e.pos?ps:ng).push(e);});var sub=Math.random()<(.5-eq.b)?ng:ps;if(!sub.length){renderSVG();return;}ev=sub[0|Math.random()*sub.length];tipo='club';}
  $('ev-ico').textContent=ev.ic||'ðŸ“£';$('ev-tipo').textContent=tipo=='club'?'â˜† Evento de Club':'âš¡ Evento del Partido';$('ev-tit').textContent=ev.t;$('ev-dsc').textContent=ev.d;S.evPend=ev;
  if(ev.pos===false)SFX.evento_neg();else SFX.evento_pos();
  $('ev-modal').classList.add('on');
}
function closeEvent(){$('ev-modal').classList.remove('on');var ev=S.evPend;if(!ev)return;S.evAct=[ev];applyEvent(ev);S.evPend=null;renderEvActive();renderSVG();}
function applyEvent(ev){
  var ef=ev.ef;if(!ef)return;var ja=S.ja,mO=S.mods[ja],mR=S.mods[ja===0?1:0];
  function ap(m,src){['movMod','entMod','regMod','resMod','precPaseMod','precTiroMod','tiroMod'].forEach(function(k){if(src[k])m[k]=(m[k]||0)+src[k];});if(src.movMax)m.movMax=Math.min(m.movMax||99,src.movMax);}
  if(ef.sc=='own')ap(mO,ef);else if(ef.sc=='rival')ap(mR,ef);else if(ef.sc=='all'){ap(mO,ef);ap(mR,ef);}
  if(ef.sp=='anular_gol'&&S.goles[ja]>0){S.goles[ja]--;updScore();log('Â¡VAR anulÃ³ gol!','lev');}
  if(ef.sp=='levantar_tumbado'){outer:for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var f=S.T[c][r];if(f&&f.eq==ja&&f.tumbado){f.tumbado=false;log(f.n+' se levanta.','lev');break outer;}}}
  if(ef.sp=='remontada'&&S.goles[ja]<S.goles[ja===0?1:0]){for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var f=S.T[c][r];if(f&&f.eq==ja&&f.pos=='DEL')f.mov=Math.min(12,(f.mov||3)+3);}log('Â¡Delanteros +3 MOV!','lev');}
  if(ef.sp=='lesion_del'){for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var f=S.T[c][r];if(f&&f.eq==ja&&f.pos=='DEL'){S.T[c][r]=null;if(S.bal.key==f._key)S.bal.key=null;log(f.n+' sale lesionado.','lev');return;}}}
  if(ef.sp=='vender_estrella'){var bst=null,bc=-1,br=-1,bv=0;for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var f=S.T[c][r];if(f&&f.eq==ja&&f.val>bv){bst=f;bc=c;br=r;bv=f.val;}}if(bst){S.T[bc][br]=null;if(S.bal.key==bst._key)S.bal.key=null;log(bst.n+' vendido.','lev');}}
  log('[Evento] '+ev.t,'lev');
}

// â”€â”€ TURNO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function pasarTurno(){
  S.movidas={};S.fsel=null;S.movR=0;S.fase='sel';S.evAct=[];renderEvActive();
  if(S.ja===0)S.ja=1;
  else{S.ja=0;S.turno++;S.trRest--;
    if(S.trRest<=0){
      if(S.mitad===1){S.mitad=2;S.trRest=8;SFX.pitidoLargo();log('Â¡Descanso! 2Âª parte.','lev');flipSides();setTimeout(function(){colocarSaqueCentro(S.ja);renderSVG();},100);}
      else{finPartido();return;}
    }
  }
  SFX.turno();updScore();renderBanquillo();log('Turno de '+S.eq[S.ja].n+'.');resetMods();setTimeout(launchEvent,80);
}
function flipSides(){
  var n=[];for(var c=0;c<NC;c++){n.push([]);for(var r=0;r<NR;r++)n[c].push(null);}
  for(var c=0;c<NC;c++)for(var r=0;r<NR;r++){var f=S.T[c][r];if(f){f.col=NC-1-c;f.row=NR-1-r;n[f.col][f.row]=f;}}
  S.T=n;if(!S.bal.key){S.bal.c=NC-1-S.bal.c;S.bal.r=NR-1-S.bal.r;}renderSVG();
}

// â”€â”€ RESULTADO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function finPartido(){
  SFX.pitidoLargo();setTimeout(function(){SFX.pitidoLargo();},300);setTimeout(function(){SFX.pitidoLargo();},600);
  var g0=S.goles[0],g1=S.goles[1];
  $('res-score').textContent=g0+' â€“ '+g1;
  $('res-tit').textContent=g0>g1?'Â¡Gana '+S.eq[0].n+'!':g1>g0?'Â¡Gana '+S.eq[1].n+'!':'Â¡Empate!';
  $('res-ico').textContent=g0==g1?'ðŸ¤':'ðŸ†';
  $('res-desc').textContent=S.eq[0].n+' '+g0+' â€“ '+g1+' '+S.eq[1].n;show('page-res');
}

// â”€â”€ WIRING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
buildEqGrid('grid-eq1','btn-eq1',1);buildEqGrid('grid-eq2','btn-eq2',2);
$('btn-inicio').onclick=function(){S.plant=[[],[]];S.eq=[null,null];S.draftPool=[[],[]];buildEqGrid('grid-eq1','btn-eq1',1);$('btn-eq1').disabled=true;show('page-eq1');SFX.pitido();};
$('btn-eq1').onclick=function(){S.eq[0]=S._eq1;S.selJ=0;S.plant[0]=[];buildDraft();show('page-draft');};
$('btn-eq2').onclick=function(){S.eq[1]=S._eq2;S.selJ=1;S.plant[1]=[];buildDraft();show('page-draft');};
$('btn-draft').onclick=confirmarDraft;
$('btn-turno').onclick=pasarTurno;
$('btn-ev-ok').onclick=closeEvent;
$('btn-sust-cancel').onclick=function(){$('sust-modal').classList.remove('on');};
$('btn-otra').onclick=function(){S.plant=[[],[]];S.eq=[null,null];S.draftPool=[[],[]];buildEqGrid('grid-eq1','btn-eq1',1);$('btn-eq1').disabled=true;show('page-eq1');};
$('sound-toggle').onclick=function(){soundOn=!soundOn;this.textContent='ðŸ”Š '+(soundOn?'ON':'OFF');if(soundOn){var ctx=getAC();if(ctx&&ctx.state=='suspended')ctx.resume();}};
