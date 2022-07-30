import { defineConfig } from "vite"
import merlyn from "merlyn/vite"

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  plugins: [merlyn()],
})
