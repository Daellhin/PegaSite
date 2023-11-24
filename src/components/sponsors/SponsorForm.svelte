<script lang="ts">
  import DismissibleForm from "$components/DismissibleForm.svelte"
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import { Sponsor } from "$lib/domain/Sponsor"
  import { sponsorStore } from "$lib/stores/SponsorStore"
  import { pushCreatedToast } from "$lib/utils/Toast"

  export let showForm = false
  export let editSponsor: Sponsor | undefined = undefined
  export let onDismiss: () => void = () => {}

  let name = ""
  let url = ""
  let image: (string | File)[] = []

  async function saveSponsor() {
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

<DismissibleForm
  onSubmit={saveSponsor}
  bind:showForm
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
</DismissibleForm>
