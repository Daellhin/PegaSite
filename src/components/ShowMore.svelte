<script lang="ts">
  export let showMore = false
  export let startHeightPx = 300
  let classList = ""
  export { classList as class }

  let clientHeight: number

  $: contentFits = clientHeight <= startHeightPx
</script>

<div class={"flex flex-col " + classList}>
  <div
    class="overflow-hidden"
    style={`max-height: ${showMore ? "none" : startHeightPx + "px"}`}
  >
    <div bind:clientHeight>
      <slot />
    </div>
  </div>
  <div
    class="relative h-16 w-full -mt-16 bg-linear-to-b from-transparent"
    class:to-base-100={!showMore && !contentFits}
    class:to-transparent={showMore || contentFits}
  ></div>
  {#if !contentFits}
    <button
      class="btn btn-neutral btn-sm mt-3 mx-auto"
      on:click={() => (showMore = !showMore)}
    >
      Toon {showMore ? "minder" : "meer"}
    </button>
  {/if}
</div>
