import { Vehicle } from "./Vehicle"

export class MiniTruck extends Vehicle {
  constructor() {
    super({
      spritesheet: ex.SpriteSheet.fromImageSource({
        image: $res("sprites/vehicles/mini-truck.png"),
        grid: {
          columns: 4,
          rows: 1,
          spriteWidth: 14,
          spriteHeight: 16,
        },
      }),
      width: 14,
      height: 16,
      collider: ex.Shape.Circle(8, ex.vec(0, -6)),
    })
  }
}
