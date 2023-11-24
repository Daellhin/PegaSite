<script lang="ts">
  import { goto } from "$app/navigation"
  import InfoCard from "$components/InfoCard.svelte"
  import LinkGroupEditor from "$components/page/NavbarGroupEditor.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { navbarStore } from "$lib/stores/NavbarStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { FLIP_DURATION } from "$lib/utils/Constants"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { dndzone } from "svelte-dnd-action"

  // -- Drag and drop --
  let savingNewOrder = false
  let errorMessage = ""
  let dragDisabled = true

  $: dragableLinkGroups = $navbarStore?.map((e) =>
    e.toDragableDragableItem()
  )

  function handleConsider(event: CustomEvent<DndEvent<any>>) {
    dragableLinkGroups = event.detail.items
    dragDisabled = true
  }
  async function handleFinalize(event: CustomEvent<DndEvent<any>>) {
    savingNewOrder = true
    dragDisabled = true
    errorMessage = ""
    try {
      dragableLinkGroups = event.detail.items
      const newSortedLinkGroups = dragableLinkGroups.map((e) => e.value)
      await navbarStore.updateLinkGroupOrder(newSortedLinkGroups)
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
    savingNewOrder = false
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Navigatiebalk wijzigen")
</script>

<h1 class="text-2xl font-bold mb-1">Navigatiebalk wijzigen</h1>

<InfoCard>
  Categoriën met <span class="font-semibold">1</span> link worden samengevouwen.
  De link titel is dan niet aanpasbaar, maar word overgenomen van de categorie.
</InfoCard>

{#if $navbarStore}
  <div
    class="sm:ml-2 flex flex-col mt-3 gap-5"
    use:dndzone={{
      items: dragableLinkGroups,
      dragDisabled: dragDisabled,
      flipDurationMs: FLIP_DURATION,
      dropTargetStyle: {},
	  type: "NavbarGroup"
    }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
  >
    {#each dragableLinkGroups as dragable (dragable.id)}
      <LinkGroupEditor linkGroup={dragable.value} bind:dragDisabled bind:savingNewOrder />
    {:else}
      Geen links
    {/each}
  </div>
  {#if savingNewOrder}
    <div class="mt-2 flex items-center gap-1">
      Herorderingen worden opgeslagen <span
        class="loading loading-spinner loading-xs"
      />
    </div>
  {/if}
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
{:else}
  Loading
{/if}
