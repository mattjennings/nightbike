import { engine } from "$game"
import type { Ground } from "./Ground"
import { Player } from "./Player"
import type { Background } from "./Background"
import { choose, getBaseY, getSafeArea, pxScale } from "./util"
import { Vehicle, vehicles } from "./vehicles"
import { Bus } from "./vehicles/Bus"
import { Truck } from "./vehicles/Truck"
import { Car } from "./vehicles/Car"
import { coroutine } from "merlyn"

export class Level extends ex.Scene {
  bg!: Background
  ground!: Ground
  player!: Player
  music!: ex.Sound
  speed = 550

  nextVehicle?: typeof Vehicle | undefined
  vehicleTimer = 0

  constructor({
    bg,
    ground,
    music,
  }: {
    bg: Background
    ground: Ground
    music: ex.Sound
  }) {
    super()
    this.bg = bg
    this.ground = ground
    this.music = music
  }

  onInitialize() {
    engine.add(this.bg)
    engine.add(this.ground)

    this.music.play()

    this.music.loop = true
    // sometimes it doesn't actually loop, this seems to help
    this.music.on("playbackend", () => {
      this.music.play()
    })
    this.spawnPlayer()
  }

  spawnPlayer() {
    if (!this.player) {
      this.player = new Player()
      engine.add(this.player)
    } else {
      this.player.respawn()
    }

    this.player.on("died", async () => {
      coroutine(function* () {
        while (this.countActiveVehicles() > 0) {
          yield
        }

        this.player.respawn()
      }, this)
    })
  }

  countActiveVehicles() {
    return this.entities.filter((e) => {
      let isActive = (e: Vehicle) =>
        e.pos.x + e.width > getSafeArea().left - pxScale(16)

      return e instanceof Vehicle && isActive(e)
    }).length
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    if (!this.player.isKilled()) {
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
  }

  spawnVehicle(vehicle = choose(vehicles)): Vehicle {
    const instance = new vehicle({} as any)
    engine.add(instance)
    return instance
  }
}
