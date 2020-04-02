/**
* @author Douglas Carlini Soares
* @description Jogo desenvolvido para prática e aprendizado do HTML5 (não finalizado).
* Ao fazer alguma alteração, peço por gentileza que entre em contato, e mande o novo arquivo, para atualização.
*/

// opcoes de desempenho

var MAX_ESTRELAS = 100, MAX_FRAGMENTOS = 80, INI_INTERVALO = 2000;

// funcoes

function setCookie(nome, valor, dias) {
  var expData = new Date();
  expData.setDate(expData.getDate() + dias);
  var valor = escape(valor) + ((dias==null) ? "" : "; expires=" + expData.toUTCString());
  document.cookie=nome + "=" + valor;
  //alert(getCookie('nivel'));
}

function getCookie(nome){
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++){
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g,"");
    if (x == nome){
      return unescape(y);
    }
  }
}

function getIndex(array, obj) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == obj) { return i; }
  }
  return false;
}

function getNaveIndex(id) {
  for (var i = 0; i < naves.length; i++) {
    if (naves[i].id == id) { return i; }
  }
  return false;
}

function distancia(obj1, obj2) {
  var dx = obj1.x - obj2.x;
  var dy = obj1.y - obj2.y;
  var dist = Math.sqrt((dx*dx) + (dy*dy));
  return dist;
}

function angulo(obj1, obj2) {
  var dx = obj1.x - obj2.x;
  var dy = obj1.y - obj2.y;
  return Math.atan2(dy, dx) * 180 / Math.PI;
}

function motion(n) {
  clearInterval(LOOP);
  FPS = n ? (n == 1 ? FPS = _FPS / 2 : FPS = _FPS / 1000) : (FPS == _FPS / 1000 ? FPS = _FPS / 2 : FPS = _FPS / 1000);
  LOOP = setInterval(motor, FPS);
}

// informacoes

function infos() {
  TELA.save();
  TELA.fillText("Fase:", 10, 20);
  TELA.fillText(NIVEL, 100, 20);
  if (naves.length) {
    for (var i = 0; i < naves.length; i++) {
      TELA.fillText("Nave " + naves[i].id + ":", 10, 40 + (20 * i));
      TELA.fillText("nivel: " + naves[i].nivel + " / pontos: " + Math.round(naves[i].pontos) + " / exp: " + Math.round(naves[i].nivel_up) + "%", 100, 40 + (20 * i));
      if (naves[i].nivel_up > 30) {
        naves[i].nivel++;
        naves[i].nivel_up = 0;
		setCookie('nivel', naves[i].nivel, 365);
      }
    }
  }
  TELA.restore();
}

// jogo

var LOOP_INI;
var TELA, LOOP, JOGADORES = 1, NIVEL = 1, PONTOS = 0, PAUSE = false, _FPS = 60, FPS = _FPS, W = 1000, H = 450, P1_BT_E = false, P1_BT_D = false, P1_BT_C = false, P1_BT_B = false, P1_BT_1 = false;
var P2_BT_E = false, P2_BT_D = false, P2_BT_C = false, P2_BT_B = false, P2_BT_1 = false;

var BARRA_NIVEL_UP = 0;

function ignicao() {
  TELA = document.getElementById("tela");
  TELA = TELA.getContext("2d");
  TELA.font = "16px Arial";
  document.addEventListener("keydown", botao_1, false);
  document.addEventListener("keyup", botao_0, false);
  FPS = FPS == _FPS/1000 ? _FPS / 2 : _FPS/1000;
  LOOP = setInterval(motor, FPS/1000);
  LOOP_INI = setInterval(cria_inimigos, INI_INTERVALO);
}

function motor() {
  if (PAUSE) {
    TELA.fillStyle = "#00FF00";
    TELA.fillText("PAUSA", 10, 20);
    clearInterval(LOOP_INI);
  } else {
    TELA.fillStyle = "#00FF00";
    TELA.clearRect(0, 0, W, H);
    infos();
    anima();
  }
}

var animacoes = [];

function anima() {
  if (animacoes.length) {
    for (var a = 0; a < animacoes.length; a++) {
      if (animacoes[a].length) {
        var objs = animacoes[a];
        for (var i = 0; i < objs.length; i++) {
         objs[i].anima();
        }
      }
    }
  }
}

function botao_1(e) {
    
  //alert(e.keyCode);
  if (e.keyCode == 78 && naves.length < 2) { naves.push(new Nave(100, H/2)); }

  // jogador 1
  if (e.keyCode == 65) { P1_BT_E = true; }
  if (e.keyCode == 68) { P1_BT_D = true; }
  if (e.keyCode == 87) { P1_BT_C = true; }
  if (e.keyCode == 83) { P1_BT_B = true; }
  if (e.keyCode == 84) { P1_BT_1 = true; }

  // jogador 2
  if (e.keyCode == 37) { P2_BT_E = true; }
  if (e.keyCode == 39) { P2_BT_D = true; }
  if (e.keyCode == 38) { P2_BT_C = true; }
  if (e.keyCode == 40) { P2_BT_B = true; }  
  if (e.keyCode == 35) { P2_BT_1 = true; }

  if (e.keyCode == 80) { if (PAUSE) { PAUSE = false; LOOP_INI = setInterval(function(){inimigos.push(new Inimigo01(W, Math.random() * H))}, INI_INTERVALO); } else { PAUSE = true; } }
  if (e.keyCode == 70) { motion(); }
}

function botao_0(e) {
  
  // jogador 1
  if (e.keyCode == 65) { P1_BT_E = false; }
  if (e.keyCode == 68) { P1_BT_D = false; }
  if (e.keyCode == 87) { P1_BT_C = false; }
  if (e.keyCode == 83) { P1_BT_B = false; }
  if (e.keyCode == 84) { P1_BT_1 = false; }

  // jogador 2
  if (e.keyCode == 37) { P2_BT_E = false; }
  if (e.keyCode == 39) { P2_BT_D = false; }
  if (e.keyCode == 38) { P2_BT_C = false; }
  if (e.keyCode == 40) { P2_BT_B = false; }  
  if (e.keyCode == 97) { P2_BT_1 = false; }
}

// estrelas

var estrelas = [];

function Estrela(x, y) {
  this.x = x;
  this.y = y;
  this.w = 0.1 + Math.random() * 4;
  this.h = this.w;
  this.alpha = this.w;
  this.anima = function() {
    this.x -= this.w / 50;
    if(this.x < 0) { this.x = W; this.y = Math.random() * H; }
    TELA.save();
    TELA.globalAlpha = this.alpha;
    TELA.fillStyle = "white";
    TELA.fillRect(this.x, this.y, this.w, this.h);
    TELA.restore();
  }
}

for (var i = 0; i < MAX_ESTRELAS; i++){
  estrelas.push(new Estrela(Math.random() * W, Math.random() * H));
}

animacoes.push(estrelas);

// nave

var naves = [];

function Nave(x, y) {
  this.id = naves[0] ? (naves[0].id == 1 ? 2 : 1) : 1;
  this.img = new Image();
  this.img.src = "nave.png";
  this.x = x;
  this.y = y;
  this.w = 75;
  this.h = 38;
  this.r = 0;
  this.vx = 0;
  this.vy = 0;
  this.acel = 0.05;
  this.fric = 0.98;
  this.alpha = 1;
  this.sangue = 100;
  this.vivo = true;
  this.motion = false;
  this.inimigo = null;
  this.pontos = 0;
  this.nivel = getCookie('nivel') ? getCookie('nivel') : 1;
  this.nivel_up = 0;
  this.tiro_int = 0;
  this.tiro_int_max = 8;
  this.anima = function() {
    this.tiro_ang_max = this.nivel;
    this.tiro_int++;
    if (this.vivo) {
      if (this.sangue < 0) {
        this.sangue = 0;
        explosoes.push(new Explosao(this.x, this.y));
        for (var i = 0; i < MAX_FRAGMENTOS; i++) { fragmentos.push(new Fragmento(this.x, this.y)); }
        naves.splice(getNaveIndex(this.id), 1);
        this.vivo = false; }
      if (this.x < 0) { this.vx += this.acel * 2; }
      if (this.y < 0) { this.vy += this.acel * 2; }
      if (this.x > W) { this.vx -= this.acel * 2; }
      if (this.y > H) { this.vy -= this.acel * 2; }
      for (var i = 0; i < inimigos.length; i++) {
        if (distancia(this, inimigos[i]) < 50) {
          this.sangue = -1;
          inimigos[i].sangue = -1;
        }
      }
      this.vx *= this.fric;
      this.vy *= this.fric;
      if (eval("P" + this.id + "_BT_E")) { this.vx -= this.acel; }
      if (eval("P" + this.id + "_BT_D")) { this.vx += this.acel; }
      if (eval("P" + this.id + "_BT_C")) { this.vy -= this.acel; }
      if (eval("P" + this.id + "_BT_B")) { this.vy += this.acel; }
      if (eval("P" + this.id + "_BT_1")) { if (this.tiro_int > this.tiro_int_max / this.nivel) { var tiro = new Tiro(this.x + (this.w/2), this.y + 7, this.id, (-(this.tiro_ang_max) + Math.random() * (this.tiro_ang_max * 2))); tiros.push(tiro); this.tiro_int = 0; } }
      this.x += this.vx;
      this.y += this.vy;
      if (!eval("P" + this.id + "_BT_E")) { var fogo = new Fogo(this.x - 40, this.y + 4); fogos.push(fogo); }
      TELA.save();
      TELA.globalAlpha = this.alpha;
      TELA.translate(this.x, this.y);
      TELA.fillStyle = "#00FF00";
      TELA.fillText(this.sangue, 0, 0);
      TELA.drawImage(this.img, -(this.w/2), -(this.h/2), this.w, this.h);
      TELA.restore();
    }
  }
}

// arsenal

var tiros = [];

function Tiro(x, y, nave_id, r, inimigo) {
  this.id = tiros.length;
  this.x = x;
  this.y = y;
  this.w = 1 + Math.random() * 6;
  this.h = this.w;
  this.r = r;
  this.vx = 0,
  this.vy = 0;
  this.vel = 5;
  this.alpha = 1;
  this.vivo = true;
  this.nave_id = nave_id;
  this.inimigo = false;
  if (inimigo) { this.inimigo = true; }
  this.anima = function() {
    if (this.vivo) {
      if (this.x > W || this.y > H || this.x < 0 || this.y < 0) { tiros.splice(getIndex(tiros, this), 1); }
      if (!this.inimigo) {
        for (var i = 0; i < inimigos.length; i++) {
          if (distancia(this, inimigos[i]) < 20){
            if (naves.length) { naves[naves.length - 1].inimigo = inimigos[i]; }
            inimigos[i].vx *= inimigos[i].fric;
            var n = naves.length ? (naves[naves.length - 1].nivel / inimigos[i].nivel * 50) : 1;
            inimigos[i].sangue -= n;
            this.vivo = false;
            inimigos[i].nave_id = this.nave_id;
          }
        }
      } else {
        for (var i = 0; i < naves.length; i++) {
          if (distancia(this, naves[i]) < 20){
            naves[i].vx *= naves[i].fric;
            naves[i].sangue--;
            this.vivo = false;
          }
        }
      }
      if (this.inimigo) {
        this.x -= Math.cos(this.r * Math.PI/180) * this.vel;
        this.y -= Math.sin(this.r * Math.PI/180) * this.vel;
      } else {
        this.x += Math.cos(this.r * Math.PI/180) * this.vel;
        this.y += Math.sin(this.r * Math.PI/180) * this.vel;
      }
    } else {
      this.vx = 0;
      this.vy = 0;
      if (this.alpha < 0.1) { tiros.splice(getIndex(tiros, this), 1); }
      this.alpha -= 0.05;
      this.w += 5;
    }
    TELA.save();
    TELA.globalAlpha = this.alpha;
    TELA.translate(this.x, this.y);
    TELA.rotate(this.r * Math.PI/180);
    TELA.fillStyle = this.inimigo ? "#00FFFF" : (this.nave_id == 1 ? "#9999FF" : "#FFFF00");
    TELA.fillRect(-(this.w/2), -(this.h/2), this.w, this.h);
    TELA.restore();
  }
}

// efeitos

var fogos = [];

function Fogo(x, y, r) {
  this.x = x;
  this.y = y;
  this.w = 1 + Math.random() * 6;
  this.h = this.w;
  this.r = r ? r : (-5 + Math.random() * 10);
  this.vx = 0,
  this.vy = 0;
  this.vel = 0.1 + Math.random() * 3;
  this.alpha = 1;
  this.anima = function() {
    if(this.alpha < 0.1 || this.x < 0 || this.w < 0.1) { fogos.splice(getIndex(fogos, this), 1); }
    this.x -= Math.cos(this.r * Math.PI/180) * this.vel;
    this.y += Math.sin(this.r * Math.PI/180) * this.vel;
    this.alpha -= 0.01;
    this.w -= 0.05;
    TELA.save();
    TELA.globalAlpha = this.alpha;
    TELA.translate(this.x, this.y);
    TELA.fillStyle = "#FF6600";
    TELA.fillRect(-(this.w/2), -(this.h/2), this.w, this.h);
    TELA.restore();
  }
}

var fragmentos = [];

function Fragmento(x, y) {
  this.x = x;
  this.y = y;
  this.w = 2 + Math.random() * 12;
  this.h = this.w;
  this.r = Math.random() * 360;
  this.vx = 0,
  this.vy = 0;
  this.vel = 0.1 + Math.random() * 3;
  this.alpha = 1;
  this.anima = function() {
    if(this.alpha < 0.1 || this.x < 0 || this.w < 0.1) { fragmentos.splice(getIndex(fragmentos, this), 1); }
    this.x -= Math.cos(this.r * Math.PI/180) * this.vel;
    this.y += Math.sin(this.r * Math.PI/180) * this.vel;
    this.alpha -= 0.01;
    this.w -= 0.05;
    TELA.save();
    TELA.globalAlpha = this.alpha;
    TELA.translate(this.x, this.y);
    TELA.fillStyle = "#EEEEEE";
    TELA.fillRect(-(this.w/2), -(this.h/2), this.w, this.h);
    TELA.restore();
  }
}

var explosoes = [];

function Explosao(x, y) {
  this.img = new Image();
  this.img.src = "explosao.png";
  this.x = x;
  this.y = y;
  this.w = 50;
  this.h = this.w/2;
  this.r = 0;
  this.vel = 10;
  this.fric = 0.98;
  this.alpha = 1;
  this.anima = function() {
    if (this.alpha < 0.1) { explosoes.splice(getIndex(explosoes, this), 1); }
    this.vel *= this.fric;
    this.w += this.vel;
    this.alpha -= 0.01;
    TELA.save();
    TELA.globalAlpha = this.alpha;
    TELA.translate(this.x, this.y);
    TELA.rotate(this.r * Math.PI/180);
    TELA.drawImage(this.img, -(this.w/2), -(this.h/2), this.w, this.h);
    TELA.restore();
  }
}

// inimigos

function cria_inimigos() {
  var num = Math.round(Math.random() * 2);
  switch (num) {
    case 0:
      inimigos.push(new Inimigo01(W, Math.random() * H));
      break;
    default:
      inimigos.push(new Inimigo02(W, Math.random() * H));
      break;
  }
}

var inimigos = [];

function Inimigo01(x, y) {
  this.img = new Image();
  this.img.src = "ast" + Math.round(Math.random() * 2) +  ".gif";
  this.x = x;
  this.y = y;
  this.w = 60;
  this.h = 81;
  this.r = 0;
  this.rot = 0;
  this.vx = 1;
  this.vy = 0;
  this.vel = 1;
  this.acel = 0.05;
  this.fric = 0.99;
  this.alpha = 1;
  this.vivo = true;
  this.sangue = 100;
  this.nivel = 1 + (Math.random() * 4) + NIVEL;
  this.nave_id = 0;
  this.anima = function() {
    if (this.vivo) {
      if (this.sangue < 0) {
        this.sangue = 0;
        explosoes.push(new Explosao(this.x, this.y));
        for (var i = 0; i < MAX_FRAGMENTOS; i++) { fragmentos.push(new Fragmento(this.x, this.y)); }
        inimigos.splice(getIndex(inimigos, this), 1);
        this.vivo = false;
        if (naves[getNaveIndex(this.nave_id)]) {
          naves[getNaveIndex(this.nave_id)].pontos += this.nivel;
          naves[getNaveIndex(this.nave_id)].nivel_up += this.nivel * 2; } }
      if (this.x < 0) { inimigos.splice(getIndex(inimigos, this), 1); }
      this.x -= this.vx;
      this.y += this.vy; }
    TELA.save();
    TELA.globalAlpha = this.alpha;
    TELA.translate(this.x, this.y);
    TELA.rotate(this.r * Math.PI/180);
    TELA.drawImage(this.img, -(this.w/2), -(this.h/2), this.w, this.h);
    TELA.fillRect(-(this.w/2), -(this.h/2) - 15, (this.sangue/100) * 50, 10);
    TELA.restore();
  }
}

function Inimigo02(x, y) {
  this.img = new Image();
  this.img.src = "inimigo1.png";
  this.x = x;
  this.y = y;
  this.w = 100;
  this.h = 48;
  this.r = 0;
  this.rot = 0;
  this.vx = 1;
  this.vy = 0;
  this.vel = 1;
  this.acel = 0.05;
  this.fric = 0.99;
  this.alpha = 1;
  this.vivo = true;
  this.sangue = 100;
  this.nivel = 1 + (Math.random() * 4) + NIVEL;
  this.nave_id = 0;
  this.tiro_int = 0;
  this.tiro_int_min = 0;
  this.tiro_int_max = 9;
  this.anima = function() {
    this.tiro_ang_max = this.nivel;
    this.tiro_int++;
    if (this.vivo) {
      if (this.sangue < 0) {
        this.sangue = 0;
        explosoes.push(new Explosao(this.x, this.y));
        for (var i = 0; i < MAX_FRAGMENTOS; i++) { fragmentos.push(new Fragmento(this.x, this.y)); }
        inimigos.splice(getIndex(inimigos, this), 1);
        this.vivo = false;
        if (naves[getNaveIndex(this.nave_id)]) {
          naves[getNaveIndex(this.nave_id)].pontos += this.nivel;
          naves[getNaveIndex(this.nave_id)].nivel_up += this.nivel * 2; } }
      if (this.x < 0) { inimigos.splice(getIndex(inimigos, this), 1); }
      this.x -= this.vx;
      this.y += this.vy;
      this.tiro_int_min++;
      if (this.tiro_int_min > 100 && this.tiro_int_min < 120) {
        if (this.tiro_int > this.tiro_int_max / this.nivel) {
          var tiro = new Tiro(this.x, this.y, this.id, angulo(this, naves[0] && naves[1] ? naves[Math.round(Math.random() * 1)] : (naves[0] ? naves[0] : (naves[1] ? naves[1] : 0))), true);
          tiros.push(tiro);
          this.tiro_int = 0;
        }
      }
      if (this.tiro_int_min > 300) {
        this.tiro_int_min = 0;
      }
    }
    TELA.save();
    TELA.globalAlpha = this.alpha;
    TELA.translate(this.x, this.y);
    TELA.rotate(this.r * Math.PI/180);
    TELA.drawImage(this.img, -(this.w/2), -(this.h/2), this.w, this.h);
    TELA.fillRect(-(this.w/2), -(this.h/2) - 15, (this.sangue/100) * 50, 10);
    TELA.restore();
  }
}

// camadas

animacoes.push(explosoes);
animacoes.push(inimigos);
animacoes.push(fogos);
animacoes.push(fragmentos);
animacoes.push(tiros);
animacoes.push(naves);
