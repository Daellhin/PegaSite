<script lang="ts">
  import { LinkGroup } from "$lib/domain/Link";
  import { navbarStore } from "$lib/stores/NavbarStore";

  export let drawerID: string;

  function closeDrawer() {
    const drawerInput = document.querySelector<HTMLInputElement>(
      `#${drawerID}`
    );
    if (drawerInput) {
      drawerInput.checked = false;
    }
  }
</script>

{#if $navbarStore}
  <ul class="menu p-4 w-80 bg-base-100">
    <!-- Can only handle linkGroups 1 deep -->
    {#each $navbarStore as linkOrGroup}
      {#if linkOrGroup instanceof LinkGroup}
        <li class="menu-title text-base">
          <span>{linkOrGroup.name}</span>
        </li>
        <div class="font-bold ml-4 pl-2 border-l-2">
          {#each linkOrGroup.links as linkInner}
            <li class="font-bold">
              <a href={linkInner.url} on:click={closeDrawer}>{linkInner.name}</a
              >
            </li>
          {/each}
        </div>
      {:else}
        <li class="font-bold">
          <a href={linkOrGroup.url} on:click={closeDrawer}>{linkOrGroup.name}</a
          >
        </li>
      {/if}
    {/each}
  </ul>
{/if}
