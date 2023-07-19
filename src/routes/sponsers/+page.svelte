<script lang="ts">
  import { goto } from "$app/navigation";
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte";
  import SponserForm from "$components/sponsers/SponserForm.svelte";
  import SponserRow from "$components/sponsers/SponserRow.svelte";
  import SortableTableHeaderRow from "$components/table/SortableTableHeaderRow.svelte";
  import { authStore } from "$lib/stores/AuthStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";

  let showForm = false;
  let searchString = "";
  let sortField = "";
  let ascDesc = 0;

  let sponsers = [""];

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/");
  });
  // -- Page title --
  pageHeadStore.updatePageTitle("Sponsers wijzigen");
</script>

<div class="flex gap-3">
  <h1 class="text-2xl font-bold">Sponsers wijzigen</h1>
  <button
    class="btn btn-sm capitalize btn-primary"
    on:click={() => (showForm = !showForm)}
  >
    Nieuwe Sponser
  </button>
</div>

{#if showForm}
  <div class="my-2">
    <SponserForm bind:showForm />
  </div>
{/if}

<SearchInput
  class="mt-3"
  bind:value={searchString}
  placeholder="Zoek een sponser "
/>

<div class="mt-3">
  <div class="overflow-auto rounded-t-lg">
    <table class="table">
      <thead class="bg-base-200">
        <SortableTableHeaderRow
          columns={[
            { name: "Nr", dontSort: true },
            { name: "Naam" },
            { name: "Website" },
            { name: "Afbeelding" },
            { name: "", dontSort: true },
          ]}
          onClick={(e, a) => {
            sortField = e;
            ascDesc = a;
          }}
        />
      </thead>
      <tbody>
        {#each sponsers as sponser, n}
            <SponserRow  index={n} />
          {/each}
      </tbody>
    </table>
  </div>
  <div class="flex items-center justify-between mt-4">
    <div class="opacity-80">
      Weergegeven <span class="font-bold opacity-100">{sponsers.length}</span>
      van
      <span class="font-bold opacity-100">{sponsers.length}</span>
    </div>
    <div class="join">
      <button class="join-item btn btn-sm">«</button>
      <button class="join-item btn btn-sm btn-active">1</button>
      <button class="join-item btn btn-sm">»</button>
    </div>
  </div>
</div>
