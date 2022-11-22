export const $ = (query, el = document) => el.querySelector(query);
export const canvas = $(".juego");
export const wombatH = 48;
export const wombatW = 78;
export const GRAV = -2;
export const MAX_VEL = -20;
export const FRICTION = -0.05;
export const SPEED_FACTOR = 1.5;
export const JUMP_TIMER = 30;
/**
 * @type {CanvasRenderingContext2D}
 */
export const ctx = canvas.getContext("2d");
export let sprite;
export let paracaidas;

const loadParacaidas = () => {
  const img = document.createElement("img");
  img.src = "./paracaidas-removebg-preview.png";
  img.addEventListener("load", () => (paracaidas = img));
};

const loadSprite = () => {
  const img = document.createElement("img");
  img.src = "./sprite-removebg-preview.png";
  img.addEventListener("load", () => (sprite = img));
};

const loadPaisaje = () => {
  const paiCanvas = $(".paisaje");
  paiCanvas.width = $("body").clientWidth;
  paiCanvas.height = $("body").clientHeight;
  const paiCtx = paiCanvas.getContext("2d");
  const img = document.createElement("img");
  img.src = "./paisaje.jfif";
  img.addEventListener("load", () => {
    const ratio = img.width / img.height;
    if (canvas.height > canvas.width / ratio)
      paiCtx.drawImage(img, 0, 0, canvas.height * ratio, canvas.height * ratio);
    else paiCtx.drawImage(img, 0, 0, canvas.width, canvas.width / ratio);
  });
};

loadSprite();
loadParacaidas();

export const getStep = (step) => {
  if (!sprite) return document.createElement("img");
  const tempCanvas = document.createElement("canvas");
  (tempCanvas.width = wombatW), (tempCanvas.height = wombatH);
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(
    sprite,
    (step % 2) * 100,
    Math.floor(step / 3) * 70 + 10,
    tempCanvas.width + 20,
    tempCanvas.height + 30,
    -11,
    -20,
    tempCanvas.width + 20,
    tempCanvas.height + 30
  );
  return tempCanvas;
};

export let maxWidth = canvas.width;
export let viewPortWidth = canvas.width;
const resize = () => {
  canvas.width = $("body").clientWidth;
  canvas.height = $("body").clientHeight;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  viewPortWidth = Math.max(maxWidth, canvas.width);
  loadPaisaje();
};
addEventListener("resize", resize);
resize();

export const setMaxWidth = (val) => (
  (maxWidth = val), (viewPortWidth = Math.max(maxWidth, canvas.width))
);
