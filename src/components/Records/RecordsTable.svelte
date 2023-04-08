<script lang="ts">
  import { constructMapWithCategory } from "$lib/domain/ClubRecord";
  import type { Category } from "$lib/domain/data-classes/Category";
  import { clubRecordStore } from "$lib/stores/ClubRecordStore";
  import {
    filterValuesInMap,
    getMapKeys,
    getMapValues,
  } from "$lib/utils/Array";
  import CollapsableList from "./CollapsableList.svelte";
  import TabedView from "./TabedView.svelte";

  export let category: Category;
  export let searchString = "";

  let recordComponents: any[] = [];

  $: clubRecords = constructMapWithCategory($clubRecordStore, category);
  $: filteredClubrecords = filterValuesInMap(clubRecords, (e) =>
    e.matchesSearchString(searchString)
  );
  $: keys = getMapKeys(filteredClubrecords);
  $: values = getMapValues(filteredClubrecords);
  $: isSearching = searchString ? true : false;
</script>

{#if filteredClubrecords && filteredClubrecords.size}
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
