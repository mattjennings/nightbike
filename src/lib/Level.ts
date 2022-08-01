import { engine } from "$game"
import { Ground } from "./Ground"
import { Player } from "./Player"
import { Background } from "./Background"
import { choose, getBaseY, pxScale } from "./util"
import { Vehicle, vehicles } from "./vehicles"
import { Bus } from "./vehicles/Bus"
import { Truck } from "./vehicles/Truck"
import { Car } from "./vehicles/Car"

export class Level extends ex.Scene {
  bg!: Background
  ground!: Ground
  player!: Player
  speed = 550

  nextVehicle?: typeof Vehicle | undefined
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
      const vehicle = this.spawnVehicle(this.nextVehicle)
      this.nextVehicle = undefined
      this.vehicleTimer = 1000

      if (vehicle instanceof Car) {
        this.vehicleTimer = 800
      } else if (vehicle instanceof Bus) {
        if (choose([true, false, false])) {
          this.nextVehicle = choose([Car, Truck])
          if (this.nextVehicle === Car) {
            this.vehicleTimer = 300
          } else {
            this.vehicleTimer = 450
          }
        }
      } else if (vehicle instanceof Truck) {
        if (choose([true, false, false, false])) {
          this.vehicleTimer = 500
          this.nextVehicle = Truck
        }
      }
    } else {
      this.vehicleTimer -= delta
    }
  }

  spawnVehicle(vehicle = choose(vehicles)): Vehicle {
    const instance = new vehicle({} as any)
    engine.add(instance)
    return instance
  }
}
