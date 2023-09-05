<script lang="ts">
  import DismissableForm from "$components/DismissableForm.svelte"
  import FormControlDropzone from "$components/formHelpers/FormControlDropzone.svelte"
  import FormControlText from "$components/formHelpers/FormControlText.svelte"
  import { Sponsor } from "$lib/domain/Sponsor"
  import { sponsorStore } from "$lib/stores/SponsorStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { pushCreatedToast } from "$lib/utils/Toast"

  export let showForm = false
  export let editSponsor: Sponsor | undefined = undefined
  export let onDismiss: () => void = () => {}

  let name = ""
  let url: string
  let image = Array<File>()
  let exsitingImage = Array<string>()

  let errorMessage = ""

  async function saveSponsor() {
    try {
      errorMessage = ""
      if (editSponsor) {
        await sponsorStore.updateSponsor(name, url, image[0], editSponsor)
        pushCreatedToast("Sponsor gewijzigd")
      } else {
        const newSponsor = new Sponsor("-1", name, url, "")
        await sponsorStore.createSponsor(newSponsor, image[0])
        pushCreatedToast("Sponsor aangemaakt")
      }
    } catch (error) {
      errorMessage = handleFirebaseError(error)
    }
  }

  // -- Set editSponsor --
  $: setSponsor(editSponsor)
  function setSponsor(editSponsor: Sponsor | undefined) {
    if (editSponsor) {
      name = editSponsor.name
      url = editSponsor.url
      image = []
      exsitingImage = [editSponsor.imageUrl]
    } else {
      name = ""
      url = ""
      image = []
      exsitingImage = []
    }
  }
</script>

<DismissableForm
  onSubmit={saveSponsor}
  bind:showForm
  error={errorMessage}
  submitLabel={editSponsor ? "Wijzigen" : "Aanmaken"}
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
    maxAmount={1}
  />
</DismissableForm>
