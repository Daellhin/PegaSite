<script lang="ts">
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte";
  import NewRecordForm from "$components/records/NewRecordForm.svelte";
  import RecordsTable from "$components/records/RecordsTable.svelte";
  import { Category } from "$lib/domain/data-classes/Category";
  import { clubRecordStore } from "$lib/stores/ClubRecordStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";

  let searchString = "";
  let showForm = false;

  pageHeadStore.updatePageTitle("Clubrecords");
</script>

<!-- Title -->
<div class="flex gap-3">
  <h1 class="text-2xl font-bold">Clubrecords</h1>
  <button
    class="btn btn-sm capitalize btn-primary"
    on:click={() => (showForm = !showForm)}
  >
    Nieuw Record
  </button>
</div>

<!-- Create Record -->
{#if showForm}
  <div class="mt-2">
    <NewRecordForm bind:showForm />
  </div>
{/if}

<!-- Search -->
<SearchInput bind:value={searchString} placeholder="Zoek een clubrecord" />

<!-- Records -->
{#if $clubRecordStore}
  {#each Category.Categories as category}
    <div class="mx-auto my-2">
      <RecordsTable {category} {searchString} />
    </div>
  {/each}
  {#each Category.Categories as category}
    <div class="mx-auto my-2">
      <RecordsTable {category} {searchString} />
    </div>
  {/each}
{:else}
  loading
{/if}
