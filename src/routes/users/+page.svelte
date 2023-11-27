<script lang="ts">
  import { goto } from "$app/navigation"
  import InfoCard from "$components/InfoCard.svelte"
  import NewUserForm from "$components/users/UserForm.svelte"
  import UserTable from "$components/users/UserTable.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"
  import { userStore } from "$lib/stores/UserStore"

  let showForm = false

  // -- Authguard --
  $: authStore.dbUser.then((dbUser) => {
    if (!dbUser || !dbUser.roles.includes("admin")) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Gebruikers")
</script>

<div class="flex gap-3">
  <h1 class="text-2xl font-bold mb-1">Gebruikers beheren</h1>
  <button
    class="btn btn-sm btn-primary"
    on:click={() => (showForm = !showForm)}
  >
    Nieuwe Gebruiker
  </button>
</div>

{#if showForm}
  <div class="mt-2">
    <NewUserForm bind:showForm />
  </div>
{/if}

<InfoCard class="mt-2">
  Om veiligheidsredenen is het niet mogelijk om gebruikers via de site te
  verwijderen. Indien nodig kan de site administrator dit doen in de databank
  console
</InfoCard>

{#if $userStore}
  <UserTable users={$userStore} />
{:else}
  Loading
{/if}
