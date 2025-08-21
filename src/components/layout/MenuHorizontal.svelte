<script lang="ts">
  import { navbarStore } from "$lib/stores/NavbarStore"
</script>

{#if $navbarStore}
  <ul class="menu menu-horizontal rounded-box p-2 bg-base-200">
    {#each $navbarStore as linkGroup}
      {#if linkGroup.links.length === 1}
        <a
          class="btn text-[1.1em] shadow-none"
          href={linkGroup.links[0].getUrl()}
        >
          {linkGroup.links[0].title}
        </a>
      {:else}
        <div class="dropdown dropdown-hover">
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label tabindex="0" class="btn text-[1.1em] shadow-none">
            {linkGroup.name}
          </label>
          <ul class="dropdown-content z-10 rounded-box bg-base-100 p-2 shadow-2xl">
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
