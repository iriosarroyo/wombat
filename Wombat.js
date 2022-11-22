import { Entity } from "./Entity.js";
import {
  isPressedBox,
  isPressedCtrl,
  isPressedLeft,
  isPressedPoop,
  isPressedRight,
  isPressedShift,
  isPressedUp,
} from "./keycontrol.js";
import { Poop } from "./Poop.js";
import {
  ctx,
  getStep,
  GRAV,
  viewPortWidth,
  MAX_VEL,
  wombatH,
  wombatW,
  SPEED_FACTOR,
  paracaidas,
  JUMP_TIMER,
} from "./tools.js";

export class Wombat extends Entity {
  height = wombatH;
  width = wombatW;
  step = 0;
  animationIteration = 0;
  minY = 0;
  vely = 0;
  velx = 0;
  timer = 0;
  poopTimer = 15;
  poops = [];
  constructor(x, y = 0, velx = 2) {
    super();
    this.x = x;
    this.y = y
    this.prevX = x;
    this.vel = velx;
  }

  update(...args) {
    super.update(...args);
    this.poopTimer = Math.max(this.poopTimer - 1, 0);
    if (isPressedPoop() && this.poopTimer === 0) {
      this.poopTimer = 60;
      const x = this.inverse ? this.x + this.width : this.x;
      this.poops.push(new Poop(x, this.y, this.velx, this.vely));
    }
    for (let i = this.poops.length - 1; i >= 0; i--) {
      if (this.poops[i].update(...args)) return true;
      if (this.poops[i].died) this.poops.splice(i, 1);
    }
  }

  moveY() {
    this.prevY = this.y;
    if (this.y > this.minY) {
      if (
        this.vely <= 0 &&
        isPressedUp() &&
        !this.hasJumped &&
        this.hasStopPressing
      )
        (this.vely += 20), (this.hasJumped = true);
      else
        this.vely = Math.max(
          this.vely + GRAV,
          MAX_VEL,
          isPressedShift() ? -1 : -Infinity
        );
      if (!isPressedUp()) this.hasStopPressing = true;
      this.y += this.vely;
    } else if (isPressedUp() && this.timer === 0) {
      this.vely = 20;
      this.y += this.vely;
      this.timer = JUMP_TIMER;
      this.hasJumped = false;
      this.hasStopPressing = false;
    } else {
      this.vely = 0;
      this.y = this.minY;
      this.hasJumped = false;
      this.hasStopPressing = false;
    }
    this.timer = Math.max(0, this.timer - 1);
  }

  moveX() {
    this.prevX = this.x;
    if (isPressedRight()) {
      this.velx = this.vel * (isPressedCtrl() ? SPEED_FACTOR : 1);
      this.inverse = false;
      if (this.animationIteration % 5 === 0) this.step = (this.step + 1) % 6;
    } else if (isPressedLeft()) {
      this.velx = -this.vel * (isPressedCtrl() ? SPEED_FACTOR : 1);
      this.inverse = true;
      if (this.animationIteration % 5 === 0)
        this.step = (this.step - 1 + 6) % 6;
    } else if (this.velx) {
      let friction = -1;
      if (this.onIce) friction *= 0.1;
      this.velx =
        (this.velx / Math.abs(this.velx)) *
        Math.max(Math.abs(this.velx) + friction, 0);
    }
    this.x = this.x + this.velx;
    if (this.x < -this.width) this.x = viewPortWidth;
    if (this.x > viewPortWidth) this.x = -this.width;
  }

  show() {
    ctx.fillStyle = "black";
    const y = this.getAbsoluteY();
    if (this.inverse) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(getStep(this.step), -this.x, y, -this.width, this.height);
      if (isPressedShift())
        ctx.drawImage(paracaidas, -this.x - 10, y - 40, -50, 50);
      ctx.restore();
    } else {
      ctx.drawImage(getStep(this.step), this.x, y);
      if (isPressedShift())
        ctx.drawImage(paracaidas, this.x + 10, y - 40, 50, 50);
    }
    for (let poop of this.poops) {
      poop.show();
    }
    if (isPressedBox()) {
      ctx.beginPath();
      ctx.rect(this.x, y, this.width, this.height);
      ctx.stroke();
    }
  }
}
