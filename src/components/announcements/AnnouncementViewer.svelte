<script lang="ts">
  import { announcementStore } from "$lib/stores/AnnouncementStore"
  import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
  import Fa from "svelte-fa"
  import AnnounementComponent from "./AnnouncementComponent.svelte"

  let index = 0

  $: announcements = $announcementStore?.filter((e) => e.visible)

  function nextAnnouncement() {
    index = (index + 1) % announcements.length
  }
</script>

{#if $announcementStore && announcements.length > 0}
  <AnnounementComponent annoucement={announcements[index]} />

  {#if announcements.length > 1}
    <div class="flex gap-4 items-center mt-2 justify-center md:justify-start">
      <div class="opacity-60">
        Aankondiging
        <span class="font-bold">{index + 1}</span>
        van
        <span class="font-bold">{announcements.length}</span>
      </div>

      <div class="flex space-x-3">
        <button
          class="btn btn-sm normal-case flex items-center"
          on:click={nextAnnouncement}
        >
          <span>Volgende</span>
          <Fa icon={faArrowRightLong} class="ml-2 text-[16px]" />
        </button>
      </div>
    </div>
  {/if}
{/if}
