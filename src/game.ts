import { FadeTransition } from "merlyn/transitions"

export const transition = import.meta.env.DEV ? null : new FadeTransition()

const engine = new ex.Engine({
  backgroundColor: ex.Color.fromHex("#273d58"),
  antialiasing: false,
  resolution: {
    height: 480,
    width: 480,
  },
  displayMode: ex.DisplayMode.FitScreenAndFill,
})

// engine.showDebug(true)

ex.Physics.gravity = new ex.Vector(0, 1 * 60 * 60)

export default engine
