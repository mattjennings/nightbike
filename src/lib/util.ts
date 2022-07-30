import { engine } from "$game"

export const PX_SCALE = 3

export function pxScaleVec(vec?: ex.Vector) {
  if (vec) {
    vec.setTo(vec.x * PX_SCALE, vec.y * PX_SCALE)
    return vec
  }

  return new ex.Vector(PX_SCALE, PX_SCALE)
}

export function pxScale(value: number) {
  return value * PX_SCALE
}

export function getSafeArea() {
  const { x: left, y: top } = engine.screen.screenToWorldCoordinates(
    ex.vec(engine.screen.contentArea.left, engine.screen.contentArea.top)
  )
  const { x: right, y: bottom } = engine.screen.screenToWorldCoordinates(
    ex.vec(engine.screen.contentArea.right, engine.screen.contentArea.bottom)
  )
  return new ex.BoundingBox({
    top,
    left,
    right,
    bottom,
  })
}

export function getBaseY() {
  return getSafeArea().bottom - engine.screen.contentArea.height / 4
}

export function choose<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
