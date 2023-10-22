<script lang="ts">
  import { goto } from "$app/navigation"
  import SavableInput from "$components/formHelpers/SavableInput.svelte"
  import UpdatePaswordForm from "$components/profile/UpdatePaswordForm.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"

  let email = ""
  let name = ""

  function init() {
    email = $authStore!.email || ""
    name = $authStore!.displayName || ""
    return true
  }

  // -- Authguard --
  $: authStore.known.then(() => {
    if (!$authStore) goto("/")
  })
  // -- Page title --
  pageHeadStore.updatePageTitle("Profiel")
</script>

{#if $authStore && init()}
  <div class="flex flex-row gap-2 items-center">
    <h1 class="text-2xl font-bold">Profiel</h1>
    {#await authStore.dbUser then dbUser}
      {#if dbUser}
        <div class="badge badge-primary capitalize">
          {dbUser.getHighestRole()}
        </div>
      {/if}
    {/await}
  </div>
  <div>
    <h-2 class="font-bold text-lg">Gegevens</h-2>
    <SavableInput
      type="text"
      bind:value={name}
      label="Naam"
      placeholder="Naam"
      save={() => authStore.updateCurrentUserName(name)}
      labelClass="font-semibold"
      required
      tooltip="Artikels aangemaakt onder oude profielnaam zullen deze naam als auteur behouden"
    />

    <SavableInput
      type="email"
      bind:value={email}
      label="Email"
      placeholder="Email"
      save={() => authStore.updateCurrentUserEmail(email)}
      labelClass="font-semibold"
    />
  </div>
  <div class="mt-5">
    <h2 class="font-bold text-lg">Wachtwoord veranderen</h2>
    <UpdatePaswordForm />
  </div>
{:else}
  <h1 class="text-2xl font-bold">Profiel</h1>
{/if}
