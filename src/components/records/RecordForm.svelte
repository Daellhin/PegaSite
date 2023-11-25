<script lang="ts">
  import DismissibleForm from "$components/DismissibleForm.svelte"
  import InfoCard from "$components/InfoCard.svelte"
  import CustomSelect from "$components/formHelpers/CustomSelect.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import { RecordInstance } from "$lib/domain/RecordInstance"
  import { AthleticEvent } from "$lib/domain/dataClasses/AthleticEvent"
  import { Category } from "$lib/domain/dataClasses/Category"
  import { Discipline } from "$lib/domain/dataClasses/Discipline"
  import { Gender } from "$lib/domain/dataClasses/Gender"
  import { clubRecordStore } from "$lib/stores/ClubRecordStore"
  import { pushCreatedToast } from "$lib/utils/Toast"
  import type { Dayjs } from "dayjs"

  export let showForm: boolean
  export let editRecord: RecordInstance | undefined = undefined
  export let onDismiss: () => void = () => {}

  let discipline: Discipline | undefined = undefined
  let category: Category | undefined = undefined
  let gender: Gender | undefined = undefined
  let athleticEvent: AthleticEvent | undefined = undefined

  let name = ""
  let result = ""
  let location = ""
  let date: Dayjs | undefined = undefined

  async function saveRecord() {
    if (editRecord) {
      await clubRecordStore.updateRecordInstance(
        discipline!,
        category!,
        gender!,
        athleticEvent!,
        name,
        result,
        location,
        date!,
        editRecord,
      )
      pushCreatedToast("Record gewijzigd")
    } else {
      const record = new RecordInstance(name, result, location, date)
      await clubRecordStore.createClubRecord(
        discipline!,
        category!,
        gender!,
        athleticEvent!,
        record,
      )
      pushCreatedToast("Record aangemaakt")
    }
  }

  // -- Set editSponsor --
  $: setSponsor(editRecord)
  function setSponsor(editRecord: RecordInstance | undefined) {
    if (editRecord) {
      discipline = editRecord.clubRecord?.discipline
      category = editRecord.clubRecord?.category
      gender = editRecord.clubRecord?.gender
      athleticEvent = editRecord.clubRecord?.athleticEvent
      name = editRecord.name
      result = editRecord.result
      location = editRecord.location
      date = editRecord.date
    } else {
      discipline = undefined
      category = undefined
      gender = undefined
      athleticEvent = undefined
      name = ""
      result = ""
      location = ""
      date = undefined
    }
  }
</script>

<DismissibleForm
  onSubmit={saveRecord}
  bind:showForm
  submitLabel={editRecord ? "Wijzigen" : "Aanmaken"}
  {onDismiss}
>
  <CustomSelect
    bind:value={discipline}
    items={Discipline.Disciplines.map((e) => ({
      value: e,
      label: e.name,
    }))}
    groupBy={(e) => e.value.type.name}
    label="Disipline"
    size="xs"
    required
  />
  <CustomSelect
    bind:value={athleticEvent}
    items={AthleticEvent.AthleticEvents.map((e) => ({
      value: e,
      label: e.name,
    }))}
    label="Indoor/outdoor"
    size="xs"
    required
  />
  <CustomSelect
    bind:value={category}
    items={Category.Categories.map((e) => ({
      value: e,
      label: e.singularName,
    }))}
    label="Categorie"
    size="xs"
    required
  />
  <CustomSelect
    bind:value={gender}
    items={Gender.Genders.map((e) => ({
      value: e,
      label: e.adultSingularName,
    }))}
    label="Geslacht"
    size="xs"
    required
  />
  <Input
    type="text"
    label="Naam"
    placeholder="Voornaam Naam"
    bind:value={name}
    size="xs"
    required
  />
  <Input
    type="text"
    label="Prestatie"
    placeholder="00.00"
    bind:value={result}
    size="xs"
    required
  />
  <Input
    type="text"
    label="Locatie"
    placeholder="Locatie"
    bind:value={location}
    size="xs"
    required
  />
  <Input type="date" label="Datum" size="xs" bind:value={date} required />
  {#if !editRecord}
    <InfoCard class="mt-2 w-fit"
      >Clubrecords moeten eerst goedgekeurd worden door een aministrator,
      voordat ze zichtbaar zijn.</InfoCard
    >
  {/if}
</DismissibleForm>
