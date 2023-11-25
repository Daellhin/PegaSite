<script lang="ts">
  import type { ClubRecord } from "$lib/domain/ClubRecord"
  import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
  } from "svelte-vertical-timeline"

  export let clubRecord: ClubRecord
  // To force open state, e.g. when searching
  export let forceOpen = false
  $: forceOpen ? open() : collapse()

  let checkedRecordInstances = clubRecord.records.filter((e) => e.checked)
  let visibleRecordInstances = checkedRecordInstances.slice(0, 1)
  let isCollapsed = true

  export function collapse() {
    visibleRecordInstances = checkedRecordInstances.slice(0, 1)
    isCollapsed = true
  }
  export function open() {
    visibleRecordInstances = checkedRecordInstances
    isCollapsed = false
  }

  function toggleCollapse() {
    visibleRecordInstances = isCollapsed
      ? checkedRecordInstances
      : checkedRecordInstances.slice(0, 1)
    isCollapsed = !isCollapsed
  }
</script>

<Timeline>
  {#each visibleRecordInstances as d, index (d)}
    <div>
      <TimelineItem>
        <TimelineOppositeContent slot="opposite-content">
          {#if index === 0}
            <p>{clubRecord.discipline.name}</p>

            {#if clubRecord.hasPreviousRecords()}
              <button
                class="btn btn-xs normal-case sm:hidden"
                on:click={toggleCollapse}
              >
                {checkedRecordInstances.length - 1}&nbsp;eerdere
              </button>
            {/if}
          {/if}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          {#if index !== visibleRecordInstances.length - 1}
            <TimelineConnector />
          {/if}
        </TimelineSeparator>
        <TimelineContent>
          <div class="flex flex-row gap-3">
            <div class="font-bold">{d.result}</div>
            <div>{d.name}</div>
            <div>{d.location}</div>
            <div>{d.formattedDate()}</div>
            {#if index === 0 && clubRecord.hasPreviousRecords()}
              <button
                class="btn btn-xs normal-case hidden sm:block"
                on:click={toggleCollapse}
              >
                {checkedRecordInstances.length - 1}&nbsp;eerdere
              </button>
            {/if}
          </div>
        </TimelineContent>
      </TimelineItem>
    </div>
  {/each}
</Timeline>

<style lang="postcss">
  :global(.timeline) {
    padding: 0 !important;
  }
  :global(.timeline-dot:first-child) {
    margin-top: 11.5px !important;
    margin-bottom: 0px !important;
  }
  :global(.timeline-dot:first-child) {
    margin-top: 11.5px !important;
    margin-bottom: 0px !important;
  }
  :global(.timeline-dot) {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    background-color: #e6e6e6 !important;
    border: none !important;
    padding: 8px !important;
  }
  :global(.timeline-connector) {
    margin-bottom: -11.5px !important;
    color: #e6e6e6 !important;
  }
  :global(.timeline-item) {
    min-height: 30px !important;
  }
  :global(.timeline-opposite-content) {
    flex: initial !important;
    width: 70px !important;
    min-width: 60px !important;
    display: block;
    margin-left: 0 !important;
  }
  @media screen and (max-width: 640px) {
    :global(.timeline-content.right .flex) {
      /* flex-direction: column !important;
			row-gap: 0.3em !important; */
      flex-wrap: wrap;
    }
  }
</style>
