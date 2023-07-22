<script lang="ts">
  import DismissableForm from "$components/DismissableForm.svelte";
  import FormControlCustomSelect from "$components/formHelpers/FormControlCustomSelect.svelte";
  import FormControlDropzone from "$components/formHelpers/FormControlDropzone.svelte";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";
  import { Sponser } from "$lib/domain/Sponser";
  import { sponserStore } from "$lib/stores/SponserStore";
  import { userStore } from "$lib/stores/UserStore";
  import { logFirebaseError } from "$lib/utils/Firebase";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import { emailValidator } from "$lib/utils/Validators";
  import type { FirebaseError } from "firebase/app";

  export let showForm = false;

  let name = "";
  let url: string;
  let image = Array<File>();

  let errorMessage = "";

  async function createSponser() {
    try {
      errorMessage = "";
      const newSponser = new Sponser("-1", name, url, "");
      await sponserStore.createSponser(newSponser, image[0]);
      pushCreatedToast("Sponser aangemaakt");
      //showForm = false;
    } catch (error) {
      if (error as FirebaseError) {
        const firebaseEror = error as FirebaseError;
        if ((firebaseEror.customData as any)?.message?.includes("NetworkError"))
          errorMessage = "Probleem met het netwerk";
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

<DismissableForm onSubmit={createSponser} bind:showForm error={errorMessage}>
  <FormControlText
    label="Naam"
    placeholder="Naam"
    bind:value={name}
    size="xs"
    required
  />
  <FormControlText
    label="Link"
    placeholder="Link"
    bind:value={url}
    size="xs"
    required
  />
  <FormControlDropzone
    label="Afbeelding"
    bind:uploadedImages={image}
    size="xs"
    required
  />
</DismissableForm>
