const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let player = { x: 50, y: 300, width: 50, height: 50, vy: 0, grounded: true, doubleJump: false };
let gravity = 1.2;
let score = 0;
let obstacles = [];
let speed = 5;
let gameOver = false;

const scoreBoard = document.getElementById('scoreBoard');
const banner = document.getElementById('banner');

function drawPlayer() {
  ctx.fillStyle = '#00ffff';
  ctx.beginPath();
  ctx.arc(player.x + 25, player.y + 25, 25, 0, Math.PI * 2);
  ctx.fill();
}

function spawnObstacle() {
  const height = 30 + Math.random() * 40;
  obstacles.push({ x: canvas.width, y: 400 - height, width: 30, height: height });
}

function drawObstacles() {
  ctx.fillStyle = '#0f0';
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });
}

function update() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.vy += gravity;
  player.y += player.vy;

  if (player.y > 300) {
    player.y = 300;
    player.vy = 0;
    player.grounded = true;
    player.doubleJump = false;
  }

  obstacles.forEach(o => {
    o.x -= speed;
    if (o.x + o.width < 0) {
      obstacles.splice(obstacles.indexOf(o), 1);
      score++;
      scoreBoard.innerText = "Score: " + score;
      checkMilestones();
    }

    if (player.x < o.x + o.width &&
        player.x + player.width > o.x &&
        player.y < o.y + o.height &&
        player.y + player.height > o.y) {
      banner.style.display = "block";
      banner.innerText = "GAME OVER ⚡";
      gameOver = true;
    }
  });

  drawPlayer();
  drawObstacles();
  requestAnimationFrame(update);
}

function checkMilestones() {
  if (score === 10) showBanner("Deshi");
  else if (score === 25) showBanner("Shugo");
  else if (score === 55) showBanner("Senshi");
  else if (score === 100) showBanner("Shihan");
}

function showBanner(text) {
  banner.innerText = text;
  banner.style.display = "block";
  setTimeout(() => banner.style.display = "none", 2000);
}

function jump() {
  if (player.grounded) {
    player.vy = -20;
    player.grounded = false;
  } else if (!player.doubleJump) {
    player.vy = -15;
    player.doubleJump = true;
  }
}

function slide() {
  player.height = 30;
  setTimeout(() => player.height = 50, 700);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jump();
  if (e.code === 'ArrowDown') slide();
});

setInterval(spawnObstacle, 1500);
update();
