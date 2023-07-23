<script lang="ts">
  import { goto } from "$app/navigation";
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte";
  import SponserForm from "$components/sponsers/SponserForm.svelte";
  import SponserRow from "$components/sponsers/SponserRow.svelte";
  import SortableTableHeaderRow from "$components/table/SortableTableHeaderRow.svelte";
  import type { Sponser } from "$lib/domain/Sponser";
  import { SortOrder } from "$lib/domain/dataClasses/SortOrder";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import { sponserStore } from "$lib/stores/SponserStore";

  let showForm = false;
  let searchString = "";
  let sortField = "";
  let sortOrder = SortOrder.None;

  let editSponser: Sponser | undefined = undefined;

  $: filteredSponsers = $sponserStore?.filter((sponser) =>
    sponser.matchesSearchString(searchString)
  );
  $: sortedSponsers = sort(filteredSponsers, sortField, sortOrder);

  function sort(sponsers: Sponser[], sortField: string, sortOrder: SortOrder) {
    if (sortOrder.none) return [...(filteredSponsers || [])];
    const newArray = [...sponsers];
    switch (sortField) {
      case "Naam":
        newArray.sort((a, b) => b.name.localeCompare(a.name));
      case "Website":
        newArray.sort((a, b) => b.url.localeCompare(a.url));
    }
    if (sortOrder.desc) newArray.reverse();
    return newArray;
  }

  function startEdit(sponser: Sponser) {
    showForm = true;
    editSponser = sponser;
  }
  function dismisForm() {
    showForm = false;
    editSponser = undefined;
  }
  function showFormHandler() {
    showForm = true;
    editSponser = undefined;
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // -- Page title --
  pageHeadStore.updatePageTitle("Sponsers wijzigen");
</script>

<div class="flex gap-3">
  <h1 class="text-2xl font-bold">Sponsers wijzigen</h1>
  <button class="btn btn-sm capitalize btn-primary" on:click={showFormHandler}>
    Nieuwe Sponser
  </button>
</div>

{#if showForm}
  <div class="my-2">
    <SponserForm bind:showForm bind:editSponser onDismiss={dismisForm} />
  </div>
{/if}

<SearchInput
  class="mt-3"
  bind:value={searchString}
  placeholder="Zoek een sponser "
/>

{#if $sponserStore}
  <div class="mt-3 grid relative">
    <div class="overflow-x-auto rounded-t-lg">
      <table class="table static">
        <thead class="bg-base-200">
          <SortableTableHeaderRow
            columns={[
              { name: "Nr", dontSort: true },
              { name: "Naam" },
              { name: "Website" },
              { name: "Afbeelding", dontSort: true },
              { name: "", dontSort: true },
            ]}
            onClick={(column, order) => {
              sortField = column;
              sortOrder = order;
            }}
          />
        </thead>
        <tbody>
          {#each sortedSponsers as sponser, n}
            <SponserRow {sponser} index={n} editHandler={startEdit} />
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex items-center justify-between mt-4">
      <div class="opacity-80">
        Weergegeven
        <span class="font-bold opacity-100">{filteredSponsers.length}</span>
        van
        <span class="font-bold opacity-100">{filteredSponsers.length}</span>
      </div>
      <div class="join">
        <button class="join-item btn btn-sm">«</button>
        <button class="join-item btn btn-sm btn-active">1</button>
        <button class="join-item btn btn-sm">»</button>
      </div>
    </div>
  </div>
{:else}
  Loading
{/if}
