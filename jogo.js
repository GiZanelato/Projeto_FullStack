const canvas = document.getElementById("jogo-canvas");     // Obtém o elemento canvas do HTML com o id "jogo-canvas"
const ctx = canvas.getContext("2d");                       // Obtém o contexto 2D do canvas, que permite desenhar no canvas
  
let frames = 0;                                           // Inicializa um contador de frames
const spritePersonagem = new Image();                     // Cria uma nova imagem para o sprite do personagem
spritePersonagem.src = 'imagens/personagem.png';          // Define a fonte da imagem do sprite do personagem

const spritechao = new Image();                           // Cria uma nova imagem para o sprite do chão
spritechao.src = 'imagens/sprite.png';

const spritefundo = new Image();                          // Cria uma nova imagem para o sprite do fundo
spritefundo.src = 'imagens/fundo2.png';

const spritePlanta = new Image();                       // Cria uma nova imagem para o sprite da planta
spritePlanta.src = 'imagens/planta.png';

const spriteCogumelo = new Image();                     // Cria uma nova imagem para o sprite do cogumelo
spriteCogumelo.src = 'imagens/cogumelo.png'; 



// plano de fundo
// Função que cria o plano de fundo do jogo
function criaFundo(){
  const planoDeFundo = {                          
    spritex : 6,                                       // Posição x no sprite (arquivo PNG)
    spritey : 11,                                      // Posição y no sprite (arquivo PNG)
    largura : 5230,                                     // Largura da imagem no sprite (arquivo PNG)
    altura : 3471,                                    // Altura da imagem no sprite (arquivo PNG)
    x : 0,                                           // Posição x no canvas
    y : canvas.height - 400,                           // Posição y no canvas, ajustada para a altura do fundo
    larguraCanvas : 800,                             // Largura da imagem no canvas
    alturaCanvas : 400,                               // Altura da imagem no canvas
    atualiza(){                                         // atualiza a posição do fundo
      const movimentoFundo = 0.5;                           // Velocidade de movimento do fundo, mais lento que o chão para dar sensação de profundidade   
      planoDeFundo.x = planoDeFundo.x -  movimentoFundo;         // Atualiza a posição x do fundo

      // Se o fundo sair da tela, reinicia a posição x
      if (planoDeFundo.x <= -planoDeFundo.larguraCanvas) {
        planoDeFundo.x = 0;
      }
    },

    desenha(){                                           //desenha o fundo no canvas
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
  velocidade: 3,

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
        const tipo = Math.random() < 0.5 ? 'baixo' : 'alto';
        let posY = tipo === 'baixo'
          ? canvas.height - globais.chao.alturaCanvas - plantas.altura
          : Math.max(0, globais.personagem.y - plantas.altura - 10);

        const novaPlanta = {
          x: canvas.width,
          y: posY,
          tipo: tipo,
        };

        // Verifica sobreposição com cogumelo
        const colisaoComCogumelo = globais.cogumelo.lista.some(c => {
          return novaPlanta.x < c.x + globais.cogumelo.largura &&
                novaPlanta.x + plantas.largura > c.x &&
                novaPlanta.y < c.y + globais.cogumelo.altura &&
                novaPlanta.y + plantas.altura > c.y;
        });

        if (!colisaoComCogumelo) {
          plantas.lista.push(novaPlanta);
        }
      }

      // Move as plantas
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
        const posY = canvas.height - globais.chao.alturaCanvas - cogumelo.altura;

        const novoCogumelo = {
          x: canvas.width,
          y: posY,
        };

        // Verifica sobreposição com plantas
        const colisaoComPlanta = globais.plantas.lista.some(p => {
          return novoCogumelo.x < p.x + globais.plantas.largura &&
                novoCogumelo.x + cogumelo.largura > p.x &&
                novoCogumelo.y < p.y + globais.plantas.altura &&
                novoCogumelo.y + cogumelo.altura > p.y;
        });

        if (!colisaoComPlanta) {
          cogumelo.lista.push(novoCogumelo);
        }
      }

      // Move e remove
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
    verificaColeta(personagem, atacando) {
      cogumelo.lista = cogumelo.lista.filter(c => {
        const colisaoX = personagem.x < c.x + cogumelo.largura &&
                        personagem.x + personagem.larguraCanvas > c.x;
        const colisaoY = personagem.y < c.y + cogumelo.altura &&
                        personagem.y + personagem.alturaCanvas > c.y;

        if (colisaoX && colisaoY && atacando) {
          cogumelo.pontos++;
          return false; // remove cogumelo coletado
        }
        return true;
      });
    }

  };

  return cogumelo;
}

function plantaSobreCogumelo(planta, cogumelo) {
  const overlapX = planta.x < cogumelo.x + globais.cogumelo.largura &&
                   planta.x + globais.plantas.largura > cogumelo.x;

  const overlapY = planta.y < cogumelo.y + globais.cogumelo.altura &&
                   planta.y + globais.plantas.altura > cogumelo.y;

  return overlapX && overlapY;
}


let atacando = false;

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

  if (tecla.toLowerCase() === 'z') {
    atacando = true;
  }
});

document.addEventListener('keyup', function(evento) {
  const tecla = evento.key;
  if (tecla == 'ArrowRight') direitaPressionada = false;
  if (tecla == 'ArrowLeft') esquerdaPressionada = false;

  if (tecla.toLowerCase() === 'z') {
    atacando = false;
  }
});

function InicioJogo() {
  mudaDeTela(telas.jogo);
}


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

telas.inicio = {
  inicializa(){
    globais.planoDeFundo = criaFundo();
    globais.chao = criaChao();
  },
  desenha(){
    globais.planoDeFundo.desenha();
    globais.chao.desenha();

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Clique no botão para iniciar o jogo!', canvas.width / 2, canvas.height / 2);
  },

  atualiza(){
    globais.planoDeFundo.atualiza();
    globais.chao.atualiza();
    
  },
};


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
    globais.cogumelo.verificaColeta(globais.personagem, atacando);  
    // Verifica colisão com plantas
    if (globais.plantas.temColisaoCom(globais.personagem)) {
      mudaDeTela(telas.gameOver);
    }

    if (atacando) {
      // Percorre todas as plantas e cogumelos para achar sobreposição
      globais.plantas.lista = globais.plantas.lista.filter(planta => {
        // Se a planta está sobre algum cogumelo, remove a planta e remove o cogumelo, soma ponto
        let plantaEstaSobreCogumelo = false;

        globais.cogumelo.lista = globais.cogumelo.lista.filter(cogumelo => {
          if (plantaSobreCogumelo(planta, cogumelo)) {
            plantaEstaSobreCogumelo = true;
            globais.cogumelo.pontos++;  // soma ponto no cogumelo coletado
            return false; // remove cogumelo
          }
          return true; // mantém cogumelo
        });

        return !plantaEstaSobreCogumelo; // remove planta se estava sobre cogumelo
      });
    }

  },
  
};

telas.gameOver = {
  desenha() {
    // Preencher fundo preto sem transparência
    ctx.fillStyle = '#2c3e50';
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

mudaDeTela(telas.inicio);
loop();
