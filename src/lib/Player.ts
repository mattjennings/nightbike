import { Explosion } from "./Explosion"
import { getBaseY, getSafeArea, pxScale, pxScaleVec } from "./util"
import { Vehicle } from "./vehicles"

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

const sndJump = $res("sound/jump.mp3")
sndJump.volume = 0.5

export class Player extends ex.Actor {
  frame = 0
  animSpeed = 0.2

  coyoteTime = 0

  isOnGround = false
  isEntering = true

  constructor() {
    super({
      anchor: new ex.Vector(0.5, 0.5),
      collisionType: ex.CollisionType.Active,
      collider: ex.Shape.Circle(8, ex.vec(0, 1)),
      scale: pxScaleVec(),
      z: 10,
    })
  }

  onInitialize() {
    this.on("collisionstart", this.onCollisionStart)
    this.on("postcollision", this.onPostCollision)
    this.respawn()
  }

  onCollisionStart = (evt: ex.CollisionStartEvent) => {
    if (evt.other.name === "Vehicle") {
      this.die()
    }
  }

  respawn() {
    if (!this.scene.contains(this)) {
      this.scene.engine.add(this)
    }
    this.pos.x = getSafeArea().left - pxScale(8)
    this.pos.y = getBaseY() - pxScale(7)

    this.graphics.opacity = 0
    this.actions.fade(1, 150)
  }

  onPostCollision = (evt: ex.PostCollisionEvent) => {
    if (evt.side === ex.Side.Bottom) {
      this.isOnGround = true
      if (this.coyoteTime > 0) {
        this.jump()
        this.coyoteTime = 0
      }
    }

    if (evt.other instanceof Vehicle) {
      if (evt.side === ex.Side.Left || evt.side === ex.Side.Right) {
        this.die()
      }
    }
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    if (this.pos.x < getSafeArea().left + pxScale(16)) {
      this.isEntering = true
      this.vel.x = 150
    } else {
      this.isEntering = false
      this.vel.x = 0
      this.pos.x = getSafeArea().left + pxScale(16)
    }

    // increment animation frame
    this.frame = (this.frame + this.animSpeed) % 4

    this.coyoteTime = Math.max(0, this.coyoteTime - delta)

    engine.input.pointers.on("down", () => {
      this.coyoteTime = 150

      this.jump()
    })

    const yVel = this.vel.y
    if (yVel > -60 && yVel < 0 && yVel !== 0) {
      this.vel.y -= 2.25 * delta
    }
  }

  onPostUpdate() {
    this.draw()
    // if window is resized, physics can get crazy and cause player to fall through floor
    if (this.pos.y > getSafeArea().bottom) {
      this.die()
    }
  }

  die() {
    if (!this.isKilled()) {
      this.vel = ex.vec(0, 0)
      this.coyoteTime = 0
      this.scene.engine.add(
        new Explosion({
          pos: this.pos,
        })
      )
      this.emit("died", undefined)
      this.kill()
    }
  }

  jump() {
    if (this.isOnGround && !this.isEntering && !this.isKilled()) {
      sndJump.play()
      this.vel.y = -13 * 60
      this.isOnGround = false
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
