<script lang="ts">
  import Input from "$components/formHelpers/Input.svelte"
  import SortableTableHeaderRow from "$components/table/SortableTableHeaderRow.svelte"
  import TableFooter from "$components/table/TableFooter.svelte"
  import UserRow from "$components/users/UserRow.svelte"
  import type { DbUser } from "$lib/domain/DbUser"
  import { SortOrder } from "$lib/domain/dataClasses/SortOrder"
  import { faSearch } from "@fortawesome/free-solid-svg-icons"

  export let users: DbUser[]

  let savingRole = false
  let updateRoleError = ""

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
        newArray.sort((a, b) =>
          a.getHighestRole().localeCompare(b.getHighestRole()),
        )
        break
      case "Aangemaakt":
        newArray.sort((a, b) =>
          a.creationTimestamp.isAfter(b.creationTimestamp) ? 1 : -1,
        )
        break
    }
    if (sortOrder.isDesc) newArray.reverse()
    return newArray
  }
</script>

<!-- Search -->
<div class="mt-3">
  <Input
    type="text"
    bind:value={searchString}
    placeholder="Zoek een gebruiker"
    iconLeft={faSearch}
  />
</div>

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
          <UserRow
            {user}
            index={n}
            bind:saving={savingRole}
            bind:updateRoleError
          />
        {/each}
      </tbody>
    </table>
  </div>
  <TableFooter
    filteredLength={filteredUsers.length}
    fullLength={users.length}
    saving={savingRole}
    error={updateRoleError}
  />
</div>
