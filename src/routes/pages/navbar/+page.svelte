<script lang="ts">
  import { goto } from "$app/navigation";
  import InfoCard from "$components/InfoCard.svelte";
  import LinkGroupEditor from "$components/page/LinkGroupEditor.svelte";
  import { authStore } from "$lib/stores/AuthStore";
  import { navbarStore } from "$lib/stores/NavbarStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";

  // Authguard
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // Page title
  pageHeadStore.updatePageTitle("Navigatiebalk wijzigen");
</script>

<h1 class="text-2xl font-bold mb-1">Navigatiebalk wijzigen</h1>

<InfoCard>
  Categoriën met <span class="font-semibold">1</span> link worden samengevouwen.
  De link titel is dan niet aanpasbaar, maar word overgenomen van de categorie.
</InfoCard>

{#if $navbarStore}
  <div class="sm:ml-4 flex flex-col mt-3 gap-5">
    {#each $navbarStore as linkGroup}
      <LinkGroupEditor {linkGroup} />
    {:else}
      Geen links
    {/each}
  </div>
{:else}
  loading
{/if}
