<script lang="ts">
  import FormControlInput from "$components/formHelpers/FormControlInput.svelte"
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
  $: error1 = validatePassword(password1)
  $: error2 = validatePasswordsAreEqual(password1, password2)

  // -- Update password --
  async function updatePassword(event: SubmitEvent) {
    event.preventDefault()
    if (error1 || error2) return
    try {
      saving = true
      await authStore.updateCurrentUserPassword(password1)
      password1 = ""
      password2 = ""
      password1Edited = false
      password2Edited = false
    } catch (error) {
      loginError = true
    }
    saving = false
  }
</script>

<form on:submit={updatePassword}>
  <FormControlInput
    type="password"
    bind:value={password1}
    bind:edited={password1Edited}
    bind:toggled
    label="Nieuw wachtwoord"
    placeholder="Wachtwoord"
    labelClass="font-semibold"
    required
  />
  <FormControlInput
    type="password"
    bind:value={password2}
    bind:edited={password2Edited}
    bind:toggled
    label="Nieuw wachtwoord"
    placeholder="Wachtwoord"
    labelClass="font-semibold"
    required
  />
  {#if error1 && password1Edited && password1 != ""}
    <p class="text-error">{error1}</p>
  {:else if error2 && password2Edited}
    <p class="text-error">{error2}</p>
  {:else if loginError}
    <p class="text-error">
      De sesie is al te lang actief, gelieve eerst opnieuw in te loggen
    </p>
  {/if}
  <button class="btn btn-primary mt-2 max-w-sm" type="submit" disabled={saving}>
    Wachtwoord veranderen
    <span class="loading loading-dots" class:hidden={!saving} />
  </button>
</form>
