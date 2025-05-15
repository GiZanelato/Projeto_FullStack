const canvas = document.getElementById("jogo-canvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const spritePersonagem = new Image();
spritePersonagem.src = 'imagens/personagem.png';

const spritechao = new Image();
spritechao.src = 'imagens/sprite.png';

const spritefundo = new Image();
spritefundo.src = 'imagens/fundo2.png';

const spritePlanta = new Image();
spritePlanta.src = 'imagens/planta.png';

const spriteCogumelo = new Image();
spriteCogumelo.src = 'imagens/cogumelo.png'; 


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

let gravidade = 0.4;
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

    // Limita para que o personagem não ultrapasse o topo do canvas
    if (personagem.y < 0) {
      personagem.y = 0;
      velocidadeY = 0;
    }

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
    { spritex: 1712, spritey: 0, }, 
    { spritex: 63, spritey: 0, }, 
    { spritex: 928, spritey: 0, }, 
    { spritex: 1712, spritey: 0, }, 
    { spritex: 2496, spritey: 0, }, 
    { spritex: 3272, spritey: 0, }, 
    { spritex: 4160, spritey: 0, }, 
  ],

  movimentoPulo:[
    { spritex: 0, spritey: 3161 },
    { spritex: 888, spritey: 3161 },
    { spritex: 1672, spritey: 3161 },
    { spritex: 2440, spritey: 3057 },
    { spritex: 3208, spritey: 3161 },
    { spritex: 4008, spritey: 3161 },
  ] ,


  frameAtual: 0,
  atualizaOFrameAtual() {     
    const intervaloDeFrames = 10;
    const passouOIntervalo = frames % intervaloDeFrames == 0;

    if(passouOIntervalo) {
      const baseDoIncremento = 1;
      const incremento = baseDoIncremento + this.frameAtual;
      const baseRepeticao = this.movimentos.length;
      this.frameAtual = incremento % baseRepeticao;
    }
  },

  desenha(){
    let spritex, spritey;

    if (!noChao) {
      // Personagem está no ar → usar sprite de pulo
      this.atualizaOFrameAtual(); // animação do pulo também
      ({ spritex, spritey } = this.movimentoPulo[this.frameAtual % this.movimentoPulo.length]);
    } else {
      // Personagem no chão — animação correndo mesmo parado (removemos a checagem das setas)
      this.atualizaOFrameAtual();
      ({ spritex, spritey } = this.movimentos[this.frameAtual]);
    }

    ctx.drawImage(
      spritePersonagem,
      spritex , spritey,
      this.largura, this.altura,
      this.x, this.y,
      this.larguraCanvas, this.alturaCanvas
    );
  }
  };

  return personagem;

}

// plantas
function criaPlantas() {
  const plantas = {
    lista: [],
    largura: 30,
    altura: 30,
    frequencia: 100,
    velocidade: 2,

    atualiza() {
      if (frames % plantas.frequencia === 0) {
        // Decide aleatoriamente se a planta será baixa ou alta
        const tipo = Math.random() < 0.5 ? 'baixo' : 'alto';

        let posY;

        if (tipo === 'baixo') {
          // Próximo do chão - planta que o personagem pode pular por cima
          posY = canvas.height - globais.chao.alturaCanvas - plantas.altura;
        } else {
          // Altas - planta que o personagem tem que passar por baixo
          // Coloca acima do personagem (exemplo: 100 pixels acima dele)
          posY = globais.personagem.y - plantas.altura - 10;
          if (posY < 0) posY = 0;  // limite no topo do canvas
        }

        plantas.lista.push({
          x: canvas.width,
          y: posY,
          tipo: tipo,
        });
      }

      // Move as plantas para esquerda e remove as que saíram da tela
      plantas.lista = plantas.lista.filter(planta => {
        planta.x -= plantas.velocidade;
        return planta.x + plantas.largura > 0;
      });
    },

    desenha() {
      plantas.lista.forEach((planta) => {
        ctx.drawImage(
          spritePlanta,
          0, 55,
          426, 534,
          planta.x, planta.y,
          plantas.largura, plantas.altura
        );
      });
    },

    temColisaoCom(personagem) {
      return plantas.lista.some((planta) => {
        const colisaoX = personagem.x < planta.x + plantas.largura &&
                         personagem.x + personagem.larguraCanvas > planta.x;

        if (planta.tipo === 'baixo') {
          // Colisão normal: se personagem bater de lado ou por baixo, game over
          const colisaoY = personagem.y + personagem.alturaCanvas > planta.y;
          return colisaoX && colisaoY;
        } else {
          // Planta alta: personagem deve passar por baixo
          const colisaoY = personagem.y < planta.y + plantas.altura &&
                           personagem.y + personagem.alturaCanvas > planta.y;
          return colisaoX && colisaoY;
        }
      });
    }
  };

  return plantas;
}


// COGUMELO
function criaCogumelo() {
  const cogumelo = {
    lista: [],
    largura: 40,
    altura: 40,
    frequencia: 200,  // aparece menos que plantas
    velocidade: 2,
    pontos: 0,  // contador de cogumelos coletados

    atualiza() {
      if (frames % cogumelo.frequencia === 0) {
        // Aparece no chão (mesma altura das plantas baixas)
        let posY = canvas.height - globais.chao.alturaCanvas - cogumelo.altura;
        cogumelo.lista.push({
          x: canvas.width,
          y: posY,
        });
      }

      // Move e remove os cogumelos que saíram da tela
      cogumelo.lista = cogumelo.lista.filter(c => {
        c.x -= cogumelo.velocidade;
        return c.x + cogumelo.largura > 0;
      });
    },

    desenha() {
      cogumelo.lista.forEach(c => {
        ctx.drawImage(
          spriteCogumelo,
          198, 195,
          1248, 1407,
          c.x, c.y,
          cogumelo.largura, cogumelo.altura
        );
      });
    },

    verificaColeta(personagem) {
      cogumelo.lista = cogumelo.lista.filter(c => {
        const colisaoX = personagem.x < c.x + cogumelo.largura &&
                         personagem.x + personagem.larguraCanvas > c.x;
        const colisaoY = personagem.y < c.y + cogumelo.altura &&
                         personagem.y + personagem.alturaCanvas > c.y;

        if (colisaoX && colisaoY) {
          cogumelo.pontos++;
          return false; // remove cogumelo coletado
        }
        return true;
      });
    }
  };

  return cogumelo;
}



// Teclado
document.addEventListener('keydown', function(evento) {
  let tecla = evento.key;
  
  if (tecla == 'ArrowRight') direitaPressionada = true;
  if (tecla == 'ArrowLeft') esquerdaPressionada = true;

  if ((tecla == ' ' || tecla == 'ArrowUp') && pulos < 2) {
    velocidadeY = -12;
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
    globais.plantas = criaPlantas();
    globais.cogumelo = criaCogumelo(); 
  },
  desenha(){
    globais.planoDeFundo.desenha();
    globais.chao.desenha();
    globais.personagem.desenha();
    globais.plantas.desenha();
    globais.cogumelo.desenha();

    // Mostrar placar de cogumelos coletados
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Cogumelos coletados: ${globais.cogumelo.pontos}`, 10, 30);
  },

  atualiza(){
    globais.planoDeFundo.atualiza();
    globais.chao.atualiza();
    globais.personagem.mover();
    globais.personagem.atualiza();
    globais.plantas.atualiza();
    globais.cogumelo.atualiza();  
    globais.cogumelo.verificaColeta(globais.personagem); 

    // Verifica colisão com plantas
    if (globais.plantas.temColisaoCom(globais.personagem)) {
      mudaDeTela(telas.gameOver);
    }
  },
  
};

telas.gameOver = {
  desenha() {
    // Preencher fundo preto sem transparência
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto "Game Over"
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);

    // Texto para reiniciar o jogo
    ctx.font = '20px Arial';
    ctx.fillText('Pressione ENTER para reiniciar', canvas.width / 2, canvas.height / 2 + 30);

    // Mostrar placar de cogumelos coletados na última partida
    ctx.fillText(
    `Cogumelos coletados: ${globais.cogumelo ? globais.cogumelo.pontos : 0}`,
    canvas.width / 2,
    canvas.height / 2 + 70
    );
  },

  atualiza() {},

  inicializa() {
    
    function reiniciaListener(event) {
      if (event.key == 'Enter') {
        mudaDeTela(telas.jogo);
        document.removeEventListener('keydown', reiniciaListener);
      }
    }
    document.addEventListener('keydown', reiniciaListener);
  }
};


function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

mudaDeTela(telas.jogo);
loop();
