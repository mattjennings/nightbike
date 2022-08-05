import { HTMLUI } from "merlyn"
import type { SvelteComponentTyped } from "svelte"
import { check_outros, group_outros, transition_out } from "svelte/internal"

export class SvelteUI<
  Props extends Record<string, any> = any,
  Events extends Record<string, any> = any,
  Slots extends Record<string, any> = any
> extends HTMLUI {
  private component: typeof SvelteComponentTyped<Props, Events, Slots>
  private props?: Props

  svelteComponent!: SvelteComponentTyped<Props, Events, Slots>

  constructor(
    component: typeof SvelteComponentTyped<Props, Events, Slots>,
    args: {
      props?: Props
    } = {}
  ) {
    super({
      resolution: "native",
    })
    this.component = component
    this.props = args.props
  }

  onInitialize(e: ex.Engine) {
    super.onInitialize(e)
    this.svelteComponent = new this.component({
      target: this.element,
      intro: true,
      props: {
        ...(this.props ?? {}),
        scene: this.scene,
      } as any,
    })
    this.element.style.pointerEvents = "none"
  }

  onPreKill() {
    outroAndDestroy(this.svelteComponent, () => {
      super.onPreKill()
    })
  }
}

// Workaround for https://github.com/sveltejs/svelte/issues/4056
const outroAndDestroy = (
  instance: SvelteComponentTyped | undefined,
  cb: () => void
) => {
  // @ts-ignore
  if (instance?.$$.fragment && instance.$$.fragment.o) {
    group_outros()
    transition_out(instance.$$.fragment, 0, 0, () => {
      instance.$destroy()
      cb()
    })
    check_outros()
  } else {
    instance?.$destroy()
  }
}
