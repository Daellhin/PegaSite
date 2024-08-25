<script lang="ts">
  import Input from "$components/formHelpers/Input.svelte"
  import { authStore } from "$lib/stores/AuthStore"

  let password1 = ""
  let password2 = ""
  let password1Edited = false
  let password2Edited = false
  let saving = false
  let loginError = false
  let toggled = false

  // -- Validate passwords --
  function validatePassword(password1: string) {
    if (!password1.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/))
      return "Wachtwoord moet minimaal 12 karakters bevatten, inclusief kleine letters, hoofdletters en cijfers"
    return undefined
  }
  function validatePasswordsAreEqual(password1: string, password2: string) {
    if (password1 !== password2) return "Wachtwoorden moeten gelijk zijn"
    return undefined
  }
  $: errorMessage1 = validatePassword(password1)
  $: errorMessage2 = validatePasswordsAreEqual(password1, password2)

  // -- Update password --
  async function updatePassword(event: SubmitEvent) {
    event.preventDefault()
    if (errorMessage1 || errorMessage2) return
    saving = true
    try {
      await authStore.updateCurrentUserPassword(password1)
      password1 = ""
      password2 = ""
      password1Edited = false
      password2Edited = false
    } catch (error) {
      loginError = true
      console.error(error)
    }
    saving = false
  }
</script>

<form on:submit={updatePassword}>
  <Input
    type="password"
    bind:value={password1}
    bind:edited={password1Edited}
    bind:toggled
    label="Nieuw wachtwoord"
    placeholder="Wachtwoord"
    labelClass="font-semibold"
    required
  />
  <Input
    type="password"
    bind:value={password2}
    bind:edited={password2Edited}
    bind:toggled
    label="Nieuw wachtwoord"
    placeholder="Wachtwoord"
    labelClass="font-semibold"
    required
  />
  {#if errorMessage1 && password1Edited && password1 != ""}
    <p class="text-error">{errorMessage1}</p>
  {:else if errorMessage2 && password2Edited}
    <p class="text-error">{errorMessage2}</p>
  {:else if loginError}
    <p class="text-error">
      De sesie is al te lang actief, gelieve eerst opnieuw in te loggen
    </p>
  {/if}
  <div class="w-fit" class:hover:cursor-wait={saving}>
    <button
      class="btn btn-primary mt-2 max-w-sm"
      type="submit"
      disabled={saving}
    >
      Wachtwoord veranderen
      <span class="loading loading-ring" class:hidden={!saving} />
    </button>
  </div>
</form>
