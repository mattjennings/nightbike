import { choose } from "$lib/util"
import { Vehicle } from "./Vehicle"

const blue = $res("sprites/vehicles/car.png")
const red = $res("sprites/vehicles/red-car.png")

export class Car extends Vehicle {
  constructor() {
    super({
      spritesheet: ex.SpriteSheet.fromImageSource({
        image: choose([blue, red]),
        grid: {
          columns: 4,
          rows: 1,
          spriteWidth: 21,
          spriteHeight: 16,
        },
      }),
      collider: ex.Shape.Circle(9, ex.vec(0, -6)),
    })
  }
}
