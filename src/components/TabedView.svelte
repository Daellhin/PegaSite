<script lang="ts">
  // this component is limited by the inability of svelte to use dynamic named slots
  // thus the max amount of tabs is 4 (add more if needed)
  export let tabs: string[]

  let currentIndex = 0

  function selectTab(tabIndex: number) {
    currentIndex = tabIndex
  }
</script>

<div class="grid">
  <div class="tabs z-10 -mb-px border-b-0">
    {#each tabs as tab, index}
      <button
        on:click={() => selectTab(index)}
        class="tab tab-lifted [--tab-bg:hsl(var(--b2))] border-b-0 [@media(max-width:568px)]:after:hidden [@media(max-width:568px)]:before:hidden [@media(max-width:568px)]:rounded-lg"
        class:tab-active={currentIndex === index}
      >
        {tab}
      </button>
    {/each}
  </div>

  <div
    class="bg-base-300 relative overflow-x-auto rounded-2xl [@media(min-width:568px)]:rounded-tl-none"
  >
    <div
      class="border border-base-300 bg-base-200 min-h-[6rem] min-w-[18rem] overflow-x-hidden p-4"
    >
      {#if currentIndex == 0}
        <slot name="0" />
      {:else if currentIndex == 1}
        <slot name="1" />
      {:else if currentIndex == 2}
        <slot name="2" />
      {:else if currentIndex == 3}
        <slot name="3" />
      {/if}
    </div>
  </div>
</div>
