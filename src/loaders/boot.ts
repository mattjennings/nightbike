import { BootLoader } from "merlyn/loaders"
import { FadeTransition } from "merlyn/transitions"

export const transition = new FadeTransition()

export default import.meta.env.DEV ? ex.Scene : BootLoader
