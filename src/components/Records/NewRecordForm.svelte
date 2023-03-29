<script lang="ts">
  import { AthleticEvent } from "$lib/domain/data-classes/AthleticEvent";
  import { Category } from "$lib/domain/data-classes/Category";
  import { Discipline } from "$lib/domain/data-classes/Discipline";
  import { Gender } from "$lib/domain/data-classes/Gender";
  import FormControlCustomSelect from "./form-components/FormControlCustomSelect.svelte";
  import FormControlText from "./form-components/FormControlText.svelte";
  import Icon from "@iconify/svelte";

  export let hideInputs: () => void;

  let athleticEvent: string;
  let category: string;
  let gender: string;
  let discipline: any;

  let name: string;
  let result: string;
  let location: string;
  let date: string;

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
  <div class="">
    <button
      class="btn btn-ghost absolute right-2 top-2 font-bold"
      title="sluiten"
      on:click={hideInputs}
    >
      <Icon icon="fa6-solid:xmark"  width={14} />
    </button>
  </div>

  <div class="flex flex-wrap gap-2">
    <FormControlCustomSelect
      selectValue={discipline}
      items={disciplineOptions()}
      groupBy={groupByDisipline}
      label={"Disipline"}
      required={true}
    />

    <FormControlCustomSelect
      selectValue={athleticEvent}
      items={AthleticEvent.AthleticEvents.map((e) => ({
        value: e,
        label: e.name,
      }))}
      label={"Indoor/outdoor"}
      required={true}
    />

    <FormControlCustomSelect
      selectValue={category}
      items={Category.Categories.map((e) => ({
        value: e,
        label: e.singularName,
      }))}
      label={"Categorie"}
      required={true}
    />

    <FormControlCustomSelect
      selectValue={gender}
      items={Gender.Genders.map((e) => ({
        value: e,
        label: e.adultSingularName,
      }))}
      label={"Geslacht"}
      required={true}
    />

    <FormControlText
      label="Naam"
      placeholder="Voornaam Naam"
      textValue={name}
      required={true}
    />
    <FormControlText
      label="Prestatie"
      placeholder="00.00"
      textValue={result}
      required={true}
    />
    <FormControlText
      label="Locatie"
      placeholder="Locatie"
      textValue={location}
      required={true}
    />
    <FormControlText
      label="Datum"
      placeholder="00-00-0000"
      textValue={date}
      required={true}
    />
  </div>

  <button class="btn btn-primary btn-md mt-4">Aanmaken</button>
</form>
