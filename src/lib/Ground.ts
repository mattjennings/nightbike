import { getBaseY, pxScale, pxScaleVec } from "./util"
import { WindowResizeComponent } from "./WindowResizeComponent"

const top = $res("sprites/levels/ground/street-top.png").toSprite()
const fill = $res("sprites/levels/ground/street-fill.png").toSprite()

export class Ground extends ex.Actor {
  offsetX = 0

  constructor() {
    super({
      anchor: new ex.Vector(0, 0),
      collisionType: ex.CollisionType.Fixed,
    })
    this.addComponent(new WindowResizeComponent())
  }

  onInitialize(engine: ex.Engine) {
    this.pos.y = getBaseY()
    this.onWindowResize()
  }

  onWindowResize() {
    const width = fill.width
    const height = fill.height

    this.collider.usePolygonCollider([
      // box shape but offset down 2 scaled pixels
      ex.vec(0, pxScale(2)),
      ex.vec(this.scene.camera.viewport.width, pxScale(2)),
      ex.vec(this.scene.camera.viewport.width, 100),
      ex.vec(0, 100),
    ])

    const columns = Math.ceil(this.scene.camera.viewport.width / width) + 1
    const rows = Math.ceil(this.pos.y / fill.height)

    this.graphics.use(
      new ex.GraphicsGroup({
        scale: pxScaleVec(new ex.Vector(1, 1)),
        members: [
          ...Array.from({ length: columns }).map((_, i) => ({
            graphic: top,
            pos: new ex.Vector(width * i, 0),
          })),
          ...Array.from({ length: columns }).flatMap((_, x) =>
            Array.from({ length: rows }).map((_, y) => ({
              graphic: fill,
              pos: new ex.Vector(width * x, height * y + height - 8),
            }))
          ),
        ],
      })
    )
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    this.pos.x = this.scene.camera.viewport.left
    this.offsetX -= (this.scene.speed / 1000) * delta

    // move back X columns so that it appears infinite
    while (this.offsetX < -pxScale(fill.width)) {
      this.offsetX += pxScale(fill.width)
    }

    this.graphics.offset.x = this.offsetX
  }
}
