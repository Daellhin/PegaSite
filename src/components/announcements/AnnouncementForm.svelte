<script lang="ts">
  import DismissibleForm from "$components/DismissibleForm.svelte"
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import CLEditor from "$components/formHelpers/CLEditor.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import { Announcement } from "$lib/domain/Announcement"
  import { announcementStore } from "$lib/stores/AnnouncementStore"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import dayjs from "dayjs"

  export let showForm = false
  export let editAnnouncement: Announcement | undefined = undefined
  export let onDismiss: () => void = () => {}

  let title = ""
  let content = ""
  let visible = true
  let dismissible = true

  async function saveAnnouncement() {
    if (editAnnouncement) {
      await announcementStore.updateAnnouncement(
        title,
        content,
        visible,
        dismissible,
        editAnnouncement,
      )
      pushCreatedToast("Aankondiging gewijzigd")
    } else {
      const newAnnouncement = new Announcement(
        "-1",
        dayjs(),
        title,
        content,
        visible,
        dismissible,
      )
      await announcementStore.createAnnouncement(newAnnouncement)
      pushCreatedToast("Sponsor aangemaakt")
    }
  }

  // -- Set editSponsor --
  $: setSponsor(editAnnouncement)
  function setSponsor(editAnnouncement: Announcement | undefined) {
    if (editAnnouncement) {
      title = editAnnouncement.title
      content = editAnnouncement.content
      visible = editAnnouncement.visible
      dismissible = editAnnouncement.dismissible
    } else {
      title = ""
      content = ""
      visible = true
      dismissible = true
    }
  }
</script>

<DismissibleForm
  onSubmit={saveAnnouncement}
  bind:showForm
  submitLabel={editAnnouncement ? "Wijzigen" : "Aanmaken"}
  {onDismiss}
>
  <Input
    type="text"
    label="Titel"
    placeholder="Titel"
    bind:value={title}
    size="xs"
    required
  />
  <Checkbox label="Zichtbaar" bind:value={visible} />
  <Checkbox label="Minimaliseerbaar" bind:value={dismissible} />
  <CLEditor label="Inhoud" bind:value={content} />
</DismissibleForm>
