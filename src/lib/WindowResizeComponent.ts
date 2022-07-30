import { engine } from "$game"
import type { ComponentCtor, Component, Entity } from "excalibur"

type Owner = Entity & {
  onWindowResize: () => void
}
export class WindowResizeComponent extends ex.Component<"window-resize"> {
  readonly type = "window-resize"

  declare owner: Owner

  onResize = () => {
    if (this.owner?.onWindowResize) {
      engine.once("predraw", () => {
        this.owner.onWindowResize.call(this.owner)
      })
    }
  }
  onAdd?(owner: Owner): void {
    window.addEventListener("resize", this.onResize)
  }

  onRemove?(previousOwner: Owner): void {
    window.removeEventListener("resize", this.onResize)
  }
}
