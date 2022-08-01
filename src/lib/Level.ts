import { engine } from "$game"
import { Ground } from "./Ground"
import { Player } from "./Player"
import { Background } from "./Background"
import { choose, getBaseY, pxScale } from "./util"
import { vehicles } from "./vehicles"

export class Level extends ex.Scene {
  bg!: Background
  ground!: Ground
  player!: Player
  speed = 550

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

  onPreUpdate(engine: ex.Engine, delta: number) {
    if (this.vehicleTimer <= 0) {
      this.spawnVehicle()
      this.vehicleTimer = 1200
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
