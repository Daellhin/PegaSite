<script lang="ts">
  import BiggerPicture from "bigger-picture/svelte"
  import { tweened } from "svelte/motion"
  import { fade } from "svelte/transition"
  import { cubicOut } from "svelte/easing"
  import { resize } from "./actions"

  // store if user prefers reduced motion
  export const prefersReducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  let internalOptions: null

  let biggerPictureInstance: BiggerPicture
  let biggerPictureItems: any[] = []
  let position: number | undefined

  let thumbsWidth: number
  let containerWidth: number
  let initialTranslate = 0
  let isPointerDown: boolean
  let pointerDownPos: number
  let hasDragged: boolean
  let dragPositions: any[] = []
  let focusWrap: HTMLElement

  let translate = tweened(0, {
    easing: cubicOut,
    duration: prefersReducedMotion ? 0 : 250,
  })

  $: if (position !== undefined) {
    // make sure button is in view when position updates
    setTimeout(scrollToButton, 0)
  }

  export function open(options: any) {
    internalOptions = options
  }

  function boundTranslate(int: number) {
    if (int >= 0) {
      int = 0
    } else if (int < containerWidth - thumbsWidth - 1) {
      int = containerWidth - thumbsWidth - 1
    }
    return int
  }

  // moves active thumb button into view
  function scrollToButton(button: HTMLElement) {
    // set button to active
    let activeBtn = button || focusWrap.querySelector(".active")
    // move button into view if off screen (changing translate value)
    let { left, right, width } = activeBtn.getBoundingClientRect()
    let margin = 3
    let { offsetLeft } = activeBtn
    if (left + width > containerWidth) {
      $translate = boundTranslate(-offsetLeft - width + containerWidth - margin)
    } else if (right - width < 0) {
      $translate = boundTranslate(-offsetLeft + margin)
    }
  }

  function pointerDown(e: PointerEvent) {
    if (thumbsWidth < containerWidth) {
      return
    }
    let { clientX } = e
    isPointerDown = true
    pointerDownPos = clientX
  }

  function pointerMove(e: PointerEvent) {
    if (isPointerDown) {
      let { clientX } = e
      let dragAmount = -(pointerDownPos - clientX)
      if (hasDragged) {
        translate.set(boundTranslate(initialTranslate + dragAmount), {
          duration: 0,
        })
        dragPositions.push(clientX)
      } else {
        hasDragged = Math.abs(dragAmount) > 5
      }
    }
  }
  function pointerUp() {
    if (hasDragged) {
      // drag inertia
      dragPositions = dragPositions.slice(-3)
      let xDiff = dragPositions[1] - dragPositions[2]
      xDiff = dragPositions[0] - dragPositions[2]
      if (Math.abs(xDiff) > 5) {
        $translate = boundTranslate($translate - xDiff * 5)
      }
    }
    dragPositions = []
    isPointerDown = hasDragged = false
    initialTranslate = $translate
  }

  const onMount = (bpWrap) => {
    biggerPictureInstance = new BiggerPicture({
      target: bpWrap,
    })
    biggerPictureInstance.open({
      ...internalOptions,
      focusWrap,
      onOpen: () => (biggerPictureItems = biggerPictureInstance.items),
      onUpdate(container, activeItem) {
        position = activeItem.i
      },
      onClose: () => (internalOptions = null),
    })
  }
</script>

{#if internalOptions}
  <div
    class="thumbnail-wrap"
    bind:this={focusWrap}
    on:pointermove={pointerMove}
    on:pointerup={pointerUp}
    on:pointercancel={pointerUp}
    use:resize
    on:bp:resize={({ detail }) => {
      containerWidth = detail.cr.width
      $translate = 0
    }}
  >
    <div class="thumbnail-bp" use:onMount />
    <div
      class="thumbnails"
      transition:fade={{
        easing: cubicOut,
        duration: prefersReducedMotion ? 0 : 480,
      }}
    >
      <div
        style:transform="translatex({$translate}px"
        on:pointerdown={pointerDown}
        use:resize
        on:bp:resize={({ detail }) => {
          thumbsWidth = detail.cr.width
        }}
      >
        <div>
          {#each biggerPictureItems as element (element.i)}
            <button
              title={element.alt}
              aria-label={element.alt}
              style:background-image="url({element.thumb})"
              class:active={element.i === position}
              on:focus={(e) => scrollToButton(e.target)}
              on:pointerup={() =>
                !hasDragged && biggerPictureInstance.setPosition(element.i)}
              on:keyup={(e) =>
                e.key === "Enter" &&
                biggerPictureInstance.setPosition(element.i)}
            />
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .thumbnail-wrap :global(.bp-wrap) {
    contain: layout size;
  }
  .thumbnail-bp :global(.bp-wrap) {
    position: absolute;
  }
  .thumbnail-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    contain: strict;
  }
  .thumbnail-bp {
    flex-grow: 1;
    position: relative;
  }
  .thumbnails {
    width: 100%;
    height: 75px;
    position: relative;
    background: #12161a;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.75);
  }
  .thumbnails > div {
    display: table;
    margin: 0 auto;
    height: 100%;
  }
  .thumbnails > div div {
    display: flex;
    padding: 4px 0;
    touch-action: none;
  }
  .thumbnails button {
    cursor: pointer;
    flex-shrink: 0;
    background: transparent;
    border: 0;
    padding: 0;
    height: 67px;
    width: 85px;
    border-radius: 2px;
    margin: 0 2px;
    user-select: none;
    background-size: cover;
    background-position: center;
    opacity: 0.7;
    transition: opacity 0.15s;
  }
  .thumbnails button:hover,
  .thumbnails button:focus {
    opacity: 0.85;
  }
  .thumbnails button.active {
    opacity: 1;
  }
</style>
