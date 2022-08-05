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
import { Sky } from "$lib/Sky"
import { SvelteUI } from "$lib/ui/SvelteUI"
import UI from "$lib/ui/UI.svelte"

export default class Main extends ex.Scene {
  player!: Player
  music = $res("music/city.mp3")
  speed = 550

  ui!: SvelteUI

  nextVehicle?: typeof Vehicle | undefined
  vehicleTimer = 0

  state = {
    score: 0,
    highscore: JSON.parse(localStorage.getItem("highscore") || "0"),
    playing: false,
    dead: false,
  }

  onInitialize() {
    this.ui = new SvelteUI(UI)
    this.player = new Player()

    const sky = new Sky()
    const bg = new CityBackground()
    const ground = new Ground()

    engine.add(this.ui)
    engine.add(this.player)
    engine.add(sky)
    engine.add(bg)
    engine.add(ground)

    this.music.play()

    this.on("score", () => this.onScore())
    this.player.on("start", () => this.onStart())
    this.player.on("died", () => this.onPlayerDied())
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

    if (this.state.playing) {
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
              this.vehicleTimer = 350
            } else {
              this.vehicleTimer = 500
            }
          }
        } else if (vehicle instanceof Truck) {
          if (choose([true, false, false, false])) {
            this.vehicleTimer = 550
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

  onScore() {
    this.state.score++
  }

  onStart() {
    if (!this.state.dead) {
      this.state.playing = true
      this.state.score = 0
    }
  }

  onPlayerDied() {
    this.state.playing = false
    this.state.dead = true

    if (this.state.score > this.state.highscore) {
      this.state.highscore = this.state.score
      localStorage.setItem("highscore", JSON.stringify(this.state.highscore))
    }

    coroutine(function* () {
      while (this.countActiveVehicles() > 0) {
        yield
      }

      this.player.respawn()
      this.state.dead = false
    }, this)
  }
}
