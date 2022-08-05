import { defineConfig } from "vite"
import merlyn from "merlyn/vite"
import compress from "vite-plugin-compress"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import preprocess from "svelte-preprocess"

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    merlyn(),
    svelte({
      preprocess: preprocess(),
    }),
    compress.default({
      verbose: true,
      exclude: ["**/*.js"],
    }),
  ],
})
