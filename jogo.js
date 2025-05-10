const canvas = document.getElementById("jogo-canvas");
const ctx = canvas.getContext("2d");

const spritePersonagem = new Image();
spritePersonagem.src = 'imagens/personagem.png';

const spritechao = new Image();
spritechao.src = 'imagens/chaos.png';

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
  spritex : 267,   //posição x no sprite  (arquivo png)
  spritey : 595,    //posição y no sprite  (arquivo png)
  largura : 3510,     //largura da imagem no sprite (arquivo png)
  altura : 407,      //altura da imagem no sprite (arquivo png)
  x : 0,                  // posição x no canva
  y : canvas.height - 80,   // posição y no canva - a altura da imagem no canva
  larguraCanvas : 800,         // largura da imagem no canva
  alturaCanvas : 80,        // altura da imagem no canva


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
  y : 50,
  larguraCanvas : 60,
  alturaCanvas : 90,
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

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada loop
  planoDeFundo.desenha();         // faz a funçao de desenhar o fundo
  chao.desenha();               // faz a funçao de desenhar o chão
  personagem.desenha();       // faz a funçao de desenhar o personagem


  
  requestAnimationFrame(loop);
}

spritePersonagem.onload = () => {
  loop(); // Só inicia o loop quando a imagem estiver carregada
};
