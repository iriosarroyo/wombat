import { isPressedCtrl, isPressedShift, keysPressed } from "./keycontrol.js";
import { levels } from "./levels.js";
import { canvas, ctx, setMaxWidth } from "./tools.js";
import { Wombat } from "./Wombat.js";

let wombat;
const createWall = (x, y, width = 200, height = 10, isIce = false) => {
  return { x, y, width, height, isIce };
};

const createPoopWalls = (x, y, wallsHeight = 120, width = 200, height = 10) => {
  const poopLayer = createWall(x, y, width, height);
  const poopWalls = [
    createWall(x - 10, y, 10, wallsHeight),
    poopLayer,
    createWall(x + width, y, 10, wallsHeight),
  ];
  return [poopWalls, poopLayer];
};

const [poopWalls, poopLayer] = createPoopWalls(1170, 70);
const walls = Array(6)
  .fill(null)
  .map((_, i) => createWall((i + 1) * 150, (i + 1) * 200, 10, 10, true))
  .concat([
    //createWall(1000, 600, 200, 10, true)
    //createWall(150, 0, 10, 100),
    /* createWall(670, 350),
    createWall(680, 120),
    createWall(460, 120),
    createWall(560, 280, 10, 70),
    createWall(470, 210, 10, 70),
    createWall(380, 140, 10, 70),
    createWall(290, 70, 10, 70),
    createWall(760, 120, 10, 230), */
  ])
  .concat(poopWalls);

//const walls = [createWall(300, 50), createWall(520, 50)].concat(poopWalls);
//let levels = [{ walls, poopLayer }];
//console.log(levels)
let level = -1,
  animation,
  lastImage,
  firstAnimation = true;
const nextLevel = () => {
  level = (level + 1) % levels.length;
  lastImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  animation = 10 ?? 180;
  const { walls } = levels[level];
  const rights = walls.map((wall) => wall.x + wall.width);
  setMaxWidth(Math.max(...rights));
  wombat = new Wombat(0);
};
nextLevel();

const goToLevel = (n) =>{
  if(n  >= levels.length) return;
  level = n - 1
  nextLevel();
}

const showAnimation = () => {
  ctx.font = "32pt serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.putImageData(lastImage, 0, 0);
  if (firstAnimation) {
    ctx.fillText(
      "Consigue que el wombat se haga caca en su caja",
      canvas.width / 2,
      canvas.height / 2
    );
  } else {
    ctx.fillText("¡Enhorabuena!", canvas.width / 2, canvas.height / 2);
  }
  ctx.font = "24pt serif";
  ctx.textBaseline = "top";
  ctx.fillText(`Nivel ${level + 1}`, canvas.width / 2, canvas.height / 2);
  animation--;
  if (!animation && firstAnimation) firstAnimation = false;
};

const draw = () => {
  requestAnimationFrame(draw);
  
  levels.forEach((_,i) => {if(isPressedCtrl() && isPressedShift() && keysPressed[`Digit${i + 1}`]) goToLevel(i)})
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  if (animation) return showAnimation();
  ctx.font = "32pt serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`Nivel ${level + 1}`, 5, 32);
  const { walls, poopLayer } = levels[level];
  for (let wall of walls) {
    if (wall.isIce) ctx.fillStyle = "blue";
    else ctx.fillStyle = "white";
    const y = canvas.height - wall.height - wall.y;
    ctx.fillRect(wall.x, y, wall.width, wall.height);
  }
  ctx.fillStyle = "red";
  const y = canvas.height - poopLayer.height - poopLayer.y;
  ctx.fillRect(poopLayer.x, y, poopLayer.width, poopLayer.height);
  if (wombat.update(walls, poopLayer)) {
    wombat.show();
    return nextLevel();
  }
  wombat.show();
};
draw();
