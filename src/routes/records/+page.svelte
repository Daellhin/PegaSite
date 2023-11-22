<script lang="ts">
    import Input from "$components/formHelpers/Input.svelte"
  import NewRecordForm from "$components/records/NewRecordForm.svelte"
  import RecordsList from "$components/records/RecordsList.svelte"
  import { Category } from "$lib/domain/dataClasses/Category"
  import { clubRecordStore } from "$lib/stores/ClubRecordStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { faSearch } from "@fortawesome/free-solid-svg-icons"

  let searchString = ""
  let showForm = false

  pageHeadStore.updatePageTitle("Clubrecords")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
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
<div class="mt-2">
  <Input
    type="text"
    bind:value={searchString}
    placeholder="Zoek een clubrecord"
    iconLeft={faSearch}
  />
</div>

<!-- Records -->
{#if $clubRecordStore}
  {#each Category.Categories as category}
    <div class="mx-auto my-2">
      <RecordsList {category} {searchString} />
    </div>
  {/each}
{:else}
  Loading
{/if}
