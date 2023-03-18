<script lang="ts">
  import { AthleticEvent } from "$lib/classes/dataClasses/AthleticEvent";
  import type { Category } from "$lib/classes/dataClasses/Category";
  import { Gender } from "$lib/classes/dataClasses/Gender";
  import { DataService } from "$lib/data/DataService";
  import { isArrayNotEmpty } from "$lib/utils/array";
  import CollapsableList from "./CollapsableList.svelte";
  import TabedView from "./TabedView.svelte";

  export let category: Category;
  export let searchString = "";

  let recordComponents: any[] = [];

  const map = new Map([
    [
      "Vrouwen indoor",
      DataService.getRecords(category, Gender.Female, AthleticEvent.Indoor),
    ],
    [
      "Mannen indoor",
      DataService.getRecords(category, Gender.Male, AthleticEvent.Indoor),
    ],
    [
      "Vrouwen outdoor",
      DataService.getRecords(category, Gender.Female, AthleticEvent.Outdoor),
    ],
    [
      "Mannen outdoor",
      DataService.getRecords(category, Gender.Male, AthleticEvent.Outdoor),
    ],
  ]);
  // TODO refactor and simplify
  // Now if this isnt a simple statement, have fun trying to understand what it does :)
  $: filteredClubrecords = Array.from(
    new Map(
      Array.from(map).map(([key, value]) => [
        key,
        value.filter((e) =>
          searchString
            ? !searchString
                .toLowerCase()
                .split(" ")
                .map((f) => e.searchableString.includes(f))
                .includes(false)
            : true
        ),
      ])
    )
  ).filter(([key, value]) => isArrayNotEmpty(value));
  $: keys = filteredClubrecords.map(([key, value]) => key);
  $: values = filteredClubrecords.map(([key, value]) => value);
  $: isSearching = searchString ? true : false;

  function hideAll() {
    recordComponents.forEach((e) => e.hide());
  }
</script>

{#if isArrayNotEmpty(filteredClubrecords)}
  <div class="flex mt-3">
    <h2 class="text-2xl text-primary font-bold whitespace-nowrap">
      {category.pluralName}
    </h2>
    <hr class="my-[18px] ml-3 w-full h-[1.6px] bg-gray-200" />
  </div>

  <div class="mt-1">
    <TabedView tabs={keys}>
      <!-- Slots can not be dynamicaly asigned so empty arrays are used -->
      <span slot="0">
        {#each values?.[0] ?? [] as record, index (record)}
          <CollapsableList
            clubRecord={record}
            bind:this={recordComponents[index]}
            forceOpen={isSearching}
          />
        {/each}
      </span>
      <span slot="1">
        {#each values?.[1] ?? [] as record, index (record)}
          <CollapsableList
            clubRecord={record}
            bind:this={recordComponents[index]}
            forceOpen={isSearching}
          />
        {/each}
      </span>
      <span slot="2">
        {#each values?.[2] ?? [] as record, index (record)}
          <CollapsableList
            clubRecord={record}
            bind:this={recordComponents[index]}
            forceOpen={isSearching}
          />
        {/each}
      </span>
      <span slot="3">
        {#each values?.[3] ?? [] as record, index (record)}
          <CollapsableList
            clubRecord={record}
            bind:this={recordComponents[index]}
            forceOpen={isSearching}
          />
        {/each}
      </span>
    </TabedView>
  </div>
{/if}
