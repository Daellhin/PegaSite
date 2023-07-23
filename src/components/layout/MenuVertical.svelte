<script lang="ts">
  import { navbarStore } from "$lib/stores/NavbarStore"

  export let drawerID: string

  function closeDrawer() {
    const drawerInput = document.querySelector<HTMLInputElement>(
      `#${drawerID}`
    )
    if (drawerInput) {
      drawerInput.checked = false
    }
  }
</script>

{#if $navbarStore}
  <ul class="menu p-4 w-80 bg-base-100">
    {#each $navbarStore as linkOrGroup}
      <li class="menu-title text-base">
        <span>{linkOrGroup.name}</span>
      </li>
      <div class="font-bold ml-4 pl-2 border-l-2">
        {#each linkOrGroup.links as linkInner}
          <li class="font-bold">
            <a href={linkInner.getUrl()} on:click={closeDrawer}>{linkInner.title}</a>
          </li>
        {/each}
      </div>
    {/each}
  </ul>
{/if}
