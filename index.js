import { Levels } from './level.js';

let niveau = 0;

//vérifie qu'il y a au moins une boîte dans le niveau
function hasBox(grid) {
  return grid.flat().includes(2) || grid.flat().includes(5);
}

//initialise la grille du niveau courant
let grid = JSON.parse(JSON.stringify(Levels[niveau]));
if (!hasBox(grid)) {
  alert("Ce niveau ne contient aucune boîte !");
  throw new Error("Niveau invalide : aucune boîte présente.");
}

gridToMap(grid);

//copie profonde de la grille
function deepCopyGrid(level) {
  return JSON.parse(JSON.stringify(level));
}

//montre la grille sous forme de divs HTML
function gridToMap(level) {
  const existingDiv = document.querySelector('.divall');
  if (existingDiv) existingDiv.remove();

  let divall = document.createElement("div");
  divall.classList.add("divall");
  divall.style.display = "grid";
  divall.style.gridTemplateColumns = `repeat(${level[0].length}, 40px)`;
  divall.style.gridTemplateRows = `repeat(${level.length}, 40px)`;

  //parcourt la grille pour créé un div correspondant
  level.forEach(row => {
    row.forEach(cell => {
      let squarediv = document.createElement("div");
      squaresAttributions(cell, squarediv);
      divall.appendChild(squarediv);
    });
  });

  document.body.appendChild(divall);
}

//attribue le style et l'image à chaque case selon son type
function squaresAttributions(index, squarediv) {
  squarediv.style.width = "40px";
  squarediv.style.height = "40px";
  squarediv.style.backgroundSize = "contain";
  squarediv.style.backgroundRepeat = "no-repeat";
  squarediv.style.backgroundPosition = "center";

  switch (index) {
    case 0: //vide
      //squarediv.style.backgroundImage = "url(../img/empty.png)";
      break;
    case 1: //mur
      squarediv.style.backgroundImage = "url(../images/mur3.jpg)";
      squarediv.style.border = '1px solid black';
      break;
    case 2: //box
      squarediv.style.backgroundImage = "url(../images/caisse_en_bois.png)";
      squarediv.style.border = '1px solid black';
      break;
    case 3: //personnage
      squarediv.style.backgroundImage = "url(../images/personnage/personnage_stop.png)";
      break;
    case 4: //objectif
      squarediv.style.backgroundImage = "url(../images/objectif.png)";
      squarediv.style.border = '1px solid black';
      break;
    case 5: //objectif atteint
      squarediv.style.backgroundImage = "url(../images/caisse_en_bois.png)";
      squarediv.style.border = '1px solid black';
      squarediv.style.backgroundColor = 'lightgreen'; //boîte bien placée
      break;
  }
}

//trouve la position du joueur dans la grille
function startingPos(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 3) return [i, j];
    }
  }
  return [-1, -1];
}

//vérifie si toutes les objectif sont couverts par des boîtes
function detectWin(grid, levelIndex) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (Levels[levelIndex][i][j] === 4 && grid[i][j] !== 5) {
        return false;
      }
    }
  }
  return true;
}

//maj de la grille après un déplacement
function updateGrid(grid, fromY, fromX, toY, toX, isBoxMove, boxToY, boxToX) {
  const val = grid[fromY][fromX];
  grid[fromY][fromX] = Levels[niveau][fromY][fromX] === 4 ? 4 : 0;
  grid[toY][toX] = val;
  if (isBoxMove) {
    grid[boxToY][boxToX] = Levels[niveau][boxToY][boxToX] === 4 ? 5 : 2;
  }
}

//reset le niveau courant
function resetLevel() {
  grid = deepCopyGrid(Levels[niveau]);
  gridToMap(grid);
}

//boucle de jeu (peut servir pour des animations futures)
function gameLoop() {
  requestAnimationFrame(gameLoop);
}
gameLoop();

//gestion des déplacements clavier
document.addEventListener('keydown', (event) => {
  const [y, x] = startingPos(grid);
  let dy = 0, dx = 0;
  let moved = false;

  //direction du déplacement
  if (event.code === 'ArrowUp') dy = -1;
  else if (event.code === 'ArrowDown') dy = 1;
  else if (event.code === 'ArrowLeft') dx = -1;
  else if (event.code === 'ArrowRight') dx = 1;
  else return;

  const ny = y + dy, nx = x + dx;
  const nny = y + 2 * dy, nnx = x + 2 * dx;

  if (grid[ny][nx] === 0 || grid[ny][nx] === 4) {
    updateGrid(grid, y, x, ny, nx, false);
    moved = true;
  } else if ((grid[ny][nx] === 2 || grid[ny][nx] === 5) && (grid[nny][nnx] === 0 || grid[nny][nnx] === 4)) {
    updateGrid(grid, y, x, ny, nx, true, nny, nnx);
    moved = true;
  }

  if (moved) {
    if (detectWin(grid, niveau)) {
      alert("Niveau complété !");
      niveau++;
      if (Levels[niveau]) {
        grid = deepCopyGrid(Levels[niveau]);
        if (!hasBox(grid)) {
          alert("Ce niveau ne contient aucune boîte !");
          throw new Error("Niveau invalide : aucune boîte présente.");
        }
      } else {
        alert("Félicitations, vous avez terminé tous les niveaux !");
        niveau = 0;
        grid = deepCopyGrid(Levels[niveau]);
      }
    }
    gridToMap(grid);
  }
});

//gestion bouton
document.getElementById("reset").addEventListener("click", resetLevel);
