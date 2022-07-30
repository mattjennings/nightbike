import { Vehicle } from "./Vehicle"

export class Truck extends Vehicle {
  constructor() {
    super({
      spritesheet: ex.SpriteSheet.fromImageSource({
        image: $res("sprites/vehicles/truck.png"),
        grid: {
          columns: 4,
          rows: 1,
          spriteWidth: 57,
          spriteHeight: 26,
        },
      }),
      collider: new ex.CompositeCollider([
        ex.Shape.Box(54, 4, ex.vec(0, 0), ex.vec(-28, -5)),
        ex.Shape.Box(14, 10, ex.vec(0, 0), ex.vec(12, -20)),
      ]),
    })
  }

  onInitialize() {
    super.onInitialize()
    const flatbed = new ex.Actor({
      pos: ex.vec(-10, -10),
      width: 40,
      height: 2,
      collisionType: ex.CollisionType.Fixed,
    })

    flatbed.scene = this.scene // tmp fix for excalibur warning
    this.addChild(flatbed)
  }
}
