const createWall = (x, y, width = 200, height = 10) => {
  return { x, y, width, height };
};

const createPoopWalls = (x, y, wallsHeight, width = 200, height = 10) => {
  const poopLayer = createWall(x, y, width, height);
  const poopWalls = [
    createWall(x - 10, y, 10, wallsHeight),
    poopLayer,
    createWall(x + width, y, 10, wallsHeight),
  ];
  return [poopWalls, poopLayer];
};

/* const walls = Array(0)
  .fill(null)
  .map((_, i) => createWall((i + 1) * 90, (i + 1) * 70))
  .concat(poopWalls); */

const [poopWalls, poopLayer] = createPoopWalls();
const walls = [createWall(300, 50), createWall(520, 50)].concat(poopWalls);
let levels = [{ walls, poopLayer }];
