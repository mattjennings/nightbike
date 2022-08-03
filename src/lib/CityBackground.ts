import { TilingGraphic } from "./TilingGraphic"
import { getBaseY } from "./util"

export class CityBackground extends TilingGraphic {
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
