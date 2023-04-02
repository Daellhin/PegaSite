<script lang="ts">
  import FormControlDate from "$components/FormHelpers/FormControlDate.svelte";
  import { AthleticEvent } from "$lib/domain/data-classes/AthleticEvent";
  import { Category } from "$lib/domain/data-classes/Category";
  import { Discipline } from "$lib/domain/data-classes/Discipline";
  import { Gender } from "$lib/domain/data-classes/Gender";
  import { RecordInstance } from "$lib/domain/RecordInstance";
  import { clubRecordStore } from "$lib/stores/ClubRecordStore";
  import { pushCreatedToast } from "$lib/utils/Toast";
  import Icon from "@iconify/svelte";
  import dayjs from "dayjs";
  import FormControlCustomSelect from "../FormHelpers/FormControlCustomSelect.svelte";
  import FormControlText from "../FormHelpers/FormControlText.svelte";

  export let showForm: boolean;

  let discipline: Discipline;
  let category: Category;
  let gender: Gender;
  let athleticEvent: AthleticEvent;

  let name: string;
  let result: string;
  let location: string;
  let date: Date;

  async function createRecord() {
    const record = new RecordInstance(name, result, location, dayjs(date));
    await clubRecordStore.add(
      discipline,
      category,
      gender,
      athleticEvent,
      record
    );
    pushCreatedToast("Record aangemaakt");
    //showForm = false;
  }
</script>

<form
  on:submit={createRecord}
  class="relative mb-3 border-base-300 bg-base-200 rounded-tr-box min-h-[6rem] min-w-[18rem] border bg-cover bg-top p-4 rounded-box overflow-visible"
>
  <button
    class="btn btn-ghost btn-sm absolute right-2 top-2 font-bold"
    title="sluiten"
    on:click={() => (showForm = false)}
  >
    <Icon icon="fa6-solid:xmark" width={14} />
  </button>

  <div class="flex flex-wrap gap-2">
    <FormControlCustomSelect
      bind:value={discipline}
      items={Discipline.Disciplines.map((e) => ({
        value: e,
        label: e.name,
      }))}
      groupBy={(e) => e.value.type.name}
      label="Disipline"
      size="xs"
    />

    <FormControlCustomSelect
      bind:value={athleticEvent}
      items={AthleticEvent.AthleticEvents.map((e) => ({
        value: e,
        label: e.name,
      }))}
      label="Indoor/outdoor"
      size="xs"
    />

    <FormControlCustomSelect
      bind:value={category}
      items={Category.Categories.map((e) => ({
        value: e,
        label: e.singularName,
      }))}
      label="Categorie"
      size="xs"
    />

    <FormControlCustomSelect
      bind:value={gender}
      items={Gender.Genders.map((e) => ({
        value: e,
        label: e.adultSingularName,
      }))}
      label="Geslacht"
      size="xs"
    />

    <FormControlText
      label="Naam"
      placeholder="Voornaam Naam"
      bind:value={name}
      size="xs"
      required
    />
    <FormControlText
      label="Prestatie"
      placeholder="00.00"
      bind:value={result}
      size="xs"
      required
    />
    <FormControlText
      label="Locatie"
      placeholder="Locatie"
      bind:value={location}
      size="xs"
      required
    />
    <FormControlDate label="Datum" bind:value={date} size="xs" required />
  </div>

  <button class="btn btn-primary btn-md mt-4">Aanmaken</button>
</form>
