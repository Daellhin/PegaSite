<script lang="ts">
  let classList = ""
  export { classList as class }

  export let showMore = false
  export let startHeightPx = 200

  let container: HTMLElement
</script>

<div class={"flex flex-col w-fit h-fit " + classList}>
  <div
    class="overflow-hidden"
    style={`max-height: ${showMore ? "none" : startHeightPx + "px"}`}
  >
    <div bind:this={container}>
      <slot />
    </div>
  </div>
  <div
    class="relative h-16 w-full -mt-16 bg-gradient-to-b from-transparent"
    class:to-base-100={!showMore}
    class:to-transparent={showMore}
  />
  {#if container?.clientHeight > startHeightPx}
    <button
      class="btn btn-neutral btn-sm mt-2 mx-auto"
      on:click={() => (showMore = !showMore)}
    >
      Toon {showMore ? "minder" : "meer"}
    </button>
  {/if}
</div>
