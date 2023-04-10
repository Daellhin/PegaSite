<script lang="ts">
  import NewRecordForm from "$components/Records/NewRecordForm.svelte";
  import RecordsTable from "$components/Records/RecordsTable.svelte";
  import { Category } from "$lib/domain/data-classes/Category";
  import { clubRecordStore } from "$lib/stores/ClubRecordStore";
  import { pageHeadStore } from "$lib/stores/PageHeadStore";
  import IoMdSearch from "svelte-icons/io/IoIosSearch.svelte";

  let searchString = "";
  let showForm = false;

  pageHeadStore.updatePageTitle("Clubrecords")
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
<div class="relative">
  <div class="absolute inset-y-0 left-0 flex items-center pl-3">
    <div class="w-5 h-5"><IoMdSearch /></div>
  </div>
  <input
    type="text"
    placeholder="Zoek een clubrecord"
    class="input input-bordered input-md border-2 max-w-sm mt-2 block w-full p-4 pl-9"
    bind:value={searchString}
  />
</div>

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
