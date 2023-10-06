<script lang="ts">
  import DismissableForm from "$components/DismissableForm.svelte"
  import FormControlCustomSelect from "$components/formHelpers/FormControlCustomSelect.svelte"
  import FormControlText from "$components/formHelpers/FormControlText.svelte"
  import { DbUser, type DbUserRole } from "$lib/domain/DbUser"
  import { userStore } from "$lib/stores/UserStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import { validateEmail } from "$lib/utils/Validators"

  export let showForm = false

  let displayName = ""
  let email = ""
  let role: DbUserRole | "" = ""
  const tempPass = "123456"
  let errorMessage = ""

  const allRoles = [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
  ]

  async function createUser() {
    try {
      errorMessage = ""
      const userRoles = DbUser.getAplicableRoles(role)
      await userStore.createUser(email, tempPass, userRoles, displayName)
      pushCreatedToast("Gebruiker aangemaakt")
      showForm = false
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
  }
</script>

<DismissableForm
  onSubmit={createUser}
  bind:showForm
  error={errorMessage}
  submitLabel="Gebruiker aanmaken"
>
  <FormControlText
    label="Naam"
    placeholder="Naam"
    bind:value={displayName}
    size="xs"
    required
  />
  <FormControlText
    label="Email"
    placeholder="user@server.com"
    bind:value={email}
    validator={validateEmail}
    size="xs"
    required
  />
  <FormControlCustomSelect
    bind:value={role}
    items={allRoles}
    label="Rol"
    size="xs"
    required
  />
  <FormControlText
    label="Tijdelijk wachtwoord"
    value={tempPass}
    size="xs"
    disabled
  />
</DismissableForm>
