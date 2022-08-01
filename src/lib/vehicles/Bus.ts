import { Vehicle } from "./Vehicle"

export class Bus extends Vehicle {
  constructor() {
    super({
      spritesheet: ex.SpriteSheet.fromImageSource({
        image: $res("sprites/vehicles/bus.png"),
        grid: {
          columns: 4,
          rows: 1,
          spriteWidth: 49,
          spriteHeight: 22,
        },
      }),
      collider: ex.Shape.Box(49, 16, ex.vec(0.5, 0.5), ex.vec(0, -8)),
    })
  }

  onInitialize() {
    super.onInitialize()
    const top = new ex.Actor({
      pos: ex.vec(0, -19),
      width: 49,
      height: 2,
      collisionType: ex.CollisionType.Fixed,
    })

    top.scene = this.scene // tmp fix for excalibur warning
    this.addChild(top)
  }
}
