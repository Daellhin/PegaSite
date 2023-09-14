<script lang="ts">
  import SearchInput from "$components/formHelpers/inputs/SearchInput.svelte"
  import SortableTableHeaderRow from "$components/table/SortableTableHeaderRow.svelte"
  import UserRow from "$components/users/UserRow.svelte"
  import type { DbUser } from "$lib/domain/DbUser"
  import { SortOrder } from "$lib/domain/dataClasses/SortOrder"
  import TablePagination from "$components/table/TableFooter.svelte"

  export let users: DbUser[]

  // -- Search --
  let searchString = ""

  $: filteredUsers =
    users?.filter((user) => user.matchesSearchString(searchString)) || []

  // -- Sort --
  let sortColumn = ""
  let sortOrder = SortOrder.None

  $: sortedUsers = sort(filteredUsers, sortColumn, sortOrder)

  function sort(users: DbUser[], sortColumn: string, sortOrder: SortOrder) {
    if (sortOrder.isNone) return [...users]
    const newArray = [...users]
    switch (sortColumn) {
      case "Naam":
        newArray.sort((a, b) => a.displayName.localeCompare(b.displayName))
        break
      case "Email":
        newArray.sort((a, b) => a.email.localeCompare(b.email))
        break
      case "Rol":
        newArray.sort((a, b) => a.role.localeCompare(b.role))
        break
      case "Aangemaakt":
        newArray.sort((a, b) =>
          a.creationTimestamp.isAfter(b.creationTimestamp) ? 1 : -1
        )
        break
    }
    if (sortOrder.isDesc) newArray.reverse()
    return newArray
  }
</script>

<SearchInput
  id="search"
  class="mt-3"
  bind:value={searchString}
  placeholder="Zoek een gebruiker "
/>

<div class="mt-3 grid">
  <div class="overflow-x-auto rounded-t-lg">
    <table class="table">
      <thead class="bg-base-200">
        <SortableTableHeaderRow
          columns={[
            { name: "Nr", dontSort: true },
            { name: "Naam" },
            { name: "Email" },
            { name: "Rol" },
            { name: "Aangemaakt" },
          ]}
          bind:sortColumn
          bind:sortOrder
        />
      </thead>
      <tbody>
        {#each sortedUsers as user, n}
          <UserRow {user} index={n} />
        {/each}
      </tbody>
    </table>
  </div>
  <TablePagination
    filteredLength={filteredUsers.length}
    fullLength={users.length}
  />
</div>
