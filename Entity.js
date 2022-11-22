import { canvas } from "./tools.js";

export class Entity {
  update(walls) {
    this.moveY();
    this.moveX();
    this.checkCollisions(walls);
    this.animationIteration++;
  }

  checkCollisions(walls) {
    this.minY = 0;
    this.onIce = false;
    for (let wall of walls) {
      if (
        this.vely >= 0 &&
        this.collidesWithBottom(wall) &&
        this.intersectsX(wall)
      ) {
        this.vely = 0;
        this.y = wall.y - this.height;
      } else if (
        this.vely <= 0 &&
        this.collidesWithTop(wall) &&
        this.intersectsX(wall)
      ) {
        this.vely = 0;
        this.minY = wall.y + wall.height;
        this.y = this.minY;
        if (wall.isIce) this.onIce = true;
      }
      if (
        this.velx >= 0 &&
        this.collidesWithLeft(wall) &&
        this.intersectsY(wall)
      ) {
        this.x = wall.x - this.width;
      } else if (
        this.velx <= 0 &&
        this.collidesWithRight(wall) &&
        this.intersectsY(wall)
      ) {
        this.x = wall.x + wall.width;
      }
    }
  }

  intersectsY(wall) {
    return this.y < wall.y + wall.height && this.y + this.height > wall.y;
  }

  collidesWithTop(wall) {
    return this.prevY >= wall.y + wall.height && wall.y + wall.height >= this.y;
  }
  collidesWithBottom(wall) {
    return this.prevY + this.height <= wall.y && wall.y <= this.y + this.height;
  }

  intersectsX(wall) {
    return this.x + this.width > wall.x && this.x < wall.x + wall.width;
  }

  collidesWithLeft(wall) {
    return this.prevX + this.width <= wall.x && wall.x <= this.x + this.width;
  }

  collidesWithRight(wall) {
    return this.prevX >= wall.x + wall.width && wall.x + wall.width >= this.x;
  }

  getAbsoluteY() {
    return canvas.height - this.height - this.y;
  }
}
