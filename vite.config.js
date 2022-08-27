import { defineConfig } from "vite"
import merlyn from "merlyn/vite"
import compress from "vite-plugin-compress"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import preprocess from "svelte-preprocess"
import { VitePWA } from "vite-plugin-pwa"

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
      exclude: ["**/*.js", "og-image.png", "index.html"],
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Night Bike",
        short_name: "NightBike",
        description: "Jump the cars for as long as you can",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
})
