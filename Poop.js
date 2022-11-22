import { Entity } from "./Entity.js";
import { isPressedShift } from "./keycontrol.js";
import { ctx, GRAV, viewPortWidth, MAX_VEL, FRICTION } from "./tools.js";

export class Poop extends Entity {
  minY = 0;
  width = 15;
  height = 15;
  life = 300;
  died = false;
  constructor(x, y, velx, vely) {
    super();
    this.x = x - this.width / 2;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.hue = Math.floor(Math.random() * 360);
  }

  update(walls, poopLayer) {
    super.update(walls);
    if (this.collidesWithTop(poopLayer) && this.intersectsX(poopLayer))
      return true;
    this.life--;
    this.hue++;
    if (this.life <= 0) this.died = true;
    return false;
  }

  moveY() {
    this.prevY = this.y;
    if (this.y > this.minY) {
      this.vely = Math.max(this.vely + GRAV, MAX_VEL);
      this.y += this.vely;
    } else {
      this.vely = 0;
      this.y = this.minY;
    }
  }

  moveX() {
    this.prevX = this.x;
    if (this.velx !== 0) {
      let friction = FRICTION;
      if (this.onIce) friction = FRICTION * 0.1;
      else if (this.y > this.minY) friction = FRICTION * 0.5;
      this.velx =
        (this.velx / Math.abs(this.velx)) *
        Math.max(Math.abs(this.velx) + friction, 0);
    }
    this.x = this.x + this.velx;
    if (this.x < -this.width) this.x = viewPortWidth;
    if (this.x > viewPortWidth) this.x = -this.width;
  }

  show() {
    if (isPressedShift()) {
      ctx.fillStyle = `hsl(${this.hue % 360}, 100%, 50%, ${this.life / 300})`;
    } else {
      ctx.fillStyle = `rgb(200, 130, 80, ${this.life / 300})`;
    }
    ctx.fillRect(this.x, this.getAbsoluteY(), this.width, this.height);
  }
}
