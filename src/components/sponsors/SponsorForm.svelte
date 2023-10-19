<script lang="ts">
  import DismissableForm from "$components/DismissableForm.svelte"
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import { Sponsor } from "$lib/domain/Sponsor"
  import { sponsorStore } from "$lib/stores/SponsorStore"
  import { handleFirebaseError } from "$lib/utils/Firebase"
  import { pushCreatedToast } from "$lib/utils/Toast"

  export let showForm = false
  export let editSponsor: Sponsor | undefined = undefined
  export let onDismiss: () => void = () => {}

  let name = ""
  let url: string
  let image: (string | File)[] = []
  let errorMessage = ""

  async function saveSponsor() {
    try {
      errorMessage = ""
      if (editSponsor) {
        await sponsorStore.updateSponsor(name, url, image[0], editSponsor)
        pushCreatedToast("Sponsor gewijzigd")
      } else {
        if (!(image[0] instanceof File))
          throw new Error("Image must be a file when creating new sponsor")
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
      image = [editSponsor.imageUrl]
    } else {
      name = ""
      url = ""
      image = []
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
  <Input
    type="text"
    label="Naam"
    placeholder="Naam"
    bind:value={name}
    size="xs"
    required
  />
  <Input
    type="text"
    label="Link"
    placeholder="Link"
    bind:value={url}
    size="xs"
    required
  />
  <Dropzone
    label="Afbeelding"
    bind:combinedImages={image}
    sortable={false}
    size="xs"
    required
    maxAmount={1}
  />
</DismissableForm>
