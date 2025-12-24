const board = document.querySelector(".board");

const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const startBtn = document.querySelector(".btn-start");
const gameOver = document.querySelector(".game-over");
const restartBtn = document.querySelector(".btn-restart");

const scoreElement = document.querySelector(".new-score");
const highScoreElement = document.querySelector(".high-score");
const timeElement = document.querySelector(".timer");

const blockHeight = 30;
const blockWidth = 30;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let time = "00-00";

const blocks = [];
let snake = [
  {
    x: 2,
    y: 4,
  },
];
let direction = "right";
let intervelId = null;
let timeIntervelId = null;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervelId);
    modal.style.display = "flex";
    startGame.style.display = "none";
    gameOver.style.display = "flex";
    return;
  }

  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);
    score += 5;
    scoreElement.innerText = score;
    if (score > highScore) {
      highScoreElement.innerText = score;
      localStorage.setItem("highScore", score.toString());
    }
  }

  snake.forEach((data) => {
    blocks[`${data.x}-${data.y}`].classList.remove("snakefill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((data) => {
    blocks[`${data.x}-${data.y}`].classList.add("snakefill");
  });
}


startBtn.addEventListener("click", () => {
  modal.style.display = "none";
  intervelId = setInterval(() => {
    render();
  }, 200);

  timeIntervelId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${String(min).padStart(2,"0")}-${String(sec).padStart(2,"0")}`;
    timeElement.innerText = time;
  }, 1000);
});

restartBtn.addEventListener("click", restartGame);

function restartGame() {
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((data) => {
    blocks[`${data.x}-${data.y}`].classList.remove("snakefill");
  });
  direction = "right";

  score = 0;
  time = "00-00";

  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  modal.style.display = "none";
  snake = [{ x: 2, y: 4 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  intervelId = setInterval(() => {
    render();
  }, 200);
}

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    direction = "up";
  } else if (event.key == "ArrowDown") {
    direction = "down";
  } else if (event.key == "ArrowLeft") {
    direction = "left";
  } else if (event.key == "ArrowRight") {
    direction = "right";
  }
});


/////mobile ////
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;

  handleSwipe();
});

function handleSwipe() {
  let diffX = touchEndX - touchStartX;
  let diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // LEFT or RIGHT
    if (diffX > 0) {
      direction = "right";
    } else {
      direction = "left";
    }
  } else {
    // UP or DOWN
    if (diffY > 0) {
      direction = "down";
    } else {
      direction = "up";
    }
  }
}


