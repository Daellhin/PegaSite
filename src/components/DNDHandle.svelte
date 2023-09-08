<script lang="ts">
  import { faGripVertical } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let dragDisabled: boolean

  function startDrag(e: { preventDefault: () => void }) {
    // Prevent default to prevent lag on touch devices
    // (because of the browser checking for screen scrolling)
    e.preventDefault()
    dragDisabled = false
  }
  function handleKeyDown(e: { key: string }) {
    if ((e.key === "Enter" || e.key === " ") && dragDisabled) {
      dragDisabled = false
    }
  }
  function handleUp() {
    dragDisabled = true
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  role="application"
  aria-labelledby="drag-handle"
  tabindex={dragDisabled ? 0 : -1}
  class="my-auto"
  style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
  on:mousedown={startDrag}
  on:touchstart={startDrag}
  on:keydown={handleKeyDown}
  on:mouseup={handleUp}
>
  <Fa icon={faGripVertical} class="w-5 h-5" />
</div>
