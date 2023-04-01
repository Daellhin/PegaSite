<script lang="ts">
  import { AthleticEvent } from "$lib/domain/data-classes/AthleticEvent";
  import { Category } from "$lib/domain/data-classes/Category";
  import { Discipline } from "$lib/domain/data-classes/Discipline";
  import { Gender } from "$lib/domain/data-classes/Gender";
  import FormControlCustomSelect from "../FormHelpers/FormControlCustomSelect.svelte";
  import FormControlText from "../FormHelpers/FormControlText.svelte";
  import Icon from "@iconify/svelte";
  import FormControlDate from "$components/FormHelpers/FormControlDate.svelte";

  export let hideInputs: () => void;

  let athleticEvent: string;
  let category: string;
  let gender: string;
  let discipline: any;

  let name: string;
  let result: string;
  let location: string;
  let date: Date;

  function disciplineOptions() {
    return Discipline.Disciplines.map((e) => ({
      value: e,
      label: e.name,
    }));
  }
  function groupByDisipline(item: { value: { type: { name: any } } }) {
    return item.value.type.name;
  }
  function createRecord() {
    // const record = new RecordInstance(name, result, location, date);
    console.log("created record");
  }
</script>

<form
  on:submit={createRecord}
  class="relative mb-3 border-base-300 bg-base-200 rounded-tr-box min-h-[6rem] min-w-[18rem] border bg-cover bg-top p-4 rounded-box overflow-visible"
>
  <button
    class="btn btn-ghost btn-sm absolute right-2 top-2 font-bold"
    title="sluiten"
    on:click={hideInputs}
  >
    <Icon icon="fa6-solid:xmark" width={14} />
  </button>

  <div class="flex flex-wrap gap-2">
    <FormControlCustomSelect
      value={discipline}
      items={disciplineOptions()}
      groupBy={groupByDisipline}
      label="Disipline"
      size="xs"
      required
    />

    <FormControlCustomSelect
      value={athleticEvent}
      items={AthleticEvent.AthleticEvents.map((e) => ({
        value: e,
        label: e.name,
      }))}
      label="Indoor/outdoor"
      size="xs"
      required
    />

    <FormControlCustomSelect
      value={category}
      items={Category.Categories.map((e) => ({
        value: e,
        label: e.singularName,
      }))}
      label="Categorie"
      size="xs"
      required
    />

    <FormControlCustomSelect
      value={gender}
      items={Gender.Genders.map((e) => ({
        value: e,
        label: e.adultSingularName,
      }))}
      label="Geslacht"
      size="xs"
      required
    />

    <FormControlText
      label="Naam"
      placeholder="Voornaam Naam"
      value={name}
      size="xs"
      required
    />
    <FormControlText
      label="Prestatie"
      placeholder="00.00"
      value={result}
      size="xs"
      required
    />
    <FormControlText
      label="Locatie"
      placeholder="Locatie"
      value={location}
      size="xs"
      required
    />
    <FormControlDate
      label="Datum"
      value={date}
      size="xs"
      required
    />
  </div>

  <button class="btn btn-primary btn-md mt-4">Aanmaken</button>
</form>
