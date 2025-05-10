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
  spritex : 1896,   //posição x no sprite  (arquivo png)
  spritey : 424,    //posição y no sprite  (arquivo png)
  largura : 3760,     //largura da imagem no sprite (arquivo png)
  altura : 968,      //altura da imagem no sprite (arquivo png)
  x : 0,                  // posição x no canva
  y : canvas.height - 65,   // posição y no canva - a altura da imagem no canva
  larguraCanvas : 800,         // largura da imagem no canva
  alturaCanvas : 65,        // altura da imagem no canva


  desenha(){                // função que desenha a imagem no canva
    ctx.drawImage(
      spritechao,
      chao.spritex , chao.spritey,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.larguraCanvas, chao.alturaCanvas
    );

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

  },

  mover() {
    if (direitaPressionada) {
      this.x += this.velocidade;
      if (this.x + this.larguraCanvas > canvas.width) {
        this.x = canvas.width - this.larguraCanvas;
      }
    }
    if (esquerdaPressionada) {
      this.x -= this.velocidade;
      if (this.x < 0) {
        this.x = 0;
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



// Controle do movimento do personagem
let esquerdaPressionada = false;
let direitaPressionada = false;


// andar pra frente ou para trás com as setas ou com d/a
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight" || e.key === "d") {
    direitaPressionada = true;
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    esquerdaPressionada = true;
  }
});

document.addEventListener("keyup", function (e) {
  if (e.key === "ArrowRight" || e.key === "d") {
    direitaPressionada = false;
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    esquerdaPressionada = false;
  }
});


// telas
let telaAtiva = {};
function mudaDeTela(novaTela){
  telaAtiva =  novaTela;
}

const telas = {

};

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
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada loop

  telaAtiva.desenha();
  telaAtiva.atualiza();

  requestAnimationFrame(loop);
}

mudaDeTela(telas.jogo);
loop(); 

