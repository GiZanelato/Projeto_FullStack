const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

// Personagem
const player = {
  x: 50,
  y: 300,
  width: 40,
  height: 60,
  color: 'red',
  dx: 0,
  dy: 0,
  gravity: 0.8,
  jumpForce: -12,
  grounded: false
};

let isPlaying = false;
let keys = {};

function drawBackground() {
  const fundo = new Image();
  fundo.src = 'fundo.jpg';
  fundo.onload = () => {
    ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);
  };
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function update() {
  // física básica
  player.dy += player.gravity;
  player.y += player.dy;

  // controle de movimento
  if (keys['ArrowLeft']) player.x -= 5;
  if (keys['ArrowRight']) player.x += 5;

  // chão
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // Limites laterais
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function loop() {
  if (!isPlaying) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  update();
  drawPlayer();

  requestAnimationFrame(loop);
}

function startGame() {
  isPlaying = true;
  loop();
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === ' ' && player.grounded) {
    player.dy = player.jumpForce;
    player.grounded = false;
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

startButton.addEventListener('click', startGame);
