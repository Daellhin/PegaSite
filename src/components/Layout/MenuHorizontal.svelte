<script lang="ts">
  import { LinkGroup } from "$lib/domain/Link";
  import { navbarStore } from "$lib/stores/NavbarStore";
</script>

{#if $navbarStore}
  <ul class="menu menu-horizontal rounded-box p-2 bg-base-200">
    <!-- Can only handle linkGroups 1 deep -->
    {#each $navbarStore as linkOrGroup}
      {#if linkOrGroup instanceof LinkGroup}
        <li tabindex="0" class="z-10">
          <span>{linkOrGroup.name}</span>
          <ul class="rounded-box bg-base-100 p-2 shadow-2xl">
            {#each linkOrGroup.links as linkInner}
              <li><a href={linkInner.url}>{linkInner.name}</a></li>
            {/each}
          </ul>
        </li>
      {:else}
        <li><a href={linkOrGroup.url}>{linkOrGroup.name}</a></li>
      {/if}
    {/each}
  </ul>
{/if}
