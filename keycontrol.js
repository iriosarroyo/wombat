export const keysPressed = {};

addEventListener("keydown", (e) => {
  keysPressed[e.code] = true;
});

addEventListener("keyup", (e) => {
  keysPressed[e.code] = false;
});

addEventListener("blur", () => {
  Object.keys(keysPressed).forEach((x) => (keysPressed[x] = false));
});

export const isPressedUp = () => {
  return keysPressed["Space"] || keysPressed["KeyW"] || keysPressed["ArrowUp"];
};

export const isPressedRight = () => {
  return keysPressed["KeyD"] || keysPressed["ArrowRight"];
};

export const isPressedLeft = () => {
  return keysPressed["KeyA"] || keysPressed["ArrowLeft"];
};

export const isPressedPoop = () => {
  return keysPressed["KeyC"] || keysPressed["KeyS"] || keysPressed["ArrowDown"];
};

export const isPressedBox = () => {
  return keysPressed["KeyZ"];
};
export const isPressedCtrl = () => {
  return keysPressed["ControlLeft"] || keysPressed["ControlRight"];
};
export const isPressedShift = () => {
  return keysPressed["ShiftLeft"] || keysPressed["ShiftRight"];
};
