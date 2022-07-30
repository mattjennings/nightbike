import "excalibur"

import { engine } from "$game"
import { Ground } from "./Ground"
import { Player } from "./Player"
import { Background } from "./Background"
import { choose, getBaseY, getSafeArea, pxScale } from "./util"
import { vehicles } from "./vehicles"
import { Truck } from "./vehicles/Truck"
import { Car } from "./vehicles/Car"
import { MiniTruck } from "./vehicles/MiniTruck"
import { Van } from "./vehicles/Van"

export class Level extends ex.Scene {
  bg!: Background
  ground!: Ground
  player!: Player
  speed = 500

  vehicleTimer = 0

  onInitialize() {
    this.bg = new Background({
      x: 0,
      y: 345,
      graphic: $res("sprites/levels/bg/city.png").toSprite(),
    })
    this.ground = new Ground()
    this.player = new Player()

    engine.add(this.bg)
    engine.add(this.ground)
    engine.add(this.player)

    this.player.pos.y = getBaseY() - pxScale(7)
    this.bg.pos.y = getBaseY() - 256
  }

  onPostDraw(ctx: ex.ExcaliburGraphicsContext, _delta: number): void {
    // engine.screen.contentArea.draw(ctx, ex.Color.Yellow)
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    if (this.vehicleTimer <= 0) {
      const vehicle = this.spawnVehicle()
      const width = vehicle.collider.bounds.width
      this.vehicleTimer = this.speed * 2
      console.log(this.vehicleTimer)
    } else {
      this.vehicleTimer -= delta
    }
  }

  spawnVehicle() {
    const vehicle = choose(vehicles)
    const instance = new vehicle()
    engine.add(instance)
    return instance
  }
}

declare module "excalibur" {
  export interface Scene {
    player: Player
    speed: number
  }
}
