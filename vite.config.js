import { defineConfig } from "vite"
import merlyn from "merlyn/vite"
import compress from "vite-plugin-compress"

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    merlyn(),
    compress.default({
      verbose: true,
      exclude: ["**/*.js"],
    }),
  ],
})
