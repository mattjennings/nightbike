import { getBaseY, getSafeArea, pxScale, pxScaleVec } from "./util"

const types = {
  // car: {
  //   spritesheet: ex.SpriteSheet.fromImageSource({
  //     image: $res("sprites/vehicles/car.png"),
  //     grid: {
  //       columns: 4,
  //       rows: 1,
  //       spriteWidth: 21,
  //       spriteHeight: 16,
  //     },
  //   }),
  //   width: 18,
  //   height: 16,
  // },
  // redcar: {
  //   spritesheet: ex.SpriteSheet.fromImageSource({
  //     image: $res("sprites/vehicles/red-car.png"),
  //     grid: {
  //       columns: 4,
  //       rows: 1,
  //       spriteWidth: 21,
  //       spriteHeight: 16,
  //     },
  //   }),
  //   width: 18,
  //   height: 16,
  // },
  // minitruck: {
  //   spritesheet: ex.SpriteSheet.fromImageSource({
  //     image: $res("sprites/vehicles/mini-truck.png"),
  //     grid: {
  //       columns: 4,
  //       rows: 1,
  //       spriteWidth: 14,
  //       spriteHeight: 16,
  //     },
  //   }),
  //   width: 14,
  //   height: 16,
  // },
  // van: {
  //   spritesheet: ex.SpriteSheet.fromImageSource({
  //     image: $res("sprites/vehicles/van.png"),
  //     grid: {
  //       columns: 4,
  //       rows: 1,
  //       spriteWidth: 19,
  //       spriteHeight: 16,
  //     },
  //   }),
  //   width: 17,
  //   height: 16,
  // },
  truck: {
    spritesheet: ex.SpriteSheet.fromImageSource({
      image: $res("sprites/vehicles/truck.png"),
      grid: {
        columns: 4,
        rows: 1,
        spriteWidth: 57,
        spriteHeight: 26,
      },
    }),
    width: 57,
    height: 26,
    platformCollider: {},
    collider: new ex.PolygonCollider({
      points: [
        ex.vec(0, 0),
        ex.vec(57, 0),
        ex.vec(57, 26),
        ex.vec(0, 26),
        // ex.vec(0, 26),
        // ex.vec(26, 26),
        // ex.vec(26, 0),
        // ex.vec(57, 0),
        // ex.vec(57, 26),
        // ex.vec(0, 26),
      ],
    }),
  },
}

type VehicleType = keyof typeof types

export class Vehicle extends ex.Actor {
  type: VehicleType

  constructor() {
    const type = Object.keys(types)[
      Math.floor(Math.random() * Object.keys(types).length)
    ] as VehicleType

    super({
      // width: types[type].width,
      // height: types[type].height,
      collider: types[type].collider,
      collisionType: ex.CollisionType.Active,
      anchor: new ex.Vector(0.5, 1),
      scale: pxScaleVec(),
    })

    this.type = type
  }

  onInitialize() {
    const width = types[this.type].width
    this.pos.x = getSafeArea().right + pxScale(width * 8)
    this.pos.y = getBaseY() + pxScale(1)
    this.body.useGravity = false
    this.graphics.use(
      ex.Animation.fromSpriteSheet(
        types[this.type].spritesheet,
        [0, 1, 2, 3],
        Math.abs(this.vel.x) * 0.15
      )
    )

    this.graphics.opacity = 0
    this.actions.fade(1, 100)
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    this.vel.x = -Math.round(this.scene.speed * 0.9)

    const width = types[this.type].width
    if (this.pos.x + width < this.scene.camera.viewport.left - pxScale(10)) {
      this.kill()
    }
  }
}
