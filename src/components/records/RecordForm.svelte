<script lang="ts">
  import DismissibleForm from "$components/DismissibleForm.svelte"
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

  let discipline: Discipline
  let category: Category
  let gender: Gender
  let athleticEvent: AthleticEvent

  let name: string
  let result: string
  let location: string
  let date: Dayjs

  async function createRecord() {
    const record = new RecordInstance(name, result, location, date)
    await clubRecordStore.createClubRecord(
      discipline,
      category,
      gender,
      athleticEvent,
      record
    )
    pushCreatedToast("Record aangemaakt")
  }
</script>

<DismissibleForm
  onSubmit={createRecord}
  bind:showForm
  submitLabel="Clubrecord aanmaken"
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
  />
  <CustomSelect
    bind:value={athleticEvent}
    items={AthleticEvent.AthleticEvents.map((e) => ({
      value: e,
      label: e.name,
    }))}
    label="Indoor/outdoor"
    size="xs"
  />
  <CustomSelect
    bind:value={category}
    items={Category.Categories.map((e) => ({
      value: e,
      label: e.singularName,
    }))}
    label="Categorie"
    size="xs"
  />
  <CustomSelect
    bind:value={gender}
    items={Gender.Genders.map((e) => ({
      value: e,
      label: e.adultSingularName,
    }))}
    label="Geslacht"
    size="xs"
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
  <Input
    type="date"
    label="Datum"
    size="xs"
    bind:value={date}
    required
  />
</DismissibleForm>
