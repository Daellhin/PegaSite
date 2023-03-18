<script lang="ts">
  import { AthleticEvent } from "$lib/classes/dataClasses/AthleticEvent";
  import { Category } from "$lib/classes/dataClasses/Category";
  import { Discipline } from "$lib/classes/dataClasses/Discipline";
  import { Gender } from "$lib/classes/dataClasses/Gender";
  import FormControlSelect from "./form-components/FormControlSelect.svelte";
  import FormControlCustomSelect from "./form-components/FormControlCustomSelect.svelte";
  import { ClubRecord } from "$lib/classes/ClubRecord";
  import { RecordInstance } from "$lib/classes/NamedRecord";
  import FormControlText from "./form-components/FormControlText.svelte";

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
    on:click={hideInputs}>X</button
  >
</div>

  <div class="flex flex-wrap gap-2">
    <FormControlCustomSelect
      selectValue={discipline}
      items={disciplineOptions()}
      groupBy={groupByDisipline}
      label={"Disipline"}
      required={true}
    />

    <FormControlSelect
      label="Indoor/outdoor"
      selectValue={athleticEvent}
      required={true}
    >
      {#each AthleticEvent.AthleticEvents as value}
        <option>{value.name}</option>
      {/each}
    </FormControlSelect>

    <FormControlSelect label="Categorie" selectValue={category} required={true}>
      {#each Category.Categories as value}
        <option>{value.singularName}</option>
      {/each}
    </FormControlSelect>

    <FormControlSelect label="Geslacht" selectValue={gender} required={true}>
      {#each Gender.Genders as value}
        <option>{value.adultSingularName}</option>
      {/each}
    </FormControlSelect>

    <FormControlSelect
      label="Disipline"
      selectValue={discipline}
      required={true}
    >
      {#each Discipline.Disciplines as value}
        <option>{value.name}</option>
      {/each}
    </FormControlSelect>

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
