import { getSafeArea, pxScale, pxScaleVec } from "./util"

const head = ex.SpriteSheet.fromImageSource({
  image: $res("sprites/player/head.png"),
  grid: {
    columns: 4,
    rows: 1,
    spriteWidth: 7,
    spriteHeight: 5,
  },
})
const wheels = ex.SpriteSheet.fromImageSource({
  image: $res("sprites/player/wheels.png"),
  grid: {
    columns: 4,
    rows: 1,
    spriteWidth: 17,
    spriteHeight: 6,
  },
})
const bike = $res("sprites/player/bike.png").toSprite()
const body = $res("sprites/player/body.png").toSprite()

// head.sprites.forEach((s) => pxScaleVec(s.scale))
// wheels.sprites.forEach((s) => pxScaleVec(s.scale))
// pxScaleVec(bike.scale)
// pxScaleVec(body.scale)

export class Player extends ex.Actor {
  frame = 0
  animSpeed = 0.2

  onGround = false

  constructor() {
    super({
      anchor: new ex.Vector(0.5, 0.5),
      collisionType: ex.CollisionType.Active,
      collider: ex.Shape.Circle(8, ex.vec(0, 1)),
      scale: pxScaleVec(),
    })
  }

  onInitialize() {
    this.on("collisionstart", this.onCollisionStart)
    this.on("postcollision", this.onPostCollision)
  }

  onCollisionStart = (evt: ex.CollisionStartEvent) => {
    if (evt.other.name === "Vehicle") {
      // console.log("dead")
    }
  }
  onPostCollision = (evt: ex.PostCollisionEvent) => {
    if (evt.side === ex.Side.Bottom) {
      this.onGround = true
    }
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    this.pos.x = getSafeArea().left + pxScale(16)

    // increment animation frame
    this.frame = (this.frame + this.animSpeed) % 4

    this.draw()

    engine.input.pointers.on("down", () => {
      this.jump()
    })

    // helps give some lenience if user clicks before landing
    // engine.input.pointers.on("up", () => {
    //   this.jump()
    // })

    const yVel = this.vel.y
    if (yVel > -60 && yVel < 0 && yVel !== 0) {
      // this.vel.y -= 10
    }
  }

  jump() {
    if (this.onGround) {
      this.vel.y = -12 * 60
      this.onGround = false
    }
  }

  draw() {
    const getFrame = (graphic: ex.SpriteSheet) => {
      const frame = Math.floor(this.frame)

      // clamp between length of sprites
      return graphic.sprites[Math.min(graphic.sprites.length - 1, frame)]
    }

    this.graphics.use(
      new ex.GraphicsGroup({
        members: [
          {
            graphic: getFrame(head),
            pos: new ex.Vector(4, 0),
          },
          {
            graphic: bike,
            pos: new ex.Vector(1, 2),
          },
          {
            graphic: body,
            pos: new ex.Vector(6, 4),
          },
          {
            graphic: getFrame(wheels),
            pos: new ex.Vector(1, 10),
          },
        ],
      })
    )
  }
}
