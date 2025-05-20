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
    spritex : 6,                                             // Posição x no sprite (arquivo PNG)
    spritey : 11,                                            // Posição y no sprite (arquivo PNG)
    largura : 5230,                                          // Largura da imagem no sprite (arquivo PNG)
    altura : 3471,                                           // Altura da imagem no sprite (arquivo PNG)
    x : 0,                                                   // Posição x no canvas
    y : canvas.height - 400,                                 // Posição y no canvas, ajustada para a altura do fundo
    larguraCanvas : 800,                                     // Largura da imagem no canvas
    alturaCanvas : 400,                                      // Altura da imagem no canvas

    // atualiza a posição do fundo:
    atualiza(){                                              
      const movimentoFundo = 0.5;                            // Velocidade de movimento do fundo, mais lento que o chão para dar sensação de profundidade   
      planoDeFundo.x = planoDeFundo.x -  movimentoFundo;     // Atualiza a posição x do fundo

      // Se o fundo sair da tela, reinicia a posição x
      if (planoDeFundo.x <= -planoDeFundo.larguraCanvas) {
        planoDeFundo.x = 0;
      }
    },

    //desenha o fundo no canvas:
    desenha(){                 
      // Desenha o fundo pela primeira vez:
      ctx.drawImage(                                                
        spritefundo,                                                // Imagem do fundo
        planoDeFundo.spritex , planoDeFundo.spritey,                // Posição no sprite
        planoDeFundo.largura, planoDeFundo.altura,                  // Dimensões da imagem no sprite
        planoDeFundo.x, planoDeFundo.y,                             // Posição x e y no canvas
        planoDeFundo.larguraCanvas, planoDeFundo.alturaCanvas       // Dimensões (largura e altura) no canvas
      );

      // Desenha o fundo no canvas novamente ,para poder fazer o efeito do fundo se movendo :
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
// Função que cria o chão do jogo
function criaChao(){
  const chao = {
    spritex : 1896,                                 // Posição x no sprite (arquivo PNG) que indica onde a imagem do chão começa
    spritey : 424,                                  // Posição y no sprite (arquivo PNG) que indica onde a imagem do chão começa
    largura : 3760,                                 // Largura da imagem no sprite (arquivo PNG) 
    altura : 968,                                   // Altura da imagem no sprite (arquivo PNG) 
    x : 0,                                          // Posição x no canvas onde o chão será desenhado
    y : canvas.height - 65,                         // Posição y no canvas, ajustada para que o chão fique na parte inferior do canvas
    larguraCanvas : 800,                            // Largura da imagem do chão que será desenhada no canvas
    alturaCanvas : 65,                              // Altura da imagem do chão que será desenhada no canvas

    //atualiza a posição do chão:
    atualiza() {
      const movimentoChao = 1;                      // Velocidade de movimento do chão
      chao.x = chao.x - movimentoChao;              // Atualiza a posição x do chão, movendo-o para a esquerda

      // Se o chão sair da tela, reinicia a posição x
      if (chao.x <= -chao.larguraCanvas) {
        chao.x = 0;                                  // Reseta a posição x do chão para que ele reapareça à direita
      }
    },


    // desenha a imagem do chão no canvas
    desenha(){                       
      ctx.drawImage(
        spritechao,                                     // Imagem do chão
        chao.spritex , chao.spritey,                    // Posição no sprite
        chao.largura, chao.altura,                      // Dimensões da imagem no sprite
        chao.x, chao.y,                                 // Posição no canvas onde a imagem será desenhada
        chao.larguraCanvas, chao.alturaCanvas            // Dimensões da imagem no canvas
      );

      // Desenha a segunda parte do chão para criar um efeito de repetição:
      ctx.drawImage(
        spritechao,                                     // Imagem do chão
        chao.spritex , chao.spritey,                    // Posição no sprite
        chao.largura, chao.altura,                      // Dimensões da imagem no sprite
        (chao.x + chao.larguraCanvas), chao.y,          // Posição no canvas, deslocada pela largura do canvas
        chao.larguraCanvas, chao.alturaCanvas           // Dimensões da imagem no canvas
      );
    },
  };

return chao;                                            // Retorna o objeto chao
}


// Controle de movimento do personagem:

let direitaPressionada = false;                     // Variável que indica se a tecla direita está pressionada
let esquerdaPressionada = false;                    // Variável que indica se a tecla esquerda está pressionada

let gravidade = 0.4;                                // Valor da gravidade que afeta o movimento vertical do personagem
let velocidadeY = 0;                                // Velocidade vertical do personagem
let noChao = false;                                 // Indica se o personagem está no chão
let pulos = 0;                                      // Contador de pulos do personagem

// Função que verifica a colisão entre o personagem e o chão:
function fazColisao(personagem, chao){
  const personagemY = personagem.y + personagem.alturaCanvas;         // Calcula a posição inferior do personagem
  const chaoY = chao.y;                                               // Posição y do chão

  // Verifica se a parte inferior do personagem colidiu com o chão:
  if(personagemY >= chaoY){
    personagem.y = chao.y - personagem.alturaCanvas;                    // Ajusta a posição do personagem para que ele fique em cima do chão
    velocidadeY = 0;                                                    // Reseta a velocidade vertical para evitar que o personagem continue caindo
    noChao = true;                                                      // Define que o personagem está no chão
    pulos = 0;                                                          // Reseta o contador de pulos
  }
}

// PERSONAGEM
// Função que cria o personagem
function criapersonagem(){
  const personagem = {
    spritex : 63,                     // Posição x no sprite (arquivo PNG) que indica onde a imagem do personagem começa
    spritey : 0,                      // Posição y no sprite (arquivo PNG) que indica onde a imagem do personagem começa
    largura : 880,                    // Largura da imagem no sprite (arquivo PNG) 
    altura : 1550,                    // Altura da imagem no sprite (arquivo PNG) 
    x : 10,                           // Posição x no canvas onde o personagem será desenhado
    y : 245,                          // Posição y no canvas onde o personagem será desenhado
    larguraCanvas : 60,               // Largura da imagem do personagem que será desenhada no canvas
    alturaCanvas : 95,                // Altura da imagem do personagem que será desenhada no canvas
    velocidade: 5,                    // Velocidade de movimento do personagem

    // atualiza a posição do personagem
    atualiza() {                      
      // Aplica gravidade
      velocidadeY = velocidadeY + gravidade;             // Aumenta a velocidade vertical pela gravidade
      personagem.y = personagem.y + velocidadeY;          // Atualiza a posição y do personagem

      // Limita para que o personagem não ultrapasse o topo do canvas
      if (personagem.y < 0) {
        personagem.y = 0;                                 // Reseta a posição y para 0 se ultrapassar
        velocidadeY = 0;                                  // Reseta a velocidade vertical
      }

      // Verifica colisão com o chão
      fazColisao(personagem, globais.chao);
    },


    // mover o personagem
    mover() {
      // Se a tecla direita estiver pressionada, move o personagem para a direita
      if (direitaPressionada) {                   
        personagem.x = personagem.x + personagem.velocidade;                      // Atualiza a posição x do personagem

        if (personagem.x + personagem.larguraCanvas > canvas.width) {             // Limita a posição x para que o personagem não saia do canvas          
          personagem.x = canvas.width - personagem.larguraCanvas;                 // Reseta a posição x para o limite direito
        }
      }

      // Se a tecla esquerda estiver pressionada, move o personagem para a esquerda
      if (esquerdaPressionada) {
        personagem.x = personagem.x - personagem.velocidade;                      // Atualiza a posição x do personagem

        if (personagem.x < 0) {                                                   // Limita a posição x para que o personagem não saia do canvas
          personagem.x = 0;                                                       // Reseta a posição x para 0 se ultrapassar o limite esquerdo
        }
      }
    },

    // Array que contém a posição x e y dos sprites para a animação de corrida
    movimentos: [             // corrida
      { spritex: 1712, spritey: 0, }, 
      { spritex: 63, spritey: 0, }, 
      { spritex: 928, spritey: 0, }, 
      { spritex: 1712, spritey: 0, }, 
      { spritex: 3272, spritey: 0, }, 
      { spritex: 4160, spritey: 0, }, 
    ],

    // Array que contém a posição x e y dos sprites para a animação de pulo
    movimentoPulo:[
      { spritex: 0, spritey: 3161 },
      { spritex: 888, spritey: 3161 },
      { spritex: 1672, spritey: 3161 },
      { spritex: 2440, spritey: 3057 },
      { spritex: 3208, spritey: 3161 },
      { spritex: 4008, spritey: 3161 },
    ] ,


    frameAtual: 0,         // Índice do frame atual da animação, usado para determinar qual sprite deve ser exibido
    
    // atualiza o frame atual da animação
    atualizaOFrameAtual() {     
      const intervaloDeFrames = 10;                                 // Define o intervalo de frames para a animação, controlando a velocidade da animação
      const passouOIntervalo = frames % intervaloDeFrames == 0;     // Verifica se o número de frames passados é um múltiplo do intervalo definido (resto da divisão)

      // Se passou o intervalo, atualiza o frame atual
      if(passouOIntervalo) {
        const baseDoIncremento = 1;                                       // Incremento para o frame, define que a cada intervalo, o frame deve avançar
        const incremento = baseDoIncremento + personagem.frameAtual;      // Calcula o novo frame somando o incremento ao frame atual
        const baseRepeticao = personagem.movimentos.length;               // Obtém o número total de frames disponíveis para a animação
        personagem.frameAtual = incremento % baseRepeticao;               // Atualiza o frame atual, reiniciando quando atinge o final da lista de frames
      }
    },

    // desenha o personagem no canvas
    desenha(){

      let spritex, spritey;                                        // Declaração das variáveis que vão armazenar as coordenadas do sprite a ser desenhado

      // Verifica se o personagem não está no chão
      // O operador '!' é usado para inverter o valor booleano de 'noChao'.
      // Se 'noChao' for true (personagem está no ar), '!noChao' será false e o bloco não será executado.
      // Se 'noChao' for false (personagem está no chão), '!noChao' será true e o bloco será executado,
      // permitindo que a animação de pulo seja ativada.

      if (!noChao) {
        // Se o personagem está no ar, usa o sprite de pulo
        personagem.atualizaOFrameAtual();                            // Atualiza o frame atual para a animação de pulo

        // Pega o frame atual do array de animação de pulo
        // 'personagem.movimentoPulo' é um array que contém objetos, cada um representando um frame da animação de pulo.
        // 'personagem.frameAtual' indica qual frame deve ser exibido atualmente.
        // O operador '%' (resto da divisão) é usado para garantir que o índice não ultrapasse o tamanho do array,
        // permitindo que a animação reinicie quando chega ao final. 
        // fazendo com que a animação comece novamente a partir do primeiro frame.

        let frame = personagem.movimentoPulo[personagem.frameAtual % personagem.movimentoPulo.length];

        // Extrai os valores spritex e spritey do frame para as variáveis
        // 'frame' agora contém o objeto correspondente ao frame atual da animação de pulo.
        // As propriedades 'spritex' e 'spritey' desse objeto são extraídas e atribuídas às variáveis 'spritex' e 'spritey',
        // que serão usadas para desenhar o sprite correto no canvas.

        spritex = frame.spritex;
        spritey = frame.spritey;

      } 
      else {
        // Personagem está no chão, usar sprite de corrida
        personagem.atualizaOFrameAtual();                   // Atualiza o frame atual para a animação de corrida

        // Pega o frame atual do array de animação de corrida
        let frame = personagem.movimentos[personagem.frameAtual];

        // Extrai os valores spritex e spritey do frame para as variáveis
        spritex = frame.spritex;
        spritey = frame.spritey;
      }

      // Desenha o sprite do personagem no canvas usando as coordenadas definidas acima
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
    lista: [],                  // Array para armazenar todas as plantas ativas na tela
    largura: 30,
    altura: 30,
    frequencia: 100,
    velocidade: 2,

    // atualiza a posição e cria novas plantas
    atualiza() {
      // Verifica se é hora de criar uma nova planta
      // A condição verifica se o número de frames atual é um múltiplo da frequência definida para a criação de plantas(resto da divisão = a 0)
      if (frames % plantas.frequencia == 0) {
        
        // Decide se a planta será alta ou baixa:
        let tipo;                                         // Variável que armazenará o tipo da planta

        // Gera um número aleatório e decide o tipo da planta com base nesse número
        if (Math.random() < 0.5) {
          tipo = 'baixo';                                   // Se o número aleatório for menor que 0.5, a planta é baixa
        } 
        else {
          tipo = 'alto';                                    // Caso contrário, a planta é alta
        }

        // Define a posição Y da planta com base no seu tipo:
        let posY;                                     // Variável que armazenará a posição Y da nova planta

        if (tipo == 'baixo') {
          // Se a planta for baixa, sua posição Y é definida para o chão
          // altura total da tela (canvas.height) - altura do chão (globais.chao.alturaCanvas) - altura da planta (plantas.altura)
          posY = canvas.height - globais.chao.alturaCanvas - plantas.altura;                        // Calcula a posição Y no chão
        } 
        else {
          // Se a planta for alta, sua posição Y é definida acima do personagem
          // posição Y do personagem (globais.personagem.y) - altura da planta (plantas.altura) - 10 (margem de espaço)
          // A função Math.max(0, ...) garante que a posição Y não seja negativa, retornando 0 se o cálculo resultar em um valor negativo
          posY = Math.max(0, globais.personagem.y - plantas.altura - 10);             // Garante que a planta não fique acima da tela
          
        }

        // Cria um novo objeto planta:
        const novaPlanta = {
          x: canvas.width,                                          // A planta começa fora da tela à direita
          y: posY,                                                  // posição Y definida anteriormente
          tipo: tipo,                                               // O tipo da planta (alto ou baixo)
        };

        // Verifica se a nova planta colide com algum cogumelo:
        let colisao = false;                                        // Inicializa a variável de colisão como falsa

        // Loop que percorre a lista de cogumelos existentes:
        for (let i = 0; i < globais.cogumelo.lista.length; i++) {
          const cogumelo = globais.cogumelo.lista[i];                // Obtém o cogumelo atual da lista

          if (plantaSobreCogumelo(novaPlanta, cogumelo)) {
            colisao = true;
            break;
          }
        }

        // Se não houver colisão, adiciona a nova planta à lista
        if (!colisao) {
          plantas.lista.push(novaPlanta);                         // Adiciona a nova planta à lista de plantas
        }
        //A função pushé usada para adicionar um novo elemento ao final de um array.
        //está adicionando o objeto novaPlanta ao final da lista de plantas, caso não tenha havido colisão com outras plantas já existentes.
      }

      // Move as plantas para a esquerda
      // Loop que percorre cada planta na lista de plantas
      for (let i = 0; i < plantas.lista.length; i++) {
        const planta = plantas.lista[i];                          // Obtém a planta atual da lista

        // Atualiza a posição X da planta
        // Subtrai a velocidade da planta da sua posição X para movê-la para a esquerda
        planta.x =  planta.x - plantas.velocidade; 
      }

      // Remove plantas que saíram da tela
      // Atualiza a lista de plantas para manter apenas as que ainda estão visíveis no canvas
      //A função filter é usada para criar um novo array contendo apenas os elementos que passam em um determinado teste (função de retorno).
      // Verifica se a planta ainda está na tela
      plantas.lista = plantas.lista.filter(planta => {
        
        return planta.x + plantas.largura > 0;                // Se a soma for maior que 0, significa que a planta ainda está visível na tela, Mantém apenas as plantas visíveis
      });
    },

    desenha() {
      // desenha todas as plantas na tela
      // Percorre a lista de plantas usando um loop for
      for (let i = 0; i < plantas.lista.length; i++) {

        const planta = plantas.lista[i];                            // Pega a planta atual na lista usando o índice i

        // Desenha a imagem da planta no canvas

        ctx.drawImage(
          spritePlanta,                                       // Imagem da planta
          0, 55,                                              // Coordenadas da parte da imagem que queremos usar (x e y)
          426, 534,                                           // Largura e altura da parte da imagem na sprite
          planta.x, planta.y,                                 // Posiciona a planta no canvas, coordenadas (x, y)
          plantas.largura, plantas.altura                     // Define o tamanho da planta na tela
        );
      }
    },

    temColisaoCom(personagem) {
      // Percorre cada planta da lista para verificar colisão
      for (let i = 0; i < plantas.lista.length; i++) {
        const planta = plantas.lista[i];

        // Verifica a colisão na direção X (horizontal)
        // personagem.x < planta.x + plantas.largura  -> O lado esquerdo do personagem está antes do lado direito da planta
        // personagem.x + personagem.larguraCanvas > planta.x -> O lado direito do personagem está após o lado esquerdo da planta 
        const colisaoX = personagem.x < planta.x + plantas.largura && personagem.x + personagem.larguraCanvas > planta.x;

        if (planta.tipo == 'baixo') {
          // Para planta do tipo 'baixo', a colisão na vertical é quando a borda inferior do personagem está abaixo da borda superior da planta
          // personagem.y + personagem.alturaCanvas > planta.y

          const colisaoY = personagem.y + personagem.alturaCanvas > planta.y;

          // Se houver colisão em X e Y, retorna true indicando colisão
          if (colisaoX && colisaoY) {
            return true;
          }
        } 
        else {
          // Para planta do tipo 'alto':
          // A borda superior do personagem deve ficar abaixo da borda inferior da planta
          // personagem.y < planta.y + plantas.altura -> topo do personagem está acima da base da planta
          // personagem.y + personagem.alturaCanvas > planta.y -> base do personagem está abaixo do topo da planta
          const colisaoY = personagem.y < planta.y + plantas.altura && personagem.y + personagem.alturaCanvas > planta.y;

          // Retorna true se houver colisão em X e Y
          if (colisaoX && colisaoY) {
            return true;
          }
        }
      }

      // Se não encontrou colisão com nenhuma planta, retorna false
      return false;
    }
  };

  return plantas;
}


// COGUMELO
// Função que cria cogumelo 
function criaCogumelo() {
  const cogumelo = {
    lista: [],          // Array para armazenar todos os cogumelos ativos na tela
    largura: 40,        // Largura do cogumelo em pixels 
    altura: 40,         // Altura do cogumelo em pixels 
    frequencia: 200,    // Quantidade de frames para criar um novo cogumelo (quanto maior, menos cogumelos aparecem)
    velocidade: 2,      // Velocidade em pixels que o cogumelo se move para a esquerda a cada frame
    pontos: 0,          // Contador de cogumelos coletados pelo jogador

    // atualiza a posição dos cogumelos e criar novos:
    atualiza() {
      // Cria um novo cogumelo a cada "frequencia" frames
      // 'frames' é uma variável global que conta o número de frames desde o início do jogo
      if (frames % cogumelo.frequencia == 0) {

        // Calcula a posição vertical (Y) do novo cogumelo para que fique alinhado ao chão
        // posY = altura total da tela - altura do chão - altura do cogumelo
        // Isso coloca o cogumelo "encostado" no chão, sem ultrapassá-lo
        const posY = canvas.height - globais.chao.alturaCanvas - cogumelo.altura;

        // Cria um novo objeto cogumelo com a posição X na largura da tela (lado direito)
        // Isso faz com que o cogumelo apareça entrando pela direita da tela
        const novoCogumelo = {
          x: canvas.width,       // posição X inicial (largura do canvas)
          y: posY,               // posição Y calculada para estar sobre o chão
        };

        //A função .some() é usada para verificar se pelo menos um elemento de um array atende a uma condição (retorna true na função de teste).
        //.some(p => ...): percorre todas as plantas da lista.
        //Para cada planta p, testa se há sobreposição (colisão) entre novoCogumelo e p.
        //Se pelo menos uma colisão for detectada, .some() retorna true.
        //Caso nenhuma planta colida, retorna false.

        // Condições para verificar colisão entre o novo cogumelo e uma planta p:
        // Sobreposição no eixo X:
        // novoCogumelo.x < p.x + largura da planta  -> verifica se a borda esquerda do cogumelo está antes da borda direita da planta
        // novoCogumelo.x + largura do cogumelo > p.x -> verifica se a borda direita do cogumelo está após a borda esquerda da planta
    
        // Sobreposição no eixo Y:
        // novoCogumelo.y < p.y + altura da planta -> verifica se a borda superior do cogumelo está acima da borda inferior da planta
        // novoCogumelo.y + altura do cogumelo > p.y -> verifica se a borda inferior do cogumelo está abaixo da borda superior da planta
        // Se essas 4 condições forem verdadeiras, há sobreposição (colisão)
        const colisaoComPlanta = globais.plantas.lista.some(p => {
          return novoCogumelo.x < p.x + globais.plantas.largura && novoCogumelo.x + cogumelo.largura > p.x && novoCogumelo.y < p.y + globais.plantas.altura && novoCogumelo.y + cogumelo.altura > p.y;
        });

        // Se NÃO houver colisão com nenhuma planta, adiciona o novo cogumelo à lista
        if (!colisaoComPlanta) {
          cogumelo.lista.push(novoCogumelo);
        }
      }

      // Atualiza a posição dos cogumelos existentes e remove os que saíram da tela
      // Usa o método .filter() para filtrar os cogumelos visíveis
      // Aqui, 'c' representa cada cogumelo da lista cogumelo.lista
      // Essa variável é um parâmetro local da função passada para .filter()
      // Ela recebe um a um os elementos do array para decidir se permanece na lista
      // Move o cogumelo para a esquerda subtraindo sua velocidade da coordenada X
      // Retorna true para manter o cogumelo na lista se ele ainda estiver visível
      // Condição: a posição X da planta + sua largura deve ser maior que zero
      // Se for <= 0, significa que o cogumelo saiu totalmente da tela (à esquerda) e pode ser removido
      cogumelo.lista = cogumelo.lista.filter(c => {
        c.x =  c.x - cogumelo.velocidade;
        return c.x + cogumelo.largura > 0;
      });
    },

    // desenha todos os cogumelos no canvas:
    desenha() {
      // Para cada cogumelo na lista, desenha a imagem na posição (x, y) com a largura e altura definidas
      cogumelo.lista.forEach(c => {
        ctx.drawImage(
          spriteCogumelo,                     // Imagem do cogumelo
          198, 195,                           // Coordenadas na imagem original
          1248, 1407,                         // Largura e altura da imagem
          c.x, c.y,                           // Posição onde será desenhado no canvas (x, y)
          cogumelo.largura, cogumelo.altura   // Tamanho da imagem no canvas
        );
      });
    },

    // verifica se o personagem coletou algum cogumelo enquanto ataca:
    verificaColeta(personagem, atacando) {
      // Filtra a lista de cogumelos para remover os que foram coletados
      cogumelo.lista = cogumelo.lista.filter(c => {
        // Verifica colisão no eixo X entre personagem e cogumelo:
        // personagem.x < c.x + largura do cogumelo -> borda esquerda do personagem antes da borda direita do cogumelo
        // personagem.x + largura do personagem > c.x -> borda direita do personagem depois da borda esquerda do cogumelo
        const colisaoX = personagem.x < c.x + cogumelo.largura && personagem.x + personagem.larguraCanvas > c.x;

        // Verifica colisão no eixo Y entre personagem e cogumelo:
        // personagem.y < c.y + altura do cogumelo -> borda superior do personagem antes da borda inferior do cogumelo
        // personagem.y + altura do personagem > c.y -> borda inferior do personagem depois da borda superior do cogumelo
        const colisaoY = personagem.y < c.y + cogumelo.altura &&  personagem.y + personagem.alturaCanvas > c.y;

        // Se houve colisão nos dois eixos E o personagem está atacando
        if (colisaoX && colisaoY && atacando) {
          cogumelo.pontos++;                  // Incrementa o contador de cogumelos coletados
          return false;                       // Remove o cogumelo da lista 
        }
        else{
          return true;                         // Mantém o cogumelo na lista (não coletado) 
        }
      });
    }

  };

  return cogumelo;
}

// Função que verifica se uma planta está sobre um cogumelo (ou vice-versa):
function plantaSobreCogumelo(planta, cogumelo) {
  // Verifica se há sobreposição no eixo X (horizontal)
  // Condição: a borda esquerda da planta está antes da borda direita do cogumelo E a borda direita da planta está depois da borda esquerda do cogumelo
  const overlapX = planta.x < cogumelo.x + globais.cogumelo.largura && planta.x + globais.plantas.largura > cogumelo.x;

  // Verifica se há sobreposição no eixo Y (vertical)
  // Condição: a parte de cima da planta está acima da parte de baixo do cogumelo E a parte de baixo da planta está abaixo da parte de cima do cogumelo
  const overlapY = planta.y < cogumelo.y + globais.cogumelo.altura && planta.y + globais.plantas.altura > cogumelo.y;

  // Retorna true se houver sobreposição nos dois eixos, ou seja, colisão
  return overlapX && overlapY;
}


// Variável que indica se o personagem está atacando ou não
let atacando = false;

// Evento que escuta quando uma tecla do teclado é pressionada
document.addEventListener('keydown', function(evento) {
  let tecla = evento.key;               // Pega a tecla pressionada 

  // Se a tecla for a seta para a direita, deixa a variável direitaPressionada como true
  if (tecla == 'ArrowRight') direitaPressionada = true;

  // Se a tecla for a seta para a esquerda, deixa a variável esquerdaPressionada como true
  if (tecla == 'ArrowLeft') esquerdaPressionada = true;

  // Se a tecla for espaço (' ') OU seta para cima ('ArrowUp'), E o número de pulos for menor que 2 (permite pular até duas vezes, pulo duplo)
  if ((tecla == ' ' || tecla == 'ArrowUp') && pulos < 2) {
    velocidadeY = -12;                  // Aplica velocidade vertical negativa para simular o pulo para cima
    pulos++;                            // Incrementa o número de pulos realizados
    noChao = false;                     // Indica que o personagem não está mais no chão (ele está no ar)
  }

  // Se a tecla pressionada for 'z' (maiúsculas/minúsculas)
  if (tecla.toLowerCase() == 'z') {
    atacando = true;                    // Ativa o estado de ataque
  }
});

// Evento que escuta quando uma tecla do teclado é solta
document.addEventListener('keyup', function(evento) {
  const tecla = evento.key;

  // Se a tecla solta for seta para a direita, desativa o movimento para direita
  if (tecla == 'ArrowRight') direitaPressionada = false;

  // Se a tecla solta for seta para a esquerda, desativa o movimento para esquerda
  if (tecla == 'ArrowLeft') esquerdaPressionada = false;

  // Se a tecla solta for 'z', desativa o estado de ataque
  if (tecla.toLowerCase() == 'z') {
    atacando = false;
  }
});

// Função para iniciar o jogo, muda a tela atual para a tela de jogo
function InicioJogo() {
  mudaDeTela(telas.jogo);
}

// Objeto para armazenar variáveis globais, compartilhadas entre as telas
const globais = {};

// Variável que mantém a tela ativa (início, jogo, game over)
let telaAtiva = {};

// Função para mudar a tela ativa para uma nova tela recebida por parâmetro
function mudaDeTela(novaTela){
  telaAtiva =  novaTela;                        // Define a nova tela como a ativa

  // Se a nova tela tiver uma função de inicialização, executa ela
  if(telaAtiva.inicializa){
    telaAtiva.inicializa();
  }
}

// Objeto que agrupa as diferentes telas do jogo
const telas = {};

// Tela inicial do jogo:
telas.inicio = {
  inicializa(){
    // Cria o plano de fundo e o chão do jogo e armazena nas variáveis globais
    globais.planoDeFundo = criaFundo();
    globais.chao = criaChao();
  },
  desenha(){
    // Desenha o plano de fundo e o chão na tela
    globais.planoDeFundo.desenha();
    globais.chao.desenha();

    // Configura o estilo do texto a ser desenhado na tela
    ctx.fillStyle = 'white';                        // Cor do texto branco
    ctx.font = '30px Arial';                        // Fonte Arial, tamanho 30px
    ctx.textAlign = 'center';                       // Centraliza o texto no eixo X

    // Escreve o texto no centro da tela
    ctx.fillText('Clique no botão para iniciar o jogo!', canvas.width / 2, canvas.height / 2);
  },

  atualiza(){
    // Atualiza o plano de fundo e o chão para animar ou ajustar sua posição
    globais.planoDeFundo.atualiza();
    globais.chao.atualiza();
  },
};

// Tela principal do jogo:
telas.jogo = {
  inicializa(){
    // Cria os objetos necessários para o jogo e armazena nas variáveis globais
    globais.planoDeFundo = criaFundo();
    globais.chao = criaChao();
    globais.personagem = criapersonagem();
    globais.plantas = criaPlantas();
    globais.cogumelo = criaCogumelo(); 
  },
  desenha(){
    // Desenha todos os elementos do jogo na ordem correta
    globais.planoDeFundo.desenha();
    globais.chao.desenha();
    globais.personagem.desenha();
    globais.plantas.desenha();
    globais.cogumelo.desenha();

    // Exibe o placar de cogumelos coletados no canto superior esquerdo
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Cogumelos coletados: ${globais.cogumelo.pontos}`, 10, 30);      // Desenha o texto na tela com o número de cogumelos coletados. Na Posição (10, 30): 10px da borda esquerda, 30px do topo
  },

  atualiza(){
    // Atualiza a animação e lógica de todos os elementos
    globais.planoDeFundo.atualiza();
    globais.chao.atualiza();
    globais.personagem.mover();                                       // Move o personagem (com base no teclado)
    globais.personagem.atualiza();                                    // Atualiza estado do personagem (ex: gravidade, colisões)
    globais.plantas.atualiza();                                       // Atualiza as plantas 
    globais.cogumelo.atualiza();                                      // Atualiza os cogumelos

    // Verifica se o personagem coletou algum cogumelo
    globais.cogumelo.verificaColeta(globais.personagem, atacando);

    // Verifica colisão do personagem com plantas (obstáculos)
    if (globais.plantas.temColisaoCom(globais.personagem)) {
      mudaDeTela(telas.gameOver);                                      // Se colidir, muda para tela de game over
    }
  },
};

// Tela de game over
telas.gameOver = {
  desenha() {
    // Preenche a tela toda com uma cor sólida
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);      // Desenha um retângulo preenchido que cobre toda a área do canvas. Começa no canto superior esquerdo (0,0) e vai até a largura e altura totais do canvas

    // Exibe o texto "Game Over" centralizado e em negrito, tamanho 48px
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);

    // Texto menor instruindo o jogador a pressionar ENTER para reiniciar
    ctx.font = '20px Arial';
    ctx.fillText('Pressione ENTER para reiniciar', canvas.width / 2, canvas.height / 2 + 30);

    // Mostra a pontuação final de cogumelos coletados na última partida
    // o valor de globais.cogumelo.pontos será convertido para texto e colocado no lugar do ${...}
    ctx.fillText(`Cogumelos coletados: ${globais.cogumelo.pontos}`, canvas.width / 2, canvas.height / 2 + 70);
  },

  atualiza() {},  // Tela de game over 

  inicializa() {
    // Função que escuta o pressionar da tecla ENTER para reiniciar o jogo
    function reiniciaListener(event) {
      if (event.key == 'Enter') {
        mudaDeTela(telas.jogo);                                               // Volta para a tela do jogo
        document.removeEventListener('keydown', reiniciaListener);            // Remove o listener para evitar múltiplos reinícios
      }
    }
    document.addEventListener('keydown', reiniciaListener);
  }
};

// Loop principal do jogo, roda a cada frame
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);                         // Limpa a tela para desenhar tudo novamente
  telaAtiva.desenha();                                                      // Desenha a tela atual (início, jogo, game over)
  telaAtiva.atualiza();                                                     // Atualiza a lógica da tela atual

  frames = frames + 1;                                                      // Incrementa o contador de frames (tempo do jogo)
  requestAnimationFrame(loop);                                              // Pede para o navegador rodar o loop na próxima atualização da tela 
}

// Inicia o jogo definindo a tela inicial e chamando o loop
mudaDeTela(telas.inicio);
loop();
