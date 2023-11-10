<script lang="ts">
  import { goto } from "$app/navigation"
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import FullDuration from "$components/formHelpers/FullDuration.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import NewRecordForm from "$components/records/NewRecordForm.svelte"
  import TablePagination from "$components/table/TableFooter.svelte"
  import TableHeaderRow from "$components/table/TableHeaderRow.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { clubRecordStore } from "$lib/stores/ClubRecordStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import {
    faCheck,
    faPen,
    faSearch,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"

  $: allRecords = $clubRecordStore
    ?.flatMap((e) => {
      e.records.forEach((f) => f.linkClubrecord(e))
      return e.records
    })
    .filter((e) => e.checked)

  let showForm = false

  // -- Search --
  let searchString = ""

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Clubrecords beheren")
</script>

<!-- Title -->
<div class="flex gap-3 mb-2">
  <h1 class="text-2xl font-bold">Clubrecords beheren</h1>
</div>

{#if showForm}
  <div class="mt-2">
    <NewRecordForm bind:showForm />
  </div>
{/if}

{#if $clubRecordStore}
  <div class="mt-2">
    <Input
      type="text"
      bind:value={searchString}
      placeholder="Zoek een clubrecord"
      iconLeft={faSearch}
    />
  </div>

  <div class="mt-2 flex gap-2 items-center w-full">
    <span class="font-bold">Filters: </span>
    <div class="flex gap-1 whitespace-nowrap">
      <Checkbox value={true} />
      Niet goedgekeurd
    </div>
    <div class="flex gap-1">
      <Checkbox value={false} />
      Goedgekeurd
    </div>
  </div>

  <div class="grid relative mt-2">
    <div class="overflow-x-auto rounded-t-lg">
      <table class="table static table-xs sm:table-sm md:table-md">
        <thead class="bg-base-200">
          <TableHeaderRow
            columns={[
              { name: "", class: "xl:hidden" },
              { name: "Disipline" },
              { name: "In/outdoor" },
              { name: "Categorie" },
              { name: "Geslacht" },
              { name: "Naam" },
              { name: "Prestatie" },
              { name: "Locatie" },
              { name: "Datum" },
              { name: "", class: "hidden xl:block" },
            ]}
          />
        </thead>
        <tbody>
          {#each allRecords as recordInstance}
            <tr>
              <td class="flex gap-2 xl:hidden">
                <button
                  type="button"
                  class="btn btn-sm btn-outline btn-square btn-success"
                  title="Goedkeuren"
                >
                  <Fa icon={faCheck} />
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline btn-square btn-error"
                  title="Afwijzen"
                >
                  <Fa icon={faXmark} />
                </button>
              </td>
              <td class="first-letter:capitalize">
                {recordInstance.clubRecord?.discipline}
              </td>
              <td>{recordInstance.clubRecord?.athleticEvent}</td>
              <td>{recordInstance.clubRecord?.category}</td>
              <td>{recordInstance.clubRecord?.gender}</td>
              <td class="max-w-xs break-words">
                {recordInstance.name}
              </td>
              <td>{recordInstance.result}</td>
              <td>{recordInstance.location}</td>
              <td>{recordInstance.formattedDate()}</td>
              <td class="gap-2 hidden xl:flex items-center">
                {#if recordInstance.checked}
                  <div class="flex text-success items-center gap-1">
                    <Fa icon={faCheck} />
                    Goedgekeurd
                  </div>
                {:else}
                  <button
                    type="button"
                    class="btn btn-sm btn-outline btn-square btn-success"
                    title="Goedkeuren"
                  >
                    <Fa icon={faCheck} />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline btn-square btn-error"
                    title="Afwijzen"
                  >
                    <Fa icon={faXmark} />
                  </button>
                {/if}

                <button
                  type="button"
                  class="btn btn-sm btn-ghost btn-square"
                  title="Aanpassen"
                  on:click={() => (showForm = true)}
                >
                  <Fa icon={faPen} />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <TablePagination
      filteredLength={allRecords.length}
      fullLength={allRecords.length}
      saving={false}
    />
  </div>
{/if}
