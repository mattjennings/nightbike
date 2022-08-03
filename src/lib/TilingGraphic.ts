import { getBaseY, getSafeArea } from "./util"
import { WindowResizeComponent } from "./WindowResizeComponent"
import type { Routes } from "$game"

export interface TilingGraphicArgs extends ex.ActorArgs {
  graphic: ex.Graphic
  speed?: number
  repeatY?: number
}

/**
 * Tiles graphic across the screen. Scrolls horizontally at the
 * given speed, can also repeat vertically.
 */
export class TilingGraphic extends ex.Actor {
  declare scene: Routes["index"]

  graphic: ex.Graphic

  offset = ex.Vector.Zero
  speed: number
  repeatY: number

  constructor({ graphic, speed = 0, repeatY = 1, ...args }: TilingGraphicArgs) {
    super({
      anchor: new ex.Vector(0, 0),
      x: 0,
      y: 0,
      ...args,
    })
    this.addComponent(new WindowResizeComponent())
    this.speed = speed
    this.repeatY = repeatY
    this.graphic = graphic
    this.graphics.offset = this.offset
    this.on("initialize", () => {
      this.onWindowResize()
    })

    this.on("preupdate", (ev) => {
      this._onPreUpdate(ev.engine, ev.delta)
    })
  }

  onWindowResize() {
    const columns =
      Math.ceil(this.scene.camera.viewport.width / this.graphic.width) + 1

    const rows = this.repeatY

    this.graphics.use(
      new ex.GraphicsGroup({
        members: Array.from({ length: columns }).flatMap((_, x) =>
          Array.from({ length: rows }).map((_, y) => ({
            graphic: this.graphic,
            pos: new ex.Vector(this.graphic.width * x, y * this.graphic.height),
          }))
        ),
      })
    )
  }

  _onPreUpdate(engine: ex.Engine, delta: number) {
    this.pos.x = this.scene.camera.viewport.left

    this.offset.x += this.speed * delta

    // move back X columns so that it appears infinite
    while (this.offset.x < -this.graphic.width) {
      this.offset.x += this.graphic.width
    }
  }
}
