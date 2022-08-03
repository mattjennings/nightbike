import { TilingGraphic } from "./TilingGraphic"
import { WindowResizeComponent } from "./WindowResizeComponent"
import type { Routes } from "$game"
import { choose, getSafeArea } from "./util"

export class Sky extends ex.Actor {
  declare scene: Routes["index"]

  moon = new ex.Actor({
    z: -5,
  })

  stars: Star[] = []

  constructor() {
    super()
    this.addComponent(new WindowResizeComponent())
  }

  onInitialize(engine: ex.Engine) {
    this.onWindowResize()

    const dither = new TilingGraphic({
      graphic: $res("sprites/levels/bg/sky-dither.png").toSprite(),
      x: 0,
      y: 0,
      z: -10,
    })
    dither.scene = this.scene

    this.moon.graphics.use($res("sprites/levels/moon.png").toSprite())
    this.addChild(dither)
    this.addChild(this.moon)
  }

  onWindowResize() {
    const bounds = this.scene.camera.viewport
    const safeBounds = getSafeArea()
    this.pos.y = bounds.top
    this.moon.pos.setTo(safeBounds.right - 60, 150)

    this.createStars()
  }

  createStars() {
    const bounds = new ex.BoundingBox(
      this.scene.camera.viewport.left - 64,
      this.scene.camera.viewport.top + 64,
      this.scene.camera.viewport.right + 64,
      this.scene.camera.viewport.bottom + 64
    )
    this.stars.forEach((star) => {
      star.kill()
    })

    const amount = Math.floor(this.scene.camera.viewport.width / 10)
    const gap = 64

    this.stars = new Array(amount).fill(0).map((_, i) => {
      const column =
        bounds.left +
        (i % Math.floor(bounds.width / gap)) * gap +
        (Math.random() - 0.5) * gap
      const row =
        bounds.top +
        Math.floor(i / Math.floor(bounds.width / gap)) * gap +
        (Math.random() - 0.5) * gap

      const star = new Star({ anchor: ex.vec(0, 0), pos: ex.vec(column, row) })

      // add to scene directly. adding as child causes weird positioning
      // when anchoring to viewport and resizing
      this.scene.engine.add(star)

      return star
    })
  }

  onPreUpdate(engine: ex.Engine, delta: number) {}
}

class Star extends ex.Actor {
  constructor(args: ex.ActorArgs) {
    const scale = choose([0.5, 1])
    super({
      z: -4,
      scale: ex.vec(scale, scale),
      ...args,
    })
  }
  onInitialize() {
    const spritesheet = ex.SpriteSheet.fromImageSource({
      image: $res("sprites/levels/star.png"),
      grid: {
        columns: 3,
        rows: 1,
        spriteWidth: 5,
        spriteHeight: 5,
      },
    })

    const anim = ex.Animation.fromSpriteSheet(
      spritesheet,
      [0, 1, 2],
      400,
      ex.AnimationStrategy.PingPong
    )

    this.graphics.use(anim)
    anim.goToFrame(choose([0, 1, 2]))
  }
}
