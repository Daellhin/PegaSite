<script lang="ts">
  import DismissableForm from "$components/DismissableForm.svelte";
  import FormControlDropzone from "$components/formHelpers/FormControlDropzone.svelte";
  import FormControlText from "$components/formHelpers/FormControlText.svelte";
  import { Sponser } from "$lib/domain/Sponser";
  import { sponserStore } from "$lib/stores/SponserStore";
  import { logFirebaseError } from "$lib/utils/Firebase";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import type { FirebaseError } from "firebase/app";

  export let showForm = false;
  export let editSponser: Sponser | undefined = undefined;
  export let onDismiss: () => void = () => {};

  let name = "";
  let url: string;
  let image = Array<File>();
  let exsitingImage = Array<string>();

  let errorMessage = "";

  async function save() {
    try {
      errorMessage = "";
      if (editSponser) {
        await sponserStore.updateSponser(name, url, image[0], editSponser);
        pushCreatedToast("Sponser gewijzigd");
      } else {
        const newSponser = new Sponser("-1", name, url, "");
        await sponserStore.createSponser(newSponser, image[0]);
        pushCreatedToast("Sponser aangemaakt");
      }
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

  // -- Set editSponser --
  $: setSponser(editSponser);
  function setSponser(editSponser: Sponser | undefined) {
    if (editSponser) {
      name = editSponser.name;
      url = editSponser.url;
      exsitingImage = [editSponser.imageUrl];
    } else {
      name = "";
      url = "";
      exsitingImage = [];
    }
  }
</script>

<DismissableForm
  onSubmit={save}
  bind:showForm
  error={errorMessage}
  submitLabel={editSponser ? "Wijzigen" : "Aanmaken"}
  {onDismiss}
>
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
    bind:existingImages={exsitingImage}
    size="xs"
    required
  />
</DismissableForm>
