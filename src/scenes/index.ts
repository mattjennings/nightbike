import "excalibur"

import { Level } from "$lib/Level"
import { Background } from "$lib/Background"
import { Ground } from "$lib/Ground"

export default class Main extends Level {
  constructor() {
    super({
      music: $res("music/city.mp3"),
      bg: new Background({
        graphic: $res("sprites/levels/bg/city.png").toSprite(),
      }),
      ground: new Ground({
        top: $res("sprites/levels/ground/street-top.png").toSprite(),
        fill: $res("sprites/levels/ground/street-fill.png").toSprite(),
      }),
    })
  }
}
