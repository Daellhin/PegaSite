<script lang="ts">
  import DismissableForm from "$components/DismissableForm.svelte";
  import FormControlCustomSelect from "$components/formHelpers/FormControlCustomSelect.svelte";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";
  import { userStore } from "$lib/stores/UserStore";
  import { logFirebaseError } from "$lib/utils/Firebase";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import { emailValidator } from "$lib/utils/Validators";
  import type { FirebaseError } from "firebase/app";

  export let showForm = false;

  let displayName = "";
  let email = "";
  let rol = "";
  const tempPass = "123456";
  let errorMessage = "";

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
  ];

  async function createUser() {
    try {
      errorMessage = "";
      await userStore.createUser(email, tempPass, rol, displayName);
      pushCreatedToast("Gebruiker aangemaakt");
      //showForm = false;
    } catch (error) {
      if (error as FirebaseError) {
        const firebaseEror = error as FirebaseError;
        if ((firebaseEror.customData as any)?.message?.includes("NetworkError"))
          errorMessage = "Probleem met het netwerk";
        else if (firebaseEror.code === "auth/email-already-in-use")
          errorMessage = "Er bestaat al een gebruiker met dit emailadres";
        else {
          errorMessage = firebaseEror.message;
          logFirebaseError(firebaseEror);
        }
      } else {
        console.error(error);
        errorMessage = "Ongekend probleem, probeer het later opnieuw";
      }
    }
  }
</script>

<DismissableForm onSubmit={createUser} bind:showForm error={errorMessage}>
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
    validator={emailValidator}
    size="xs"
    required
  />
  <FormControlCustomSelect
    bind:value={rol}
    items={roles}
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
