const canvas = document.getElementById("jogo-canvas");
const ctx = canvas.getContext("2d");

const spritePersonagem = new Image();
spritePersonagem.src = 'imagens/personagem.png';

const spritechao = new Image();
spritechao.src = 'imagens/sprite.png';

const spritefundo = new Image();
spritefundo.src = 'imagens/fundo2.png';

// plano de fundo
function criaFundo(){
  const planoDeFundo = {
    spritex : 6,
    spritey : 11,
    largura : 5230,
    altura : 3471,
    x : 0,
    y : canvas.height - 400,
    larguraCanvas : 800,
    alturaCanvas : 400,
    atualiza(){
      const movimentoFundo = 0.5; // mais lento que o chão para dar sensação de profundidade   
      planoDeFundo.x = planoDeFundo.x -  movimentoFundo;

      if (planoDeFundo.x <= -planoDeFundo.larguraCanvas) {
        planoDeFundo.x = 0;
      }
    },

    desenha(){
      ctx.drawImage(
        spritefundo,
        planoDeFundo.spritex , planoDeFundo.spritey,
        planoDeFundo.largura, planoDeFundo.altura,
        planoDeFundo.x, planoDeFundo.y,
        planoDeFundo.larguraCanvas, planoDeFundo.alturaCanvas
      );

      ctx.drawImage(
        spritefundo,
        planoDeFundo.spritex , planoDeFundo.spritey,
        planoDeFundo.largura, planoDeFundo.altura,
        (planoDeFundo.x + planoDeFundo.larguraCanvas), planoDeFundo.y,
        planoDeFundo.larguraCanvas, planoDeFundo.alturaCanvas
      );
    }
  };
  return planoDeFundo;
}

//chao
function criaChao(){
  const chao = {
  spritex : 1896,      //posição x no sprite  (arquivo png)
  spritey : 424,       //posição y no sprite  (arquivo png)
  largura : 3760,      //largura da imagem no sprite (arquivo png)
  altura : 968,         //altura da imagem no sprite (arquivo png)
  x : 0,                   // posição x no canva
  y : canvas.height - 65,     // posição y no canva - a altura da imagem no canva
  larguraCanvas : 800,         // largura da imagem no canva
  alturaCanvas : 65,             // altura da imagem no canva

  atualiza() {
    const movimentoChao = 1;
    chao.x = chao.x - movimentoChao;

    if (chao.x <= -chao.larguraCanvas) {
      chao.x = 0;
    }
  },


  desenha(){                         // função que desenha a imagem no canva
    ctx.drawImage(
      spritechao,
      chao.spritex , chao.spritey,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.larguraCanvas, chao.alturaCanvas
    );

      ctx.drawImage(
        spritechao,
        chao.spritex , chao.spritey,
        chao.largura, chao.altura,
        (chao.x + chao.larguraCanvas), chao.y,
        chao.larguraCanvas, chao.alturaCanvas
    );
  },
};

return chao;
}


// Controle de movimento
let direitaPressionada = false;
let esquerdaPressionada = false;

let gravidade = 1;
let velocidadeY = 0;
let noChao = false;
let pulos = 0;

function fazColisao(personagem, chao){
  const personagemY = personagem.y + personagem.alturaCanvas;
  const chaoY = chao.y;

  if(personagemY >= chaoY){
    personagem.y = chao.y - personagem.alturaCanvas;
    velocidadeY = 0;        // velocidade vertical, para não inteferir na velocidade horizontal que esta sendo usada para fazer o personagem andar
    noChao = true;
    pulos = 0;
  }
}

// PERSONAGEM
function criapersonagem(){
  const personagem = {
  spritex : 63,
  spritey : 0,
  largura : 880,
  altura : 1550,
  x : 10,
  y : 245,
  larguraCanvas : 60,
  alturaCanvas : 95,
  velocidade: 5,

  atualiza() {
  
    // Aplica gravidade
    velocidadeY += gravidade;
    personagem.y += velocidadeY;

     // Verifica colisão com o chão
    fazColisao(personagem, globais.chao);

  },

  mover() {
    if (direitaPressionada) {
      personagem.x += personagem.velocidade;
      if (personagem.x + personagem.larguraCanvas > canvas.width) {
        personagem.x = canvas.width - personagem.larguraCanvas;
      }
    }
    if (esquerdaPressionada) {
      personagem.x -= personagem.velocidade;
      if (personagem.x < 0) {
        personagem.x = 0;
      }
    }
  },

  movimentos: [             // corrida
    { spritex: 63, spritey: 0, }, 
    { spritex: 928, spritey: 0, }, 
    { spritex: 1712, spritey: 0, }, 
    { spritex: 2496, spritey: 0, }, 
    { spritex: 3272, spritey: 0, }, 
    { spritex: 4160, spritey: 0, }, 
  ],

  frameAtual: 0,
  atualizaOFrameAtual() {     
    const intervaloDeFrames = 10;
    const passouOIntervalo = frames % intervaloDeFrames === 0;

    if(passouOIntervalo) {
      const baseDoIncremento = 1;
      const incremento = baseDoIncremento + personagem.frameAtual;
      const baseRepeticao = passouOIntervalo.movimentos.length;
      personagem.frameAtual = incremento % baseRepeticao
    }
  },

  desenha(){
    personagem.atualizaOFrameAtual();
    const { spritex, spritey } = personagem.movimentos[personagem.frameAtual];

    ctx.drawImage(
      spritePersonagem,
      spritex , spritey,
      personagem.largura, personagem.altura,
      personagem.x, personagem.y,
      personagem.larguraCanvas, personagem.alturaCanvas
    );
  }
};

 return personagem;

}


// Teclado
document.addEventListener('keydown', function(evento) {
  let tecla = evento.key;
  
  if (tecla == 'ArrowRight') direitaPressionada = true;
  if (tecla == 'ArrowLeft') esquerdaPressionada = true;

  if ((tecla == ' ' || tecla == 'ArrowUp') && pulos < 2) {
    velocidadeY = -15;
    pulos++;
    noChao = false;
  }
});

document.addEventListener('keyup', function(evento) {
  const tecla = evento.key;
  if (tecla == 'ArrowRight') direitaPressionada = false;
  if (tecla == 'ArrowLeft') esquerdaPressionada = false;
});

// Telas
const globais = {};
let telaAtiva = {};
function mudaDeTela(novaTela){
  telaAtiva =  novaTela;

  if(telaAtiva.inicializa){
    telaAtiva.inicializa();
  }
}

const telas = {};

telas.jogo = {
  inicializa(){
    globais.planoDeFundo = criaFundo();
    globais.chao = criaChao();
    globais.personagem = criapersonagem();
  },
  desenha(){
    globais.planoDeFundo.desenha();
    globais.chao.desenha();
    globais.personagem.desenha();
  },
  atualiza(){
    globais.planoDeFundo.atualiza();
    globais.chao.atualiza();
    globais.personagem.mover();
    globais.personagem.atualiza();
  },
};

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  telaAtiva.desenha();
  telaAtiva.atualiza();
  requestAnimationFrame(loop);
}

mudaDeTela(telas.jogo);
loop();
