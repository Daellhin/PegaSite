<script lang="ts">
  import { goto } from "$app/navigation"
  import FormControlPassword from "$components/formHelpers/FormControlPassword.svelte"
  import FormControlSavable from "$components/formHelpers/FormControlSavable.svelte"
  import { authStore } from "$lib/stores/AuthStore"
  import { pageHeadStore } from "$lib/stores/PageHeadStore"

  let email = ""
  let name = ""
  let password1 = ""
  let password2 = ""

  function init() {
    email = $authStore!.email || ""
    name = $authStore!.displayName || ""
    return true
  }
  let passEdited1 = false
  let passEdited2 = false
  function validatePassword1(password1: string) {
    if (!password1.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/))
      return "Wachtwoord moet minimaal 12 karakters bevatten, inclusief kleine letters, hoofdletters en cijfers"
    return undefined
  }
  function validatePasswords(password1: string, password2: string) {
    if (password1 !== password2) return "Wachtwoorden moeten gelijk zijn"
    return undefined
  }
  $: error1 = validatePassword1(password1)
  $: error2 = validatePasswords(password1, password2)

  let saving = false
  let loginError = false
  async function updatePassword(event: SubmitEvent) {
    event.preventDefault()
    if (error1 || error2) return
    try {
      saving = true
      await authStore.updateCurrentUserPassword(password1)
      password1 = ""
      password2 = ""
      passEdited1 = false
      passEdited2 = false
    } catch (error) {
      loginError = true
    }
    saving = false
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
  <FormControlSavable
    type="text"
    bind:value={name}
    label="Naam"
    placeholder="Naam"
    save={() => authStore.updateCurrentUserName(name)}
    labelClass="font-semibold"
    required
    tooltip="Artikels aangemaakt onder oude profielnaam zullen deze naam als author behouden"
  />
  <FormControlSavable
    type="email"
    bind:value={email}
    label="Email"
    placeholder="Email"
    save={() => authStore.updateCurrentUserEmail(email)}
    labelClass="font-semibold"
  />
  <form class="mt-5" on:submit={updatePassword}>
    <FormControlPassword
      bind:value={password1}
      label="Nieuw wachtwoord"
      placeholder="Wachtwoord"
      labelClass="font-semibold"
      bind:passEdited={passEdited1}
      required
    />
    <FormControlPassword
      bind:value={password2}
      label="Herhaal wachtwoord"
      placeholder="Wachtwoord"
      labelClass="font-semibold"
      bind:passEdited={passEdited2}
      required
    />
    {#if error1 && passEdited1 && password1 != ""}
      <p class="text-error">{error1}</p>
    {:else if error2 && passEdited2}
      <p class="text-error">{error2}</p>
    {:else if loginError}
      <p class="text-error">
        De sesie is al te lang actief, gelieve eerst opnieuw in te loggen
      </p>
    {/if}
    <button class="btn btn-primary normal-case mt-3">
      Wachtwoord veranderen
      <span class="loading loading-dots" class:hidden={!saving} />
    </button>
  </form>
{:else}
  <h1 class="text-2xl font-bold">Profiel</h1>
{/if}
