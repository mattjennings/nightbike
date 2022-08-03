import type { Routes } from "$game"
import { getBaseY, getSafeArea, pxScale, pxScaleVec } from "$lib/util"

export interface VehicleArgs extends ex.ActorArgs {
  spritesheet: ex.SpriteSheet
}

export class Vehicle extends ex.Actor {
  declare scene: Routes["index"]
  spritesheet: ex.SpriteSheet

  constructor({ spritesheet, ...args }: VehicleArgs) {
    super({
      name: "Vehicle",
      anchor: new ex.Vector(0.5, 1),
      scale: pxScaleVec(),
      collisionType: ex.CollisionType.Passive,
      ...args,
    })
    this.spritesheet = spritesheet
  }

  get width() {
    return this.collider.bounds.width
  }

  onInitialize() {
    this.pos.x = getSafeArea().right + pxScale(128)
    this.pos.y = getBaseY() + pxScale(1)
    this.body.useGravity = false
    this.graphics.use(
      ex.Animation.fromSpriteSheet(
        this.spritesheet,
        [0, 1, 2, 3],
        Math.abs(this.vel.x) * 0.15
      )
    )

    this.graphics.opacity = 0
    this.actions.fade(1, 100)
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    this.scene.isTransitioning
    this.vel.x = -Math.round(this.scene.speed * 0.75)

    if (
      this.pos.x + this.width <
      this.scene.camera.viewport.left - pxScale(10)
    ) {
      this.kill()
    }
  }
}
