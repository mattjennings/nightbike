import { engine } from "$game"
import { Ground } from "$lib/Ground"
import { Player } from "$lib/Player"
import { choose, getBaseY, getSafeArea, pxScale } from "$lib/util"
import { Vehicle, vehicles } from "$lib/vehicles"
import { Bus } from "$lib/vehicles/Bus"
import { Truck } from "$lib/vehicles/Truck"
import { Car } from "$lib/vehicles/Car"
import { coroutine } from "merlyn"
import { CityBackground } from "$lib/CityBackground"

export default class Main extends ex.Scene {
  player!: Player
  music = $res("music/city.mp3")
  speed = 550

  nextVehicle?: typeof Vehicle | undefined
  vehicleTimer = 0

  onInitialize() {
    const bg = new CityBackground()
    const ground = new Ground()
    engine.add(bg)
    engine.add(ground)

    this.music.play()
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
    // sometimes it doesn't actually loop, this seems to help
    if (!this.music.isPlaying()) {
      this.music.play()
    }
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
