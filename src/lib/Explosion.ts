const spritesheet = ex.SpriteSheet.fromImageSource({
  image: $res("sprites/fx/explosion.png"),
  grid: {
    columns: 7,
    rows: 1,
    spriteWidth: 60,
    spriteHeight: 60,
  },
})

const sndExplode = $res("sound/explode.mp3")
sndExplode.volume = 0.5

export class Explosion extends ex.Actor {
  onInitialize() {
    sndExplode.play()
    const anim = ex.Animation.fromSpriteSheet(
      spritesheet,
      [0, 1, 2, 3, 4, 5, 6],
      25,
      ex.AnimationStrategy.End
    )
    this.graphics.use(anim)
    anim.events.on("end", () => {
      this.kill()
    })
  }
}
