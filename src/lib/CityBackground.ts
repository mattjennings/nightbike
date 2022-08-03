import { getBaseY, getSafeArea } from "./util"
import { WindowResizeComponent } from "./WindowResizeComponent"
import type { Routes } from "$game"
import { InfiniteScrollGraphic } from "./InfiniteScrollGraphic"

export class CityBackground extends InfiniteScrollGraphic {
  constructor() {
    super({
      anchor: new ex.Vector(0, 0),
      x: 0,
      y: 0,
      graphic: $res("sprites/levels/bg/city.png").toSprite(),
      speed: 0,
    })
  }

  onInitialize() {
    this.speed = -this.scene.speed / 6000
    this.pos.y = getBaseY() - 256
  }
}

class Star extends ex.Actor {
  onInitialize() {
    const spritesheet = ex.SpriteSheet.fromImageSource({
      image: $res("sprites/levels/star.png"),
      grid: {
        columns: 3,
        rows: 1,
        spriteWidth: 5,
        spriteHeight: 5,
      },
    })
    this.graphics.use(ex.Animation.fromSpriteSheet(spritesheet, [0, 1, 2], 50))
  }
}
