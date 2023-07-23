<script lang="ts">
  import { navbarStore } from "$lib/stores/NavbarStore"
</script>

{#if $navbarStore}
  <ul class="menu menu-horizontal rounded-box p-2 bg-base-200">
    {#each $navbarStore as linkGroup}
      {#if linkGroup.links.length === 1}
        <a
          class="btn normal-case text-[1.1em]"
          href={linkGroup.links[0].getUrl()}
        >
          {linkGroup.links[0].title}
        </a>
      {:else}
        <div class="dropdown dropdown-hover">
          <button tabindex="0" class="btn normal-case text-[1.1em]">
            {linkGroup.name}
          </button>
          <ul class="dropdown-content z-[1] rounded-box bg-base-100 p-2 shadow-2xl">
            {#each linkGroup.links as linkInner}
              <li>
                <a class="text-[15px]" href={linkInner.getUrl()}>
                  {linkInner.title}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/each}
  </ul>
{/if}
