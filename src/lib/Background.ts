import type { Level } from "./Level"
import { getBaseY } from "./util"
import { WindowResizeComponent } from "./WindowResizeComponent"

export class Background extends ex.Actor {
  declare scene: Level

  graphic: ex.Graphic
  speed!: number
  offset = ex.Vector.Zero

  constructor({
    graphic,
    ...args
  }: ex.ActorArgs & {
    graphic: ex.Graphic
  }) {
    super({
      anchor: new ex.Vector(0, 0),
      x: 0,
      ...args,
    })
    this.addComponent(new WindowResizeComponent())
    this.graphic = graphic
    this.graphics.offset = this.offset
  }

  onInitialize() {
    this.pos.y = getBaseY() - 256

    this.speed = -this.scene.speed / 6000
    this.onWindowResize()
  }

  onWindowResize() {
    const columns =
      Math.ceil(this.scene.camera.viewport.width / this.graphic.width) + 1

    this.graphics.use(
      new ex.GraphicsGroup({
        members: Array.from({ length: columns }).map((_, x) => ({
          graphic: this.graphic,
          pos: new ex.Vector(this.graphic.width * x, 0),
        })),
      })
    )
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    this.pos.x = this.scene.camera.viewport.left

    this.offset.x += this.speed * delta

    // move back X columns so that it appears infinite
    while (this.offset.x < -this.graphic.width) {
      this.offset.x += this.graphic.width
    }
  }
}
