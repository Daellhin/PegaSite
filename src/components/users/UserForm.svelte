<script lang="ts">
  import DismissableForm from "$components/DismissableForm.svelte"
  import CustomSelect from "$components/formHelpers/CustomSelect.svelte"
  import Input from "$components/formHelpers/Input.svelte"
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
  <Input
    type="text"
    label="Naam"
    placeholder="Naam"
    bind:value={displayName}
    size="xs"
    required
  />
  <Input
    type="text"
    label="Email"
    placeholder="user@server.com"
    bind:value={email}
    validate={validateEmail}
    size="xs"
    required
  />
  <CustomSelect
    bind:value={role}
    items={allRoles}
    label="Rol"
    size="xs"
    required
  />
  <Input
    type="text"
    label="Tijdelijk wachtwoord"
    value={tempPass}
    size="xs"
    disabled
  />
</DismissableForm>
