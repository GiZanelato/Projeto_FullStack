const canvas = document.getElementById("jogo-canvas");
const ctx = canvas.getContext("2d");

const spritePersonagem = new Image();
spritePersonagem.src = 'imagens/personagem.png';

const spritechao = new Image();
spritechao.src = 'imagens/sprite.png';

const spritefundo = new Image();
spritefundo.src = 'imagens/fundo2.png';

// plano de fundo
const planoDeFundo = {
  spritex : 6,
  spritey : 11,
  largura : 5230,
  altura : 3471,
  x : 0,
  y : canvas.height - 400,
  larguraCanvas : 800,
  alturaCanvas : 400,
  desenha(){
    ctx.drawImage(
      spritefundo,
      planoDeFundo.spritex , planoDeFundo.spritey,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.larguraCanvas, planoDeFundo.alturaCanvas
    );
  }
};

// Chao
const chao = {
  spritex : 1896,      //posição x no sprite  (arquivo png)
  spritey : 424,       //posição y no sprite  (arquivo png)
  largura : 3760,      //largura da imagem no sprite (arquivo png)
  altura : 968,         //altura da imagem no sprite (arquivo png)
  x : 0,                   // posição x no canva
  y : canvas.height - 65,     // posição y no canva - a altura da imagem no canva
  larguraCanvas : 800,         // largura da imagem no canva
  alturaCanvas : 65,             // altura da imagem no canva

  desenha(){                         // função que desenha a imagem no canva
    ctx.drawImage(
      spritechao,
      chao.spritex , chao.spritey,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.larguraCanvas, chao.alturaCanvas
    );
  }
};

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


// Personagem
const personagem = {
  spritex : 0,
  spritey : 0,
  largura : 944,
  altura : 1552,
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
    fazColisao(personagem, chao);

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

  desenha(){
    ctx.drawImage(
      spritePersonagem,
      personagem.spritex , personagem.spritey,
      personagem.largura, personagem.altura,
      personagem.x, personagem.y,
      personagem.larguraCanvas, personagem.alturaCanvas
    );
  }
};

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
let telaAtiva = {};
function mudaDeTela(novaTela){
  telaAtiva =  novaTela;
}

const telas = {};

telas.jogo = {
  desenha(){
    planoDeFundo.desenha();
    chao.desenha();
    personagem.desenha();
  },
  atualiza(){
    personagem.mover();
    personagem.atualiza();
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
