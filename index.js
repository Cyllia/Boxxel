import { Levels } from './level.js';

const GRID_WIDTH = 50;
const GRID_HEIGHT = 25;
const fps = 10;

const keys = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down'
};

let currentLevel = 0;
let level = [];
let canvas, ctx;
let player = { x: 0, y: 0 };

function loadLevel() {
  level = Levels[currentLevel].map(row => [...row]);

  // Trouver la position du joueur (2)
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      if (level[y][x] === 2) {
        player.x = x;
        player.y = y;
      }
    }
  }
}

function init() {
  const gameboard = document.getElementById("gameboard");

  // Créer le canvas dynamiquement
  canvas = document.createElement("canvas");
  canvas.width = GRID_WIDTH * Levels[0][0].length;
  canvas.height = GRID_HEIGHT * Levels[0].length;
  gameboard.appendChild(canvas);

  ctx = canvas.getContext("2d");

  loadLevel();
  window.addEventListener('keydown', handleKey);
  draw();
}


function drawTile(type, x, y) {
  switch (type) {
    case 1: // mur
      ctx.fillStyle = "black";
      break;
    case 0: // sol
      ctx.fillStyle = "white";
      break;
    case 3: // caisse
      ctx.fillStyle = "brown";
      break;
    case 4: // objectif
      ctx.fillStyle = "yellow";
      break;
    case 2: // joueur
      ctx.fillStyle = "blue";
      break;
    default:
      ctx.fillStyle = "grey";
  }

  ctx.fillRect(x * GRID_WIDTH, y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
}

function handleKey(e) {
  const dir = keys[e.keyCode];
  if (!dir) return;

  let dx = 0, dy = 0;
  if (dir === 'left') dx = -1;
  if (dir === 'right') dx = 1;
  if (dir === 'up') dy = -1;
  if (dir === 'down') dy = 1;

  const nx = player.x + dx;
  const ny = player.y + dy;

  if (level[ny][nx] === 0 || level[ny][nx] === 4) {
    player.x = nx;
    player.y = ny;
  }
}

window.onload = init;

console.log("Script chargé !");

const gameboard = document.getElementById("gameboard");

const createCell = (x, y) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.gridColumnStart = x + 1;
    cell.style.gridRowStart = y + 1;
    return cell;
};

const drawTestGrid = () => {
    gameboard.innerHTML = "";
    gameboard.style.display = "grid";
    gameboard.style.gridTemplateColumns = `repeat(${GRID_WIDTH}, 20px)`;
    gameboard.style.gridTemplateRows = `repeat(${GRID_HEIGHT}, 20px)`;

    const testCell = createCell(2, 2); // Exemple : une seule case en haut à gauche
    testCell.style.backgroundColor = "red";
    gameboard.appendChild(testCell);
};

drawTestGrid();
