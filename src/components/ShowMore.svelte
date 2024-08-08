<script lang="ts">
  export let showMore = false
  export let startHeightPx = 300
  let classList = ""
  export { classList as class }

  let container: HTMLElement

  $: contentFits = container?.clientHeight < startHeightPx
</script>

<div class={"flex flex-col w-fit h-fit " + classList}>
  <div
    class="overflow-hidden"
    style={`max-height: ${showMore || contentFits ? "none" : startHeightPx + "px"}`}
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
  {#if !contentFits}
    <button
      class="btn btn-neutral btn-sm mt-3 mx-auto"
      on:click={() => (showMore = !showMore)}
    >
      Toon {showMore ? "minder" : "meer"}
    </button>
  {/if}
</div>
