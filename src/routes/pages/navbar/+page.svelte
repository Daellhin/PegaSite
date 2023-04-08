<script lang="ts">
  import ToolbarDropdownEditor from "$components/toolbar/ToolbarDropdownEditor.svelte";
  import { navbarStore } from "$lib/stores/NavbarStore";
  import MdInfoOutline from "svelte-icons/md/MdInfoOutline.svelte";
</script>

<h1 class="text-2xl font-bold mb-1">Navigatiebalk wijzigen</h1>

<div class="alert shadow-md w-fit">
  <div>
    <div class="text-info flex-shrink-0 w-6 h-6"><MdInfoOutline /></div>
    <span>
      Categoriën met 1 link worden samengevouwen. De link titel is dan niet
      aanpasbaar, maar word overgenomen van de categorie.
    </span>
  </div>
</div>

{#if $navbarStore}
  <div class="sm:ml-4 flex flex-col mt-3 gap-5">
    {#each $navbarStore as linkGroup}
      <ToolbarDropdownEditor {linkGroup} />
    {:else}
      Geen links
    {/each}
  </div>
  <button class="btn btn-primary mt-3">Categorie toevoegen</button>
{:else}
  loading
{/if}
