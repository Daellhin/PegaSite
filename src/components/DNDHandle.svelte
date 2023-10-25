<script lang="ts">
  import { faGripVertical } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  export let dragDisabled: boolean
  export let disabled = false

  function startDrag(e: { preventDefault: () => void }) {
    // Prevent default to prevent lag on touch devices
    // (because of the browser checking for screen scrolling)
    e.preventDefault()
    if (disabled) return
    dragDisabled = false
  }
  function handleKeyDown(e: { key: string }) {
    if (disabled) return
    if ((e.key === "Enter" || e.key === " ") && dragDisabled)
      dragDisabled = false
  }
  function handleUp() {
    if (disabled) return
    dragDisabled = true
  }
</script>

<span
  role="button"
  aria-labelledby="drag-handle"
  tabindex={dragDisabled && !disabled ? 0 : -1}
  class="my-auto"
  class:cursor-grab={dragDisabled && !disabled}
  class:cursor-grabbing={!dragDisabled && !disabled}
  class:cursor-not-allowed={disabled}
  on:mousedown={startDrag}
  on:touchstart={startDrag}
  on:keydown={handleKeyDown}
  on:mouseup={handleUp}
>
  <Fa icon={faGripVertical} class="w-5 h-5" />
</span>
