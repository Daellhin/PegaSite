<script lang="ts">
  import { Category } from "$lib/classes/dataClasses/Category";
  import NewRecordForm from "$components/Records/NewRecordForm.svelte";
  import RecordsTable from "$components/Records/RecordsTable.svelte";
  import { RECORDS } from "$lib/mock/mockRecords";

  let searchString = "";
  let showInputs = false;

  function toggleShowInputs() {
    showInputs = !showInputs;
  }
  function hideInputs() {
    showInputs = false;
  }
</script>

<div class="">
  <div class="flex gap-3">
    <h1 class="text-2xl font-bold">Clubrecords</h1>
    <button class="btn btn-sm capitalize btn-primary" on:click={toggleShowInputs}
      >Nieuw Record</button
    >
  </div>
  {#if showInputs}
    <div class="mt-2">
      <NewRecordForm {hideInputs} />
    </div>
  {/if}

  <input
    type="text"
    placeholder="Zoek een clubrecord"
    class="input input-bordered input-md border-2 w-full max-w-xs mt-2"
    bind:value={searchString}
  />
</div>

<!-- <button class="btn btn-sm" on:click={hideAll}>Verberg alle</button> -->

{#each Category.Categories as category}
  <div class="mx-auto my-2">
    <RecordsTable {category} {searchString} />
  </div>
{/each}
