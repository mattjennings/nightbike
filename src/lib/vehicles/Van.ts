import { Vehicle } from "./Vehicle"

export class Van extends Vehicle {
  constructor() {
    super({
      spritesheet: ex.SpriteSheet.fromImageSource({
        image: $res("sprites/vehicles/van.png"),
        grid: {
          columns: 4,
          rows: 1,
          spriteWidth: 19,
          spriteHeight: 16,
        },
      }),
      width: 17,
      height: 16,
      collider: ex.Shape.Circle(10, ex.vec(0, -6)),
    })
  }
}
