// ====== ASSETS ======
let introImg, gameImg, winImg, failImg;
let playerImg, studImg, bugImg;

// ====== STATE ======
const INTRO = "INTRO", PLAY = "PLAY", WIN = "WIN", FAIL = "FAIL";
let state = INTRO;

// ====== GAME VALUES ======
let score = 0, target = 10;
let lives = 3, maxLives = 3;

let timeLeft = 30;
let lastSecond = 0;

// ====== ENTITIES ======
let items = []; // { type:'STUD'|'BUG', x,y, size, speed }
let px = 150, py = 600;
let pw = 220, ph = 140;
let speed = 6;

function preload() {
  // BACKGROUNDS
  introImg = loadImage("intro screen.jpg");
  gameImg  = loadImage("game screen.jpg");
  winImg   = loadImage("end screen.jpg");
  failImg  = loadImage("fail screen.jpg");

  // SPRITES
  playerImg = loadImage("sunglass.png");
  studImg   = loadImage("sun.png");
  bugImg    = loadImage("enemies.png");
}

function setup() {
  createCanvas(800, 800);
  resetGame();
}

function resetGame() {
  score = 0;
  lives = maxLives;

  timeLeft = 30;
  lastSecond = millis();

  items = [];
  px = 150;
  py = 600;
}

function draw() {
  if (state === INTRO) return image(introImg, 0, 0, width, height);
  if (state === WIN)   return image(winImg,   0, 0, width, height);
  if (state === FAIL)  return image(failImg,  0, 0, width, height);

  // PLAY
  image(gameImg, 0, 0, width, height);

  updateTimer();
  movePlayer();

  spawnItems();
  updateItems();
  checkCollisions();

  drawPlayer();
  drawHUD();

  if (score >= target) state = WIN;
  if (lives <= 0 || timeLeft <= 0) state = FAIL;
}

// ====== ENTER: START / RESTART ======
function keyPressed() {
  if (keyCode === ENTER && (state === INTRO || state === WIN || state === FAIL)) {
    resetGame();
    state = PLAY;
  }
}

// ====== TIMER ======
function updateTimer() {
  if (millis() - lastSecond >= 1000) {
    timeLeft--;
    lastSecond = millis();
  }
}

// ====== PLAYER ======
function movePlayer() {
  if (keyIsDown(LEFT_ARROW))  px -= speed;
  if (keyIsDown(RIGHT_ARROW)) px += speed;
  if (keyIsDown(UP_ARROW))    py -= speed;
  if (keyIsDown(DOWN_ARROW))  py += speed;

  px = constrain(px, pw / 2 + 10, width - pw / 2 - 10);
  py = constrain(py, 170 + ph / 2, height - ph / 2 - 20);
}

function drawPlayer() {
  imageMode(CENTER);
  image(playerImg, px, py, pw, ph);
  imageMode(CORNER);
}

// ====== ITEMS ======
function spawnItems() {
  if (frameCount % 30 === 0) items.push(makeItem("STUD"));
  if (frameCount % 45 === 0) items.push(makeItem("BUG"));
}

function makeItem(type) {
  return {
    type,
    x: random(40, width - 40),
    y: random(-200, -30),
    size: 60,
    speed: type === "STUD" ? random(3, 5) : random(4, 6)
  };
}

function updateItems() {
  imageMode(CENTER);

  for (const it of items) {
    it.y += it.speed;
    image(it.type === "STUD" ? studImg : bugImg, it.x, it.y, it.size, it.size);
  }

  imageMode(CORNER);
  items = items.filter(it => it.y < height + 80);
}

function checkCollisions() {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (dist(px, py, it.x, it.y) < 70) {
      if (it.type === "STUD") score++;
      else lives--;
      items.splice(i, 1);
    }
  }
}

// ====== HUD ======
function drawHUD() {
  fill(255);
  textSize(28);

  textAlign(LEFT, CENTER);
  text(`Shine: ${score}/${target}`, 80, 75);

  textAlign(CENTER, CENTER);
  text(`Time: ${timeLeft}s`, width / 2, 75);

  textAlign(RIGHT, CENTER);
  text("Lives:", width - 200, 75);

  for (let i = 0; i < maxLives; i++) {
    fill(i < lives ? color(220, 40, 40) : 70);
    rect(width - 170 + i * 35, 60, 22, 22, 4);
  }
}

/*
NOT:
Bu projede bazı kısımlarda Aidan ve LMS’teki kodlardan yararlandım.
*/