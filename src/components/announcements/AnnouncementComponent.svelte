<script lang="ts">
  import InfoCard from "$components/alerts/InfoCard.svelte"
  import { Announcement } from "$lib/domain/Announcement"

  export let annoucement: Announcement
</script>

<InfoCard class="w-full">
  <div>
    <h3 class="font-bold">{annoucement.title}</h3>
    <div class="text-xs">{annoucement.content}</div>
  </div>
</InfoCard>
