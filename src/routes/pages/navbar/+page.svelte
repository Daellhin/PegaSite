<script lang="ts">
  import { goto } from "$app/navigation";
  import ToolbarDropdownEditor from "$components/Toolbar/ToolbarDropdownEditor.svelte";
  import { authStore } from "$lib/stores/AuthStore";
  import { navbarStore } from "$lib/stores/NavbarStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import MdInfoOutline from "svelte-icons/md/MdInfoOutline.svelte";

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // Page title
  pageHeadStore.updatePageTitle("Navigatiebalk wijzigen");
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
{:else}
  loading
{/if}
