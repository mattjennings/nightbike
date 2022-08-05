<script lang="ts">
  import type { Routes } from "$game"
  import { onMount } from "svelte"

  export let scene: Routes["index"]

  let score = 0
  let highscore = 0
  let playing = false
  let dead = false

  onMount(() => {
    scene.on("postupdate", () => {
      score = scene.state.score
      highscore = scene.state.highscore
      playing = scene.state.playing
      dead = scene.state.dead
    })
  })
</script>

<div class="root">
  <div class="score">
    {#if !playing}
      <span>HIGHSCORE: {highscore}</span>
    {/if}

    <span>{score}</span>

    {#if !playing && !dead}
      <span>TAP TO START</span>
    {/if}
  </div>
</div>

<style>
  @font-face {
    font-family: Pixel;
    src: url(fonts/dogicapixel.ttf);
  }

  .root {
    font-family: Pixel;
    pointer-events: none;
    color: white;
    font-size: 32em;
  }
</style>
