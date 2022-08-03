import { getBaseY, pxScale, pxScaleVec } from "./util"
import { WindowResizeComponent } from "./WindowResizeComponent"
import type { Routes } from "$game"
import { InfiniteScrollGraphic } from "./InfiniteScrollGraphic"

const top = $res("sprites/levels/ground/street-top.png").toSprite()
const fill = $res("sprites/levels/ground/street-fill.png").toSprite()
export class Ground extends InfiniteScrollGraphic {
  declare scene: Routes["index"]

  fill: InfiniteScrollGraphic | undefined

  constructor() {
    super({
      name: "Ground",
      graphic: top,
      x: 0,
      y: 0,
      scale: pxScaleVec(),
      anchor: new ex.Vector(0, 0),
      collisionType: ex.CollisionType.Fixed,
    })
  }

  onInitialize(engine: ex.Engine) {
    this.pos.y = getBaseY()
    this.speed = -this.scene.speed / 3500
  }

  onWindowResize() {
    super.onWindowResize()
    this.collider.usePolygonCollider([
      ex.vec(0, 2),
      ex.vec(this.scene.camera.viewport.width, 2),
      ex.vec(this.scene.camera.viewport.width, 100),
      ex.vec(0, 100),
    ])

    const rows = Math.ceil(this.pos.y / fill.height)
    if (this.fill) {
      this.fill.kill()
    }

    this.fill = new InfiniteScrollGraphic({
      graphic: fill,
      speed: this.speed,
      scale: this.scale,
      x: this.scene.camera.viewport.left,
      y: this.pos.y + fill.height + fill.height,
      repeatY: rows,
    })

    // add directly to scene
    // normally, it would make sense for these to be children of Ground,
    // but its pos.x does not stay in sync with viewport on resize for some reason
    this.scene.engine.add(this.fill)
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    this.pos.x = this.scene.camera.viewport.left
  }
}
