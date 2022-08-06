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
  <div class="scores">
    <span class="highscore">HIGHSCORE: {highscore}</span>

    {#if score > 0}
      <span class="score">{score}</span>
    {/if}
  </div>

  {#if !playing && !dead}
    <div class="tap-to-start">
      <span>TAP TO START</span>
    </div>
  {/if}
</div>

<style>
  @font-face {
    font-family: Pixel;
    src: url(fonts/dogicapixel.ttf);
  }

  .root {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    font-family: Pixel;
    pointer-events: none;
    color: white;
    font-size: 28em;

    --outline-width: calc(2 * var(--px));
    --n-outline-width: calc(-2 * var(--px));

    text-shadow: var(--n-outline-width) var(--n-outline-width) 0 #000,
      var(--outline-width) var(--n-outline-width) 0 #000,
      var(--n-outline-width) var(--outline-width) 0 #000,
      var(--outline-width) var(--outline-width) 0 #000;
  }

  .scores {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(48 * var(--px));
    padding: calc(32 * var(--px));
  }

  .score {
    font-size: 1.5em;
  }

  .tap-to-start {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: calc(16 * var(--px));
  }
</style>
