<script lang="ts">
  import { navbarStore } from "$lib/stores/NavbarStore";
</script>

{#if $navbarStore}
  <ul class="menu menu-horizontal rounded-box p-2 bg-base-200">
    {#each $navbarStore as linkGroup}
      {#if linkGroup.links.length === 1}
        <li>
          <a href={linkGroup.links[0].url}>{linkGroup.links[0].name}</a>
        </li>
      {:else}
        <li tabindex="0" class="z-10">
          <span>{linkGroup.name}</span>
          <ul class="rounded-box bg-base-100 p-2 shadow-2xl">
            {#each linkGroup.links as linkInner}
              <li><a href={linkInner.url}>{linkInner.name}</a></li>
            {/each}
          </ul>
        </li>
      {/if}
    {/each}
  </ul>
{/if}
